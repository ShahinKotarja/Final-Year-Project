import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCQ30nT9V5sF7-HpKFiuVJiNR0_yqBKRbs",
  authDomain: "ml-shop-project.firebaseapp.com",
  projectId: "ml-shop-project",
  storageBucket: "ml-shop-project.appspot.com",
  messagingSenderId: "56279353316",
  appId: "1:56279353316:web:4c45cac7ec075eee4429f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
