import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Marketplace from './Marketplace';
import SocialFeed from './SocialFeed';
import Search from './Search';
import Profile from './Profile';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header with Tabs and Logo */}
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
            <Link to="/profile" className="text-gray-700 hover:text-blue-500 transition">Profile</Link>
          </nav>
        </header>

        {/* App Pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/feed" element={<SocialFeed />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;