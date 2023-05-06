// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3hwP1f66IiwrVD0U5EdI31ucymIv0h0s",
    authDomain: "react-cursos-d23b2.firebaseapp.com",
    projectId: "react-cursos-d23b2",
    storageBucket: "react-cursos-d23b2.appspot.com",
    messagingSenderId: "929068013753",
    appId: "1:929068013753:web:5aa6a7c2ab4d0d74c2e368"
};

// Initialize Firebase
export const FireBaseApp = initializeApp(firebaseConfig);
export const FireBaseAuth = getAuth( FireBaseApp )
export const FireBaseDB = getFirestore( FireBaseApp )