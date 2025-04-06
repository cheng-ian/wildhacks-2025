import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from './services/api';
import farmFreshLogo from './images/farmfresh-logo.png';
import produce_image from './images/produce_background.jpg';
import bgphoto2 from './images/bgphoto2.jpg';
import TypewriterEffect from './components/TypewriterEffect';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const typingPhrases = [
    "Naturally Grown, Incredibly Fresh",
    "From Farm to Table, Simply Better",
    "Local Produce, Global Impact",
    "Fresh Picks, Happy Community",
    "Sustainable Farming, Healthier Living"
  ];

  useEffect(() => {
    const fetchMostSoldProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMostSoldProducts(6);
        if (response.products) {
          setMostSoldProducts(response.products);
        }
      } catch (err) {
        setError('Failed to load most sold products');
        console.error('Error fetching most sold products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMostSoldProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (zipCode) {
      navigate(`/marketplace?zip=${zipCode}&produce=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-white min-h-[600px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${produce_image})`,
            backgroundPosition: 'center 30%'
          }}
        />
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-60 mix-blend-multiply z-10"></div>
        
        {/* Content */}
        <div className="relative flex flex-col items-center justify-center min-h-[600px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            <TypewriterEffect 
              phrases={typingPhrases}
              typingSpeed={80}
              deletingSpeed={40}
              pauseTime={3000}
            />
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow">Our marketplace connects you with local farmers for the freshest produce, grown with care.</p>
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Produce (e.g. apples)"
              className="flex-1 p-4 rounded-lg text-gray-900 shadow-lg"
            />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              className="flex-1 p-4 rounded-lg text-gray-900 shadow-lg"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-4 px-8 rounded-lg transition-colors shadow-lg"
            >
              Find Fresh Produce
            </button>
          </form>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Marketplace</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At FarmFresh, we are dedicated to connecting local farmers with their community. Our marketplace offers fresh, seasonal produce while fostering sustainable farming practices and supporting local agriculture.
            </p>
          </div>
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="relative py-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${bgphoto2})`,
            backgroundPosition: 'center 30%'
          }}
        />
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-60 mix-blend-multiply z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12 drop-shadow-lg">Most Popular Products</h2>
          
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Loading popular products...</p>
            </div>
          ) : error ? (
            <p className="text-red-300 text-center drop-shadow">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mostSoldProducts.map((product, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{product.name}</h3>
                    <p className="text-gray-600">Listed {product.count} times</p>
                    <Link
                      to={`/marketplace?produce=${product.name}`}
                      className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Find Sellers
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Produce</h3>
              <p className="text-gray-600">Fresh, nutritious produce grown using sustainable practices for the best taste and health benefits.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Focused</h3>
              <p className="text-gray-600">Supporting local farmers and creating connections between growers and consumers.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable Practices</h3>
              <p className="text-gray-600">Committed to environmentally friendly farming methods and reducing food miles.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8">Ready to start buying or selling fresh, local produce?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold"
            >
              Sign Up Now
            </Link>
            <Link
              to="/marketplace"
              className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-bold"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;