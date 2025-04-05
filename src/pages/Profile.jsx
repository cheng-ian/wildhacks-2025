import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Farmer from Illinois specializing in organic vegetables.',
    profilePicture: null,
    location: ''
  });
  const [listings, setListings] = useState([
    { id: 1, name: 'Fresh Tomatoes', price: '$3/lb', image: null },
    { id: 2, name: 'Organic Carrots', price: '$2/bunch', image: null },
    { id: 3, name: 'Strawberries', price: '$5/lb', image: null }
  ]);

  const toggleSellerMode = () => {
    setIsSeller(!isSeller);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setUserInfo({ ...userInfo, profilePicture: url });
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.onload = () => window.google && initAutocomplete();
      document.body.appendChild(script);
    };

    const initAutocomplete = () => {
      const input = document.getElementById('location-input');
      if (!input || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setUserInfo({ ...userInfo, location: place.formatted_address });
        }
      });
    };

    loadGoogleMaps();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-2">User Information</h2>

        {userInfo.profilePicture && (
          <img src={userInfo.profilePicture} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
        )}

        <label className="bg-blue-500 text-white py-2 px-4 rounded mb-4 cursor-pointer inline-block">
          Upload Profile Picture
          <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
        </label>

        <input 
          type="text" 
          name="name" 
          value={userInfo.name} 
          onChange={handleChange} 
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          placeholder="Name"
        />

        <input 
          type="email" 
          name="email" 
          value={userInfo.email} 
          onChange={handleChange} 
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          placeholder="Email"
        />

        <textarea 
          name="bio" 
          value={userInfo.bio} 
          onChange={handleChange} 
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          placeholder="Bio"
        />

        <input 
          type="text" 
          id="location-input"
          name="location" 
          value={userInfo.location} 
          onChange={handleChange} 
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          placeholder="Enter your location"
        />

        <button onClick={toggleSellerMode} className="bg-blue-500 text-white py-2 px-4 rounded mt-2">
          {isSeller ? 'Switch to Buyer Mode' : 'Switch to Seller Mode'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
