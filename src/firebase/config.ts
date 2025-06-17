import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9bmv7FBjWJ9MLgHCAXkLUiAStb89C2as",
  authDomain: "desifyar.firebaseapp.com",
  projectId: "desifyar",
  storageBucket: "desifyar.firebasestorage.app",
  messagingSenderId: "1006637516972",
  appId: "1:1006637516972:web:7a868d209cb6b868f0f709",
  measurementId: "G-BLJPK2WJB6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;