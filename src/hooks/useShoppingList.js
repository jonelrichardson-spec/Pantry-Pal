import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

// Constants
const STORAGE_KEY = 'shoppingList';

/**
 * Custom hook for managing shopping list
 * @returns {Object} Shopping list operations and state
 */
export const useShoppingList = () => {
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

  // Add a new shopping list item
  const addItem = (item) => {
    const newItem = {
      ...item,
      id: item.id || uuidv4(),
      completed: false,
    };
    setItems(prevItems => [...prevItems, newItem]);
    return newItem;
  };

  // Add multiple items at once (e.g., from a recipe)
  const addItems = (itemsToAdd, recipeSource = '') => {
    const newItems = itemsToAdd.map(item => ({
      ...item,
      id: item.id || uuidv4(),
      completed: false,
      recipeSource: recipeSource || item.recipeSource,
    }));
    
    setItems(prevItems => [...prevItems, ...newItems]);
    return newItems;
  };

  // Update an existing shopping list item
  const updateItem = (id, updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    );
  };

  // Toggle item completion status
  const toggleItemCompleted = (id) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Remove a shopping list item
  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Clear completed items
  const clearCompletedItems = () => {
    setItems(prevItems => prevItems.filter(item => !item.completed));
  };

  // Clear all items
  const clearAllItems = () => {
    setItems([]);
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

  // Get completed and uncompleted items
  const getItemsByCompletionStatus = () => {
    return {
      completed: items.filter(item => item.completed),
      uncompleted: items.filter(item => !item.completed)
    };
  };

  return {
    items,
    loading,
    addItem,
    addItems,
    updateItem,
    toggleItemCompleted,
    removeItem,
    clearCompletedItems,
    clearAllItems,
    getItemsByCategory,
    getItemsByCompletionStatus,
  };
};

export default useShoppingList;