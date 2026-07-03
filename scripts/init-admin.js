import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Carichiamo la vera API key dal file src/firebase.js se presente
let apiKey = "AIzaSyDummyKeyReplaceThisWithRealKey";
try {
  const firebaseJsPath = path.resolve('src/firebase.js');
  const content = fs.readFileSync(firebaseJsPath, 'utf8');
  const match = content.match(/apiKey:\s*"([^"]+)"/);
  if (match && match[1]) {
    apiKey = match[1];
  }
} catch (e) {
  console.log("Impossibile leggere src/firebase.js, uso chiavi di default.");
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "ermal-mondial-game.firebaseapp.com",
  projectId: "ermal-mondial-game",
  storageBucket: "ermal-mondial-game.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = 'admin@ermalgame.com';
const adminPassword = 'Cambiami123!';

async function run() {
  if (apiKey === 'AIzaSyDummyKeyReplaceThisWithRealKey') {
    console.warn("ATTENZIONE: Stai provando ad inizializzare l'admin con una chiave API fittizia.");
    console.warn("Assicurati di incollare la tua vera API Key da Firebase Console in src/firebase.js prima!");
  }
  
  console.log(`Creazione utente admin: ${adminEmail}...`);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    // Crea il profilo admin in firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: 'Admin',
      email: adminEmail,
      role: 'admin',
      requiresPasswordChange: true,
      status: 'approved'
    });
    
    console.log("------------------------------------------");
    console.log("🏆 Utente Admin creato con successo!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password Temporanea: ${adminPassword}`);
    console.log("------------------------------------------");
    console.log("Ora puoi deployare ed effettuare il login. Ti verrà chiesto di cambiarla subito.");
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("L'utente admin esiste già in Auth. Tento di aggiornare Firestore...");
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: 'Admin',
          email: adminEmail,
          role: 'admin',
          requiresPasswordChange: true,
          status: 'approved'
        });
        console.log("🏆 Profilo Admin Firestore aggiornato/ripristinato con successo!");
      } catch (signInError) {
        console.log("Impossibile accedere per ricreare il record in Firestore.");
        console.log("Se la password è già stata cambiata, il record dovrebbe essere già consistente.");
      }
    } else {
      console.error("Errore nella creazione dell'admin:", error);
    }
  }
  process.exit(0);
}

run();
