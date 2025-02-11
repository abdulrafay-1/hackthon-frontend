import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaFacebookSquare, FaGoogle } from "react-icons/fa";
import { auth, db, provider } from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import MyToastConntainer from '../components/MyToastConntainer';
import { getDocument } from '../utils/firebasehelpers';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate()

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Logging in with:', { email, password });
            signInWithEmailAndPassword(
                auth,
                email,
                password
            ).then(async (userCredential) => {
                const user = userCredential.user;
                const userDoc = await getDocument("users", user.uid)
                localStorage.setItem("user", JSON.stringify(userDoc));
                navigate("/");
                setErrors(false);
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorCode);
            });
        }
    };

    const loginWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                const userObj = {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    requests: []
                }
                const data = await setDoc(doc(db, "users", user.uid), userObj);
                console.log(data)
                console.log(user)
                localStorage.setItem("user", JSON.stringify(user))
                toast.success("Register successfull")
                setTimeout(() => {
                    navigate('/')
                }, 2000);
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const credential = GoogleAuthProvider.credentialFromError(error);
                toast.error(errorCode)
                console.log(credential);
                console.log(error);
            });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <MyToastConntainer />
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Login</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?
                    <Link to={'/signup'}
                        className="text-blue-600 hover:underline focus:outline-none">
                        Sign up here
                    </Link>
                </p>
                <div>
                    <button onClick={loginWithGoogle} className='flex w-full bg-gray-400 mt-3 justify-center gap-2 items-center text-white py-2 rounded-lg'>
                        <FaGoogle size={28} />
                        <p>Login with Google</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
