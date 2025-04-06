import requests
import json

BASE_URL = 'http://127.0.0.1:5000'

# Test data
user_data = {
    'uid': 'user123',
    'name': 'Alice'
}

names = [
    # Asian American or Pacific Islander (26%)
    "Hiroshi Tanaka",
    "Soo-Jin Kim",
    "Ananya Patel",
    "Wei Zhang",
    "Jin Park",
    "Ling Chen",
    "Aarav Singh",
    "Mei Li",

    # Black or African American (15%)
    "Jamal Washington",
    "Aaliyah Johnson",
    "Malik Thompson",
    "Imani Davis",
    "Kwame Brown",

    # Hispanic or Latinx/e (18%)
    "Santiago García",
    "Isabella Rodriguez",
    "Mateo Hernandez",
    "Camila Lopez",
    "Diego Martinez",
    "Lucia Gonzalez",

    # Native or Indigenous (3%)
    "Dakota Yazzie",
    "Cheyenne Begay",

    # White (43%)
    "James Smith",
    "Emily Johnson",
    "Michael Williams",
    "Emma Brown",
    "William Jones",
    "Olivia Miller",
    "Benjamin Davis",
    "Sophia Wilson",
    "Alexander Moore",
    "Charlotte Taylor"
]

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

listing_data4 = {
    "location": "017 Berry Estates, Dawntown, CA 30326",
    "time": "2025-04-23T07:10:11",
    "produce_items": [
        {"name": "Lettuce", "price": "$0.57 per lb"},
        {"name": "Parsnips", "price": "$0.78 per lb"}
    ]
}

listing_data5 = {
    "location": "2610 West Crest, West Jefferyborough, NE 56705",
    "time": "2025-05-06T07:10:11",
    "produce_items": [
        {"name": "Squash", "price": "$2.83 per lb"},
        {"name": "Zucchini", "price": "$0.78 per lb"}
    ]
}

listing_data6 = {
    "location": "2268 Daniel Locks, South Michelle, TX 38344",
    "time": "2025-04-26T07:10:11",
    "produce_items": [
        {"name": "Brussels Sprouts", "price": "$1.53 per lb"},
        {"name": "Cauliflower", "price": "$2.61 per lb"}
    ]
}

listing_data7 = {
    "location": "9790 Brady Roads Suite 121, South Valerie, KY 61172",
    "time": "2025-04-20T07:10:11",
    "produce_items": [
        {"name": "Broccoli", "price": "$2.25 per lb"},
        {"name": "Chard", "price": "$2.12 per lb"}
    ]
}

listing_data8 = {
    "location": "08100 Rodriguez Crossroad Suite 871, Hodgefort, DC 92369",
    "time": "2025-05-05T07:10:11",
    "produce_items": [
        {"name": "Turnips", "price": "$2.01 per lb"},
        {"name": "Cucumbers", "price": "$0.83 per lb"}
    ]
}

listing_data9 = {
    "location": "908 Suzanne Circle, North Stephen, WY 80440",
    "time": "2025-04-10T07:10:11",
    "produce_items": [
        {"name": "Spinach", "price": "$2.17 per lb"},
        {"name": "Brussels Sprouts", "price": "$2.50 per lb"}
    ]
}

listing_data10 = {
    "location": "020 Hunt Mill, New Gregory, AZ 81924",
    "time": "2025-04-10T07:10:11",
    "produce_items": [
        {"name": "Sweet Corn", "price": "$2.97 per lb"},
        {"name": "Radishes", "price": "$2.73 per lb"}
    ]
}

listing_data11 = {
    "location": "413 Kaitlyn Mountain, South Stevemouth, TN 89581",
    "time": "2025-05-06T07:10:11",
    "produce_items": [
        {"name": "Artichokes", "price": "$2.44 per lb"},
        {"name": "Cucumbers", "price": "$3.21 per lb"}
    ]
}

listing_data12 = {
    "location": "7430 Mason Shoal Apt. 257, Port Jeffery, LA 43258",
    "time": "2025-05-03T07:10:11",
    "produce_items": [
        {"name": "Peppers", "price": "$2.12 per lb"},
        {"name": "Garlic", "price": "$1.94 per lb"}
    ]
}

listing_data13 = {
    "location": "55113 Dwayne Knolls, Brittanyborough, NH 37053",
    "time": "2025-04-12T07:10:11",
    "produce_items": [
        {"name": "Celery", "price": "$0.75 per lb"},
        {"name": "Eggplant", "price": "$1.91 per lb"}
    ]
}

