import React from 'react';
import { Trash2, Edit, AlertCircle, Clock } from 'lucide-react';

const getExpirationStatus = (expirationDate) => {
  if (!expirationDate) return { status: 'none', days: null };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  const daysUntilExpiration = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiration < 0) return { status: 'expired', days: Math.abs(daysUntilExpiration) };
  if (daysUntilExpiration === 0) return { status: 'today', days: 0 };
  if (daysUntilExpiration <= 3) return { status: 'urgent', days: daysUntilExpiration };
  if (daysUntilExpiration <= 7) return { status: 'soon', days: daysUntilExpiration };
  return { status: 'fresh', days: daysUntilExpiration };
};

const getStatusStyles = (status) => {
  const styles = {
    expired: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      badge: 'bg-red-500 text-white',
      icon: AlertCircle
    },
    today: {
      border: 'border-red-400',
      bg: 'bg-red-50',
      text: 'text-red-600',
      badge: 'bg-red-400 text-white',
      icon: AlertCircle
    },
    urgent: {
      border: 'border-orange-400',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-500 text-white',
      icon: Clock
    },
    soon: {
      border: 'border-yellow-400',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      badge: 'bg-yellow-500 text-white',
      icon: Clock
    },
    fresh: {
      border: 'border-green-400',
      bg: 'bg-white',
      text: 'text-green-600',
      badge: 'bg-green-500 text-white',
      icon: null
    },
    none: {
      border: 'border-gray-200',
      bg: 'bg-white',
      text: 'text-gray-500',
      badge: 'bg-gray-400 text-white',
      icon: null
    }
  };
  return styles[status] || styles.none;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const PantryItemCard = ({ item, onEdit, onDelete }) => {
  const { name, quantity, unit, purchaseDate, expirationDate, price } = item;
  const { status, days } = getExpirationStatus(expirationDate);
  const styles = getStatusStyles(status);
  const StatusIcon = styles.icon;
  
  const getExpirationLabel = () => {
    if (status === 'expired') return `Expired ${days} day${days !== 1 ? 's' : ''} ago`;
    if (status === 'today') return 'Expires today!';
    if (status === 'urgent' || status === 'soon') return `${days} day${days !== 1 ? 's' : ''} left`;
    if (status === 'fresh') return `Fresh (${days} days)`;
    return 'No expiration';
  };
  
  return (
    <div className={`${styles.bg} p-4 rounded-lg shadow-sm border-2 ${styles.border} transition-all hover:shadow-md relative`}>
      {/* Expiration Badge */}
      {status !== 'none' && status !== 'fresh' && (
        <div className={`absolute -top-2 -right-2 ${styles.badge} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm`}>
          {StatusIcon && <StatusIcon size={12} />}
          {status === 'expired' && '!'}
          {status === 'today' && 'TODAY'}
          {(status === 'urgent' || status === 'soon') && `${days}d`}
        </div>
      )}
      
      <div className="flex justify-between">
        <div className="flex-1 pr-4">
          <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{quantity}</span> {unit}
          </p>
          
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Purchased:</span>
              <span>{formatDate(purchaseDate)}</span>
            </div>
            
            <div className={`flex items-center gap-2 text-xs ${styles.text} font-medium`}>
              {StatusIcon && <StatusIcon size={14} />}
              <span>{getExpirationLabel()}</span>
            </div>
            
            {price && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium">Price:</span>
                <span>${parseFloat(price).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => onEdit(item)} 
            className="p-2 text-gray-500 hover:text-[#FF8C42] hover:bg-orange-100 rounded-lg transition-colors"
            title="Edit item"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(item.id)} 
            className="p-2 text-gray-500 hover:text-[#EF4444] hover:bg-red-100 rounded-lg transition-colors"
            title="Delete item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PantryItemCard;