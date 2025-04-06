import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

export default function UserProfile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return;
      
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/user/${currentUser.uid}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
    
    // Set initial display name from current user
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, [currentUser]);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    
    try {
      setUpdateMessage('');
      setUpdateError('');
      await updateUserProfile(displayName);
      setUpdateMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError('Failed to update profile');
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>}
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium">{currentUser?.displayName || 'User'}</h2>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="mb-6">
          <h3 className="text-lg font-medium mb-4">Update Profile</h3>
          
          {updateMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{updateMessage}</span>
          </div>}
          
          {updateError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{updateError}</span>
          </div>}
          
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
        
        {userData && (
          <div>
            <h3 className="text-lg font-medium mb-4">Your Listings</h3>
            {userData.listings && userData.listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.listings.map((listing, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium">{listing.location}</p>
                    <p className="text-sm text-gray-600">{listing.time}</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Produce Items:</p>
                      <ul className="list-disc pl-5">
                        {listing.produce_items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm">
                            {item.name} - {item.quantity} {item.unit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't created any listings yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 