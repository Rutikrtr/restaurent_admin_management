// src/services/restaurantApi.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Restaurant API functions
export const restaurantApi = {
  // Get restaurant by manager
  getRestaurantByManager: async () => {
    try {
      const response = await apiClient.get('/restaurant/manager');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Menu Item Management
  addMenuItem: async (menuItem) => {
    try {
      const response = await apiClient.post('/restaurant/menu', menuItem);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateMenuItem: async (menuItemId, updatedItem) => {
    try {
      const response = await apiClient.put(`/restaurant/menu/${menuItemId}`, updatedItem);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteMenuItem: async (menuItemId) => {
    try {
      const response = await apiClient.delete(`/restaurant/menu/${menuItemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Category Management
  addCategory: async (categoryName) => {
    try {
      const response = await apiClient.post('/restaurant/menu/category', { name: categoryName });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCategory: async (categoryName) => {
    try {
      const response = await apiClient.delete(`/restaurant/menu/category/${categoryName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Order Management
  getRestaurantOrders: async () => {
    try {
      const response = await apiClient.get('/restaurant/order/restaurant');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put('/restaurant/order/status', {
        orderId,
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};