import React, { useState } from 'react';

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

  const addListing = (listing) => {
    setListings([...listings, { ...listing, id: listings.length + 1 }]);
  };

  const CreateListing = ({ addListing }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      category: '',
      image: null,
      location: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      addListing(formData);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
        location: ''
      });
    };

    return (
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Create New Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Dairy">Dairy</option>
            <option value="Flowers">Flowers</option>
            <option value="Other">Other</option>
          </select>
          <label className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer inline-block mb-2">
            Upload Product Image
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {formData.image && <img src={formData.image} alt="Product" className="w-32 h-32 rounded mb-2" />}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white py-3 px-6 rounded w-full hover:bg-blue-600 transition">Add Listing</button>
        </form>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-bold mb-2">User Information</h2>

        {userInfo.profilePicture && (
          <img src={userInfo.profilePicture} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
        )}

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
        <div>
          <CreateListing addListing={addListing} />

          <div className="bg-white p-4 rounded-2xl shadow mb-6">
            <h2 className="text-xl font-bold mb-2">My Listings</h2>
            {listings.map((listing, index) => (
              <div key={index} className="p-2 mb-2 border-b">
                <h3 className="font-bold">{listing.name}</h3>
                <p>{listing.price}</p>
                {listing.image && (
                  <img src={listing.image} alt="Product" className="w-32 h-32 rounded mb-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
