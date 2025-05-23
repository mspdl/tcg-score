import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
    Create a file called .env in the root directory and add the following code with your data. 

    REACT_APP_FIREBASE_API_KEY=xxxx
    REACT_APP_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=xxx
    REACT_APP_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
    REACT_APP_FIREBASE_APP_ID=xxx
    
    This file should not be committed to version control.
    
**/

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
