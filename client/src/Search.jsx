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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="p-6 max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-green-800">Let us cook.</h1>
          <p className="mb-8 text-gray-600 text-lg">Type what you want to make, and we'll find recipes, ingredients, and nearby vendors selling what you need!</p>

          {/* Search Bar */}
          <div className="flex items-center mb-12 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., steak dinner with sides" 
              className="w-full p-4 border border-gray-300 rounded-l-2xl shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
            />
            <button 
              onClick={handleSearch} 
              className="bg-green-600 text-white font-semibold p-4 rounded-r-2xl hover:bg-green-700 transition disabled:bg-green-300 shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
            <h2 className="font-bold text-xl mb-4 text-green-800">Try These Prompts:</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Steak dinner with frites
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Something Chinese or Korean
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Tortellini soup
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                A delicious sweet treat
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-100">
            <h2 className="font-bold text-xl mb-4 text-yellow-800">Find Local Ingredients!</h2>
            <p className="text-gray-700 mb-4">After generating a recipe, you can:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Enter your ZIP code to find local sellers
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                See which ingredients are available nearby
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Support local farmers and get the freshest produce
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm">Powered by Gemini API</p>
      </div>
    </div>
  );
};

export default Search;