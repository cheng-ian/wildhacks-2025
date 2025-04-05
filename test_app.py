# test_app.py
import unittest
import json
from app import app  # Import the Flask app

class FlaskTestCase(unittest.TestCase):
    
    # Set up the test client
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True  # Set the app to testing mode
    
    # Test /create-listing route (POST)
    def test_create_listing(self):
        # Data to be sent in the POST request
        data = {
            "location": "Park Avenue",
            "time": "2025-04-10 14:00",
            "items": [
                {"name": "Tomato", "price": 3.99, "quantity": 10},
                {"name": "Lettuce", "price": 2.49, "quantity": 5}
            ],
            "user_id": "test_user_123"
        }
        
        # Send POST request to create a listing
        response = self.app.post('/create-listing', data=json.dumps(data), content_type='application/json')
        
        # Check the status code and message
        self.assertEqual(response.status_code, 201)
        response_json = json.loads(response.data)
        self.assertIn('Listing created successfully', response_json['message'])
        self.assertIn('listing_id', response_json)
    
    # Test /listings route (GET)
    def test_get_listings(self):
        # Send GET request to retrieve all listings
        response = self.app.get('/listings')
        
        # Check the status code
        self.assertEqual(response.status_code, 200)
        
        # Check that the response contains a list of listings
        response_json = json.loads(response.data)
        self.assertIsInstance(response_json, list)
        if len(response_json) > 0:
            self.assertIn('location', response_json[0])
            self.assertIn('time', response_json[0])
            self.assertIn('user_id', response_json[0])
    
    # Test /listing/<listing_id> route (GET)
    def test_get_listing_details(self):
        # First, create a listing using the same data from the POST request
        data = {
            "location": "Park Avenue",
            "time": "2025-04-10 14:00",
            "items": [
                {"name": "Tomato", "price": 3.99, "quantity": 10},
                {"name": "Lettuce", "price": 2.49, "quantity": 5}
            ],
            "user_id": "test_user_123"
        }
        
        response = self.app.post('/create-listing', data=json.dumps(data), content_type='application/json')
        response_json = json.loads(response.data)
        listing_id = response_json['listing_id']  # Extract listing_id from the response
        
        # Send GET request to fetch the details of the created listing
        response = self.app.get(f'/listing/{listing_id}')
        
        # Check the status code
        self.assertEqual(response.status_code, 200)
        
        # Check that the response contains the listing details and products
        response_json = json.loads(response.data)
        self.assertIn('listing', response_json)
        self.assertIn('products', response_json)
        self.assertGreater(len(response_json['products']), 0)
    
    # Test invalid listing ID for /listing/<listing_id> route (GET)
    def test_get_listing_details_invalid(self):
        # Send GET request with a non-existent listing ID
        response = self.app.get('/listing/nonexistent_id')
        
        # Check the status code and message
        self.assertEqual(response.status_code, 404)
        response_json = json.loads(response.data)
        self.assertIn('Listing not found', response_json['message'])

if __name__ == '__main__':
    unittest.main()
