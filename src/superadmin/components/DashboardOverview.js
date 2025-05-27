import React from 'react';
import { 
  TrendingUp,
  Store, 
  Clock,
  UserCheck,
  Settings
} from 'lucide-react';
import StatsCard from './StatsCard';

const DashboardOverview = ({ restaurants = [], pendingRestaurants = [], setActiveTab }) => {
  const statsCards = [
    { 
      title: 'Total Restaurants', 
      value: restaurants.length.toString(), 
      change: '+8.2%', 
      icon: Store, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Pending Approvals', 
      value: pendingRestaurants.length.toString(), 
      change: '+5.7%', 
      icon: Clock, 
      color: 'bg-orange-500' 
    },
    { 
      title: 'Active Restaurants', 
      value: restaurants.filter(r => r.approvalStatus === 'approved').length.toString(), 
      change: '+12.5%', 
      icon: TrendingUp, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Total Managers', 
      value: new Set(restaurants.map(r => r.managerEmail)).size.toString(), 
      change: '+23.1%', 
      icon: UserCheck, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('restaurants')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Store className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">View All Restaurants</p>
          </button>
          <button 
            onClick={() => setActiveTab('pending-restaurants')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative"
          >
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Pending Approvals</p>
            {pendingRestaurants.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingRestaurants.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;