import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDoc, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail, getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyBFTGwfMyNKsU5Q_9XLZjMaeDNTOp-p8ns",
//     authDomain: "salimtech-d4171.firebaseapp.com",
//     projectId: "salimtech-d4171",
//     storageBucket: "salimtech-d4171.firebasestorage.app",
//     messagingSenderId: "1007953204162",
//     appId: "1:1007953204162:web:f353d5fc5f8164c032bc5b",
//     measurementId: "G-YQE8ZJB3S0"
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_M_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// 🔐 Admin Login
export const adminLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is an admin
    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists() && adminSnap.data().role === "admin") {
      return { success: true, user };
    } else {
      await signOut(auth); // Log out if not admin
      return { success: false, message: "Access Denied: Not an Admin" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔑 Reset Password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🚪 Logout
export const adminLogout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export { db, storage, app, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, ref, uploadBytes, getDownloadURL, deleteObject };

/*
import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "./firebaseConfig"; // Import Firebase config

const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Admin Login
export const adminLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is an admin
    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists() && adminSnap.data().role === "admin") {
      return { success: true, user };
    } else {
      await signOut(auth); // Log out if not admin
      return { success: false, message: "Access Denied: Not an Admin" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔑 Reset Password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🚪 Logout
export const adminLogout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
*/
