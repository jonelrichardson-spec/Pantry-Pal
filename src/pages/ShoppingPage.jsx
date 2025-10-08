import React, { useState } from 'react';
import { Plus, Trash2, Check, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import useShoppingList from '../hooks/useShoppingList';
import usePantry from '../hooks/usePantry';

const ShoppingPage = () => {
  const { 
    items, 
    addItem, 
    addItems,
    toggleItemCompleted, 
    removeItem, 
    clearCompletedItems,
    getItemsByCategory 
  } = useShoppingList();
  
  const { items: pantryItems } = usePantry();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMode, setAddMode] = useState('single');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Other');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [bulkText, setBulkText] = useState('');
  
  const categories = [
    'Fresh Produce',
    'Dairy & Eggs',
    'Meat & Protein',
    'Grains & Pasta',
    'Canned Goods',
    'Pantry Staples',
    'Frozen',
    'Other'
  ];
  
  const itemsByCategory = getItemsByCategory();
  
  const isInPantry = (itemName) => {
    return pantryItems.some(pantryItem => 
      pantryItem.name.toLowerCase() === itemName.toLowerCase()
    );
  };
  
  const handleAddItem = (e) => {
    e.preventDefault();
    
    if (!newItemName.trim()) return;
    
    addItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQuantity,
      completed: false
    });
    
    toast.success(`Added "${newItemName}" to shopping list!`);
    setNewItemName('');
    setNewItemQuantity('1');
    setShowAddForm(false);
  };
  
  const handleBulkAdd = (e) => {
    e.preventDefault();
    
    if (!bulkText.trim()) return;
    
    const lines = bulkText.split('\n').filter(line => line.trim());
    const itemsToAdd = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      const name = parts[0];
      const quantity = parts[1] || '1';
      
      return {
        name,
        quantity,
        category: 'Other',
        completed: false
      };
    });
    
    addItems(itemsToAdd);
    setBulkText('');
    setShowAddForm(false);
    toast.success(`Added ${itemsToAdd.length} item${itemsToAdd.length !== 1 ? 's' : ''} to shopping list!`);
  };
  
  const handleClearCompleted = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p>Clear all completed items?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              clearCompletedItems();
              toast.dismiss(t.id);
              toast.success('Completed items cleared!');
            }}
            className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };
  
  const handleRemoveItem = (item) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p>Remove "{item.name}" from shopping list?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              removeItem(item.id);
              toast.dismiss(t.id);
              toast.success('Item removed!');
            }}
            className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded text-sm"
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };
  
  const uncompletedCount = items.filter(item => !item.completed).length;
  const completedCount = items.filter(item => item.completed).length;
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#FF8C42] to-[#F97316] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <ShoppingCart size={28} />
          Shopping List
        </h2>
        <p>Keep track of items you need to buy</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">To Buy</h3>
          <p className="text-2xl font-bold text-[#FF8C42]">{uncompletedCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500 mb-1">Completed</h3>
          <p className="text-2xl font-bold text-[#10B981]">{completedCount}</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
        >
          <Plus size={20} />
          Add Items
        </button>
        
        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            <Trash2 size={20} />
            Clear Completed
          </button>
        )}
      </div>
      
      {showAddForm && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Add Items</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setAddMode('single')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  addMode === 'single'
                    ? 'bg-[#FF8C42] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setAddMode('bulk')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  addMode === 'bulk'
                    ? 'bg-[#FF8C42] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Quick Add
              </button>
            </div>
          </div>
          
          {addMode === 'single' ? (
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name*
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                  placeholder="e.g., Milk, Eggs, Bread"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
                >
                  Add to List
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewItemName('');
                    setNewItemQuantity('1');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleBulkAdd} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quick Add (one item per line)
                </label>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
                  rows={8}
                  placeholder="milk&#10;eggs, 2 dozen&#10;bread&#10;chicken breast, 2 lbs&#10;apples, 6"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: item name, quantity (optional). One per line.
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
                >
                  Add All Items
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setBulkText('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="font-bold text-lg mb-2">Your shopping list is empty</h3>
          <p className="text-gray-600 mb-4">
            Add items manually or from recipe missing ingredients
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(itemsByCategory).map(category => (
            <div key={category}>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                {category === 'Fresh Produce' && '🥬'}
                {category === 'Dairy & Eggs' && '🥛'}
                {category === 'Meat & Protein' && '🥩'}
                {category === 'Grains & Pasta' && '🌾'}
                {category === 'Canned Goods' && '🥫'}
                {category === 'Pantry Staples' && '🧂'}
                {category === 'Frozen' && '❄️'}
                {category === 'Other' && '🍽️'}
                {category}
              </h3>
              
              <div className="space-y-2">
                {itemsByCategory[category].map(item => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 flex items-center gap-3 transition-all ${
                      item.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleItemCompleted(item.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'bg-[#10B981] border-[#10B981]'
                          : 'border-gray-300 hover:border-[#10B981]'
                      }`}
                    >
                      {item.completed && <Check size={16} className="text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.name}
                      </p>
                      <div className="flex gap-3 text-sm text-gray-500 mt-1">
                        <span>Qty: {item.quantity}</span>
                        {isInPantry(item.name) && (
                          <span className="text-[#10B981] font-medium">✓ In Pantry</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingPage;