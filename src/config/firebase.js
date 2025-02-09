import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDn2Nu1ijqffwFNyhm3m9d6agRRnynGhXw",
  authDomain: "ex-ms-a4e4d.firebaseapp.com",
  projectId: "ex-ms-a4e4d",
  storageBucket: "ex-ms-a4e4d.appspot.com",
  messagingSenderId: "654267550819",
  appId: "1:654267550819:web:173b371d462d3b9230bc56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
