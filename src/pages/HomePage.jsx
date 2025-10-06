import React from 'react';
import usePantry from '../hooks/usePantry';

const HomePage = () => {
  const { items, getExpiringItems } = usePantry();
  const expiringItems = getExpiringItems(3); // Items expiring in 3 days

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to PantryPal! 🧺
        </h2>
        <p>Manage your pantry and discover recipes with what you have on hand.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Items */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">Total Items</h3>
          <p className="text-2xl font-bold">{items.length}</p>
        </div>
        
        {/* Expiring Soon */}
        <div className={`bg-white rounded-lg p-4 shadow-sm border ${expiringItems.length > 0 ? 'border-[#EF4444]' : 'border-gray-100'}`}>
          <h3 className="text-sm text-gray-500 mb-1">Expiring Soon</h3>
          <p className={`text-2xl font-bold ${expiringItems.length > 0 ? 'text-[#EF4444]' : ''}`}>
            {expiringItems.length}
          </p>
        </div>
        
        {/* This Week's Savings */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">This Week's Savings</h3>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
      </div>

      {/* Expiring Items Section */}
      {expiringItems.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3">Items Expiring Soon</h3>
          <div className="space-y-2">
            {expiringItems.map(item => (
              <div 
                key={item.id}
                className="flex justify-between items-center p-2 bg-red-50 rounded"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Expires: {item.expirationDate}
                  </p>
                </div>
                <button className="px-3 py-1 bg-[#FF8C42] text-white text-sm rounded">
                  Use It Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
          <h3 className="font-bold text-lg mb-2">Your pantry is empty! Let's add some ingredients 🧺</h3>
          <button className="px-4 py-2 bg-[#FF8C42] text-white rounded-lg mt-4">
            Add Items
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;