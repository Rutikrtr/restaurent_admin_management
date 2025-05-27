import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
        <p className="text-gray-600 mb-4">
          System settings and configuration options will be available here.
        </p>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Settings;