listing_data14 = {
    "location": "708 Acevedo Mission Suite 150, Port Sean, WV 21383",
    "time": "2025-04-15T07:10:11",
    "produce_items": [
        {"name": "Tomatoes", "price": "$1.33 per lb"},
        {"name": "Brussels Sprouts", "price": "$0.61 per lb"}
    ]
}

listing_data15 = {
    "location": "168 Ford Passage, Simmonsside, FL 82416",
    "time": "2025-05-04T07:10:11",
    "produce_items": [
        {"name": "Sweet Corn", "price": "$3.49 per lb"},
        {"name": "Turnips", "price": "$2.25 per lb"}
    ]
}

listing_data16 = {
    "location": "866 Holden Streets Suite 878, Michelleport, RI 42615",
    "time": "2025-04-14T07:10:11",
    "produce_items": [
        {"name": "Eggplant", "price": "$2.42 per lb"},
        {"name": "Broccoli", "price": "$1.14 per lb"}
    ]
}

listing_data17 = {
    "location": "16598 Brenda Mall Apt. 955, Port Kari, KS 32842",
    "time": "2025-04-22T07:10:11",
    "produce_items": [
        {"name": "Pumpkin", "price": "$1.86 per lb"},
        {"name": "Lettuce", "price": "$1.69 per lb"}
    ]
}

listing_data18 = {
    "location": "5125 Jessica Meadows Suite 825, East Kenneth, MT 53640",
    "time": "2025-04-29T07:10:11",
    "produce_items": [
        {"name": "Beets", "price": "$2.75 per lb"},
        {"name": "Celery", "price": "$2.01 per lb"}
    ]
}

listing_data19 = {
    "location": "87789 Smith Expressway Apt. 931, North Christophertown, UT 61838",
    "time": "2025-05-05T07:10:11",
    "produce_items": [
        {"name": "Brussels Sprouts", "price": "$2.48 per lb"},
        {"name": "Cauliflower", "price": "$0.61 per lb"}
    ]
}

listing_data20 = {
    "location": "5747 Jeffery Hills Apt. 887, South Michellebury, CO 41884",
    "time": "2025-04-15T07:10:11",
    "produce_items": [
        {"name": "Pumpkin", "price": "$2.11 per lb"},
        {"name": "Celery", "price": "$2.49 per lb"}
    ]
}

listing_data21 = {
    "location": "261 Williams Fall, East Marcusview, VA 56987",
    "time": "2025-04-30T07:10:11",
    "produce_items": [
        {"name": "Turnips", "price": "$2.71 per lb"},
        {"name": "Spinach", "price": "$1.92 per lb"}
    ]
}

listing_data22 = {
    "location": "322 Eddie Gateway Suite 246, Kendratown, OR 79464",
    "time": "2025-04-14T07:10:11",
    "produce_items": [
        {"name": "Kale", "price": "$1.34 per lb"},
        {"name": "Potatoes", "price": "$2.77 per lb"}
    ]
}

listing_data23 = {
    "location": "903 Austin Isle, Petersonhaven, NE 37363",
    "time": "2025-05-03T07:10:11",
    "produce_items": [
        {"name": "Yams", "price": "$3.15 per lb"},
        {"name": "Spinach", "price": "$0.85 per lb"}
    ]
}

listing_data24 = {
    "location": "3520 Fernando Harbor, Lake Steven, GA 34731",
    "time": "2025-05-06T07:10:11",
    "produce_items": [
        {"name": "Cauliflower", "price": "$1.43 per lb"},
        {"name": "Kale", "price": "$3.23 per lb"}
    ]
}

listing_data25 = {
    "location": "896 John Run Apt. 407, Danielchester, CO 04216",
    "time": "2025-05-05T07:10:11",
    "produce_items": [
        {"name": "Celery", "price": "$2.42 per lb"},
        {"name": "Brussels Sprouts", "price": "$2.13 per lb"}
    ]
}

listing_data26 = {
    "location": "6983 Anthony Ridge, Michaelberg, NJ 51731",
    "time": "2025-04-22T07:10:11",
    "produce_items": [
        {"name": "Leeks", "price": "$0.92 per lb"},
        {"name": "Garlic", "price": "$1.74 per lb"}
    ]
}

