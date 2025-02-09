import React from "react";
import { FaHome, FaCompass, FaShoppingCart, FaUsers, FaStar, FaEnvelope, FaCog } from "react-icons/fa";

const Sidebar = () => {
    // const contacts = [
    //     { name: "Julia Clarke", location: "New York, USA", img: "https://via.placeholder.com/40" },
    //     { name: "Mark Stefne", location: "Sydney, Australia", img: "https://via.placeholder.com/40" },
    //     { name: "Sara Cliene", location: "Tokyo, Japan", img: "https://via.placeholder.com/40" },
    //     { name: "Trinity Sapon", location: "Chicago, USA", img: "https://via.placeholder.com/40" },
    //     { name: "Amy Ruth", location: "New York, USA", img: "https://via.placeholder.com/40" },
    //     { name: "George Thompson", location: "New York, USA", img: "https://via.placeholder.com/40" },
    // ];

    return (
        <aside className="hidden sm:flex sm:flex-col w-64 bg-white p-4 shadow-md sticky top-0 h-screen">
            <nav className="space-y-6">
                <div className="space-y-4">
                    <a href="#" className="flex items-center space-x-3 text-pink-500 font-semibold">
                        <FaHome className="w-5 h-5" /> <span>Feed</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-pink-500">
                        <FaCompass className="w-5 h-5" /> <span>Explore</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-pink-500">
                        <FaShoppingCart className="w-5 h-5" /> <span>Marketplace</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-pink-500">
                        <FaUsers className="w-5 h-5" /> <span>Groups</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-pink-500">
                        <FaStar className="w-5 h-5" /> <span>My favorites</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-pink-500">
                        <FaEnvelope className="w-5 h-5" /> <span>Messages</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-pink-500">
                        <FaCog className="w-5 h-5" /> <span>Settings</span>
                    </a>
                </div>
                <hr className="my-4" />
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 mb-4">My Contacts</h2>
                    <div className="space-y-4">
                        {/* {contacts.map((contact, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <img src={contact.img} alt={contact.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-gray-800 font-medium">{contact.name}</p>
                                    <p className="text-sm text-gray-500">{contact.location}</p>
                                </div>
                            </div>
                        ))} */}
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar