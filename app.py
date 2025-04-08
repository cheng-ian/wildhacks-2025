# app.py

from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
from flask_cors import CORS
from gemini_prompt import generate_recipe
import os
import requests
from math import radians, cos, sin, sqrt, atan2
from functools import wraps

GOOGLE_MAPS_API_KEY = os.getenv("REACT_APP_GOOGLE_MAPS_API_KEY")

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('config/wildhacks-2025-cf527-firebase-adminsdk-fbsvc-4084686e69.json')  # Replace with your key file
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Firestore collections
users_collection = db.collection('users')

# Configure CORS with specific settings
CORS(app, resources={
    r"/*": {
        "origins": "*",  # React's default port
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Firebase Authentication Middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get the auth token from the request header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header is missing'}), 401
        
        # Extract the token
        token = auth_header.split("Bearer ")[1] if "Bearer " in auth_header else auth_header
        
        try:
            # Verify the token
            decoded_token = auth.verify_id_token(token)
            # Add the user's UID to the request
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Authentication error: {e}")
            return jsonify({'error': 'Invalid authentication token'}), 401
    
    return decorated

@app.route('/verify-auth', methods=['GET'])
@token_required
def verify_auth():
    """Verify a user's authentication status"""
    return jsonify({
        'authenticated': True,
        'uid': request.user['uid'],
        'email': request.user.get('email', ''),
    })

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    user_input = data.get('query')
    print("Received input:", user_input)

    if not user_input:
        return jsonify({"error": "No query provided"}), 400

    try:
        result = generate_recipe(user_input)
        return jsonify({"result": result})
    except Exception as e:
        print("Error generating recipe:", e)  # Print error to terminal
        return jsonify({"error": "Failed to generate recipe"}), 500

def calculate_distance(lat1, lon1, lat2, lon2):
    # Earth radius in km
    R = 6371.0

    lat1_r, lon1_r = radians(lat1), radians(lon1)
    lat2_r, lon2_r = radians(lat2), radians(lon2)

    dlon = lon2_r - lon1_r
    dlat = lat2_r - lat1_r

    a = sin(dlat / 2)**2 + cos(lat1_r) * cos(lat2_r) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c

def geocode_address(address):
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        'address': address,
        'key': GOOGLE_MAPS_API_KEY
    }
    response = requests.get(geocode_url, params=params)
    data = response.json()

    if data['status'] == 'OK' and data['results']:
        location = data['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None

def get_lat_lon_from_zip(zip_code):
    geocode_url = f'https://maps.googleapis.com/maps/api/geocode/json?address={zip_code}&key={GOOGLE_MAPS_API_KEY}'
    response = requests.get(geocode_url)
    data = response.json()

    if data['status'] == 'OK':
        location = data['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    else:
        return None, None

# Add a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    uid = data.get('uid')
    name = data.get('name')

    if not uid or not name:
        return jsonify({'error': 'UID and name required'}), 400

    # Check if user already exists
    user_ref = users_collection.document(uid)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        # Update user if needed
        user_ref.update({
            'name': name,
        })
        return jsonify({'message': 'User updated successfully'}), 200
    else:
        # Create new user
        user_ref.set({
            'uid': uid,
            'name': name,
            'listings': []
        })
        return jsonify({'message': 'User created successfully'}), 201

# Add a produce listing event for a user
@app.route('/add_listing/<uid>', methods=['POST'])
@token_required
def add_listing(uid):
    # Verify the authenticated user is adding their own listing
    if request.user['uid'] != uid:
        return jsonify({'error': 'Not authorized to add listings for this user'}), 403
        
    data = request.json
    location = data.get('location')
    time = data.get('time')
    produce_items = data.get('produce_items')

    if not all([location, time, produce_items]):
        return jsonify({'error': 'Location, time, and produce_items required'}), 400

    # Validate produce items have price, quantity and units
    for item in produce_items:
        if not all(k in item for k in ['name', 'quantity', 'unit', 'price']):
            return jsonify({'error': 'All produce items must have name, quantity, unit, and price'}), 400
    
    # Geocode the address to get lat/lon
    lat, lon = geocode_address(location)
    if lat is None or lon is None:
        return jsonify({'error': 'Invalid location address'}), 400

    user_ref = users_collection.document(uid)

    # Create the listing with price and timestamp
    listing_event = {
        'location': location,
        'lat': lat,
        'lon': lon,
        'time': time,
        'produce_items': produce_items,
        'created_at': datetime.now().isoformat()
    }

    user_ref.update({
        'listings': firestore.ArrayUnion([listing_event])
    })

    print(listing_event)
    return jsonify({'message': 'Listing added successfully'}), 200

# Fetch user details and listings
@app.route('/user/<uid>', methods=['GET'])
def get_user(uid):
    user_ref = users_collection.document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user_doc.to_dict()), 200

# Query listings based on produce name and zip code
@app.route('/query_produce', methods=['GET'])
def query_produce():
    try:
        produce_name = request.args.get('produce')  # Now optional
        zip_code = request.args.get('zip')
        lat = request.args.get('lat')
        lon = request.args.get('lon')

        print(f"Received query with params: produce={produce_name}, zip={zip_code}, lat={lat}, lon={lon}")

        # Determine coordinates
        if zip_code:
            user_lat, user_lon = get_lat_lon_from_zip(zip_code)
            if user_lat is None:
                print(f"Failed to get coordinates for ZIP code: {zip_code}")
                return jsonify({'error': 'Invalid ZIP code or failed to get coordinates from Google Maps'}), 400
        else:
            try:
                user_lat = float(lat)
                user_lon = float(lon)
            except (TypeError, ValueError):
                print(f"Invalid lat/lon values: lat={lat}, lon={lon}")
                return jsonify({'error': 'Provide a valid ZIP code or lat/lon query parameters'}), 400

        limit = int(request.args.get('limit', 20))

        try:
            users = users_collection.stream()
            matching_listings = []

            for user in users:
                try:
                    user_data = user.to_dict()
                    print(f"Processing user: {user_data.get('name', 'Unknown')}")
                    
                    for event in user_data.get('listings', []):
                        try:
                            matched_items = []
                            for item in event.get('produce_items', []):
                                if not produce_name or produce_name.lower() in item.get('name', '').lower():
                                    matched_items.append(item)

                            if matched_items:
                                dist = calculate_distance(user_lat, user_lon, event['lat'], event['lon'])
                                
                                matching_listings.append({
                                    'user_name': user_data.get('name', 'Unknown'),
                                    'user_id': user_data.get('uid', ''),
                                    'location': event['location'],
                                    'time': event['time'],
                                    'produce_items': matched_items,
                                    'distance_miles': round((dist * 0.621371), 2),
                                    'lat': event['lat'],
                                    'lon': event['lon'],
                                    'created_at': event.get('created_at', '')
                                })
                        except Exception as e:
                            print(f"Error processing event: {str(e)}")
                            continue
                except Exception as e:
                    print(f"Error processing user: {str(e)}")
                    continue

            matching_listings.sort(key=lambda x: x['distance_miles'])
            print(f"Returning {len(matching_listings)} matching listings")
            return jsonify({'matching_listings': matching_listings[:limit]}), 200

        except Exception as e:
            print(f"Error accessing Firestore: {str(e)}")
            return jsonify({'error': 'Error accessing database'}), 500

    except Exception as e:
        print(f"Error in query_produce: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Get most sold products from listings
@app.route('/most_sold_products', methods=['GET'])
def get_most_sold_products():
    try:
        limit = int(request.args.get('limit', 10))
        users = users_collection.stream()
        
        # Count occurrences of each product
        product_counts = {}
        
        for user in users:
            user_data = user.to_dict()
            for listing in user_data.get('listings', []):
                for item in listing.get('produce_items', []):
                    product_name = item.get('name', '').lower()
                    if product_name:
                        product_counts[product_name] = product_counts.get(product_name, 0) + 1
        
        # Sort products by count and get top N
        sorted_products = sorted(product_counts.items(), key=lambda x: x[1], reverse=True)
        top_products = [{'name': name, 'count': count} for name, count in sorted_products[:limit]]
        
        return jsonify({'products': top_products}), 200
    except Exception as e:
        print(f"Error getting most sold products: {str(e)}")
        return jsonify({'error': 'Failed to retrieve most sold products'}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
