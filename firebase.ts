// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4qEwjI1YYLuEqDVKttDQG7H5Hkl-qH5s",
  authDomain: "notion-clone-d1900.firebaseapp.com",
  projectId: "notion-clone-d1900",
  storageBucket: "notion-clone-d1900.firebasestorage.app",
  messagingSenderId: "286261787978",
  appId: "1:286261787978:web:6392fe8e600d9a861515b3",
};

// Initialize Firebase
const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
