import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Incolla qui le chiavi reali ottenute dalle Impostazioni Progetto della Console Firebase.
// Per default usa il projectId fornito 'ermal-mondial-game'.
const firebaseConfig = {
  apiKey: "AIzaSyCn7wpcsgiKJue7-wuZKr_rQ8lqSuLrG7Q",
  authDomain: "ermal-mondial-game.firebaseapp.com",
  projectId: "ermal-mondial-game",
  storageBucket: "ermal-mondial-game.firebasestorage.app",
  messagingSenderId: "746215979041",
  appId: "1:746215979041:web:c9ce7570e22b8c6ef2cb60",
  measurementId: "G-273F2S92S3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
