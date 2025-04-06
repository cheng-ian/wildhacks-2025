# app.py

from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from flask_cors import CORS
from gemini_prompt import generate_recipe
import os
import requests
from math import radians, cos, sin, sqrt, atan2

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

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
        "origins": ["http://localhost:3000"],  # React's default port
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
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

    user_ref = users_collection.document(uid)
    user_ref.set({
        'uid': uid,
        'name': name,
        'listings': []
    })

    return jsonify({'message': 'User created successfully'}), 201

# Add a produce listing event for a user
@app.route('/add_listing/<uid>', methods=['POST'])
def add_listing(uid):
    data = request.json
    location = data.get('location')
    time = data.get('time')
    produce_items = data.get('produce_items')

    if not all([location, time, produce_items]):
        return jsonify({'error': 'Location, time, and produce_items required'}), 400

    # Geocode the address to get lat/lon
    lat, lon = geocode_address(location)
    if lat is None or lon is None:
        return jsonify({'error': 'Invalid location address'}), 400

    user_ref = users_collection.document(uid)

    listing_event = {
        'location': location,
        'lat': lat,
        'lon': lon,
        'time': time,
        'produce_items': produce_items
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

        limit = int(request.args.get('limit', 5))

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
                                    'uid': user_data['uid'],
                                    'name': user_data['name'],
                                    'location': event['location'],
                                    'time': event['time'],
                                    'produce_items': matched_items,
                                    'distance_miles': round((dist * 0.621371), 2),
                                    'lat': event['lat'],
                                    'lon': event['lon']
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

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
