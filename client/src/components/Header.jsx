import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import farmFreshLogo from '../images/farmfresh-logo.png';

const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="w-full px-2 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src={farmFreshLogo} alt="FarmFresh Logo" className="h-12 w-12 object-contain" />
          <h1 className="text-2xl font-bold text-green-800">The Neighbor's Table</h1>
        </Link>
        
        <nav className="flex items-center space-x-4 p-4">
          <Link to="/" className="px-4 py-2 text-gray-700 hover:text-green-600 transition rounded-md hover:bg-gray-50">
            Home
          </Link>
          <Link to="/marketplace" className="px-4 py-2 text-gray-700 hover:text-green-600 transition rounded-md hover:bg-gray-50">
            Marketplace
          </Link>
          <Link to="/feed" className="px-4 py-2 text-gray-700 hover:text-green-600 transition rounded-md hover:bg-gray-50">
            Social Feed
          </Link>
          <Link to="/search" className="px-4 py-2 text-gray-700 hover:text-green-600 transition rounded-md hover:bg-gray-50">
            Search
          </Link>
          
          {currentUser ? (
            <>
              <Link to="/create-listing" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                Create Listing
              </Link>
              <Link to="/user-profile" className="px-4 py-2 text-gray-700 hover:text-green-600 transition rounded-md hover:bg-gray-50">
                {currentUser.displayName || 'Profile'}
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition rounded-md hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-green-600 transition rounded-md hover:bg-gray-50">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 