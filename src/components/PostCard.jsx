import React from 'react'

const PostCard = ({ title }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex items-center space-x-3 mb-3">
                <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-gray-800">{name}</p>
                    <p className="text-sm text-gray-500">{new Date(time).toLocaleTimeString()}</p>
                </div>
            </div>
            <img src="https://via.placeholder.com/600x300" alt="Post" className="w-full rounded-lg mb-3" />
            <div className="flex items-center justify-between text-gray-500">
                <div className="flex space-x-4">
                    <span className="cursor-pointer">Like</span>
                    <span className="cursor-pointer">Comments</span>
                    <span className="cursor-pointer">Share</span>
                </div>
                <span>340 Likes</span>
            </div>
            <div className="mt-3">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
            </div>
        </div>
    )
}

export default PostCard