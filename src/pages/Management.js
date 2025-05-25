import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { logoutRestaurant } from '../features/auth/authApi';
import Navbar from '../components/Navbar';

const Management = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, restaurant } = useSelector((state) => state.auth);



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
        <div>
            <Navbar
                user={user}
                onLogout={handleLogout}
            />
            <div className='flex h-screen flex-col items-center justify-center font-mono'>
                <div className="max-h-auto mx-auto max-w-xl text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Management Page</h1>

                    {user && (
                        <div className="mb-4 p-4 bg-gray-100 rounded">
                            <p>Welcome, {user.email || user.name || 'User'}!</p>
                            {restaurant && <p>Restaurant: {restaurant.name}  .</p>}
                        </div>
                    )}

                    <button
                        className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Management;