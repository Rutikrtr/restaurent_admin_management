import React from 'react';

const MenuManagement = ({ menu, openEditModal, handleDeleteMenuItem, setShowAddMenuModal }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Menu Management
                    </h2>
                </div>
                <button
                    onClick={() => setShowAddMenuModal(true)}
                    className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <span className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span>Add Menu Item</span>
                    </span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menu?.map((item) => (
                    <div key={item._id}
                         className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        {item.image && (
                            <div className="relative h-48 overflow-hidden">
                                <img src={item.image} alt={item.name}
                                     className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>
                                <div
                                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl ${
                                        item.available ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                                    }`}>
                                    {item.available ? 'Available' : 'Unavailable'}
                                </div>
                            </div>
                        )}
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{item.name}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <span
                                    className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    ₹{item.price}
                                </span>
                                <span
                                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold">
                                    {item.category}
                                </span>
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteMenuItem(item._id)}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuManagement;
