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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-green-800">Social Feed</h1>
          <div className="text-sm text-gray-600">
            Connect with local farmers and sellers
          </div>
        </div>

        {/* Create New Post */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-green-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Share Your Produce</h2>
          <div className="space-y-4">
            <textarea
              name="content"
              value={newPost.content}
              onChange={handleChange}
              placeholder="What fresh produce are you offering today?"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none h-32"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="location" 
                value={newPost.location} 
                onChange={handleChange} 
                placeholder="Where can buyers find you?" 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />

              <input 
                type="text" 
                name="tags" 
                value={newPost.tags} 
                onChange={handleChange} 
                placeholder="Add tags (e.g., Organic, Fruits, Local)" 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl cursor-pointer hover:bg-yellow-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Add Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {newPost.image && (
                <div className="relative">
                  <img src={newPost.image} alt="Upload preview" className="w-20 h-20 rounded-lg object-cover" />
                  <button
                    onClick={() => setNewPost({ ...newPost, image: null })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCreatePost}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Share Post</span>
            </button>
          </div>
        </div>

        {/* Display Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold">
                      {post.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{post.user}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {post.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 text-lg">{post.content}</p>
              
              {post.image && (
                <div className="rounded-xl overflow-hidden mb-4">
                  <img src={post.image} alt="Post" className="w-full h-auto" />
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;