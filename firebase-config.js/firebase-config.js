// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbAKoyjv1wwF-CChOZbMfrx0u2f2G9uVQ",
  authDomain: "datinoon-login.firebaseapp.com",
  projectId: "datinoon-login",
  storageBucket: "datinoon-login.firebasestorage.app",
  messagingSenderId: "668031477218",
  appId: "1:668031477218:web:39e5474e643dce4bd985bb",
  measurementId: "G-1DS969657B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
