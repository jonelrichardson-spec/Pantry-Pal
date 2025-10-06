import React from 'react';
import { Trash2, Edit } from 'lucide-react';

const getExpirationColor = (expirationDate) => {
  if (!expirationDate) return 'text-gray-500';
  
  const today = new Date();
  const expDate = new Date(expirationDate);
  const daysUntilExpiration = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiration <= 0) return 'text-[#EF4444]';
  if (daysUntilExpiration <= 3) return 'text-[#EF4444]';
  if (daysUntilExpiration <= 7) return 'text-[#FCD34D]';
  return 'text-[#10B981]';
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const PantryItemCard = ({ item, onEdit, onDelete }) => {
  const { name, quantity, unit, purchaseDate, expirationDate, price } = item;
  const expirationColor = getExpirationColor(expirationDate);
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between">
      <div>
        <h3 className="font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{quantity} {unit}</p>
        <div className="flex gap-3 mt-1 text-xs">
          <span className="text-gray-500">Purchased: {formatDate(purchaseDate)}</span>
          <span className={expirationColor}>
            Expires: {formatDate(expirationDate)}
          </span>
          {price && <span className="text-gray-500">Price: ${parseFloat(price).toFixed(2)}</span>}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => onEdit(item)} 
          className="p-1.5 text-gray-500 hover:text-[#FF8C42] hover:bg-orange-50 rounded-full"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(item.id)} 
          className="p-1.5 text-gray-500 hover:text-[#EF4444] hover:bg-red-50 rounded-full"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PantryItemCard;