import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

// If you don't have uuid installed, run: npm install uuid

// Constants
const STORAGE_KEY = 'pantryItems';

/**
 * Custom hook for managing pantry items
 * @returns {Object} Pantry operations and state
 */
export const usePantry = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load items from localStorage on mount
  useEffect(() => {
    const storedItems = getFromStorage(STORAGE_KEY, []);
    setItems(storedItems);
    setLoading(false);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveToStorage(STORAGE_KEY, items);
    }
  }, [items, loading]);

  // Add a new pantry item
  const addItem = (item) => {
    const newItem = {
      ...item,
      id: item.id || uuidv4(), // Generate id if not provided
      purchaseDate: item.purchaseDate || new Date().toISOString().slice(0, 10), // Default to today
    };
    setItems(prevItems => [...prevItems, newItem]);
    return newItem;
  };

  // Update an existing pantry item
  const updateItem = (id, updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  // Remove a pantry item
  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Get items expiring soon
  const getExpiringItems = (daysThreshold = 3) => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    return items.filter(item => {
      if (!item.expirationDate) return false;
      const expDate = new Date(item.expirationDate);
      return expDate <= thresholdDate && expDate >= today;
    });
  };

  // Group items by category
  const getItemsByCategory = () => {
    const categories = {};
    
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    return categories;
  };

  return {
    items,
    loading,
    addItem,
    updateItem,
    removeItem,
    getExpiringItems,
    getItemsByCategory,
  };
};

export default usePantry;