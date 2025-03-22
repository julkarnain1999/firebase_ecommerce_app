import {getAuth} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBEFAsJZOTrofidmFTYzeE6M6bPTtNITJs",
  authDomain: "realestate-abfce.firebaseapp.com",
  projectId: "realestate-abfce",
  storageBucket: "realestate-abfce.firebasestorage.app",
  messagingSenderId: "960074823741",
  appId: "1:960074823741:web:52f51b00336b0e398e1254",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };