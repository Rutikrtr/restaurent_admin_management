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
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import RestaurantOverview from '../components/RestaurantOverview';
import MenuManagement from '../components/MenuManagement';
import CategoryManagement from '../components/CategoryManagement';
import Order from '../components/Order';

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
            <Header restaurant={restaurant} handleLogout={handleLogout} />

            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'overview' && (
                    <RestaurantOverview restaurant={restaurant} categories={categories} menu={menu} />
                )}



                {activeTab === 'menu' && (
                    <MenuManagement
                        menu={menu}
                        openEditModal={openEditModal}
                        handleDeleteMenuItem={handleDeleteMenuItem}
                        setShowAddMenuModal={setShowAddMenuModal}
                    />
                )}


                {activeTab === 'categories' && (
                    <CategoryManagement
                        categories={categories}
                        setShowAddCategoryModal={setShowAddCategoryModal}
                        handleDeleteCategory={handleDeleteCategory}
                    />
                )}
                 {activeTab === 'orders' && (
                    <Order/>
                )}


            </div>

            {showAddMenuModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fade-in">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Menu Item</h3>
                        <form onSubmit={handleAddMenuItem} className="space-y-4">
                            <input type="text" placeholder="Item Name" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
                            <textarea placeholder="Description" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} rows="3" className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
                            <input type="number" step="0.01" placeholder="Price" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
                            <select value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" required>
                                <option value="">Select Category</option>
                                {categories?.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <input type="url" placeholder="Image URL" value={menuForm.image} onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
                            <label className="flex items-center text-sm">
                                <input type="checkbox" checked={menuForm.available} onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })} className="mr-2" />
                                Available
                            </label>

                            <div className="flex space-x-4 pt-4">
                                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50">
                                    {loading ? 'Adding...' : 'Add Item'}
                                </button>
                                <button type="button" onClick={() => { setShowAddMenuModal(false); resetMenuForm(); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium">
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
                                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={menuForm.description}
                                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2"
                                    rows="3"
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={menuForm.price}
                                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <select
                                    value={menuForm.category}
                                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
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
                                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2"
                                    required
                                />
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={menuForm.available}
                                        onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
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
                                onChange={(e) => setCategoryForm({ name: e.target.value })}
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
                                        setCategoryForm({ name: '' });
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