import React from 'react';
import { Pencil, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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
    if (daysUntilExpiry === null) return 'border-gray-200';
    if (daysUntilExpiry < 0) return 'border-red-500';
    if (daysUntilExpiry === 0) return 'border-red-500';
    if (daysUntilExpiry <= 3) return 'border-orange-500';
    if (daysUntilExpiry <= 7) return 'border-yellow-500';
    return 'border-green-500';
  };

  const getExpirationStatus = () => {
    if (daysUntilExpiry === null) {
      return {
        icon: <Clock size={16} className="text-gray-500" />,
        text: 'No expiration date',
        color: 'text-gray-600',
        bg: 'bg-gray-50'
      };
    }
    if (daysUntilExpiry < 0) {
      return {
        icon: <AlertCircle size={16} className="text-red-600" />,
        text: `Expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) !== 1 ? 's' : ''} ago!`,
        color: 'text-red-700 font-bold',
        bg: 'bg-red-50'
      };
    }
    if (daysUntilExpiry === 0) {
      return {
        icon: <AlertCircle size={16} className="text-red-600" />,
        text: 'Expires TODAY!',
        color: 'text-red-700 font-bold',
        bg: 'bg-red-50'
      };
    }
    if (daysUntilExpiry === 1) {
      return {
        icon: <AlertCircle size={16} className="text-orange-600" />,
        text: 'Expires tomorrow!',
        color: 'text-orange-700 font-bold',
        bg: 'bg-orange-50'
      };
    }
    if (daysUntilExpiry <= 3) {
      return {
        icon: <AlertCircle size={16} className="text-orange-500" />,
        text: `Expires in ${daysUntilExpiry} days`,
        color: 'text-orange-700 font-semibold',
        bg: 'bg-orange-50'
      };
    }
    if (daysUntilExpiry <= 7) {
      return {
        icon: <Clock size={16} className="text-yellow-600" />,
        text: `Expires in ${daysUntilExpiry} days`,
        color: 'text-yellow-700 font-medium',
        bg: 'bg-yellow-50'
      };
    }
    return {
      icon: <Clock size={16} className="text-green-600" />,
      text: `Fresh - ${daysUntilExpiry} days left`,
      color: 'text-green-700',
      bg: 'bg-green-50'
    };
  };

  const expirationStatus = getExpirationStatus();

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border-4 ${getExpirationColor()}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {item.category}
        </span>
      </div>

      {/* Prominent Expiration Status */}
      {item.expirationDate && (
        <div className={`flex items-center gap-2 p-2 rounded-md mb-3 ${expirationStatus.bg}`}>
          {expirationStatus.icon}
          <span className={`text-sm ${expirationStatus.color}`}>
            {expirationStatus.text}
          </span>
        </div>
      )}

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
          <p>
            <span className="font-medium">Expires:</span> {item.expirationDate}
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