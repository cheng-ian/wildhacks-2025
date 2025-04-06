import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';

const Marketplace = () => {
  const [location, setLocation] = useState('');
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.8781, lng: -87.6298 },
        zoom: 10
      });

      listings.forEach(listing => {
        const marker = new window.google.maps.Marker({
          position: { lat: listing.lat, lng: listing.lon },
          map: map,
          title: listing.name
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h3>${listing.name}</h3>
              <p>Location: ${listing.location}</p>
              <p>Time: ${listing.time}</p>
              <p>Distance: ${listing.distance_miles} miles</p>
              <p>Items: ${listing.produce_items.map(item => item.name).join(', ')}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      });
    };

    loadGoogleMaps();
  }, [listings]);

  const fetchListings = async (zipCode) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.queryProduce(searchQuery, zipCode);
      if (response.error) {
        throw new Error(response.error);
      }
      setListings(response.matching_listings);
      setFilteredListings(response.matching_listings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (location) {
      fetchListings(location);
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
        >
          Search
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

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div id="map" className="w-full h-96 mb-6"></div>
          <div className="bg-white p-4 rounded-2xl shadow mb-6">
            <h2 className="text-xl font-bold mb-2">Available Listings</h2>
            {filteredListings.map((listing, index) => (
              <div key={index} className="p-4 border-b">
                <h3 className="font-bold">{listing.name}</h3>
                <p>Location: {listing.location}</p>
                <p>Time: {listing.time}</p>
                <p>Distance: {listing.distance_miles} miles</p>
                <div className="mt-2">
                  <h4 className="font-semibold">Available Items:</h4>
                  <ul className="list-disc list-inside">
                    {listing.produce_items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;