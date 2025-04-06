import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Marketplace from './Marketplace';
import SocialFeed from './SocialFeed';
import Search from './Search';
import Profile from './Profile';
import IngredientList from './IngredientList';
import Header from './components/Header';
import CreateListing from './components/CreateListing';
import UserListings from './components/UserListings';

// Auth Components
import { AuthProvider } from './auth/AuthContext';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import UserProfile from './auth/UserProfile';
import ProtectedRoute from './auth/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />

          {/* App Pages */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/feed" element={<SocialFeed />} />
            <Route path="/search" element={<Search />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ingredients" element={<IngredientList />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/seller/:userId" element={<UserListings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;