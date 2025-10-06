import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';

// Constants
const STORAGE_KEY = 'recentRecipes';
const API_KEY_STORAGE = 'spoonacularApiKey';
const MAX_RECENT_RECIPES = 10;

/**
 * Custom hook for managing recipes and API interactions
 * @returns {Object} Recipe operations and state
 */
export const useRecipes = () => {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const storedRecipes = getFromStorage(STORAGE_KEY, []);
    const storedApiKey = getFromStorage(API_KEY_STORAGE, '');
    
    setRecentRecipes(storedRecipes);
    setApiKey(storedApiKey || import.meta.env.VITE_SPOONACULAR_API_KEY || '');
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, recentRecipes);
  }, [recentRecipes]);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(API_KEY_STORAGE, apiKey);
  }, [apiKey]);

  // Add a recipe to recent recipes
  const addToRecentRecipes = (recipe) => {
    setRecentRecipes(prev => {
      // Remove if already exists
      const filtered = prev.filter(r => r.id !== recipe.id);
      // Add to beginning and limit array length
      return [recipe, ...filtered].slice(0, MAX_RECENT_RECIPES);
    });
  };

  // Clear recent recipes
  const clearRecentRecipes = () => {
    setRecentRecipes([]);
  };

  // Find recipes by available ingredients
  const findRecipesByIngredients = async (ingredients, number = 5, ranking = 1, ignorePantry = true) => {
    if (!apiKey) {
      setError('API key not set. Please set your Spoonacular API key');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const ingredientsStr = ingredients.join(',');
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${ingredientsStr}&number=${number}&ranking=${ranking}&ignorePantry=${ignorePantry}`
      );
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(`Failed to fetch recipes: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get detailed recipe information
  const getRecipeDetails = async (recipeId) => {
    if (!apiKey) {
      setError('API key not set. Please set your Spoonacular API key');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      addToRecentRecipes(data);
      return data;
    } catch (err) {
      setError(`Failed to fetch recipe details: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculate recipe match percentage based on available ingredients
  const calculateRecipeMatch = (recipe, availableIngredients) => {
    if (!recipe.extendedIngredients) return 0;
    
    const availableSet = new Set(
      availableIngredients.map(i => i.toLowerCase())
    );
    
    let matchCount = 0;
    recipe.extendedIngredients.forEach(ingredient => {
      if (availableSet.has(ingredient.name.toLowerCase())) {
        matchCount++;
      }
    });
    
    return (matchCount / recipe.extendedIngredients.length) * 100;
  };

  return {
    recentRecipes,
    loading,
    error,
    apiKey,
    setApiKey,
    findRecipesByIngredients,
    getRecipeDetails,
    addToRecentRecipes,
    clearRecentRecipes,
    calculateRecipeMatch,
  };
};

export default useRecipes;