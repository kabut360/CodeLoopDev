import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD0WeJZ1axm_xzHbDNpM2pG4LJvr_4uwkQ",
  authDomain: "codeloop-5c108.firebaseapp.com",
  projectId: "codeloop-5c108",
  storageBucket: "codeloop-5c108.firebasestorage.app",
  messagingSenderId: "31617736587",
  appId: "1:31617736587:web:37b5b5a0150e721ba5198e",
  measurementId: "G-NJ08PQDBRS"
};

function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

const app = getFirebaseApp();

// These are now getter functions to ensure they are only called on the client
const getDb = () => getFirestore(app);
const getFirebaseAuth = () => getAuth(app);
const getAnalyticsInstance = () => {
    if (typeof window !== 'undefined') {
        return getAnalytics(app);
    }
    return null;
}


export { app, getFirebaseAuth as auth, getDb as db, getAnalyticsInstance as analytics };
export { getDb, getFirebaseAuth, getAnalyticsInstance };