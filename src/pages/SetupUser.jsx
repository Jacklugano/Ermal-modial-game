import { useState } from 'react';
import { useApp } from '../App';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ShieldAlert, UserPlus, LogIn } from 'lucide-react';

export default function SetupUser() {
  const { setCurrentUser, setPlayers, scoringConfig } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Controlla se siamo in modalità demo locale (API Key fittizia)
  const isDemoMode = auth.config?.apiKey === 'AIzaSyDummyKeyReplaceThisWithRealKey' || !auth.config?.apiKey;

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isDemoMode) {
      // --- MODALITÀ DEMO LOCALE ---
      setTimeout(() => {
        const storedUsers = localStorage.getItem('localUsers');
        const usersList = storedUsers ? JSON.parse(storedUsers) : [
          { uid: 'andrea', name: 'Andrea', email: 'andrea@example.com', points: 42, role: 'player', status: 'approved' },
          { uid: 'enea', name: 'Enea', email: 'enea@example.com', points: 30, role: 'player', status: 'approved' },
          { uid: 'luca', name: 'Luca', email: 'luca@example.com', points: 15, role: 'player', status: 'approved' },
          { uid: 'admin', name: 'Admin', email: 'admin@ermalgame.com', points: 0, role: 'admin', status: 'approved', requiresPasswordChange: true }
        ];

        if (isRegister) {
          if (!username.trim() || !email || !password) {
            setError('Compila tutti i campi.');
            setLoading(false);
            return;
          }
          const emailExists = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (emailExists) {
            setError('Questa email è già registrata.');
            setLoading(false);
            return;
          }

          const newUser = { 
            uid: username.toLowerCase(), 
            name: username, 
            email: email, 
            points: 0, 
            role: 'player', 
            status: 'pending' 
          };
          usersList.push(newUser);
          localStorage.setItem('localUsers', JSON.stringify(usersList));
          setError('Registrazione completata! Il tuo account è in attesa di approvazione da parte di un amministratore.');
        } else {
          // Login
          if (email === 'admin@ermalgame.com' && password === 'Cambiami123!') {
            const adminUser = usersList.find(u => u.email === 'admin@ermalgame.com') || { uid: 'admin', name: 'Admin', email, points: 0, role: 'admin', status: 'approved', requiresPasswordChange: true };
            setCurrentUser(adminUser);
            const approvedPlayers = usersList.filter(u => u.status === 'approved');
            setPlayers(approvedPlayers);
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
          } else if (email === 'admin@ermalgame.com') {
            setError('Password errata per l\'admin (usa Cambiami123! per la prima volta).');
          } else {
            const user = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
              setError('Utente non trovato. Registrati prima.');
            } else if (user.status === 'pending') {
              setError('Il tuo account è in attesa di approvazione da parte di un amministratore.');
            } else {
              setCurrentUser(user);
              const approvedPlayers = usersList.filter(u => u.status === 'approved');
              setPlayers(approvedPlayers);
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
          }
        }
        setLoading(false);
      }, 1000);
      return;
    }

    // --- MODALITÀ REALE CON FIREBASE ---
    try {
      if (isRegister) {
        // Registrazione
        if (!username.trim()) {
          setError('Inserisci uno username.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Crea profilo utente in Firestore
        const profile = {
          uid: user.uid,
          name: username,
          email: user.email,
          role: 'player',
          points: 0,
          status: 'pending'
        };

        await setDoc(doc(db, 'users', user.uid), profile);
        
        setError('Registrazione completata! Il tuo account è in attesa di approvazione da parte di un amministratore.');
        await auth.signOut();
      } else {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Recupera profilo da Firestore
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const profile = docSnap.data();
          if (profile.role !== 'admin' && profile.status === 'pending') {
            await auth.signOut();
            setError('Il tuo account è in attesa di approvazione da parte di un amministratore.');
            setLoading(false);
            return;
          }
          setCurrentUser(profile);
          localStorage.setItem('currentUser', JSON.stringify(profile));
        } else {
          // Se non esiste, crea un profilo al volo
          const fallbackProfile = { uid: user.uid, name: user.email.split('@')[0], email: user.email, role: 'player', points: 0, status: 'approved' };
          await setDoc(doc(db, 'users', user.uid), fallbackProfile);
          setCurrentUser(fallbackProfile);
          localStorage.setItem('currentUser', JSON.stringify(fallbackProfile));
        }
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Email o password errate.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Questa email è già registrata.');
      } else if (err.code === 'auth/weak-password') {
        setError('La password deve contenere almeno 6 caratteri.');
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '3.5rem' }}>🏆</span>
        <h1 style={{ fontSize: '2.2rem', marginTop: '12px' }}>Predicto<span className="text-accent">WC</span></h1>
        {isDemoMode && (
          <p style={{ color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '4px' }}>
            ⚠️ Esecuzione in modalità Demo Locale
          </p>
        )}
        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>Lega Pronostici Mondiali</p>
      </div>

      <div className="panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isRegister ? <UserPlus size={20} className="text-accent" /> : <LogIn size={20} className="text-accent" />}
          {isRegister ? 'Crea il tuo profilo' : 'Accedi all\'app'}
        </h2>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        {isDemoMode && !isRegister && (
          <div style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid var(--accent)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--accent)' }}>
            <strong>Demo Admin:</strong> admin@ermalgame.com / Cambiami123!
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Username / Nome</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Es. Giacomo" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Es. giacomo@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Minimo 6 caratteri" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading} style={{ marginTop: '12px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Elaborazione in corso...' : isRegister ? 'Registrati ed entra' : 'Accedi'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)} 
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isRegister ? 'Hai già un profilo? Accedi' : 'Nuovo utente? Registrati ora'}
          </button>
        </div>
      </div>
    </div>
  );
}
