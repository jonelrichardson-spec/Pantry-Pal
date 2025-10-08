import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'pantryItems';

export const usePantry = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedItems = getFromStorage(STORAGE_KEY, []);
    setItems(storedItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveToStorage(STORAGE_KEY, items);
    }
  }, [items, loading]);

  // Add a new pantry item - check for duplicates first
  const addItem = (itemData) => {
    // Check if item with same name already exists (case-insensitive)
    const existingItemIndex = items.findIndex(
      item => item.name.toLowerCase().trim() === itemData.name.toLowerCase().trim()
    );
    
    if (existingItemIndex !== -1) {
      // Item exists - update quantity instead of adding duplicate
      const existingItem = items[existingItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: parseFloat(existingItem.quantity || 0) + parseFloat(itemData.quantity || 1),
        // Update other fields if they're provided and more recent
        purchaseDate: itemData.purchaseDate || existingItem.purchaseDate,
        expirationDate: itemData.expirationDate || existingItem.expirationDate,
        price: itemData.price || existingItem.price,
        category: itemData.category || existingItem.category,
        unit: itemData.unit || existingItem.unit,
      };
      
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = updatedItem;
      setItems(updatedItems);
      return updatedItem;
    } else {
      // New item - add normally
      const newItem = {
        ...itemData,
        id: itemData.id || uuidv4(),
        purchaseDate: itemData.purchaseDate || new Date().toISOString().slice(0, 10),
        quantity: parseFloat(itemData.quantity) || 1,
      };
      setItems(prevItems => [...prevItems, newItem]);
      return newItem;
    }
  };

  const updateItem = (id, updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

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