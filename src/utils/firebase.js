import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBFTGwfMyNKsU5Q_9XLZjMaeDNTOp-p8ns",
    authDomain: "salimtech-d4171.firebaseapp.com",
    projectId: "salimtech-d4171",
    storageBucket: "salimtech-d4171.firebasestorage.app",
    messagingSenderId: "1007953204162",
    appId: "1:1007953204162:web:f353d5fc5f8164c032bc5b",
    measurementId: "G-YQE8ZJB3S0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, ref, uploadBytes, getDownloadURL, deleteObject };
