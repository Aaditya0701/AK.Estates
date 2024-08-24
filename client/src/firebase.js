// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ak-estate-a8084.firebaseapp.com",
  projectId: "ak-estate-a8084",
  storageBucket: "ak-estate-a8084.appspot.com",
  messagingSenderId: "676159080355",
  appId: "1:676159080355:web:b86bdae3d7c611686fbc16"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);