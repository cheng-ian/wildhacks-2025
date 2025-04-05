# app.py

import firebase_admin
from flask import Flask, jsonify, request
from firebase_admin import credentials, firestore
from datetime import datetime

app = Flask(__name__)

cred = credentials.Certificate("")
firebase_admin.initialize_app(cred)

# Example route to check if the backend is working
@app.route('/')
def hello_world():
    return 'Hello, World!'

# Get Firestore client
db = firestore.client()

# Route to create a new listing
@app.route('/create-listing', methods=['POST'])
def create_listing():
    data = request.get_json()
    
    # Extracting data from the request
    location = data.get('location')
    time = data.get('time')  # Expected format: "YYYY-MM-DD HH:MM"
    items = data.get('items')  # List of items in the listing
    user_id = data.get('user_id')
    
    # Create a listing document
    listing_ref = db.collection('listings').add({
        'location': location,
        'time': time,
        'user_id': user_id,
        'timestamp': datetime.now()
    })

    listing_id = listing_ref.id  # Get the ID of the new listing
    
    # Now, create product entries (items being sold) under this listing
    for item in items:
        product_data = {
            'listing_id': listing_id,
            'name': item['name'],
            'price': item['price'],
            'quantity': item['quantity']
        }
        db.collection('products').add(product_data)

    return jsonify({"message": "Listing created successfully", "listing_id": listing_id}), 201

# Route to get all listings
@app.route('/listings', methods=['GET'])
def get_listings():
    listings_ref = db.collection('listings')
    listings = listings_ref.stream()
    
    listing_data = []
    for listing in listings:
        listing_info = listing.to_dict()
        listing_info['id'] = listing.id  # Include listing ID
        listing_data.append(listing_info)
    
    return jsonify(listing_data)

# Route to get details of a single listing and its products
@app.route('/listing/<listing_id>', methods=['GET'])
def get_listing_details(listing_id):
    # Get listing data
    listing_ref = db.collection('listings').document(listing_id)
    listing = listing_ref.get()
    if not listing.exists:
        return jsonify({"message": "Listing not found"}), 404
    
    listing_info = listing.to_dict()

    # Get all products in this listing
    products_ref = db.collection('products').where('listing_id', '==', listing_id)
    products = products_ref.stream()

    product_data = []
    for product in products:
        product_info = product.to_dict()
        product_info['id'] = product.id
        product_data.append(product_info)

    return jsonify({"listing": listing_info, "products": product_data})

if __name__ == '__main__':
    app.run(debug=True)

