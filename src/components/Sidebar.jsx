import { arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaHome, FaCompass, FaShoppingCart, FaUsers, FaStar, FaEnvelope, FaCog, FaUserPlus, FaEnvelopeOpenText } from "react-icons/fa";
import { db } from "../config/firebase";
import { useUser } from "../context/userContext";
import { updateDocument } from "../utils/firebasehelpers";
// import { updateDocument, arrayUnion } from "../utils/firebasehelpers";
const Sidebar = () => {
    const [allRequests, setAllRequests] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const getAllRequest = async () => {
            try {
                const q = query(collection(db, "users"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    let data = [];
                    querySnapshot.forEach((doc) => {
                        data.push({ docID: doc.id, ...doc.data() });
                    });
                    // console.log(data)
                    const filterRequests = []
                    data.forEach(s => {
                        if (s.requests) {
                            console.log("me chala", s.requests)
                            const reqFound = s.requests.find(req => {
                                console.log("req found", req.receiverId, user.uid)
                                return req.receiverId === user.uid
                            })
                            if (reqFound) {
                                filterRequests.push({ ...reqFound })
                            }
                        }
                    })
                    console.log(filterRequests)
                    setAllRequests(filterRequests);
                });

                return unsubscribe; // Cleanup on unmount
            } catch (error) {
                console.log(error);
            }
        };

        getAllRequest();
    }, []);

    const handleRequest = async (request, status) => {
        console.log(request, status)
        try {
            // Update the request status
            // await updateDocument("users", request.senderId, { requests: arrayRemove(request) });
            await updateDocument("users", request.receiverId, { requests: arrayRemove(request) })
            await updateDocument("users", request.senderId, { requests: arrayUnion({ ...request, status }) });
            await updateDocument("users", request.receiverId, {
                requests: arrayUnion({
                    senderId: request.receiverId,
                    receiverId: request.senderId,
                    receiverData: request.senderData,
                    senderData: request.receiverData,
                    status

                })
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <aside className="hidden no-scrollbar sm:flex sm:flex-col w-64 bg-white p-4 shadow-md sticky top-20 overflow-y-auto h-[88dvh]">
            <nav className="space-y-6 overflow-y-auto">
                <div className="space-y-4">
                    <a href="#" className="flex bg-primary p-2 rounded-lg items-center space-x-3 text-white font-semibold">
                        <FaHome className="w-5 h-5" /> <span>Feed</span>
                    </a>
                    <a href="#" className="flex items-center p-2 space-x-3 text-gray-800 hover:text-primary">
                        <FaCompass className="w-5 h-5" /> <span>Explore</span>
                    </a>
                    <a href="#" className="flex items-center p-2 space-x-3 text-gray-800 hover:text-primary">
                        <FaShoppingCart className="w-5 h-5" /> <span>Marketplace</span>
                    </a>
                    <a href="#" className="flex items-center p-2 space-x-3 text-gray-800 hover:text-primary">
                        <FaUsers className="w-5 h-5" /> <span>Groups</span>
                    </a>
                    <a href="#" className="flex items-center p-2 space-x-3 text-gray-800 hover:text-primary">
                        <FaStar className="w-5 h-5" /> <span>My favorites</span>
                    </a>
                    <a href="#" className="flex items-center p-2 space-x-3 text-gray-800 hover:text-primary">
                        <FaEnvelope className="w-5 h-5" /> <span>Messages</span>
                    </a>
                    <a href="#" className="flex items-center p-2 space-x-3 text-gray-800 hover:text-primary">
                        <FaCog className="w-5 h-5" /> <span>Settings</span>
                    </a>
                </div>
                <hr className="my-4" />
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 mb-4">My Contacts</h2>
                    <div className="space-y-4">
                        {allRequests?.map((item, index) => (
                            <div key={index} className="flex border-b border-b-gray-300 pb-3 items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.senderData.photoURL}
                                        alt="User Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">{item.senderData.displayName}</p>
                                    </div>
                                </div>
                                {item.status === "accepted" ? (
                                    <div className="text-gray-400 italic text-sm">friends</div>
                                ) : (
                                    <div className="space-y-2 space-x-2">
                                        <button
                                            onClick={() => handleRequest(item, "accepted")}
                                            className="flex cursor-pointer items-center px-3 py-1 bg-green-500 text-white rounded-lg"
                                        >
                                            <FaUserPlus className="mr-2 " /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleRequest(item, "rejected")}
                                            className="flex cursor-pointer items-center px-3 py-1 bg-red-500 text-white rounded-lg"
                                        >
                                            <FaEnvelopeOpenText className="mr-2" /> Ignore
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;