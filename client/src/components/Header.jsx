import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

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
    <header className="bg-white shadow p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="FarmFresh Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-gray-800">FarmFresh</h1>
        </div>
        
        <nav className="flex items-center">
          <div className="flex space-x-6 mr-4">
            <Link to="/" className="text-gray-700 hover:text-blue-500 transition">Home</Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-blue-500 transition">Marketplace</Link>
            <Link to="/feed" className="text-gray-700 hover:text-blue-500 transition">Social Feed</Link>
            <Link to="/search" className="text-gray-700 hover:text-blue-500 transition">Search</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/create-listing" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  Create Listing
                </Link>
                <Link to="/user-profile" className="text-gray-700 hover:text-blue-500 transition">
                  {currentUser.displayName || 'Profile'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-500 transition">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 