import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtmI3jLzqDSr3UIwuUdBa5ocsN5vjzpW8",
  authDomain: "stock-taking-19198.firebaseapp.com",
  projectId: "stock-taking-19198",
  storageBucket: "stock-taking-19198.appspot.com",
  messagingSenderId: "228033001185",
  appId: "1:228033001185:web:b2020053fb824a87d9a9a0",
  measurementId: "G-79BQVKMPSR"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth };
export default db;
