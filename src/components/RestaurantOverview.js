import React from 'react';

const RestaurantOverview = ({ restaurant, categories = [], menu = [] }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Restaurant Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Restaurant Name */}
          <InfoCard
            bg="from-blue-50 to-indigo-50"
            border="border-blue-100"
            iconBg="from-blue-500 to-indigo-600"
            title="Restaurant Name"
            value={restaurant?.name}
          />

          {/* Location */}
          <InfoCard
            bg="from-green-50 to-emerald-50"
            border="border-green-100"
            iconBg="from-green-500 to-emerald-600"
            title="Location"
            value={restaurant?.location}
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            }
          />

          {/* Rating & Hours */}
          <div className="grid grid-cols-2 gap-4">
            <MiniCard
              bg="from-amber-50 to-orange-50"
              border="border-amber-100"
              iconBg="from-amber-500 to-orange-600"
              label="Rating"
              value={`${restaurant?.rating}/5`}
            />
            <MiniCard
              bg="from-purple-50 to-pink-50"
              border="border-purple-100"
              iconBg="from-purple-500 to-pink-600"
              label="Hours"
              value={`${restaurant?.openingTime} - ${restaurant?.closingTime}`}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Image with intro */}
          {restaurant?.image && (
            <div className="group relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold">{restaurant.name}</p>
                <p className="text-sm opacity-90">{restaurant.introduction}</p>
              </div>
            </div>
          )}

          {/* Categories & Menu count */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              bg="from-cyan-50 to-blue-50"
              border="border-cyan-100"
              iconBg="from-cyan-500 to-blue-600"
              count={categories.length}
              label="Categories"
            />
            <StatCard
              bg="from-rose-50 to-pink-50"
              border="border-rose-100"
              iconBg="from-rose-500 to-pink-600"
              count={menu.length}
              label="Menu Items"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOverview;

// Reusable Components

const InfoCard = ({ bg, border, iconBg, title, value, icon }) => (
  <div className={`group p-4 bg-gradient-to-r ${bg} rounded-2xl ${border} hover:shadow-lg transition-all duration-300`}>
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 bg-gradient-to-r ${iconBg} rounded-xl flex items-center justify-center`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon || (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          )}
        </svg>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const MiniCard = ({ bg, border, iconBg, label, value }) => (
  <div className={`group p-4 bg-gradient-to-r ${bg} rounded-2xl ${border} hover:shadow-lg transition-all duration-300`}>
    <div className="flex items-center space-x-2">
      <div className={`w-8 h-8 bg-gradient-to-r ${iconBg} rounded-lg flex items-center justify-center`}>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-bold text-gray-900 text-sm">{value}</p>
      </div>
    </div>
  </div>
);

const StatCard = ({ bg, border, iconBg, count, label }) => (
  <div className={`group p-6 bg-gradient-to-br ${bg} rounded-2xl ${border} hover:shadow-lg transition-all duration-300`}>
    <div className="text-center">
      <div className={`w-12 h-12 bg-gradient-to-r ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
    </div>
  </div>
);
