import React, { useState, useEffect } from 'react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState([]);

  // Placeholder listings for now
  useEffect(() => {
    const fetchListings = async () => {
      const placeholderListings = [
        {
          id: 1,
          name: 'Fresh Flowers',
          description: 'Available now at Green Meadows Farm',
          image: '/images/flowers.jpg'
        },
        {
          id: 2,
          name: 'Strawberries',
          description: 'Picked fresh this morning at Flora Market',
          image: '/images/strawberries.jpg'
        },
        {
          id: 3,
          name: 'Organic Potatoes',
          description: 'Locally grown at Sunrise Farms',
          image: '/images/potatoes.jpg'
        }
      ];

      setFeaturedListings(placeholderListings);
    };

    fetchListings();
  }, []);

  const recommendedProducts = [
    { name: 'Flowers', image: '/images/flowers.jpg' },
    { name: 'Potatoes', image: '/images/potatoes.jpg' },
    { name: 'Strawberries', image: '/images/strawberries.jpg' },
    { name: 'Dairy', image: '/images/dairy.jpg' },
    { name: 'Vegetables', image: '/images/vegetables.jpg' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Home</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for products..."
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      {/* Recommended Products */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Recommended Products</h2>
        <div className="flex overflow-x-auto space-x-4">
          {recommendedProducts.map((product, index) => (
            <div key={index} className="min-w-[150px] bg-white p-4 rounded-2xl shadow cursor-pointer">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
              <h3 className="text-center font-bold">{product.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Listings */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Featured Listings</h2>
        {featuredListings.map((listing) => (
          <div key={listing.id} className="p-2 mb-2">
            <div className="flex items-center space-x-4">
              <img src={listing.image} alt={listing.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-bold">{listing.name}</h3>
                <p>{listing.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-2">Categories</h2>
        <div className="flex space-x-4">
          {['Fruits', 'Vegetables', 'Dairy', 'Flowers', 'Other'].map((category) => (
            <button key={category} className="bg-blue-500 text-white py-2 px-4 rounded">
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;