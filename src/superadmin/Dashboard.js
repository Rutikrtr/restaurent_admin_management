import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { logoutRestaurant } from '../features/auth/authApi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        const data = await logoutRestaurant()
        if (data.success) {
            dispatch(logout());
            toast.success("Logout successful");
            navigate("/login");
        } else {
            toast.error("Logout failed");
        }
    };  
  return (
    <div className='flex h-screen flex-col items-center justify-center font-mono'>
        <div className="max-h-auto mx-auto max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Super Admin Dashboard</h1>
            <p className="mb-4">This is a placeholder for the Super Admin Dashboard.</p>
            <p className="text-gray-500">More features coming soon!</p>
            {/* logout btn */}
            <button
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    </div>
  )
}

export default Dashboard