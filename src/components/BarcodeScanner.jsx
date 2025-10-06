import React, { useState } from 'react';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  console.log("BarcodeScanner component rendered");
  
  const fetchProductInfo = async (barcode) => {
    setLoading(true);
    setError('');
    
    try {
      console.log("Fetching product info for barcode:", barcode);
      
      // Use CORS proxy if needed
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      console.log("API URL:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response data:", data);
      
      if (data.status === 1) {
        // Product found
        const product = data.product;
        console.log("Product found:", product.product_name);
        
        const productInfo = {
          name: product.product_name || 'Unknown Product',
          barcode: barcode,
          category: 'Other',
          quantity: 1,
          unit: 'units',
          purchaseDate: new Date().toISOString().slice(0, 10),
        };
        
        onScan(productInfo);
      } else {
        console.log("Product not found in API");
        // Product not found
        setError('Product not found in database. Please add details manually.');
        
        onScan({
          name: '',
          barcode: barcode,
          category: 'Other',
          quantity: 1,
          unit: 'units',
          purchaseDate: new Date().toISOString().slice(0, 10),
        });
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
      setError('Error connecting to product database. Check your internet connection and try again.');
      
      // Even with an error, let's continue with manual entry
      onScan({
        name: '',
        barcode: barcode,
        category: 'Other',
        quantity: 1,
        unit: 'units',
        purchaseDate: new Date().toISOString().slice(0, 10),
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      fetchProductInfo(manualInput.trim());
    } else {
      setError('Please enter a barcode number');
    }
  };
  
  // For testing - hardcoded products
  const useTestProduct = (productName) => {
    let barcode = '';
    switch(productName) {
      case 'nutella':
        barcode = '3017620422003';
        onScan({
          name: 'Nutella Hazelnut Spread',
          barcode: barcode,
          category: 'Pantry Staples',
          quantity: 1,
          unit: 'units',
          purchaseDate: new Date().toISOString().slice(0, 10),
        });
        break;
      case 'coke':
        barcode = '5449000000996';
        onScan({
          name: 'Coca-Cola Classic',
          barcode: barcode, 
          category: 'Pantry Staples',
          quantity: 1,
          unit: 'units',
          purchaseDate: new Date().toISOString().slice(0, 10),
        });
        break;
      case 'milk':
        barcode = '12345';
        onScan({
          name: 'Milk, Whole',
          barcode: barcode,
          category: 'Dairy & Eggs',
          quantity: 1,
          unit: 'L',
          purchaseDate: new Date().toISOString().slice(0, 10),
        });
        break;
      default:
        setError('Test product not found');
    }
  };
  
  return (
    <div className="bg-white p-4">
      <div className="mb-4 text-center">
        <h3 className="font-bold mb-2">Enter Product Barcode</h3>
        <p className="text-sm text-gray-600">
          Enter a barcode number or use test products
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-6">
        <p className="text-center mb-2">Enter barcode number:</p>
        <form onSubmit={handleManualSubmit} className="flex">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg"
            placeholder="Enter barcode number"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#FF8C42] text-white rounded-r-lg"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      
      {/* Test product buttons */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        <button 
          onClick={() => useTestProduct('nutella')}
          className="px-3 py-2 bg-[#10B981] text-white rounded-lg text-sm"
        >
          Test: Nutella
        </button>
        <button 
          onClick={() => useTestProduct('coke')}
          className="px-3 py-2 bg-[#10B981] text-white rounded-lg text-sm"
        >
          Test: Coca-Cola
        </button>
        <button 
          onClick={() => useTestProduct('milk')}
          className="px-3 py-2 bg-[#10B981] text-white rounded-lg text-sm"
        >
          Test: Milk
        </button>
      </div>
      
      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;