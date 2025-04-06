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
  const [priceRanges, setPriceRanges] = useState({ min: 0, max: 0 });
  
  const findLocalSellers = async () => {
    if (!zipCode.trim()) return;
    
    setLoading(true);
    try {
      const ingredientNames = ingredients.map(item => item.ingredient);
      const sellersByIngredient = {};
      let totalMin = 0;
      let totalMax = 0;
      
      // Find sellers for each ingredient
      for (const ingredientName of ingredientNames) {
        const response = await apiService.queryProduce(ingredientName, zipCode);
        if (response.matching_listings) {
          sellersByIngredient[ingredientName] = response.matching_listings;
          
          // Get all valid prices for this ingredient from all sellers
          const prices = response.matching_listings
            .flatMap(listing => 
              listing.produce_items
                .map(item => {
                  // Remove any dollar signs and convert to number
                  const priceStr = String(item.price).replace(/[^0-9.]/g, '');
                  return parseFloat(priceStr);
                })
            )
            .filter(price => !isNaN(price) && price > 0);
          
          // If we have prices for this ingredient, add to totals
          if (prices.length > 0) {
            // For each ingredient, we want to add the min and max available prices
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            totalMin += minPrice;
            totalMax += maxPrice;
          }
        }
      }
      
      setLocalSellers(sellersByIngredient);
      setPriceRanges({ 
        min: Number(totalMin.toFixed(2)), 
        max: Number(totalMax.toFixed(2)) 
      });
    } catch (error) {
      console.error('Error finding local sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Find Your Ingredients</h1>

        {/* ZIP Code Input */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Find local sellers for these ingredients:</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter your ZIP code"
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={findLocalSellers}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-400 font-medium"
            >
              {loading ? 'Searching...' : 'Find Sellers'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients List */}
          <div className="bg-white rounded-xl shadow-md p-6 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingredients</h2>
            
            {/* Price Range Display */}
            {Object.keys(localSellers).length > 0 && (
              <div className="absolute top-6 right-6 text-right">
                <p className="text-sm text-gray-600 mb-1">Estimated Total Cost:</p>
                <p className="text-3xl font-bold text-green-600 mb-8">
                  ${priceRanges.min.toFixed(2)} - ${priceRanges.max.toFixed(2)}
                </p>
              </div>
            )}
            
            {ingredients.length === 0 ? (
              <p className="text-gray-500">No ingredients found.</p>
            ) : (
              <ol className="space-y-4 mt-20">
                {ingredients.map((item, index) => (
                  <li key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{item.ingredient}</span>
                      <span className="text-gray-600">{item.amount}</span>
                    </div>
                    
                    {/* Display local sellers for this ingredient */}
                    {localSellers[item.ingredient] && localSellers[item.ingredient].length > 0 && (
                      <div className="mt-3 ml-4">
                        <p className="text-sm font-medium text-green-600 mb-2">Available from local sellers:</p>
                        <ul className="space-y-2">
                          {localSellers[item.ingredient].slice(0, 3).map((seller, sellerIndex) => (
                            <li key={sellerIndex} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700">{seller.name}</span>
                                <span className="text-sm text-gray-500">{seller.distance_miles} miles away</span>
                              </div>
                              <ul className="space-y-1">
                                {seller.produce_items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{item.name}</span>
                                    <span className="font-medium text-green-600">{item.price}</span>
                                  </li>
                                ))}
                              </ul>
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recipe</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{recipe}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Display all local sellers */}
        {Object.keys(localSellers).length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Local Sellers</h2>
            <div className="space-y-8">
              {Object.entries(localSellers).map(([ingredient, sellers]) => (
                sellers.length > 0 && (
                  <div key={ingredient} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h3 className="text-xl font-medium text-gray-800 mb-4">{ingredient}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sellers.map((seller, sellerIndex) => (
                        <div key={sellerIndex} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                          <h4 className="font-bold text-gray-800 mb-2">{seller.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">Location: {seller.location}</p>
                          <p className="text-sm text-gray-600 mb-3">Distance: {seller.distance_miles} miles</p>
                          <p className="text-sm font-medium text-gray-700 mb-2">Available items:</p>
                          <ul className="space-y-1">
                            {seller.produce_items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{item.name}</span>
                                <span className="font-medium text-green-600">{item.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientList;