// src/features/restaurant/restaurantSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    restaurant: null,
    categories: [],
    menu: [],
    loading: false,
    error: null
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setRestaurantData: (state, action) => {
            const { id, name, introduction, openingTime, closingTime, location, image, rating, categories, menu } = action.payload;
            state.restaurant = { id, name, introduction, openingTime, closingTime, location, image, rating };
            state.categories = categories || [];
            state.menu = menu || [];
            state.loading = false;
            state.error = null;
        },
        addMenuItem: (state, action) => {
            const { menuItem, categories } = action.payload;
            state.menu.push(menuItem);
            state.categories = categories;
            state.loading = false;
        },
        updateMenuItem: (state, action) => {
            const { menuItem, categories } = action.payload;
            const index = state.menu.findIndex(item => item._id === menuItem._id);
            if (index !== -1) {
                state.menu[index] = menuItem;
            }
            state.categories = categories;
            state.loading = false;
        },
        removeMenuItem: (state, action) => {
            const { menuItemId, categories } = action.payload;
            state.menu = state.menu.filter(item => item._id !== menuItemId);
            state.categories = categories;
            state.loading = false;
        },
        addCategory: (state, action) => {
            state.categories = action.payload;
            state.loading = false;
        },
        removeCategory: (state, action) => {
            state.categories = action.payload;
            state.loading = false;
        },
        clearRestaurantData: (state) => {
            return initialState;
        }
    }
});

export const {
    setLoading,
    setError,
    setRestaurantData,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    addCategory,
    removeCategory,
    clearRestaurantData
} = restaurantSlice.actions;

export default restaurantSlice.reducer;