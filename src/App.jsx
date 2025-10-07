import { useState } from 'react';
import { Home, ShoppingBasket, ChefHat, ShoppingCart } from 'lucide-react';

// Import page components
import HomePage from './pages/HomePage';
import PantryPage from './pages/PantryPage';
import RecipesPage from './pages/RecipesPage';
import ShoppingPage from './pages/ShoppingPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchIngredient, setSearchIngredient] = useState(null);

  const handleNavigateWithIngredient = (tab, ingredient = null) => {
    setActiveTab(tab);
    setSearchIngredient(ingredient);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <HomePage onNavigate={handleNavigateWithIngredient} />;
      case 'pantry': return <PantryPage />;
      case 'recipes': return <RecipesPage searchIngredient={searchIngredient} onClearSearch={() => setSearchIngredient(null)} />;
      case 'shopping': return <ShoppingPage />;
      default: return <HomePage onNavigate={handleNavigateWithIngredient} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-[#292524] flex items-center gap-2">
          🧺 PantryPal
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'pantry', icon: ShoppingBasket, label: 'Pantry' },
            { id: 'recipes', icon: ChefHat, label: 'Recipes' },
            { id: 'shopping', icon: ShoppingCart, label: 'Shopping' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                activeTab === id 
                  ? 'text-[#FF8C42] bg-orange-50' 
                  : 'text-gray-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;