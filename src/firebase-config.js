import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAZ_i8ic6jA7qUbrjTVHfApYJS6Yw8dnr4",
    authDomain: "centerplast-9e138.firebaseapp.com",
    projectId: "centerplast-9e138",
    storageBucket: "centerplast-9e138.appspot.com",
    messagingSenderId: "1050381548673",
    appId: "1:1050381548673:web:f8aebd90692bd2b86ea180",
    measurementId: "G-9PZD1ELEL2"
  };
  
  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const db = getFirestore(app);

  