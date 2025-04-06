import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from './services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [showZipModal, setShowZipModal] = useState(false);

  useEffect(() => {
    const fetchMostSoldProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMostSoldProducts(9);
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
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowZipModal(true);
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (zipCode && selectedProduct) {
      // Redirect to marketplace with search parameters
      navigate(`/marketplace?zip=${zipCode}&produce=${selectedProduct.name}`);
    }
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

      {/* Most Sold Products Section */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Most Popular Products</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading popular products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : mostSoldProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mostSoldProducts.map((product, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleProductClick(product)}
              >
                <h3 className="font-bold text-lg capitalize">{product.name}</h3>
                <p className="text-gray-600">Listed {product.count} times</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
          <h2 className="font-bold text-lg mb-2">Find Local Sellers</h2>
          <p className="text-gray-700 mb-2">Looking for fresh produce?</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Search by ZIP code</li>
            <li>Find nearby farmers</li>
            <li>Get the freshest ingredients</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <h2 className="font-bold text-lg mb-2">Recipe Search</h2>
          <p className="text-gray-700 mb-2">Need cooking inspiration?</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Search for recipes</li>
            <li>Get ingredient lists</li>
            <li>Find local ingredients</li>
          </ul>
        </div>
      </div>

      {/* ZIP Code Modal */}
      {showZipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Find {selectedProduct?.name} near you</h2>
            <form onSubmit={handleZipSubmit}>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your ZIP code"
                className="w-full p-3 border border-gray-300 rounded mb-4"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowZipModal(false);
                    setZipCode('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;