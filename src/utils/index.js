import sections_json from "../ui/sections.json";
import { doc, limit, orderBy, query, where } from "firebase/firestore";
import { addDoc, collection, db, getDocs, updateDoc } from "./firebase";

export async function fetchSetting(data_key = 'general') {
    try {
        const settingsCol = collection(db, "settings");
        const q = query(settingsCol, where("data_keys", "==", data_key));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return JSON.parse(doc.data().data_values);
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function updateSetting(form, data_key = 'general') {
    try {
        const settingsCol = collection(db, "settings");
        const q = query(settingsCol, where("data_keys", "==", data_key));
        const snapshot = await getDocs(q);
        const data = JSON.stringify(form);
        const date = new Date().toISOString();
        if (!snapshot.empty) {
            const docu = snapshot.docs[0];
            await updateDoc(doc(db, "settings", docu.id), { data_values: data, updated_at: date });
        } else {
            await addDoc(settingsCol, { data_keys: data_key, data_values: data, created_at: date, updated_at: date });
        }
        const tle = await keyToTitle(data_key);
        return { message: `${tle.split('.')?.[0]} setting updated successfully!` };

    } catch (error) {
        return { error: error.message };
    }
}

export const setNotification = async (notification) => {
    try {
        const noteCol = collection(db, "notifications");
        const date = new Date().toISOString();
        await addDoc(noteCol, { ...notification, created_at: date, updated_at: date });
        return true;
    } catch (error) {
        throw error;
    }
};

export const fetchNotifications = async (user_id = false, id = false) => {
    try {
        let notify
        const noteCol = collection(db, "notifications");
        if (user_id) {
            const q = query(noteCol, where("user_id", "==", user_id));
            const snapshot = await getDocs(q);
            notify = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        } else if (id) {
            const q = query(noteCol, where("id", "==", id));
            const snapshot = await getDocs(q);
            const doc = snapshot.docs[0];
            notify = { id: doc.id, ...doc.data() }
        }
        return notify;
    } catch (error) {
        return false;
    }
};

export const readNotifications = async (id = false, user_id = false) => {
    try {
        const noteCol = collection(db, "notifications");
        const cond = user_id ? where("user_id", "==", user_id) : where("id", "==", id);
        const q = query(noteCol, cond, where("status", "==", 0));
        const snapshot = await getDocs(q);
        const date = new Date().toISOString();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await updateDoc(doc(db, "notifications", doc.id), { status: 1, updated_at: date });
        } return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const verificationCode = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getNumber = (length = 8) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

// Convert title to key
export const keyToTitle = (text, multi = false) => {
    const words = text.split("_").map((word) => word[0].toUpperCase() + word.slice(1));
    return multi ? words.join(" ") : words.join(" ");
}

export function formatDate(date) {
    date = new Date(date);
    return `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}${getOrdinal(date.getDate())}, ${date.getFullYear()} ${date.toLocaleTimeString('en-US', { hour12: true })}`;
}

export function getOrdinal(n) {
    if (n > 10 && n < 14) return 'th';
    switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export const getPageSections = async (arr = false) => {
    const sections = sections_json;
    if (arr) {
      return Object.entries(sections).sort();
    }
    return sections;
};

//   import { db } from "./firebase"; // Import Firestore instance
//   import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
  
  export const getContent = async (data_keys, singleQuery = false, limitValue = null, orderById = false) => {
    let content = false;
  
    try {
      const frontendsRef = collection(db, "frontends"); // Firestore collection reference
  
      let q = query(frontendsRef, where("data_keys", "==", data_keys)); // Base query
      /*
      if (!orderById) {
        q = query(frontendsRef, where("data_keys", "==", data_keys)); // No ordering
      } else {
        q = query(frontendsRef, where("data_keys", "==", data_keys), orderBy("id", "desc"));
      }
      */
  
      if (limitValue) {
        q = query(q, limit(Number(limitValue))); // Apply limit if provided
      }
  
      const snapshot = await getDocs(q);
  
      if (snapshot.empty) return content; // Return false if no data
  
      if (singleQuery) {
        const doc = snapshot.docs[0]; // Get first document
        content = { id: doc.id, ...doc.data() };
        content.data_values = JSON.parse(content.data_values); // Parse stored JSON data
      } else {
        content = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), data_values: JSON.parse(doc.data().data_values) }))
      }
    } catch (error) {
      console.log("Error:", error);
    }
  
    return content;
  };
  