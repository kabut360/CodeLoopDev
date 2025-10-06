import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0WeJZ1axm_xzHbDNpM2pG4LJvr_4uwkQ",
  authDomain: "codeloop-5c108.firebaseapp.com",
  projectId: "codeloop-5c108",
  storageBucket: "codeloop-5c108.firebasestorage.app",
  messagingSenderId: "31617736587",
  appId: "1:31617736587:web:37b5b5a0150e721ba5198e",
  measurementId: "G-NJ08PQDBRS"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
