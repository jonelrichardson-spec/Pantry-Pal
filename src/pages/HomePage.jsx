import React from 'react';
import { Plus, TrendingUp, AlertCircle, ChefHat } from 'lucide-react';
import usePantry from '../hooks/usePantry';

const HomePage = ({ onNavigate }) => {
  const { items, getExpiringItems } = usePantry();
  const expiringItems = getExpiringItems(3); // Items expiring in 3 days
  
  // Calculate total value of pantry items
  const totalValue = items.reduce((sum, item) => {
    const cost = parseFloat(item.cost) || 0;
    return sum + cost;
  }, 0);
  
  // Calculate value of expiring items (potential waste)
  const expiringValue = expiringItems.reduce((sum, item) => {
    const cost = parseFloat(item.cost) || 0;
    return sum + cost;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to PantryPal! 🧺
        </h2>
        <p>Manage your pantry and discover recipes with what you have on hand.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onNavigate('pantry')}
          className="bg-[#FF8C42] text-white p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-[#F97316] transition-colors"
        >
          <Plus size={24} />
          <span className="font-medium">Add Items</span>
        </button>
        <button 
          onClick={() => onNavigate('recipes')}
          className="bg-[#10B981] text-white p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-[#059669] transition-colors"
        >
          <ChefHat size={24} />
          <span className="font-medium">Find Recipes</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Items */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">Total Items</h3>
          <p className="text-2xl font-bold">{items.length}</p>
          {totalValue > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Value: ${totalValue.toFixed(2)}
            </p>
          )}
        </div>
        
        {/* Expiring Soon */}
        <div className={`bg-white rounded-lg p-4 shadow-sm border ${expiringItems.length > 0 ? 'border-[#EF4444]' : 'border-gray-100'}`}>
          <h3 className="text-sm text-gray-500 mb-1">Expiring Soon</h3>
          <p className={`text-2xl font-bold ${expiringItems.length > 0 ? 'text-[#EF4444]' : ''}`}>
            {expiringItems.length}
          </p>
          {expiringValue > 0 && (
            <p className="text-xs text-red-600 mt-1">
              At risk: ${expiringValue.toFixed(2)}
            </p>
          )}
        </div>
        
        {/* Pantry Value */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            <TrendingUp size={14} />
            Pantry Value
          </h3>
          <p className="text-2xl font-bold">
            ${totalValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Expiring Items Alert */}
      {expiringItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900">Use These Items Soon!</h3>
              <p className="text-sm text-red-700">
                {expiringItems.length} item{expiringItems.length > 1 ? 's' : ''} expiring in the next 3 days
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {expiringItems.map(item => {
              const daysUntilExpiry = item.expirationDate 
                ? Math.ceil((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
                : null;
              
              return (
                <div 
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-white rounded border border-red-100"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="flex gap-3 text-sm text-gray-600 mt-1">
                      <span>Expires: {item.expirationDate}</span>
                      {daysUntilExpiry !== null && (
                        <span className="text-red-600 font-medium">
                          ({daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''} left)
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('recipes')}
                    className="px-4 py-2 bg-[#FF8C42] text-white text-sm rounded-lg hover:bg-[#F97316] transition-colors whitespace-nowrap ml-3"
                  >
                    Find Recipe
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-6xl mb-4">🧺</div>
          <h3 className="font-bold text-lg mb-2">Your pantry is empty!</h3>
          <p className="text-gray-600 mb-4">Start adding ingredients to track your inventory and discover recipes.</p>
          <button 
            onClick={() => onNavigate('pantry')}
            className="px-6 py-3 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
          >
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;