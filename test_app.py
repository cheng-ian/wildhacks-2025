import requests
import json

BASE_URL = 'http://127.0.0.1:5000'

# Test data
user_data = {
    'uid': 'user123',
    'name': 'Alice'
}

listing_data = {
    'location': '2420 N Campus Dr, Evanston, IL',
    'time': '2025-04-10T10:00:00',
    'produce_items': [
        {'name': 'Tomatoes', 'price': '$2 per lb'},
        {'name': 'Potatoes', 'price': '$1 per lb'}
    ]
}

listing_data2 = {
    'location': '815 Noyes St, Evanston, IL 60201',
    'time': '2025-04-10T10:00:00',
    'produce_items': [
        {'name': 'Tomatoes', 'price': '$2 per lb'},
        {'name': 'Pogatoes', 'price': '$1 per lb'}
    ]
}

listing_data3 = {
    'location': '9599 Skokie Blvd, Skokie, IL 60077',
    'time': '2025-04-10T10:00:00',
    'produce_items': [
        {'name': 'Togatoes', 'price': '$2 per lb'},
        {'name': 'Popatoes', 'price': '$1 per lb'}
    ]
}

# Add user
def test_add_user():
    response = requests.post(f'{BASE_URL}/add_user', json=user_data)
    print('Add User:', response.status_code, response.json())

# Add listings
def test_add_listing():
    for i, listing in enumerate([listing_data, listing_data2, listing_data3], start=1):
        response = requests.post(f'{BASE_URL}/add_listing/{user_data["uid"]}', json=listing)
        print(f'Add Listing {i}:', response.status_code, response.json())

# Get user
def test_get_user():
    response = requests.get(f'{BASE_URL}/user/{user_data["uid"]}')
    print('Get User:', response.status_code)
    print(json.dumps(response.json(), indent=2))

# Query produce with and without filter
def test_query_produce():
    zip_code = '60201'  # Evanston ZIP

    # Case 1: All listings near ZIP (no filter)
    params_no_filter = {
        'zip': zip_code,
        'limit': 5
    }
    response = requests.get(f'{BASE_URL}/query_produce', params=params_no_filter)
    print('\nQuery Produce (no filter):', response.status_code)
    print(json.dumps(response.json(), indent=2))

    # Case 2: Listings near ZIP with produce filter
    params_with_filter = {
        'zip': zip_code,
        'limit': 5,
        'produce': 'Tomatoes'
    }
    response = requests.get(f'{BASE_URL}/query_produce', params=params_with_filter)
    print('\nQuery Produce (filtered by Tomatoes):', response.status_code)
    print(json.dumps(response.json(), indent=2))

# Run all tests
if __name__ == '__main__':
    test_add_user()
    test_add_listing()
    test_get_user()
    test_query_produce()
