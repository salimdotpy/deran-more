import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail, getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
    // return { success: true, user };
    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
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
    const q = query(collection(db, "admins"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const docu = snapshot.docs[0];
        await sendPasswordResetEmail(auth, docu.data().email);
        return { success: true, message: "Password reset email sent!" };
    } else {
      return { success: false, message: "Email not found" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateAdminPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;

    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
    console.log("Password updated successfully!");
    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Update Password Error:", error.message);
    return { success: false, message: error.message };
  }
};

export const updateAdminProfile = async (displayName, username) => {
  const user = auth.currentUser;
  try {
    await updateDoc(doc(db, "admins", user.uid), { name: displayName, username });
    await updateProfile(user, { displayName });
    console.log("Profile updated successfully!");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Update Profile Error:", error.message);
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

// 🚪 Get Admin
export const getAdmin = async (user) => {
  try {
    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      return {id: adminSnap.id, ...adminSnap.data()};
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export { db, storage, app, auth, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, ref, uploadBytes, getDownloadURL, deleteObject };