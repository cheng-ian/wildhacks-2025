import requests
import json
import random
from datetime import datetime, timedelta

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

# Chicago area locations
chicago_locations = [
    # Downtown Chicago
    "233 S Wacker Dr, Chicago, IL 60606",  # Willis Tower
    "111 S Michigan Ave, Chicago, IL 60603",  # Art Institute
    "201 E Randolph St, Chicago, IL 60602",  # Millennium Park
    "875 N Michigan Ave, Chicago, IL 60611",  # John Hancock Center
    "600 E Grand Ave, Chicago, IL 60611",  # Navy Pier
    
    # North Side Chicago
    "1060 W Addison St, Chicago, IL 60613",  # Wrigley Field
    "2001 N Clark St, Chicago, IL 60614",  # Lincoln Park Zoo
    "1200 S Lake Shore Dr, Chicago, IL 60605",  # Shedd Aquarium
    "3600 N Halsted St, Chicago, IL 60613",  # Boystown
    "5700 N Broadway, Chicago, IL 60660",  # Edgewater
    
    # South Side Chicago
    "333 E 35th St, Chicago, IL 60616",  # Guaranteed Rate Field
    "6401 S Stony Island Ave, Chicago, IL 60637",  # Jackson Park
    "5700 S Lake Shore Dr, Chicago, IL 60637",  # Museum of Science and Industry
    "1200 W 35th St, Chicago, IL 60609",  # Bridgeport
    "6300 S Cottage Grove Ave, Chicago, IL 60637",  # Woodlawn
    
    # West Side Chicago
    "1901 W Madison St, Chicago, IL 60612",  # United Center
    "2021 N Western Ave, Chicago, IL 60647",  # Bucktown
    "1850 W Chicago Ave, Chicago, IL 60622",  # West Town
    "3100 W Chicago Ave, Chicago, IL 60651",  # Humboldt Park
    "4000 W North Ave, Chicago, IL 60639",  # Hermosa
    
    # Evanston (Northwestern)
    "2420 N Campus Dr, Evanston, IL 60208",  # Northwestern University
    "815 Noyes St, Evanston, IL 60201",
    "1603 Orrington Ave, Evanston, IL 60201",  # Downtown Evanston
    "2100 Ridge Ave, Evanston, IL 60201",  # Evanston City Hall
    "2233 Sherman Ave, Evanston, IL 60201",
    
    # Nearby Suburbs
    "9599 Skokie Blvd, Skokie, IL 60077",
    "1151 Lake Cook Rd, Deerfield, IL 60015",
    "2200 N Oakbrook Center, Oak Brook, IL 60523",
    "1251 Lake Cook Rd, Highland Park, IL 60035",
    "7501 Lincoln Ave, Skokie, IL 60077",
    "3232 Lake Ave, Wilmette, IL 60091",
    "1701 Lake Ave, Glenview, IL 60025",
    "5220 Touhy Ave, Skokie, IL 60077",
    "4999 Old Orchard Shopping Center, Skokie, IL 60077",
    "475 Central Ave, Highland Park, IL 60035"
]

# Full list of produce items
produce_items = [
    # Vegetables
    {"name": "Tomatoes", "price": "$3.99 per lb"},
    {"name": "Potatoes", "price": "$0.99 per lb"},
    {"name": "Onions", "price": "$1.49 per lb"},
    {"name": "Sweet Potatoes", "price": "$1.79 per lb"},
    {"name": "Bell Peppers", "price": "$1.50 each"},
    {"name": "Carrots", "price": "$1.29 per bunch"},
    {"name": "Broccoli", "price": "$2.49 per head"},
    {"name": "Cauliflower", "price": "$3.99 per head"},
    {"name": "Lettuce", "price": "$2.49 per head"},
    {"name": "Spinach", "price": "$3.99 per bag"},
    {"name": "Kale", "price": "$2.99 per bunch"},
    {"name": "Zucchini", "price": "$1.29 per lb"},
    {"name": "Cucumber", "price": "$0.79 each"},
    {"name": "Asparagus", "price": "$3.99 per bunch"},
    {"name": "Mushrooms", "price": "$3.49 per package"},
    {"name": "Cabbage", "price": "$1.49 per lb"},
    {"name": "Brussels Sprouts", "price": "$3.99 per lb"},
    {"name": "Corn", "price": "$0.50 per ear"},
    {"name": "Garlic", "price": "$0.89 per head"},
    {"name": "Eggplant", "price": "$1.99 each"},
    
    # Fruits
    {"name": "Apples", "price": "$1.49 per lb"},
    {"name": "Bananas", "price": "$0.59 per lb"},
    {"name": "Oranges", "price": "$1.29 each"},
    {"name": "Strawberries", "price": "$3.99 per container"},
    {"name": "Blueberries", "price": "$4.99 per container"},
    {"name": "Raspberries", "price": "$4.49 per container"},
    {"name": "Grapes", "price": "$2.99 per lb"},
    {"name": "Lemons", "price": "$0.79 each"},
    {"name": "Limes", "price": "$0.59 each"},
    {"name": "Peaches", "price": "$1.99 per lb"},
    {"name": "Pears", "price": "$1.79 per lb"},
    {"name": "Plums", "price": "$1.99 per lb"},
    {"name": "Watermelon", "price": "$5.99 each"},
    {"name": "Cantaloupe", "price": "$3.99 each"},
    {"name": "Honeydew", "price": "$3.99 each"},
    {"name": "Cherries", "price": "$4.99 per lb"},
    {"name": "Kiwi", "price": "$0.99 each"},
    {"name": "Avocado", "price": "$1.50 each"},
    {"name": "Mango", "price": "$1.99 each"},
    {"name": "Pineapple", "price": "$4.99 each"},
    
    # Herbs and Others
    {"name": "Basil", "price": "$2.99 per bunch"},
    {"name": "Cilantro", "price": "$1.49 per bunch"},
    {"name": "Parsley", "price": "$1.49 per bunch"},
    {"name": "Mint", "price": "$2.49 per bunch"},
    {"name": "Rosemary", "price": "$2.99 per bunch"},
    {"name": "Thyme", "price": "$2.49 per bunch"},
    {"name": "Ginger", "price": "$3.99 per lb"},
    {"name": "Honey", "price": "$8.99 per jar"},
    {"name": "Farm Eggs", "price": "$5.99 per dozen"},
    {"name": "Microgreens", "price": "$4.99 per container"}
]

