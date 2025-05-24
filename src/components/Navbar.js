import React from 'react';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = (props) => {
    const { user, onLogout } = props;
    
    return (
        <nav className="bg-[#0D1436] text-white px-6 py-3 shadow-md flex justify-between items-center">
            {/* Left: Logo */}
            <div className="text-xl font-bold">DGDign</div>

            {/* Right: Links and Icons */}
            <div className="flex items-center space-x-6 text-sm">
                <span className="cursor-pointer hover:text-gray-300">Management</span>

                <FiShoppingCart className="text-xl cursor-pointer hover:text-gray-300" />

                {user &&
                    <div className="flex items-center gap-1">
                        <FiUser className="text-xl" />
                        <span>{user?.fullname || 'User'}</span>
                    </div>
                }

                <div
                    className="flex items-center gap-1 cursor-pointer hover:text-red-400"
                    onClick={onLogout}
                >
                    <FiLogOut className="text-xl" />
                    <span>Logout</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
