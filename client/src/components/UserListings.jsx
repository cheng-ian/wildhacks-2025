import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const UserListings = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/user/${userId}`
        );
        setUserData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching seller data:', error);
        setError('Failed to load seller profile');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <div className="mt-4">
            <Link to="/marketplace" className="text-blue-600 hover:text-blue-800">
              ← Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md">
          <p className="font-bold">Seller Not Found</p>
          <p>The seller profile you're looking for doesn't exist or has been removed.</p>
          <div className="mt-4">
            <Link to="/marketplace" className="text-blue-600 hover:text-blue-800">
              ← Return to Marketplace
            </Link>
          </div>
        </div>
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
      <div className="mb-4">
        <Link 
          to="/marketplace" 
          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Marketplace
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="bg-green-100 text-green-800 p-3 rounded-full mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{userData.name}'s Produce Listings</h1>
            <p className="text-gray-600">View all available listings from this seller</p>
          </div>
        </div>
        
        {sortedListings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
            </svg>
            <p className="text-lg text-gray-600">This seller doesn't have any active listings</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedListings.map((listing, index) => (
              <div key={index} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-green-50 p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-lg text-green-800">{listing.location}</p>
                      <p className="text-sm text-gray-600 mt-1">Available: {formatDateTime(listing.time)}</p>
                    </div>
                    {listing.created_at && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Posted {formatDateTime(listing.created_at)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="font-medium text-gray-700 mb-3">Available Produce:</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {listing.produce_items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              ${item.price}
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
        )}
      </div>
    </div>
  );
};

export default UserListings; 