listing_data27 = {
    "location": "09490 Anne Burg Suite 211, Leonardbury, NV 02374",
    "time": "2025-04-15T07:10:11",
    "produce_items": [
        {"name": "Broccoli", "price": "$2.29 per lb"},
        {"name": "Beets", "price": "$2.37 per lb"}
    ]
}

listing_data28 = {
    "location": "9168 Norman Flat Apt. 171, Danashire, WY 34348",
    "time": "2025-04-26T07:10:11",
    "produce_items": [
        {"name": "Radishes", "price": "$2.88 per lb"},
        {"name": "Eggplant", "price": "$2.82 per lb"}
    ]
}

listing_data29 = {
    "location": "33711 Young Corner Suite 600, Ramirezberg, MN 52191",
    "time": "2025-04-07T07:10:11",
    "produce_items": [
        {"name": "Celery", "price": "$1.67 per lb"},
        {"name": "Carrots", "price": "$1.20 per lb"}
    ]
}

listing_data30 = {
    "location": "579 Alison Turnpike, Sanchezmouth, AR 11543",
    "time": "2025-04-18T07:10:11",
    "produce_items": [
        {"name": "Tomatoes", "price": "$0.96 per lb"},
        {"name": "Garlic", "price": "$3.05 per lb"}
    ]
}



import requests
import json

BASE_URL = 'http://127.0.0.1:5000'

# List of user names (diverse + representative of NU undergrads)
names = [
    "Hiroshi Tanaka", "Soo-Jin Kim", "Ananya Patel", "Wei Zhang",
    "Jin Park", "Ling Chen", "Aarav Singh", "Mei Li",
    "Jamal Washington", "Aaliyah Johnson", "Malik Thompson", "Imani Davis",
    "Kwame Brown", "Santiago García", "Isabella Rodriguez", "Mateo Hernandez",
    "Camila Lopez", "Diego Martinez", "Lucia Gonzalez", "Dakota Yazzie",
    "Cheyenne Begay", "James Smith", "Emily Johnson", "Michael Williams",
    "Emma Brown", "William Jones", "Olivia Miller", "Benjamin Davis",
    "Sophia Wilson", "Alexander Moore"
]

# Generate user objects
users = [{"uid": f"user{i+1}", "name": name} for i, name in enumerate(names)]

# Reference all listing_data variables
listings = [
    listing_data, listing_data2, listing_data3, listing_data4, listing_data5,
    listing_data6, listing_data7, listing_data8, listing_data9, listing_data10,
    listing_data11, listing_data12, listing_data13, listing_data14, listing_data15,
    listing_data16, listing_data17, listing_data18, listing_data19, listing_data20,
    listing_data21, listing_data22, listing_data23, listing_data24, listing_data25,
    listing_data26, listing_data27, listing_data28, listing_data29, listing_data30
]

# Add all users
def test_add_users():
    for user in users:
        response = requests.post(f'{BASE_URL}/add_user', json=user)
        print(f"Add User {user['uid']}: {response.status_code}", response.json())

# Add one listing per user
def test_add_listings_to_users():
    for user, listing in zip(users, listings):
        response = requests.post(f'{BASE_URL}/add_listing/{user["uid"]}', json=listing)
        print(f"Add Listing for {user['uid']}: {response.status_code}", response.json())

# Get all users and print data
def test_get_all_users():
    for user in users:
        response = requests.get(f'{BASE_URL}/user/{user["uid"]}')
        print(f'Get User {user["uid"]}: {response.status_code}')
        print(json.dumps(response.json(), indent=2))

# Produce search test
def test_query_produce():
    zip_code = '60201'
    params_no_filter = {'zip': zip_code, 'limit': 5}
    response = requests.get(f'{BASE_URL}/query_produce', params=params_no_filter)
    print('\nQuery Produce (no filter):', response.status_code)
    print(json.dumps(response.json(), indent=2))

    params_with_filter = {'zip': zip_code, 'limit': 5, 'produce': 'Tomatoes'}
    response = requests.get(f'{BASE_URL}/query_produce', params=params_with_filter)
    print('\nQuery Produce (filtered by Tomatoes):', response.status_code)
    print(json.dumps(response.json(), indent=2))

# Main
if __name__ == '__main__':
    test_add_users()
    test_add_listings_to_users()
    test_get_all_users()
    test_query_produce()
