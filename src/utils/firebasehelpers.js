import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";

export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), { ...data });
    return { ...data, docID: docRef.id };

  } catch (e) {
    throw new Error("Error adding document: ", e);
  }
}

export const getDocument = async (collectionName, docID) => {
  const docRef = doc(db, collectionName, docID);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return ("Document data:", docSnap.data());
    } else {
      return ("No such document!");
    }
  } catch (error) {
    throw new Error(error)
  }
}


export const updateDocument = async (collectionName, docID, updatedData) => {
  const ref = doc(db, collectionName, docID);
  try {
    const res = await updateDoc(ref, updatedData);
    return res
  } catch (error) {
    throw new Error(error)
  }
}

export const logoutUser = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });

}