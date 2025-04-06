import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from './services/api';

const IngredientList = () => {
  const location = useLocation();
  const ingredients = location.state?.ingredients || [];
  const recipe = location.state?.recipe || "";
  const [localSellers, setLocalSellers] = useState({});
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const findLocalSellers = async () => {
    if (!zipCode.trim()) return;
    
    setLoading(true);
    try {
      const ingredientNames = ingredients.map(item => item.ingredient);
      const sellersByIngredient = {};
      
      // Find sellers for each ingredient
      for (const ingredientName of ingredientNames) {
        const response = await apiService.queryProduce(ingredientName, zipCode);
        if (response.matching_listings) {
          sellersByIngredient[ingredientName] = response.matching_listings;
        }
      }
      
      setLocalSellers(sellersByIngredient);
    } catch (error) {
      console.error('Error finding local sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Here's where you can find your ingredients.</h1>

      {/* ZIP Code Input */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Find local sellers for these ingredients:</h3>
        <div className="flex">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter your ZIP code"
            className="p-2 border border-gray-300 rounded-l focus:outline-none"
          />
          <button
            onClick={findLocalSellers}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Find Sellers'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Ingredients</h2>
          {ingredients.length === 0 ? (
            <p className="text-gray-500">No ingredients found.</p>
          ) : (
            <ol className="list-decimal list-inside space-y-2">
              {ingredients.map((item, index) => (
                <li key={index} className="border-b border-gray-100 pb-2">
                  <span className="font-medium">{item.ingredient}</span>: {item.amount}
                  
                  {/* Display local sellers for this ingredient */}
                  {localSellers[item.ingredient] && localSellers[item.ingredient].length > 0 && (
                    <div className="mt-2 ml-6">
                      <p className="text-sm font-medium text-green-600">Available from local sellers:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {localSellers[item.ingredient].slice(0, 3).map((seller, sellerIndex) => (
                          <li key={sellerIndex} className="ml-2">
                            {seller.name} - {seller.distance_miles} miles away
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
        
        {/* Recipe */}
        {recipe && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recipe</h2>
            <p className="whitespace-pre-wrap text-gray-700">{recipe}</p>
          </div>
        )}
      </div>
      
      {/* Display all local sellers */}
      {Object.keys(localSellers).length > 0 && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Local Sellers</h2>
          {Object.entries(localSellers).map(([ingredient, sellers]) => (
            sellers.length > 0 && (
              <div key={ingredient} className="mb-6">
                <h3 className="text-lg font-medium border-b pb-2 mb-2">{ingredient}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sellers.map((seller, sellerIndex) => (
                    <div key={sellerIndex} className="border rounded-lg p-3 hover:bg-gray-50">
                      <h4 className="font-bold">{seller.name}</h4>
                      <p className="text-sm text-gray-600">Location: {seller.location}</p>
                      <p className="text-sm text-gray-600">Distance: {seller.distance_miles} miles</p>
                      <p className="text-sm text-gray-600 mt-1">Available items:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {seller.produce_items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientList;