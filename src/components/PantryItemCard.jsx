import React from 'react';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

const PantryItemCard = ({ item, onEdit, onDelete }) => {
  const getDaysUntilExpiration = () => {
    if (!item.expirationDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(item.expirationDate);
    expDate.setHours(0, 0, 0, 0);
    return Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = getDaysUntilExpiration();

  const getExpirationColor = () => {
    if (daysUntilExpiry === null) return 'bg-gray-100 text-gray-700';
    if (daysUntilExpiry < 0) return 'bg-red-100 text-red-800 border-red-300';
    if (daysUntilExpiry === 0) return 'bg-red-100 text-red-800 border-red-300';
    if (daysUntilExpiry <= 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (daysUntilExpiry <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getExpirationText = () => {
    if (daysUntilExpiry === null) return 'No expiration date';
    if (daysUntilExpiry < 0) return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    return `Expires in ${daysUntilExpiry} days`;
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border-2 ${getExpirationColor()}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <span className="text-sm bg-gray-200 px-2 py-1 rounded">
          {item.category}
        </span>
      </div>

      <div className="space-y-1 text-sm mb-3">
        <p>
          <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
        </p>
        {item.purchaseDate && (
          <p>
            <span className="font-medium">Purchased:</span> {item.purchaseDate}
          </p>
        )}
        {item.expirationDate && (
          <p className="font-medium">
            {getExpirationText()}
          </p>
        )}
        {item.price && parseFloat(item.price) > 0 && (
          <p>
            <span className="font-medium">Price:</span> ${parseFloat(item.price).toFixed(2)}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Mark "${item.name}" as used up?`)) {
              onDelete(item.id);
            }
          }}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          title="Used Up"
        >
          <CheckCircle size={16} />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Delete ${item.name}?`)) {
              onDelete(item.id);
            }
          }}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PantryItemCard;