# Original test data - keep for backwards compatibility
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

# Keep the existing listing data references
listing_data4 = {
    "location": "017 Berry Estates, Dawntown, CA 30326",
    "time": "2025-04-23T07:10:11",
    "produce_items": [
        {"name": "Lettuce", "price": "$0.57 per lb"},
        {"name": "Parsnips", "price": "$0.78 per lb"}
    ]
}

# Skip listing_data5 through listing_data22 - they will be replaced with Chicago locations

# Generate random dates between now and 3 months in the future
def random_future_date():
    days_ahead = random.randint(1, 90)
    future_date = datetime.now() + timedelta(days=days_ahead)
    hour = random.randint(8, 19)  # Between 8 AM and 7 PM
    minute = random.choice([0, 15, 30, 45])
    future_date = future_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    return future_date.isoformat()

# Generate a list of listing data for Chicago area
chicago_listings = []

# Create 50 random listings in Chicago area
for i in range(50):
    location = random.choice(chicago_locations)
    time = random_future_date()
    
    # Choose 2-4 random produce items
    num_items = random.randint(2, 4)
    selected_items = random.sample(produce_items, num_items)
    
    listing = {
        'location': location,
        'time': time,
        'produce_items': selected_items
    }
    
    chicago_listings.append(listing)

def test_add_users():
    for i, name in enumerate(names):
        uid = f'user{i+100}'
        response = requests.post(f'{BASE_URL}/add_user', json={'uid': uid, 'name': name})
        print(f'Added user {name}: {response.json()}')

def test_add_listings_to_users():
    # Add listings to existing users
    for i in range(len(names)):
        uid = f'user{i+100}'
        
        # Add 1-3 random listings for each user
        num_listings = random.randint(1, 3)
        for j in range(num_listings):
            listing = random.choice(chicago_listings)
            response = requests.post(f'{BASE_URL}/add_listing/{uid}', json=listing)
            print(f'Added listing for {uid}: {response.json()}')

def test_get_all_users():
    for i in range(len(names)):
        uid = f'user{i+100}'
        response = requests.get(f'{BASE_URL}/user/{uid}')
        if response.status_code == 200:
            user_data = response.json()
            print(f'User {user_data["name"]} has {len(user_data.get("listings", []))} listings')

def test_query_produce():
    # Test with a few common produce items in Chicago area (60611 is downtown Chicago)
    produce_items_to_test = ["Tomatoes", "Apples", "Carrots", "Strawberries", "Broccoli"]
    for item in produce_items_to_test:
        response = requests.get(f'{BASE_URL}/query_produce?produce={item}&zip=60611&limit=10')
        if response.status_code == 200:
            results = response.json()
            print(f'Found {len(results.get("matching_listings", []))} sellers for {item}')
            
            # Print the first few matches
            for idx, listing in enumerate(results.get("matching_listings", [])[:3]):
                print(f'  Seller {idx+1}: {listing["name"]} at {listing["location"]}, {listing["distance_miles"]} miles away')

if __name__ == "__main__":
    # Run the tests in order
    test_add_users()
    test_add_listings_to_users()
    test_get_all_users()
    test_query_produce()
