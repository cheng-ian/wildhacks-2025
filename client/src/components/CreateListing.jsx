import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { addListing } from '../services/authService';

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields state
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [produceItems, setProduceItems] = useState([
    { name: '', quantity: '', unit: '', price: '' }
  ]);

  // Add new produce item field
  const addProduceItem = () => {
    setProduceItems([...produceItems, { name: '', quantity: '', unit: '', price: '' }]);
  };

  // Remove produce item field
  const removeProduceItem = (index) => {
    const newItems = [...produceItems];
    newItems.splice(index, 1);
    setProduceItems(newItems);
  };

  // Handle produce item field changes
  const handleProduceItemChange = (index, field, value) => {
    const newItems = [...produceItems];
    newItems[index][field] = value;
    setProduceItems(newItems);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a listing');
      return;
    }
    
    if (produceItems.some(item => !item.name || !item.quantity || !item.unit || !item.price)) {
      setError('Please fill in all produce item fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const formattedDateTime = `${date} at ${time}`;
      
      await addListing({
        location,
        time: formattedDateTime,
        produce_items: produceItems
      });
      
      setSuccess('Listing created successfully!');
      
      // Reset the form after successful submission
      setLocation('');
      setDate('');
      setTime('');
      setProduceItems([{ name: '', quantity: '', unit: '', price: '' }]);
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/user-profile');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating listing:', error);
      setError('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Location & Time</h2>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location/Address
            </label>
            <input
              type="text"
              id="location"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Enter full address or location name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Produce Items</h2>
            <button
              type="button"
              onClick={addProduceItem}
              className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
            >
              + Add Item
            </button>
          </div>
          
          {produceItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Item #{index + 1}</h3>
                {produceItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduceItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produce Name
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="e.g. Tomatoes, Apples"
                    value={item.name}
                    onChange={(e) => handleProduceItemChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      placeholder="0.00"
                      value={item.price}
                      onChange={(e) => handleProduceItemChange(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleProduceItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    value={item.unit}
                    onChange={(e) => handleProduceItemChange(index, 'unit', e.target.value)}
                    required
                  >
                    <option value="">Select unit</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="oz">Ounces (oz)</option>
                    <option value="g">Grams (g)</option>
                    <option value="each">Each</option>
                    <option value="bunch">Bunch</option>
                    <option value="basket">Basket</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="seller-info mb-6">
          <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">Name:</span> {currentUser?.displayName || 'Anonymous'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your user information will be stored with your listing
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing; 