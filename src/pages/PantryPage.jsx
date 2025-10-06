import React, { useState } from 'react';
import { Camera, Plus, Search, Filter } from 'lucide-react';
import usePantry from '../hooks/usePantry';
import Modal from '../components/Modal';
import PantryItemForm from '../components/PantryItemForm';
import PantryItemCard from '../components/PantryItemCard';
import BarcodeScanner from '../components/BarcodeScanner';

const PantryPage = () => {
  const { items, addItem, updateItem, removeItem, getItemsByCategory } = usePantry();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [scannedItem, setScannedItem] = useState(null);
  const [sortBy, setSortBy] = useState('category');
  const [filterExpiration, setFilterExpiration] = useState('all');
  
  const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);
    return Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  };
  
  const getFilteredItems = () => {
    let filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterExpiration === 'expiring') {
      filtered = filtered.filter(item => {
        const days = getDaysUntilExpiration(item.expirationDate);
        return days <= 7;
      });
    } else if (filterExpiration === 'fresh') {
      filtered = filtered.filter(item => {
        const days = getDaysUntilExpiration(item.expirationDate);
        return days > 7;
      });
    }
    
    return filtered;
  };
  
  const getSortedAndGroupedItems = () => {
    const filtered = getFilteredItems();
    
    if (sortBy === 'expiration') {
      const sorted = [...filtered].sort((a, b) => {
        const daysA = getDaysUntilExpiration(a.expirationDate);
        const daysB = getDaysUntilExpiration(b.expirationDate);
        return daysA - daysB;
      });
      
      const groups = {
        'Expired': [],
        'Expiring Today': [],
        'Expiring Soon (1-3 days)': [],
        'Expiring This Week (4-7 days)': [],
        'Fresh (8+ days)': [],
        'No Expiration Date': []
      };
      
      sorted.forEach(item => {
        const days = getDaysUntilExpiration(item.expirationDate);
        if (!item.expirationDate) {
          groups['No Expiration Date'].push(item);
        } else if (days < 0) {
          groups['Expired'].push(item);
        } else if (days === 0) {
          groups['Expiring Today'].push(item);
        } else if (days <= 3) {
          groups['Expiring Soon (1-3 days)'].push(item);
        } else if (days <= 7) {
          groups['Expiring This Week (4-7 days)'].push(item);
        } else {
          groups['Fresh (8+ days)'].push(item);
        }
      });
      
      return Object.keys(groups).reduce((acc, key) => {
        if (groups[key].length > 0) {
          acc[key] = groups[key];
        }
        return acc;
      }, {});
      
    } else if (sortBy === 'name') {
      const sorted = [...filtered].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      return { 'All Items': sorted };
      
    } else {
      const categories = {};
      filtered.forEach(item => {
        const category = item.category || 'Other';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(item);
      });
      return categories;
    }
  };
  
  const sortedItems = getSortedAndGroupedItems();
  
  const handleAddItem = (formData) => {
    addItem(formData);
    setIsAddModalOpen(false);
    setScannedItem(null);
  };
  
  const handleEditItem = (formData) => {
    if (currentItem) {
      updateItem(currentItem.id, formData);
      setIsEditModalOpen(false);
      setCurrentItem(null);
    }
  };
  
  const handleScan = (productInfo) => {
    setScannedItem(productInfo);
    setIsScannerOpen(false);
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      'Fresh Produce': '🥬',
      'Dairy & Eggs': '🥛',
      'Meat & Protein': '🥩',
      'Grains & Pasta': '🌾',
      'Canned Goods': '🥫',
      'Pantry Staples': '🧂',
      'Frozen': '❄️',
      'Other': '🍽️',
      'Expired': '⚠️',
      'Expiring Today': '🚨',
      'Expiring Soon (1-3 days)': '⏰',
      'Expiring This Week (4-7 days)': '📅',
      'Fresh (8+ days)': '✅',
      'No Expiration Date': '📦',
      'All Items': '📋'
    };
    return icons[category] || '🍽️';
  };
  
  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setIsScannerOpen(true)} 
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
        >
          <Camera size={20} />
          <span>Scan</span>
        </button>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors"
        >
          <Plus size={20} />
          <span>Add Manual</span>
        </button>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
            placeholder="Search pantry items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Filter size={16} className="text-gray-500" />
            <span className="text-gray-600 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
            >
              <option value="category">Category</option>
              <option value="expiration">Expiration Date</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 font-medium">Show:</span>
            <select
              value={filterExpiration}
              onChange={(e) => setFilterExpiration(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="expiring">Expiring Soon (7 days or less)</option>
              <option value="fresh">Fresh (8+ days)</option>
            </select>
          </div>
        </div>
      </div>
      
      {Object.keys(sortedItems).length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          {searchTerm || filterExpiration !== 'all' ? (
            <div>
              <p className="text-gray-600 mb-2">No items found matching your filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterExpiration('all');
                }}
                className="text-[#FF8C42] hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-lg mb-2">Your pantry is empty!</h3>
              <p className="text-gray-600 mb-4">Add some ingredients to get started.</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
              >
                Add Items
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(sortedItems).map((category) => (
            <div key={category}>
              <h2 className="font-bold mb-3 flex items-center gap-2 text-lg">
                <span>{getCategoryIcon(category)}</span>
                <span>{category}</span>
                <span className="text-sm font-normal text-gray-500">
                  ({sortedItems[category].length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedItems[category].map((item) => (
                  <PantryItemCard 
                    key={item.id}
                    item={item}
                    onEdit={openEditModal}
                    onDelete={removeItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setScannedItem(null);
        }}
        title="Add Item to Pantry"
      >
        <PantryItemForm 
          initialValues={scannedItem || {}}
          onSubmit={handleAddItem}
          onCancel={() => {
            setIsAddModalOpen(false);
            setScannedItem(null);
          }}
        />
      </Modal>
      
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentItem(null);
        }}
        title="Edit Item"
      >
        <PantryItemForm 
          initialValues={currentItem || {}}
          onSubmit={handleEditItem}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentItem(null);
          }}
          submitLabel="Save Changes"
        />
      </Modal>
      
      <Modal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        title="Scan Barcode"
      >
        <BarcodeScanner 
          onScan={handleScan}
          onClose={() => setIsScannerOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PantryPage;