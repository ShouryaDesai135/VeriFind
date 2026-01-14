import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5b4Wby9DvC2fEHCuxSrq1jMVBCMLpWG4",
  authDomain: "campusfind-317be.firebaseapp.com",
  projectId: "campusfind-317be",
  storageBucket: "campusfind-317be.firebasestorage.app",
  messagingSenderId: "663060955602",
  appId: "1:663060955602:web:f4d31f0721915e8c63480b",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
