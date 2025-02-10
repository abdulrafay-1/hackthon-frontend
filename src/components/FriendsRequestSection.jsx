import { arrayUnion, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { db } from "../config/firebase";
import { useUser } from "../context/userContext";
import { addDocument, updateDocument } from "../utils/firebasehelpers";
import Skeleton from "react-loading-skeleton";

const FriendsRequestSection = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);

    // useEffect(() => {
    //     const getAllUsers = async () => {
    //         try {
    //             setLoading(true)
    //             const q = collection(db, "users");
    //             // const querySnapshot = await getDocs(q);
    //             const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //                 let data = [];

    //                 querySnapshot.forEach((doc) => {
    //                     data.push({ docID: doc.id, ...doc.data() });
    //                 });
    //                 const filteredUsers = data.filter((userData) => userData.uid !== user.uid);
    //                 setAllUsers(filteredUsers);
    //             })
    //             // Filter out the current user
    //         } catch (error) {
    //             console.log(error);
    //         } finally {
    //             setLoading(false)
    //         }
    //     };
    //     getAllUsers();
    // }, [user]);


    useEffect(() => {
        const getAllUsers = async () => {
            try {
                setLoading(true);
                const q = collection(db, "users");
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    let data = [];
                    querySnapshot.forEach((doc) => {
                        data.push({ docID: doc.id, ...doc.data() });
                    });
                    const filteredUsers = data.filter((userData) => userData.uid !== user.uid);
                    setAllUsers(filteredUsers);
                    setLoading(false);  // Move setLoading(false) here
                });
            } catch (error) {
                console.log(error);
                setLoading(false);  // Ensure loading stops even on error
            }
        };
        getAllUsers();
    }, [user]);

    const sendRequest = async (postUser) => {
        const requestObj = {
            receiverId: postUser.uid,
            senderId: user.uid,
            receiverData: {
                displayName: postUser.displayName,
                photoURL: postUser.photoURL,
            },
            senderData: {
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
            status: "pending",
            timestamp: Date.now(),
        };
        await updateDocument("users", postUser.uid, { requests: arrayUnion(requestObj) });
        console.log(requestObj)
    };

    const checkReqStatus = (postUser) => {
        const requestSent = postUser.requests?.find(requests => requests.senderId === user.uid)
        const friends = postUser.requests.find(req => req.senderId || req.receiverId === user.uid && req.status === "accepted")
        if (friends) {
            return friends.status
        }
        if (requestSent) return requestSent.status
        return false
    };

    return (
        <div className="relative mt-2">
            <div className="bg-white sticky top-0 hidden md:block p-4 rounded-lg shadow-md">
                <h3 className="font-medium text-gray-800 mb-4">Add Friends</h3>
                <div className="space-y-4">
                    {loading && <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex gap-3">
                            <Skeleton circle width={40} height={40} />
                            <div>
                                <Skeleton width={100} height={15} />
                                <Skeleton width={150} height={15} style={{ marginTop: "5px" }} />
                            </div>
                        </div>
                    </div>}
                    {allUsers?.map((item, index) => (

                        <div key={index} className="flex mt-2 items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={item.photoURL}
                                    alt="User Profile"
                                    className="w-10 h-10 object-cover rounded-full"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">{item.displayName}</p>
                                    <p className="text-sm text-gray-500">2 mutual friends</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => sendRequest(item)}
                                    disabled={checkReqStatus(item)}
                                    className={`flex cursor-pointer items-center px-2 py-1 bg-primary text-white rounded-lg ${checkReqStatus(item) ? "disabled:!bg-gray-400 disabled:pointer-events-none" : ""
                                        }`}
                                >
                                    <FaUserPlus className="mr-2" /> {checkReqStatus(item) || "Add"}
                                </button>
                            </div>
                        </div>



                    ))}
                </div>
            </div>
        </div>
    );
};

export default FriendsRequestSection;