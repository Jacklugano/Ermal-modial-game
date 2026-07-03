import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Incolla qui le chiavi reali ottenute dalle Impostazioni Progetto della Console Firebase.
// Per default usa il projectId fornito 'ermal-mondial-game'.
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyReplaceThisWithRealKey",
  authDomain: "ermal-mondial-game.firebaseapp.com",
  projectId: "ermal-mondial-game",
  storageBucket: "ermal-mondial-game.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
