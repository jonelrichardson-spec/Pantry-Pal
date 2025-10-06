import React, { useState } from 'react';
import { Camera, Plus, Search } from 'lucide-react';
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
  
  const itemsByCategory = getItemsByCategory();
  
  const filteredItemsByCategory = Object.keys(itemsByCategory).reduce((acc, category) => {
    const filteredItems = itemsByCategory[category].filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredItems.length > 0) {
      acc[category] = filteredItems;
    }
    
    return acc;
  }, {});
  
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
    console.log("Scan result:", productInfo);
    setScannedItem(productInfo);
    setIsScannerOpen(false);
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };
  
  return (
    <div>
      {/* Top Actions */}
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setIsScannerOpen(true)} 
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF8C42] text-white rounded-lg font-medium"
        >
          <Camera size={20} />
          <span>Scan</span>
        </button>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#10B981] text-white rounded-lg font-medium"
        >
          <Plus size={20} />
          <span>Add Manual</span>
        </button>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg"
          placeholder="Search pantry items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Inventory Display */}
      {Object.keys(filteredItemsByCategory).length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          {searchTerm ? (
            <p>No items found matching "{searchTerm}"</p>
          ) : (
            <>
              <h3 className="font-bold text-lg mb-2">Your pantry is empty!</h3>
              <p className="text-gray-600 mb-4">Add some ingredients to get started.</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#FF8C42] text-white rounded-lg font-medium"
              >
                Add Items
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(filteredItemsByCategory).map((category) => (
            <div key={category}>
              <h2 className="font-bold mb-3 flex items-center gap-2">
                {category === 'Fresh Produce' && '🥬'}
                {category === 'Dairy & Eggs' && '🥛'}
                {category === 'Meat & Protein' && '🥩'}
                {category === 'Grains & Pasta' && '🌾'}
                {category === 'Canned Goods' && '🥫'}
                {category === 'Pantry Staples' && '🧂'}
                {category === 'Frozen' && '❄️'}
                {category === 'Other' && '🍽️'}
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredItemsByCategory[category].map((item) => (
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
      
      {/* Add Item Modal */}
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
      
      {/* Edit Item Modal */}
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
        />
      </Modal>
      
      {/* Barcode Scanner Modal */}
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