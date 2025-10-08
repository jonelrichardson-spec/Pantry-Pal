import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log("Modal opened:", title);
    } else {
      document.body.style.overflow = 'unset';
      console.log("Modal closed:", title);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, title]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        console.log("Escape pressed, closing modal");
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      console.log("Background clicked, closing modal:", title);
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };
  
  const handleCloseClick = (e) => {
    console.log("X button clicked, closing modal:", title);
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
      onTouchEnd={handleBackgroundClick}
    >
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title || 'Modal'}</h2>
          <button 
            onClick={handleCloseClick}
            onTouchEnd={handleCloseClick}
            className="p-1 rounded-full hover:bg-gray-100"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children || <p className="text-red-500">No content provided to modal</p>}
        </div>
      </div>
    </div>
  );
};

export default Modal;