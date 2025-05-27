import React from 'react';
import { MapPin } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const AllRestaurants = ({ restaurants, loading, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'stop': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Active';
      case 'rejected': return 'Rejected';
      case 'stop': return 'Stopped';
      default: return status || 'Unknown';
    }
  };

  const renderActionButtons = (restaurant) => {
    const currentStatus = restaurant.approvalStatus || 'approved';
    
    return (
      <div className="flex space-x-2">
        {currentStatus !== 'approved' && (
          <button
            onClick={() => onStatusChange(restaurant._id, 'approved')}
            className="text-green-600 hover:text-green-800 text-sm font-medium px-2 py-1 rounded hover:bg-green-50"
          >
            Approve
          </button>
        )}
        {currentStatus !== 'rejected' && (
          <button
            onClick={() => onStatusChange(restaurant._id, 'rejected')}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
          >
            Reject
          </button>
        )}
        {(currentStatus === 'approved' || currentStatus === 'rejected') && (
          <button
            onClick={() => onStatusChange(restaurant._id, 'stop')}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium px-2 py-1 rounded hover:bg-orange-50"
          >
            Stop
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading restaurants..." />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">All Restaurants</h3>
        <p className="text-sm text-gray-600 mt-1">Manage all registered restaurants</p>
      </div>

      {restaurants.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No restaurants found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-12 w-12 rounded-lg object-cover" 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        <div className="text-sm text-gray-500">{restaurant.introduction}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {restaurant.managerEmail || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {restaurant.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(restaurant.approvalStatus || 'approved')}`}>
                      {getStatusText(restaurant.approvalStatus || 'approved')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {restaurant.openingTime} - {restaurant.closingTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderActionButtons(restaurant)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRestaurants;