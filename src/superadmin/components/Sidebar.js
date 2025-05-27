import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Settings, 
  LogOut, 
  X,
  Clock
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, onLogout }) => {
  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'restaurants', icon: Store, label: 'All Restaurants' },
    { id: 'pending-restaurants', icon: Clock, label: 'Pending Restaurants' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-20 px-4 border-b">
        <h1 className="text-xl font-bold text-gray-800 font-mono">SuperAdmin</h1>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="mt-8 px-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;