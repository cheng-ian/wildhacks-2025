import React, { useState } from 'react';

const Profile = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Farmer from Illinois specializing in organic vegetables.',
    profilePicture: null
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

  const handleProductImageUpload = (index, e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const updatedListings = listings.map((listing, i) => (
      i === index ? { ...listing, image: url } : listing
    ));
    setListings(updatedListings);
  };

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

        <button onClick={toggleSellerMode} className="bg-blue-500 text-white py-2 px-4 rounded mt-2">
          {isSeller ? 'Switch to Buyer Mode' : 'Switch to Seller Mode'}
        </button>
      </div>

      {isSeller && (
        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-bold mb-2">My Listings</h2>
          {listings.map((listing, index) => (
            <div key={listing.id} className="p-2 mb-2 border-b">
              <h3 className="font-bold">{listing.name}</h3>
              <p>{listing.price}</p>
              {listing.image && (
                <img src={listing.image} alt="Product" className="w-32 h-32 rounded mb-2" />
              )}

              <label className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer inline-block mt-2">
                Upload Product Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleProductImageUpload(index, e)} 
                  className="hidden"
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
