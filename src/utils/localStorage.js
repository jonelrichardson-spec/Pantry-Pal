// Utility functions for localStorage operations

/**
 * Get data from localStorage with error handling
 * @param {string} key - The localStorage key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist or on error
 * @returns {any} The parsed data or default value
 */
export const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Save data to localStorage with error handling
 * @param {string} key - The localStorage key to set
 * @param {any} value - The data to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

/**
 * Remove data from localStorage with error handling
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};