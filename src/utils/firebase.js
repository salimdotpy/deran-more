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

/*
// AUTH ACTIONS ------------

createAccount = (email, password) =>
this.auth.createUserWithEmailAndPassword(email, password);

signIn = (email, password) =>
this.auth.signInWithEmailAndPassword(email, password);

signInWithGoogle = () =>
this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

signInWithFacebook = () =>
this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

signInWithGithub = () =>
this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

signOut = () => this.auth.signOut();

passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

addUser = (id, user) => this.db.collection("users").doc(id).set(user);

getUser = (id) => this.db.collection("users").doc(id).get();

passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

changePassword = (currentPassword, newPassword) =>
new Promise((resolve, reject) => {
  this.reauthenticate(currentPassword)
    .then(() => {
      const user = this.auth.currentUser;
      user
        .updatePassword(newPassword)
        .then(() => {
          resolve("Password updated successfully!");
        })
        .catch((error) => reject(error));
    })
    .catch((error) => reject(error));
});

reauthenticate = (currentPassword) => {
const user = this.auth.currentUser;
const cred = app.auth.EmailAuthProvider.credential(
  user.email,
  currentPassword
);

return user.reauthenticateWithCredential(cred);
};

updateEmail = (currentPassword, newEmail) =>
new Promise((resolve, reject) => {
  this.reauthenticate(currentPassword)
    .then(() => {
      const user = this.auth.currentUser;
      user
        .updateEmail(newEmail)
        .then(() => {
          resolve("Email Successfully updated");
        })
        .catch((error) => reject(error));
    })
    .catch((error) => reject(error));
});

updateProfile = (id, updates) =>
this.db.collection("users").doc(id).update(updates);

onAuthStateChanged = () =>
new Promise((resolve, reject) => {
  this.auth.onAuthStateChanged((user) => {
    if (user) {
      resolve(user);
    } else {
      reject(new Error("Auth State Changed failed"));
    }
  });
});

saveBasketItems = (items, userId) =>
this.db.collection("users").doc(userId).update({ basket: items });

setAuthPersistence = () =>
this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);
*/