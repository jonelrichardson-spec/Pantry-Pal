import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [scanMode, setScanMode] = useState('manual');
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef(null);
  const hasScannedRef = useRef(false);
  
  useEffect(() => {
    if (scanMode === 'camera' && !isScanning) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [scanMode]);
  
  // Estimate price based on product category/type
  const estimatePrice = (product) => {
    const categories = product.categories_tags || [];
    const productName = (product.product_name || '').toLowerCase();
    
    // Basic price estimation based on common categories
    if (categories.some(cat => cat.includes('beverages')) || productName.includes('drink') || productName.includes('soda')) {
      return (Math.random() * 2 + 1.5).toFixed(2); // $1.50 - $3.50
    }
    if (categories.some(cat => cat.includes('snacks')) || productName.includes('chips') || productName.includes('candy')) {
      return (Math.random() * 3 + 2).toFixed(2); // $2.00 - $5.00
    }
    if (categories.some(cat => cat.includes('dairy')) || productName.includes('milk') || productName.includes('cheese')) {
      return (Math.random() * 4 + 3).toFixed(2); // $3.00 - $7.00
    }
    if (categories.some(cat => cat.includes('meat')) || productName.includes('chicken') || productName.includes('beef')) {
      return (Math.random() * 8 + 5).toFixed(2); // $5.00 - $13.00
    }
    if (categories.some(cat => cat.includes('spreads')) || productName.includes('nutella') || productName.includes('jam')) {
      return (Math.random() * 4 + 3.5).toFixed(2); // $3.50 - $7.50
    }
    if (categories.some(cat => cat.includes('cereals')) || productName.includes('cereal')) {
      return (Math.random() * 3 + 4).toFixed(2); // $4.00 - $7.00
    }
    
    // Default price for unknown categories
    return (Math.random() * 5 + 3).toFixed(2); // $3.00 - $8.00
  };
  
  const startCamera = async () => {
    setCameraError('');
    setIsScanning(true);
    hasScannedRef.current = false;
    
    try {
      console.log("Initializing camera...");
      
      html5QrCodeRef.current = new Html5Qrcode("reader");
      
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.777778,
          disableFlip: false,
          formatsToSupport: [
            0,  // QR_CODE
            1,  // AZTEC
            2,  // CODABAR
            3,  // CODE_39
            4,  // CODE_93
            5,  // CODE_128
            6,  // DATA_MATRIX
            7,  // MAXICODE
            8,  // ITF
            9,  // EAN_13
            10, // EAN_8
            11, // PDF_417
            12, // RSS_14
            13, // RSS_EXPANDED
            14, // UPC_A
            15, // UPC_E
            16, // UPC_EAN_EXTENSION
          ]
        },
        (decodedText, decodedResult) => {
          if (!hasScannedRef.current) {
            console.log("Scanned barcode:", decodedText);
            hasScannedRef.current = true;
            handleSuccessfulScan(decodedText);
          }
        },
        (errorMessage) => {
          // Silent - scanning errors are normal
        }
      );
      
      console.log("Camera started successfully");
    } catch (err) {
      console.error("Camera error:", err);
      setIsScanning(false);
      
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        setCameraError('Camera access denied. Please allow camera permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError(`Camera error: ${err.message || 'Unable to access camera'}`);
      }
    }
  };
  
  const stopCamera = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        console.log("Camera stopped");
      } catch (err) {
        console.error("Error stopping camera:", err);
      }
    }
    setIsScanning(false);
  };
  
  const handleSuccessfulScan = async (barcode) => {
    console.log("Barcode detected, stopping camera immediately");
    
    await stopCamera();
    
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    fetchProductInfo(barcode);
    setScanMode('manual');
    
    setManualInput('');
    setError('');
    setCameraError('');
  };
  
  const fetchProductInfo = async (barcode) => {
    setLoading(true);
    setError('');
    
    try {
      console.log("Fetching product info for barcode:", barcode);
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (data.status === 1) {
        const product = data.product;
        
        // Estimate price based on product data
        const estimatedPrice = estimatePrice(product);
        
        const productInfo = {
          name: product.product_name || 'Unknown Product',
          barcode: barcode,
          category: 'Other',
          quantity: 1,
          unit: 'units',
          purchaseDate: new Date().toISOString().slice(0, 10),
          price: estimatedPrice,
        };
        
        console.log("Estimated price:", estimatedPrice);
        onScan(productInfo);
      } else {
        setError('Product not found. Please try another barcode or add manually.');
        onScan({
          name: '',
          barcode: barcode,
          category: 'Other',
          quantity: 1,
          unit: 'units',
          purchaseDate: new Date().toISOString().slice(0, 10),
          price: '',
        });
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
      setError('Failed to lookup product information. Please try again or enter manually.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      fetchProductInfo(manualInput.trim());
      setManualInput('');
    }
  };
  
  const handleModeChange = async (mode) => {
    if (mode === 'manual' && scanMode === 'camera') {
      await stopCamera();
    }
    setScanMode(mode);
  };
  
  return (
    <div className="bg-white p-4">
      <div className="mb-4 text-center">
        <h3 className="font-bold mb-2">Scan Product Barcode</h3>
        <p className="text-sm text-gray-600">
          Choose your scanning method below
        </p>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleModeChange('manual')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            scanMode === 'manual' 
              ? 'bg-[#FF8C42] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => handleModeChange('camera')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            scanMode === 'camera' 
              ? 'bg-[#FF8C42] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Camera Scan
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {cameraError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {cameraError}
          <p className="mt-2 text-xs">
            Check your browser settings to allow camera access for this site.
          </p>
        </div>
      )}
      
      {scanMode === 'camera' && (
        <div className="mb-4">
          <div id="reader" className="w-full"></div>
          {isScanning && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Scanning Tips:</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Hold barcode 6-12 inches from camera</li>
                <li>• Keep barcode steady and in good lighting</li>
                <li>• Fill the orange box with the barcode</li>
                <li>• Try vertical then horizontal orientation</li>
                <li>• Avoid glare and shadows on the barcode</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {scanMode === 'manual' && (
        <>
          <div className="mb-4">
            <p className="text-center mb-2 text-sm text-gray-600">Enter barcode number:</p>
            <form onSubmit={handleManualSubmit} className="flex">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                placeholder="e.g., 3017620422003"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF8C42] text-white rounded-r-lg hover:bg-[#F97316] transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Test Barcodes:</p>
            <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Nutella:</span>
                <span className="font-mono">3017620422003</span>
              </div>
              <div className="flex justify-between">
                <span>Coca-Cola:</span>
                <span className="font-mono">5449000000996</span>
              </div>
              <div className="flex justify-between">
                <span>Red Bull:</span>
                <span className="font-mono">9002490100070</span>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;