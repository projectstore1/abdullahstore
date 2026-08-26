// assets/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    getDocs, 
    addDoc, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0v8rABIglIXQGv-JfOcz0FBiTxtvg8zQ",
  authDomain: "abdullah-store-v1.firebaseapp.com",
  projectId: "abdullah-store-v1",
  storageBucket: "abdullah-store-v1.firebasestorage.app",
  messagingSenderId: "757004475979",
  appId: "1:757004475979:web:858b4cceaa39c4dfe3f7ce",
  measurementId: "G-4FJQJV6W55"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, onSnapshot, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc };
