// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
const initialState = {
    user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
    restaurant: Cookies.get('restaurant') ? JSON.parse(Cookies.get('restaurant')) : null,
    accessToken: Cookies.get('accessToken') || null,
    refreshToken: Cookies.get('refreshToken') || null,
    isAuthenticated: !!Cookies.get('accessToken')
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { user, restaurant, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.restaurant = restaurant;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            Cookies.set('accessToken', accessToken, { secure: true });
            Cookies.set('refreshToken', refreshToken, { secure: true });

           
        },

        logout: (state) => {
            state.user = null;
            state.restaurant = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
