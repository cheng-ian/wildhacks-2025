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
        <nav className="bg-white shadow p-4 flex justify-between">
          <Link to="/" className="text-xl font-bold">FarmFresh</Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-700">Home</Link>
            <Link to="/marketplace" className="text-gray-700">Marketplace</Link>
            <Link to="/feed" className="text-gray-700">Social Feed</Link>
            <Link to="/search" className="text-gray-700">Search</Link>
            <Link to="/profile" className="text-gray-700">Profile</Link>
          </div>
        </nav>
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