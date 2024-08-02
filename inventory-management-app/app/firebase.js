// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ22x4ebjdxh82NDpyNS0nuG0vV55Plec",
  authDomain: "pantryapp-e8da7.firebaseapp.com",
  projectId: "pantryapp-e8da7",
  storageBucket: "pantryapp-e8da7.appspot.com",
  messagingSenderId: "562148387597",
  appId: "1:562148387597:web:da923a3d7f036d1d13de44",
  measurementId: "G-9MMHXWN303"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
//const analytics = getAnalytics(app);
export {firestore}