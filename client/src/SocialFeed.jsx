import React, { useState } from 'react';

const SocialFeed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'John Doe',
      content: 'Fresh strawberries for sale at Flora Market!',
      image: null,
      location: 'Flora Market, Chicago',
      tags: ['Fruits', 'Strawberries']
    },
    {
      id: 2,
      user: 'Jane Smith',
      content: 'Organic carrots available at Green Acres Farm.',
      image: null,
      location: 'Green Acres Farm, Illinois',
      tags: ['Vegetables', 'Organic']
    }
  ]);
  const [newPost, setNewPost] = useState({
    content: '',
    location: '',
    image: null,
    tags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setNewPost({ ...newPost, image: url });
  };

  const handleCreatePost = () => {
    if (!newPost.content || !newPost.location) return;

    const newPostObj = {
      id: posts.length + 1,
      user: 'Current Seller',
      content: newPost.content,
      location: newPost.location,
      image: newPost.image,
      tags: newPost.tags.split(',').map(tag => tag.trim())
    };

    setPosts([newPostObj, ...posts]);
    setNewPost({ content: '', location: '', image: null, tags: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Social Feed</h1>

      {/* Create New Post */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <textarea
          name="content"
          value={newPost.content}
          onChange={handleChange}
          placeholder="What are you selling today?"
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />

        <input 
          type="text" 
          name="location" 
          value={newPost.location} 
          onChange={handleChange} 
          placeholder="Enter your location" 
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />

        <label className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer inline-block mb-4">
          Upload Image
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
        {newPost.image && <img src={newPost.image} alt="Uploaded" className="w-32 h-32 rounded mb-4" />}

        <input 
          type="text" 
          name="tags" 
          value={newPost.tags} 
          onChange={handleChange} 
          placeholder="Tags (comma-separated)" 
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />

        <button
          onClick={handleCreatePost}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Post
        </button>
      </div>

      {/* Display Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-2xl shadow mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-bold">{post.user}</span>
            <span>{post.tags.map(tag => `#${tag} `)}</span>
          </div>
          <p className="mb-2">{post.content}</p>
          <p className="mb-2 text-gray-500">📍 {post.location}</p>
          {post.image && <img src={post.image} alt="Product" className="w-full h-auto mb-2" />}
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;