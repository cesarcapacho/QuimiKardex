// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCwhIoH8HRXNxgXfBBVMZTEp-CCCo_W8uY",
    authDomain: "quimikardex.firebaseapp.com",
    projectId: "quimikardex",
    storageBucket: "quimikardex.firebasestorage.app",
    messagingSenderId: "988778293474",
    appId: "1:988778293474:web:f630cd5f626c1a13ced6bb",
    measurementId: "G-HR96BCJM5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Exportar los servicios que vamos a utilizar en la aplicación
export const db = getFirestore(app); // La base de datos (Firestore)
