import React, { useState, useEffect, useRef } from 'react';
import { apiService } from './services/api';

const Marketplace = () => {
  const [location, setLocation] = useState('');
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 41.8781, lng: -87.6298 }); // Default to Chicago
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
          title: listing.name
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h3>${listing.name}</h3>
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

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
      
      <form onSubmit={handleLocationSubmit} className="mb-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your ZIP code"
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for produce..."
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div ref={mapRef} className="w-full h-96 mb-6 rounded-lg shadow-lg"></div>
      
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Available Listings</h2>
        {filteredListings.length === 0 ? (
          <p className="text-gray-500">No listings found in this area.</p>
        ) : (
          filteredListings.map((listing, index) => (
            <div key={index} className="p-4 border-b hover:bg-gray-50">
              <h3 className="font-bold text-lg">{listing.name}</h3>
              <p className="text-gray-600">Location: {listing.location}</p>
              <p className="text-gray-600">Time: {formatDateTime(listing.time)}</p>
              <p className="text-gray-600">Distance: {listing.distance_miles} miles</p>
              <div className="mt-2">
                <h4 className="font-semibold">Available Items:</h4>
                <ul className="list-disc list-inside">
                  {listing.produce_items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700">{item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;