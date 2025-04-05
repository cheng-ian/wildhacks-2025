import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async () => {
    const apiKey = 'YOUR_API_KEY';  // Replace with your actual API key
    const apiUrl = 'https://gemini.googleapis.com/v1/query';  // Example endpoint

    try {
      const response = await axios.post(apiUrl, {
        query: searchQuery,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      setSearchResults(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      <p className="mb-4 text-gray-600">Type what you want to make, and we'll find recipes, ingredients, and nearby vendors selling what you need!</p>

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="e.g., I want to make steak for dinner" 
          className="w-full p-3 border border-gray-300 rounded-l-2xl shadow focus:outline-none"
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white p-3 rounded-r-2xl hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-2xl mb-6">
        <h2 className="font-bold text-lg mb-2">Try These Queries:</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>I want to make steak for dinner</li>
          <li>Find recipes with strawberries</li>
          <li>What can I cook with potatoes?</li>
          <li>Suggest vegetarian dinner ideas</li>
        </ul>
      </div>

      {searchResults && (
        <div className="mt-6 bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-2">Search Results</h2>
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
        </div>
      )}

      <p className="text-gray-500 text-sm mt-4">Powered by Gemini API</p>
    </div>
  );
};

export default Search;
