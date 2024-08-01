// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMe1pTtM2sF-q8AN-ESd7_fpN8O5Zf4Lk",
  authDomain: "pantry-app-a6a4b.firebaseapp.com",
  projectId: "pantry-app-a6a4b",
  storageBucket: "pantry-app-a6a4b.appspot.com",
  messagingSenderId: "589629853806",
  appId: "1:589629853806:web:c24597d73d09c2e431567f",
  measurementId: "G-WQVCXEH8HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Analytics
const firestore = getFirestore(app);
// const analytics = getAnalytics(app);

export { app, firestore };
export {firebaseConfig}