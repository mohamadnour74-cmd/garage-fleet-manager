import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA0iU44wDkwfFQC4_j2eYq1HNX5gPz-WVg",
  authDomain: "garage-fleet-manager.firebaseapp.com",
  projectId: "garage-fleet-manager",
  storageBucket: "garage-fleet-manager.appspot.com",
  messagingSenderId: "622242559504",
  appId: "1:622242559504:web:2379aee03dd9e5152abc95",
  measurementId: "G-QGR6V33WMM"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
