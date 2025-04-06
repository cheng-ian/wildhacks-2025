import React from 'react';
import { useLocation } from 'react-router-dom';

const IngredientList = () => {
  const location = useLocation();
  const ingredients = location.state?.ingredients || [];
  const recipe = location.state?.recipe || "";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Here's where you can find your ingredients.</h1>

      {ingredients.length === 0 ? (
        <p className="text-gray-500">No ingredients found.</p>
      ) : (
        <ol className="list-decimal list-inside space-y-1">
          {ingredients.map((item, index) => (
            <li key={index}>
              <span className="font-medium">{item.ingredient}</span>: {item.amount}
            </li>
          ))}
        </ol>
      )}
      {recipe && (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Recipe</h2>
            <p className="whitespace-pre-wrap text-gray-700">{recipe}</p>
        </div>
        )}
    </div>
  );
};

export default IngredientList;