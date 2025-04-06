import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function UserProfile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');

  // Format date and time for display
  const formatDateTime = (dateTimeStr) => {
    try {
      // Check if the string contains "at" format (e.g., "2023-04-06 at 15:30")
      if (dateTimeStr.includes(' at ')) {
        const [datePart, timePart] = dateTimeStr.split(' at ');
        const date = new Date(datePart);
        
        // If date is invalid, just return the original string
        if (isNaN(date.getTime())) {
          return dateTimeStr;
        }
        
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
        return `${formattedDate} at ${timePart.trim()}`;
      } else {
        // Try to parse as ISO string or regular date
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) {
          return dateTimeStr;
        }
        
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeStr;
    }
  };

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

  // Sort listings by creation date if available
  const sortedListings = userData?.listings?.slice() || [];
  sortedListings.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB - dateA; // Most recent first
  });

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
          <div className="flex space-x-4">
            <Link
              to="/create-listing"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Create New Listing
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
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
            {sortedListings.length > 0 ? (
              <div className="space-y-4">
                {sortedListings.map((listing, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{listing.location}</p>
                        <p className="text-sm text-gray-600 mb-2">{formatDateTime(listing.time)}</p>
                        {listing.created_at && (
                          <p className="text-xs text-gray-500">
                            Created: {formatDateTime(listing.created_at)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="font-medium">Produce Items:</p>
                      <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                              </th>
                              <th scope="col" className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th scope="col" className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {listing.produce_items.map((item, itemIndex) => (
                              <tr key={itemIndex}>
                                <td className="py-2 px-3 whitespace-nowrap text-sm">
                                  {item.name}
                                </td>
                                <td className="py-2 px-3 whitespace-nowrap text-sm">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="py-2 px-3 whitespace-nowrap text-sm">
                                  {item.price ? `$${item.price}` : 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
                <Link 
                  to="/create-listing" 
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Create Your First Listing
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 