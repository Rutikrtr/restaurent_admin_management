import React from 'react';
import { Clock, MapPin, Calendar, Check, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const PendingRestaurants = ({ pendingRestaurants, loading, onStatusChange }) => {
  if (loading) {
    return <LoadingSpinner message="Loading pending restaurants..." />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Pending Restaurant Approvals</h3>
        <p className="text-sm text-gray-600 mt-1">Review and approve new restaurant registrations</p>
      </div>
      
      {pendingRestaurants.length === 0 ? (
        <div className="p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pending restaurant approvals</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {pendingRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img 
                    className="h-16 w-16 rounded-lg object-cover" 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{restaurant.introduction}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {restaurant.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {restaurant.openingTime} - {restaurant.closingTime}
                      </div>
                      <div>
                        Manager: {restaurant.managerEmail}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onStatusChange(restaurant._id, 'approved')}
                    className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusChange(restaurant._id, 'rejected')}
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRestaurants;