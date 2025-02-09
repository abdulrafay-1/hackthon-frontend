import React, { useRef, useState } from "react";
import { auth, db, provider } from "../config/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import MyToastConntainer from "../components/MyToastConntainer";
import { addDocument } from "../utils/firebasehelpers";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const email = useRef();
    const name = useRef();
    const password = useRef();
    const [error, setError] = useState(false);
    const [uploadImageUrl, setUploadImageUrl] = useState(null)
    const navigate = useNavigate()

    const registerUser = () => {
        if (password.current.value.length < 6) {
            setError("Password should have atleast 6 characters");
            return;
        }
        if (!uploadImageUrl) {
            toast.error("Please upload and image")
            return
        }
        createUserWithEmailAndPassword(
            auth,
            email.current.value,
            password.current.value
        )
            .then(async (userCredential) => {
                const user = userCredential.user;
                const userObj = {
                    email: email.current.value,
                    displayName: name.current.value,
                    photoURL: uploadImageUrl,
                    uid: user.uid
                }
                const data = await setDoc(doc(db, "users", user.uid), userObj);
                console.log(data)
                localStorage.setItem("user", JSON.stringify({ ...userObj }));
                toast.success("Registration Successfull")
                setTimeout(() => {
                    navigate('/')
                }, 2000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                console.log(errorCode, errorMessage);
            });
    };

    const registerWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(user)
                localStorage.setItem("user", JSON.stringify(user))
                toast.success("Register successfull")
                setTimeout(() => {
                    navigate('/')
                }, 2000);
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                toast.error(errorCode)
                console.log(credential);
                console.log(error);
            });
    }

    const uploadImage = () => {
        var myWidget = cloudinary.createUploadWidget({
            cloudName: 'dvmyemrlc',
            uploadPreset: 'expertizo-hackthon',
            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'],
            multiple: false, sources: ['local', 'url', 'camera'],
            resourceType: 'image'
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                console.log('Done! Here is the image info: ', result.info);
                setUploadImageUrl(result.info.secure_url)
                console.log(result.info.secure_url)
            }
        }
        )
        myWidget.open()
    }

    return (
        <div className="flex items-center flex-col h-screen justify-center">
            <MyToastConntainer />
            <h1 className="text-center text-3xl text-gray-600 font-semibold pb-3">
                Register
            </h1>
            <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md ">
                <div className="px-6 py-4">
                    <h3 className="mt-3 text-xl font-medium text-center text-gray-600 ">
                        Welcome to Social Media App
                    </h3>
                    <p className="mt-1 text-center text-gray-500 ">
                        Register or login account
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            registerUser();
                        }}
                    >
                        <div className="w-full mt-4">
                            <input
                                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg    focus:border-blue-400 -300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                                type="text"
                                required
                                ref={name}
                                placeholder="Name"
                                aria-label="Name"
                            />
                        </div>
                        <div className="w-full mt-4">
                            <input
                                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg    focus:border-blue-400 -300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                                type="email"
                                required
                                ref={email}
                                placeholder="Email Address"
                                aria-label="Email Address"
                            />
                        </div>
                        <div className="w-full mt-4">
                            <input
                                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg    focus:border-blue-400 -300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                                type="password"
                                required
                                ref={password}
                                placeholder="Password"
                                aria-label="Password"
                            />
                        </div>
                        <div className="w-full mt-4">
                            <div
                                className={`border text-center rounded-lg w-full py-2 cursor-pointer ${uploadImageUrl && "border-gray-300"}`}
                                onClick={uploadImage}
                            >{uploadImageUrl ? "Image Uploaded" : "Upload Image"}</div>
                        </div>
                        <p className="mt-2 text-center text-red-500">{error && error}</p>
                        <div className="flex items-center justify-end mt-4">
                            <button type="submit" className="px-6 py-2 flex-1 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                Register
                            </button>
                        </div>

                    </form>
                    <div>
                        <button onClick={registerWithGoogle} className='flex cursor-pointer w-full bg-gray-400 mt-3 justify-center gap-2 flex-1 items-center text-white py-2 rounded-lg'>
                            <FaGoogle size={28} />
                            <p className="text-sm">Signup with Google</p>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center py-4 text-center bg-gray-50 ">
                    <span className="text-sm text-gray-600 ">
                        Already have an account?{" "}
                    </span>
                    <Link
                        to="/login"
                        className="mx-2 text-sm font-bold text-blue-500  hover:underline"
                    >
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Register;
