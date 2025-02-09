import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaUserPlus } from 'react-icons/fa'
import { db } from '../config/firebase'
import { useUser } from '../context/userContext'

const FriendsRequestSection = () => {
    const { user } = useUser()
    const [allUsers, setAllUsers] = useState(null)


    useEffect(() => {
        const getAllUsers = async () => {
            const data = []
            try {
                const q = collection(db, "users")

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    if (doc.data().uid != user.uid)
                        data.push({ docID: doc.id, ...doc.data() })
                    // console.log(doc.id, " => ", doc.data());
                });
            } catch (error) {
                console.log(error)
            }
            setAllUsers(data)
            console.log(data)
        }
        getAllUsers()
    }, [])

    const sendRequest = (user) => {
        console.log(user)
    }

    return (
        <div className='relative mt-2'>
            <div className="bg-white sticky top-0 hidden md:block p-4 rounded-lg shadow-md">
                <h3 className="font-medium text-gray-800 mb-4">Friend Requests</h3>
                <div className="space-y-4">
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
                                <button onClick={() => { sendRequest(item) }} className="flex cursor-pointer items-center px-2 py-1 bg-pink-500 text-white rounded-lg">
                                    <FaUserPlus className="mr-2" /> Request
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div></div>
    )
}

export default FriendsRequestSection