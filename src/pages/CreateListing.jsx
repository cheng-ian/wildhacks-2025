import React, { useState } from 'react';

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

        {formData.image && <img src={formData.image} alt="Product" className="w-32 h-32 rounded mb-2" />}

        <label className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer inline-block mb-2">
          Upload Product Image
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden"
          />
        </label>

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

export default CreateListing;
