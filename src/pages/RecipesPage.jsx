import React, { useState, useEffect } from 'react';
import { Search, ChefHat, Clock, Users, ExternalLink, ShoppingCart } from 'lucide-react';
import usePantry from '../hooks/usePantry';
import useRecipes from '../hooks/useRecipes';
import useShoppingList from '../hooks/useShoppingList';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const RecipesPage = ({ searchIngredient, onClearSearch }) => {
  const { items } = usePantry();
  const { addItems } = useShoppingList();
  const { 
    findRecipesByIngredients, 
    getRecipeDetails, 
    loading, 
    error 
  } = useRecipes();
  
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [numberOfRecipes, setNumberOfRecipes] = useState(10);
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('');
  
  // Auto-search when navigating with specific ingredient
  useEffect(() => {
    if (searchIngredient && items.length > 0) {
      const ingredients = items.map(item => item.name);
      
      findRecipesByIngredients(ingredients, numberOfRecipes, 1, true)
        .then(results => {
          setRecipes(results);
          setSearchPerformed(true);
        });
      
      onClearSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchIngredient]);
  
  const getIngredientList = () => {
    return items.map(item => item.name);
  };
  
  const handleFindRecipes = async () => {
    const ingredients = getIngredientList();
    
    if (ingredients.length === 0) {
      toast.error('Add some items to your pantry first!');
      return;
    }
    
    setSearchPerformed(true);
    const results = await findRecipesByIngredients(
      ingredients, 
      numberOfRecipes,
      1,
      true
    );
    
    setRecipes(results);
  };
  
  const handleViewRecipe = async (recipe) => {
    const details = await getRecipeDetails(recipe.id);
    if (details) {
      setSelectedRecipe(details);
      setShowDetailModal(true);
    }
  };
  
  const handleAddToShoppingList = (recipe) => {
    const missingIngredients = [];
    
    if (recipe.extendedIngredients) {
      recipe.extendedIngredients.forEach(ing => {
        const ingredientName = ing.name.toLowerCase();
        
        // More precise matching - check if pantry item name is in ingredient OR vice versa
        const isInPantry = items.some(pantryItem => {
          const pantryName = pantryItem.name.toLowerCase();
          
          // Exact match
          if (pantryName === ingredientName) return true;
          
          // Check if they're the same with slight variations (plurals, etc)
          // But NOT if they just share a few letters
          const words1 = pantryName.split(' ');
          const words2 = ingredientName.split(' ');
          
          // Check if any significant word matches (3+ characters)
          return words1.some(word1 => 
            words2.some(word2 => 
              word1.length >= 3 && word2.length >= 3 && 
              (word1.includes(word2) || word2.includes(word1))
            )
          );
        });
        
        if (!isInPantry) {
          missingIngredients.push(ing);
        }
      });
    }
    
    const shoppingItems = missingIngredients.map(ing => ({
      name: ing.name,
      quantity: ing.amount ? `${ing.amount} ${ing.unit}` : '1',
      category: 'Other',
      recipeSource: recipe.title
    }));
    
    addItems(shoppingItems, recipe.title);
    toast.success(`Added ${shoppingItems.length} ingredient${shoppingItems.length !== 1 ? 's' : ''} to your shopping list!`);
  };
  
  const getMatchPercentage = (recipe) => {
    if (!recipe.usedIngredientCount || !recipe.missedIngredientCount === undefined) {
      return 0;
    }
    const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
    return Math.round((recipe.usedIngredientCount / total) * 100);
  };
  
  const getFilteredRecipes = () => {
    let filtered = recipes;
    
    if (dietaryFilter) {
      filtered = filtered.filter(recipe => {
        const title = recipe.title.toLowerCase();
        const diet = dietaryFilter.toLowerCase();
        
        if (diet === 'vegetarian') {
          return !title.includes('chicken') && !title.includes('beef') && 
                 !title.includes('pork') && !title.includes('fish');
        }
        if (diet === 'vegan') {
          return !title.includes('chicken') && !title.includes('beef') && 
                 !title.includes('pork') && !title.includes('fish') &&
                 !title.includes('cheese') && !title.includes('egg') &&
                 !title.includes('milk') && !title.includes('cream');
        }
        return true;
      });
    }
    
    if (mealTypeFilter) {
      filtered = filtered.filter(recipe => {
        const title = recipe.title.toLowerCase();
        
        if (mealTypeFilter === 'sweet') {
          return title.includes('cake') || title.includes('cookie') || 
                 title.includes('dessert') || title.includes('sweet') ||
                 title.includes('chocolate') || title.includes('pie') ||
                 title.includes('pastry') || title.includes('muffin') ||
                 title.includes('brownie') || title.includes('tart') ||
                 title.includes('nutella') || title.includes('jam') ||
                 title.includes('jelly') || title.includes('honey') ||
                 title.includes('syrup') || title.includes('frosting') ||
                 title.includes('icing') || title.includes('pudding') ||
                 title.includes('custard') || title.includes('caramel') ||
                 title.includes('fudge') || title.includes('candy') ||
                 title.includes('truffle') || title.includes('macaron') ||
                 title.includes('donut') || title.includes('doughnut') ||
                 title.includes('cinnamon roll') || title.includes('danish') ||
                 title.includes('strudel') || title.includes('cobbler') ||
                 title.includes('crisp') || title.includes('crumble');
        }
        if (mealTypeFilter === 'savory') {
          return !title.includes('cake') && !title.includes('cookie') && 
                 !title.includes('dessert') && !title.includes('sweet') &&
                 !title.includes('chocolate') && !title.includes('pie') &&
                 !title.includes('pastry') && !title.includes('muffin') &&
                 !title.includes('brownie') && !title.includes('tart') &&
                 !title.includes('nutella') && !title.includes('jam') &&
                 !title.includes('jelly') && !title.includes('honey') &&
                 !title.includes('syrup') && !title.includes('frosting') &&
                 !title.includes('icing') && !title.includes('pudding') &&
                 !title.includes('custard') && !title.includes('caramel') &&
                 !title.includes('fudge') && !title.includes('candy') &&
                 !title.includes('truffle') && !title.includes('macaron') &&
                 !title.includes('donut') && !title.includes('doughnut') &&
                 !title.includes('cinnamon roll') && !title.includes('danish') &&
                 !title.includes('strudel') && !title.includes('cobbler') &&
                 !title.includes('crisp') && !title.includes('crumble');
        }
        return true;
      });
    }
    
    return filtered;
  };
  
  const filteredRecipes = getFilteredRecipes();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <ChefHat size={28} />
          Recipe Finder
        </h2>
        <p>Discover recipes you can make with ingredients from your pantry</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-gray-500" />
            <span className="font-medium">
              {items.length} ingredients available in your pantry
            </span>
          </div>
          
          <div className="flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of recipes
              </label>
              <select
                value={numberOfRecipes}
                onChange={(e) => setNumberOfRecipes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={5}>5 recipes</option>
                <option value={10}>10 recipes</option>
                <option value={15}>15 recipes</option>
                <option value={20}>20 recipes</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dietary preference (optional)
              </label>
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All recipes</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal type (optional)
              </label>
              <select
                value={mealTypeFilter}
                onChange={(e) => setMealTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All types</option>
                <option value="savory">Savory</option>
                <option value="sweet">Sweet/Dessert</option>
              </select>
            </div>
            
            <button
              onClick={handleFindRecipes}
              disabled={loading || items.length === 0}
              className="px-6 py-2 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Find Recipes'}
            </button>
          </div>
        </div>
      </div>
      
      {loading && (
        <LoadingSpinner message="Finding delicious recipes..." />
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
      
      {items.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center">
          <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="font-bold text-lg mb-2">No ingredients in your pantry</h3>
          <p className="text-gray-600 mb-4">
            Add some ingredients to your pantry to find recipes you can make!
          </p>
        </div>
      )}
      
      {!searchPerformed && items.length > 0 && !loading && (
        <div className="bg-white rounded-lg p-8 text-center">
          <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="font-bold text-lg mb-2">Ready to cook?</h3>
          <p className="text-gray-600">
            Click "Find Recipes" to see what you can make with your ingredients
          </p>
        </div>
      )}
      
      {searchPerformed && filteredRecipes.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">
            Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecipes.map((recipe) => {
              const matchPercent = getMatchPercentage(recipe);
              
              return (
                <div 
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[#10B981] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {matchPercent}% Match
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2">{recipe.title}</h4>
                    
                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-1">
                          ✓ You have ({recipe.usedIngredientCount}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {recipe.usedIngredients?.slice(0, 3).map((ing, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                            >
                              {ing.name}
                            </span>
                          ))}
                          {recipe.usedIngredients?.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{recipe.usedIngredients.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {recipe.missedIngredientCount > 0 && (
                        <div>
                          <p className="text-sm font-medium text-orange-700 mb-1">
                            ✗ You need ({recipe.missedIngredientCount}):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {recipe.missedIngredients?.slice(0, 3).map((ing, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded"
                              >
                                {ing.name}
                              </span>
                            ))}
                            {recipe.missedIngredients?.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{recipe.missedIngredients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleViewRecipe(recipe)}
                      className="w-full px-4 py-2 bg-[#FF8C42] text-white rounded-lg font-medium hover:bg-[#F97316] transition-colors"
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {searchPerformed && filteredRecipes.length === 0 && recipes.length > 0 && (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">
            No recipes found matching your filters. Try changing the filters or adding more ingredients to your pantry.
          </p>
        </div>
      )}
      
      {searchPerformed && recipes.length === 0 && !loading && (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">
            No recipes found. Try adding more ingredients to your pantry!
          </p>
        </div>
      )}
      
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRecipe(null);
        }}
        title={selectedRecipe?.title || 'Recipe Details'}
      >
        {selectedRecipe && (
          <div className="space-y-4">
            <img 
              src={selectedRecipe.image} 
              alt={selectedRecipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="flex gap-4 text-sm text-gray-600">
              {selectedRecipe.readyInMinutes && (
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{selectedRecipe.readyInMinutes} min</span>
                </div>
              )}
              {selectedRecipe.servings && (
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{selectedRecipe.servings} servings</span>
                </div>
              )}
            </div>
            
            {selectedRecipe.extendedIngredients && (
              <div>
                <h4 className="font-bold mb-2">Ingredients:</h4>
                <ul className="space-y-1">
                  {selectedRecipe.extendedIngredients.map((ing, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      • {ing.original}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedRecipe.instructions && (
              <div>
                <h4 className="font-bold mb-2">Instructions:</h4>
                <div 
                  className="text-sm text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
                />
              </div>
            )}
            
            {selectedRecipe.extendedIngredients && (
              <button
                onClick={() => handleAddToShoppingList(selectedRecipe)}
                className="w-full px-4 py-2 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add Missing Ingredients to Shopping List
              </button>
            )}
            
            {selectedRecipe.sourceUrl && (
              <a 
                href={selectedRecipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#10B981] hover:underline"
              >
                <ExternalLink size={16} />
                View original recipe
              </a>
            )}
            
            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecipesPage;