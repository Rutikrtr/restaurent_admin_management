import axios from "axios";


const API_BASE_URL = 'http://localhost:8000/api/v1/user';

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch restaurants');
      }

      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching all restaurants:', error);
      throw error;
    }
  },

  // Get pending restaurants
  getPendingRestaurants: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/superadmin/pending-restaurants`, {
        withCredentials: true // This ensures cookies are sent
      });

      const data = response.data;

      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching pending restaurants:', error);
      throw error;
    }
  },

  // Change restaurant status
  changePendingRestaurantStatus: async (restaurantId, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/superadmin/approval`,
        {
          restaurantId: restaurantId,
          status: status
        },
        {
          withCredentials: true, // Send cookies
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error changing restaurant status:', error);
      throw error;
    }
  },

  changeRestaurantStatus: async (restaurantId, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/superadmin/changeRestaurantStatus`,
        {
          restaurantId: restaurantId,
          status: status
        },
        {
          withCredentials: true, // Send cookies
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error changing restaurant status:', error);
      throw error;
    }
  }
};