import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;