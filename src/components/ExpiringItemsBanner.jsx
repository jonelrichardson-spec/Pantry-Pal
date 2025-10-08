import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ExpiringItemsBanner = ({ expiringItems, onDismiss, onViewItem }) => {
  if (expiringItems.length === 0) return null;

  const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);
    return Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  };

  // Categorize items
  const expiredItems = expiringItems.filter(item => getDaysUntilExpiration(item.expirationDate) < 0);
  const expiringToday = expiringItems.filter(item => getDaysUntilExpiration(item.expirationDate) === 0);
  const expiringSoon = expiringItems.filter(item => {
    const days = getDaysUntilExpiration(item.expirationDate);
    return days > 0 && days <= 3;
  });

  const getBannerColor = () => {
    if (expiredItems.length > 0 || expiringToday.length > 0) {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-orange-50 border-orange-200';
  };

  const getIconColor = () => {
    if (expiredItems.length > 0 || expiringToday.length > 0) {
      return 'text-red-600';
    }
    return 'text-orange-600';
  };

  const getMessage = () => {
    if (expiredItems.length > 0) {
      return `${expiredItems.length} item${expiredItems.length !== 1 ? 's have' : ' has'} expired!`;
    }
    if (expiringToday.length > 0) {
      return `${expiringToday.length} item${expiringToday.length !== 1 ? 's expire' : ' expires'} today!`;
    }
    return `${expiringSoon.length} item${expiringSoon.length !== 1 ? 's expire' : ' expires'} in the next 3 days`;
  };

  return (
    <div className={`${getBannerColor()} border-2 rounded-lg p-4 mb-6 relative`}>
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded-full transition-colors"
        title="Dismiss"
      >
        <X size={20} className="text-gray-600" />
      </button>

      <div className="flex items-start gap-3">
        <AlertCircle size={24} className={`${getIconColor()} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{getMessage()}</h3>
          
          <div className="space-y-2">
            {expiredItems.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">Expired:</p>
                <div className="flex flex-wrap gap-2">
                  {expiredItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onViewItem(item)}
                      className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full hover:bg-red-200 transition-colors font-medium"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {expiringToday.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">Expires Today:</p>
                <div className="flex flex-wrap gap-2">
                  {expiringToday.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onViewItem(item)}
                      className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full hover:bg-red-200 transition-colors font-medium"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {expiringSoon.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-orange-700 mb-1">Expiring Soon:</p>
                <div className="flex flex-wrap gap-2">
                  {expiringSoon.map(item => {
                    const days = getDaysUntilExpiration(item.expirationDate);
                    return (
                      <button
                        key={item.id}
                        onClick={() => onViewItem(item)}
                        className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors font-medium"
                      >
                        {item.name} ({days} day{days !== 1 ? 's' : ''})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-600 mt-3">
            💡 Tip: Use these items soon or freeze them to extend their life!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpiringItemsBanner;