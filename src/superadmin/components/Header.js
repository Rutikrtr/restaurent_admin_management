import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, activeTab, pendingCount, user }) => {
  return (
    <header className="bg-white shadow-sm border-b h-20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            )}
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://avatars.githubusercontent.com/u/90312737?s=400&u=ef4cb5f0a7fd3a5c53868cfebad45b9a5be8d096&v=4"
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">{user}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;