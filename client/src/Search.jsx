import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate', {
        query: searchQuery,
      });

      const fullResponse = response.data.result;

      // Extract CSV section of output
      const csvMatch = fullResponse.match(/CSV:\s*([\s\S]*?)\n\s*Recipe:/i);
      const recipeMatch = fullResponse.match(/Recipe:\s*([\s\S]*)/i);
      
      let csvLines = [];
      let ingredientsArray = [];
      let recipeText = recipeMatch ? recipeMatch[1].trim() : "";

      if (csvMatch && csvMatch[1])
      {
        csvLines = csvMatch[1]
          .trim()
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // Convert to key-value object array
        ingredientsArray = csvLines.map(line => {
          const [ingredient, amount] = line.split(',').map(part => part.trim());
          return { ingredient, amount };
        });
      }

      console.log("Parsed Ingredients:", ingredientsArray);

      setSearchResults(ingredientsArray);

      // move to page that lists ingredients
      navigate('/ingredients', { 
        state: { 
          ingredients: ingredientsArray,
          recipe: recipeText,
        }, 
      });

    } catch (error) {
      console.error('Error calling backend:', error);
      setSearchResults("Error generating recipe.");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white p-3 rounded-r-2xl hover:bg-blue-600 transition disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-2xl mb-6">
          <h2 className="font-bold text-lg mb-2">Try These Queries:</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>I want to make steak for dinner</li>
            <li>Find recipes with strawberries</li>
            <li>What can I cook with potatoes?</li>
            <li>Suggest vegetarian dinner ideas</li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-2xl mb-6 border border-green-100">
          <h2 className="font-bold text-lg mb-2">Find Local Ingredients!</h2>
          <p className="text-gray-700 mb-2">After generating a recipe, you can:</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Enter your ZIP code to find local sellers</li>
            <li>See which ingredients are available nearby</li>
            <li>Support local farmers and get the freshest produce</li>
          </ul>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-4">Powered by Gemini API</p>
    </div>
  );
};

export default Search;