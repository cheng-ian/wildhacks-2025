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
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="FarmFresh Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold text-gray-800">FarmFresh</h1>
      </div>
      
      <nav className="flex space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-500 transition">Home</Link>
        <Link to="/marketplace" className="text-gray-700 hover:text-blue-500 transition">Marketplace</Link>
        <Link to="/feed" className="text-gray-700 hover:text-blue-500 transition">Social Feed</Link>
        <Link to="/search" className="text-gray-700 hover:text-blue-500 transition">Search</Link>
        
        {currentUser ? (
          <>
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
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header; 