// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7EPdkzf0Wm9zaibAgdf3HRZbuy___or0",
  authDomain: "war-up.firebaseapp.com",
  projectId: "war-up",
  storageBucket: "war-up.appspot.com",
  messagingSenderId: "624808024383",
  appId: "1:624808024383:web:b96c50fad2e491516d5b8a"
};

// Initialize Firebase
const fire_app = initializeApp(firebaseConfig);
export const auth = getAuth(fire_app);
export const db = getFirestore();