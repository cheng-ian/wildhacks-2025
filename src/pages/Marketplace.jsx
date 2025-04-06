import React, { useState, useEffect } from 'react';

const Marketplace = () => {
  const [location, setLocation] = useState('');
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

      vendors.forEach(vendor => {
        const marker = new window.google.maps.Marker({
          position: vendor.location,
          map: map,
          title: vendor.name
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `<div><h3>${vendor.name}</h3><p>${vendor.description}</p></div>`
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      });
    };

    loadGoogleMaps();
  }, [vendors]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(query)
    );

    setFilteredVendors(filtered);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for vendors or products..."
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
      </div>
      <div id="map" className="w-full h-96 mb-6"></div>
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Vendors</h2>
        {filteredVendors.map((vendor, index) => (
          <div key={index} className="p-2 border-b">
            <h3 className="font-bold">{vendor.name}</h3>
            <p>{vendor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
