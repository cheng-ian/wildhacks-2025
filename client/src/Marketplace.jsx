import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from './services/api';

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState(searchParams.get('zip') || '');
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('produce') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 41.8781, lng: -87.6298 }); // Default to Chicago
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

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
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    loadGoogleMaps();
  }, []); // Only load Google Maps once

  useEffect(() => {
    if (googleMapRef.current && mapRef.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Center map on new location and set zoom
      googleMapRef.current.setCenter(mapCenter);
      googleMapRef.current.setZoom(14);  // Set zoom to 14 when showing search results

      // Add markers for listings
      listings.forEach(listing => {
        const marker = new window.google.maps.Marker({
          position: { lat: listing.lat, lng: listing.lon },
          map: googleMapRef.current,
          title: listing.user_name || 'Unknown seller'
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h3>${listing.user_name || 'Unknown seller'}</h3>
              <p>Location: ${listing.location}</p>
              <p>Time: ${formatDateTime(listing.time)}</p>
              <p>Distance: ${listing.distance_miles} miles</p>
              <p>Items: ${listing.produce_items.map(item => item.name).join(', ')}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infowindow.open(googleMapRef.current, marker);
        });

        markersRef.current.push(marker);
      });
    }
  }, [listings, mapCenter]); // Update markers when listings or center changes

  useEffect(() => {
    // If we have a zip code and search query from URL, perform the search
    if (location && searchQuery) {
      handleLocationSubmit(null, true);
    }
  }, []); // Run only once on component mount

  const initMap = () => {
    if (!mapRef.current) return;

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 13  // Increased from 10 to 13 for initial view
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = listings.filter(listing =>
      listing.produce_items.some(item => 
        item.name.toLowerCase().includes(query)
      )
    );

    setFilteredListings(filtered);
  };

  const handleLocationSubmit = async (e, isInitialLoad = false) => {
    if (e) {
      e.preventDefault();
    }
    if (!location) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.queryProduce(searchQuery, location);
      
      if (response.matching_listings && response.matching_listings.length > 0) {
        setListings(response.matching_listings);
        setFilteredListings(response.matching_listings);
        
        // Update map center if we have listings
        const firstListing = response.matching_listings[0];
        setMapCenter({ lat: firstListing.lat, lng: firstListing.lon });
      } else {
        setListings([]);
        setFilteredListings([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-3 text-green-700">Marketplace</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Find produce near you</label>
          <form onSubmit={handleLocationSubmit}>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-5">
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter ZIP code (required)"
                    className="w-full p-2.5 pl-10 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="col-span-12 md:col-span-5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by produce name (optional)"
                    className="w-full p-2.5 pl-10 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="col-span-12 md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-2.5 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching
                    </span>
                  ) : (
                    <span>Find Produce</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[600px]">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden h-full">
          <div className="bg-green-600 text-white p-2 px-3">
            <h2 className="text-lg font-bold">Map View</h2>
          </div>
          <div ref={mapRef} className="w-full h-[calc(100%-40px)]"></div>
        </div>
        
        <div className="lg:col-span-2 h-full">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            <div className="bg-green-600 text-white p-2 px-3">
              <h2 className="text-lg font-bold">Available Listings</h2>
            </div>
            <div className="overflow-y-auto flex-grow max-h-[calc(600px-40px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                  </svg>
                  <p className="text-gray-500 text-lg font-medium">No listings found</p>
                  <p className="text-gray-400 mt-1">Try searching with a different ZIP code</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredListings.map((listing, index) => (
                    <div 
                      key={index} 
                      className="p-3 hover:bg-green-50 transition-colors"
                    >
                      <h3 className="font-bold text-lg text-green-700">{listing.user_name || 'Unknown Seller'}</h3>
                      <div className="grid grid-cols-2 gap-1 text-sm mt-1">
                        <p className="text-gray-600">
                          <span className="font-semibold">Location:</span> {listing.location}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Distance:</span> {listing.distance_miles} miles
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">When:</span> {formatDateTime(listing.time)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Items:</span> {listing.produce_items.length}
                        </p>
                      </div>
                      <div className="mt-3">
                        <p className="font-semibold text-sm text-gray-700">Available Produce:</p>
                        <ul className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {listing.produce_items.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-green-50 rounded p-2 text-sm">
                              <span>{item.name} - {item.quantity} {item.unit}</span>
                              <span className="font-semibold">${item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;