import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { logoutRestaurant } from '../features/auth/authApi';
import {
    setLoading,
    setError,
    setRestaurantData,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    addCategory,
    removeCategory
} from '../features/restaurant/restaurantSlice';
import {
    getRestaurantByManager,
    addMenuItemWithCategory,
    updateMenuItem as updateMenuItemApi,
    deleteMenuItem,
    addCategory as addCategoryApi,
    deleteCategory as deleteCategoryApi
} from '../features/restaurant/restaurantApi';

const Management = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { restaurant, categories, menu, loading } = useSelector((state) => state.restaurant);

    const [activeTab, setActiveTab] = useState('overview');
    const [showAddMenuModal, setShowAddMenuModal] = useState(false);
    const [showEditMenuModal, setShowEditMenuModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    // Form states
    const [menuForm, setMenuForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        available: true
    });
    const [categoryForm, setCategoryForm] = useState({
        name: ''
    });

    useEffect(() => {
        fetchRestaurantData();
    }, []);

    // Redirect if not authenticated or not restaurant user
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.accountType !== 'restaurant') {
        return <Navigate to="/login" replace />;
    }

    const fetchRestaurantData = async () => {
        try {
            dispatch(setLoading(true));
            const data = await getRestaurantByManager();
            dispatch(setRestaurantData(data));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch restaurant data'));
            toast.error(error.response?.data?.message || 'Failed to fetch restaurant data');
        }
    };

    const handleLogout = async () => {
        try {
            await logoutRestaurant();
            dispatch(logout());
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const data = await addMenuItemWithCategory(menuForm);
            dispatch(addMenuItem(data));
            toast.success('Menu item added successfully');
            setShowAddMenuModal(false);
            resetMenuForm();
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to add menu item'));
            toast.error(error.response?.data?.message || 'Failed to add menu item');
        }
    };

    const handleUpdateMenuItem = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const data = await updateMenuItemApi(selectedMenuItem._id, menuForm);
            dispatch(updateMenuItem(data));
            toast.success('Menu item updated successfully');
            setShowEditMenuModal(false);
            resetMenuForm();
            setSelectedMenuItem(null);
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to update menu item'));
            toast.error(error.response?.data?.message || 'Failed to update menu item');
        }
    };

    const handleDeleteMenuItem = async (menuItemId) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;
        
        try {
            dispatch(setLoading(true));
            const data = await deleteMenuItem(menuItemId);
            dispatch(removeMenuItem({ menuItemId, categories: data.categories }));
            toast.success('Menu item deleted successfully');
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to delete menu item'));
            toast.error(error.response?.data?.message || 'Failed to delete menu item');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const data = await addCategoryApi({ category: categoryForm });
            dispatch(addCategory(data.data));
            toast.success('Category added successfully');
            setShowAddCategoryModal(false);
            setCategoryForm({ name: '' });
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to add category'));
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    };

    const handleDeleteCategory = async (categoryName) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        
        try {
            dispatch(setLoading(true));
            const data = await deleteCategoryApi(categoryName);
            dispatch(removeCategory(data.data));
            toast.success('Category deleted successfully');
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to delete category'));
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const resetMenuForm = () => {
        setMenuForm({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            available: true
        });
    };

    const openEditModal = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setMenuForm({
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            category: menuItem.category,
            image: menuItem.image,
            available: menuItem.available
        });
        setShowEditMenuModal(true);
    };

    if (loading && !restaurant) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Toaster />
            
            {/* Header */}
            <header className="relative bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Restaurant Management</h1>
                        <p className="text-sm text-gray-500 font-medium">{restaurant?.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </span>
                </button>
            </div>
        </div>
    </header>

            {/* Navigation Tabs */}
             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-2">
            <nav className="flex space-x-2">
                {['overview', 'menu', 'categories'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-6 py-3 rounded-xl font-semibold text-sm capitalize transition-all duration-300 transform hover:scale-105 ${
                            activeTab === tab
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                    >
                        {activeTab === tab && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur opacity-20"></div>
                        )}
                        <span className="relative flex items-center space-x-2">
                            {tab === 'overview' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                            {tab === 'menu' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                            {tab === 'categories' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                            <span>{tab}</span>
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                       {activeTab === 'overview' && (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Restaurant Overview</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Restaurant Name</p>
                                    <p className="text-lg font-bold text-gray-900">{restaurant?.name}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Location</p>
                                    <p className="text-lg font-bold text-gray-900">{restaurant?.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Rating</p>
                                        <p className="font-bold text-gray-900">{restaurant?.rating}/5</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Hours</p>
                                        <p className="font-bold text-gray-900 text-sm">{restaurant?.openingTime} - {restaurant?.closingTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {restaurant?.image && (
                            <div className="group relative overflow-hidden rounded-3xl shadow-2xl">
                                <img src={restaurant.image} alt={restaurant.name} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-lg font-bold">{restaurant?.name}</p>
                                    <p className="text-sm opacity-90">{restaurant?.introduction}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 hover:shadow-lg transition-all duration-300">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{categories?.length || 0}</p>
                                    <p className="text-sm text-gray-600 font-medium">Categories</p>
                                </div>
                            </div>
                            
                            <div className="group p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 hover:shadow-lg transition-all duration-300">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{menu?.length || 0}</p>
                                    <p className="text-sm text-gray-600 font-medium">Menu Items</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'menu' && (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Menu Management</h2>
                    </div>
                    <button
                        onClick={() => setShowAddMenuModal(true)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Add Menu Item</span>
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menu?.map((item) => (
                        <div key={item._id} className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                            {item.image && (
                                <div className="relative h-48 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl ${
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
                                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${item.price}</span>
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold">
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
        )}

                {activeTab === 'categories' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Category Management</h2>
                            <button
                                onClick={() => setShowAddCategoryModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Add Category
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                {categories?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categories.map((category) => (
                                            <div key={category} className="flex justify-between items-center p-4 border rounded-lg">
                                                <span className="font-medium">{category}</span>
                                                <button
                                                    onClick={() => handleDeleteCategory(category)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No categories found. Add your first category!</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Menu Item Modal */}
            {showAddMenuModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Add Menu Item</h3>
                        <form onSubmit={handleAddMenuItem}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    value={menuForm.name}
                                    onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={menuForm.description}
                                    onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    rows="3"
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={menuForm.price}
                                    onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <select
                                    value={menuForm.category}
                                    onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories?.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input
                                    type="url"
                                    placeholder="Image URL"
                                    value={menuForm.image}
                                    onChange={(e) => setMenuForm({...menuForm, image: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={menuForm.available}
                                        onChange={(e) => setMenuForm({...menuForm, available: e.target.checked})}
                                        className="mr-2"
                                    />
                                    Available
                                </label>
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Adding...' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddMenuModal(false);
                                        resetMenuForm();
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Menu Item Modal */}
            {showEditMenuModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Edit Menu Item</h3>
                        <form onSubmit={handleUpdateMenuItem}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    value={menuForm.name}
                                    onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={menuForm.description}
                                    onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    rows="3"
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={menuForm.price}
                                    onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <select
                                    value={menuForm.category}
                                    onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories?.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input
                                    type="url"
                                    placeholder="Image URL"
                                    value={menuForm.image}
                                    onChange={(e) => setMenuForm({...menuForm, image: e.target.value})}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={menuForm.available}
                                        onChange={(e) => setMenuForm({...menuForm, available: e.target.checked})}
                                        className="mr-2"
                                    />
                                    Available
                                </label>
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditMenuModal(false);
                                        resetMenuForm();
                                        setSelectedMenuItem(null);
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {showAddCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Add Category</h3>
                        <form onSubmit={handleAddCategory}>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({name: e.target.value})}
                                className="w-full border rounded-md px-3 py-2 mb-4"
                                required
                            />
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Adding...' : 'Add Category'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddCategoryModal(false);
                                        setCategoryForm({name: ''});
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Management;