// src/features/auth/authAPI.js
import axios from 'axios';
import Cookies from 'js-cookie';
export const loginRestaurant = async (email, password) => {
  const res = await axios.post(
    'http://localhost:8000/api/v1/user/login/bothsuperadmin&restaurent',
    { email, password },
    {
      withCredentials: true
    }
  );
  return res.data.data;
};

export const logoutRestaurant = async () => {
  const res = await axios.post(
    'http://localhost:8000/api/v1/user/logout',
    {},
   {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header as fallback
        Authorization: `Bearer ${Cookies.get('accessToken')}`
      }
    }
  );
  return res.data;
};


