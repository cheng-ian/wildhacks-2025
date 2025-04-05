import React from 'react';

const Home = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Welcome to FarmFresh!</h1>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">Fresh Food</h2>
        <p>Discover organic produce from local farmers.</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">Explore Recipes</h2>
        <p>Find recipes and meal ideas using fresh produce.</p>
      </div>
    </div>
  </div>
);

export default Home;