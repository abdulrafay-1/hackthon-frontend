import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const UserContext = createContext(null);

export const useUser = () => {
    return useContext(UserContext);
};

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData != 'undefined') {
            // try {
            const parsedUser = JSON.parse(userData) || auth.currentUser || null
            if (parsedUser) {
                setUser(parsedUser);
                console.log("user is in context", parsedUser);
            }
            // } catch (error) {
            // console.error('Error parsing user data from localStorage:', error);
            // Fallback to auth.currentUser if parsing fails
            // setUser(auth.currentUser);
        }
        //     } else {
        //         setUser(auth.currentUser); // If no user in localStorage, use auth.currentUser
        // }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
