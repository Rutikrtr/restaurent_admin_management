// src/features/restaurant/restaurantApi.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api/v1/user';

// Get axios config with auth headers
const getAuthConfig = () => ({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('accessToken')}`
    }
});

// Get restaurant details by manager
export const getRestaurantByManager = async () => {
    const res = await axios.get(
        `${API_BASE_URL}/manager`,
        getAuthConfig()
    );
    console.log(res.data.data)
    return res.data.data;
    
};

// Add menu item with category
export const addMenuItemWithCategory = async (menuData) => {
    const res = await axios.post(
        `${API_BASE_URL}/menu`,
        menuData,
        getAuthConfig()
    );
    return res.data.data;
};

// Update menu item
export const updateMenuItem = async (menuItemId, menuData) => {
    const res = await axios.put(
        `${API_BASE_URL}/menu/${menuItemId}`,
        menuData,
        getAuthConfig()
    );
    return res.data.data;
};

// Delete menu item
export const deleteMenuItem = async (menuItemId) => {
    const res = await axios.delete(
        `${API_BASE_URL}/menu/${menuItemId}`,
        getAuthConfig()
    );
    return res.data.data;
};

// Add category
export const addCategory = async (categoryData) => {
    const res = await axios.post(
        `${API_BASE_URL}/menu/category`,
        categoryData,
        getAuthConfig()
    );
    return res.data;
};

// Delete category
export const deleteCategory = async (categoryName) => {
    const res = await axios.delete(
        `${API_BASE_URL}/menu/category/${categoryName}`,
        getAuthConfig()
    );
    return res.data;
};