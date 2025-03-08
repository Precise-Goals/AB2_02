import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWxvlIkzEIIalPyWDrkMhBN9TKxuasVGs",
  authDomain: "unifusion-8db9b.firebaseapp.com",
  projectId: "unifusion-8db9b",
  storageBucket: "unifusion-8db9b.firebasestorage.app",
  messagingSenderId: "1095329153157",
  appId: "1:1095329153157:web:4e37867c378ac700cfa9ec",
  measurementId: "G-M9WBJPVJJS",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);