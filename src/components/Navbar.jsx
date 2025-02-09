import React from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "../context/userContext";
import "./../index.css"
import { logoutUser } from "../utils/firebasehelpers";
const Navbar = () => {
    const { user } = useUser()
    const navigate = useNavigate()
    const logout = () => {
        logoutUser()
        localStorage.removeItem('user')
        navigate('/login')
    }
    return (
        <nav className="flex items-center justify-between bg-white p-4 shadow-md">
            {/* Logo */}
            <Link to={'/'} className="text-xl font-bold text-gray-800">Scrolllink</Link>

            {/* Search Bar */}
            <div className="hidden sm:flex md:flex-1 max-w-2xl mx-4 sm:mx-8 my-2 sm:my-0">
                <input
                    type="text"
                    placeholder="Search something here..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium hidden md:block">{user?.displayName}</span>
                <div><img
                    src={user.photoURL} // Replace with actual profile image URL
                    alt="User Profile"
                    className="w-10 h-10 border border-gray-300 object-cover p-0.5 rounded-full"
                /></div>
                <button onClick={logout} className="px-3 cursor-pointer font-medium text-sm md:text-base bg-pink-400 text-white py-2 border border-white/50 rounded-md">
                    Logout
                </button>
            </div>

        </nav>
    );
};

export default Navbar;
