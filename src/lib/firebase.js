import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
console.log(import.meta.env.VITE_FIREBASE_API_KEY, "===key");
const firebaseConfig = {
  apiKey: "AIzaSyDtsUbkQ63GD0Qh086iiYVdNuBOn_Cs5fk",
  authDomain: "visa-consultant-appointment-ms.firebaseapp.com",
  projectId: "visa-consultant-appointment-ms",
  storageBucket: "visa-consultant-appointment-ms.firebasestorage.app",
  messagingSenderId: "398154823998",
  appId: "1:398154823998:web:b46bcaaf5ef86fcb2f946f",
  measurementId: "G-ZE4YMTRLHJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
