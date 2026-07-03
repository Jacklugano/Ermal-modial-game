import { useState } from 'react';
import { useApp } from '../App';
import { auth, db } from '../firebase';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ShieldAlert, Key, Check } from 'lucide-react';

export default function ChangePassword() {
  const { currentUser, setCurrentUser, setPlayers } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isDemoMode = auth.config?.apiKey === 'AIzaSyDummyKeyReplaceThisWithRealKey' || !auth.config?.apiKey;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword.length < 6) {
      setError('La password deve contenere almeno 6 caratteri.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    setLoading(true);

    if (isDemoMode) {
      // --- MODALITÀ DEMO LOCALE ---
      setTimeout(() => {
        const updatedUser = { ...currentUser, requiresPasswordChange: false };
        setCurrentUser(updatedUser);
        setPlayers(prev => prev.map(p => p.id === currentUser.id ? updatedUser : p));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setSuccess(true);
        setLoading(false);
      }, 1000);
      return;
    }

    // --- MODALITÀ REALE FIREBASE ---
    try {
      const user = auth.currentUser;
      if (user) {
        // Aggiorna la password in Auth
        await updatePassword(user, newPassword);
        
        // Aggiorna il record in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          requiresPasswordChange: false
        });

        const updatedUser = { ...currentUser, requiresPasswordChange: false };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
        <div className="panel" style={{ padding: '30px' }}>
          <div style={{ background: 'rgba(20, 184, 166, 0.15)', padding: '16px', borderRadius: '50%', width: 'fit-content', margin: '0 auto 20px auto' }}>
            <Check size={40} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Password Aggiornata!</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
            La tua password amministratore è stata modificata con successo. Ora puoi gestire la lega.
          </p>
          <button className="btn" onClick={() => window.location.reload()}>
            Accedi alla Console Amministrativa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '3rem' }}>🔐</span>
        <h1 style={{ fontSize: '1.8rem', marginTop: '12px' }}>Cambio Password</h1>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Primo accesso Amministratore. Devi cambiare la password temporanea.</p>
      </div>

      <div className="panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} className="text-accent" /> Imposta nuova password
        </h2>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Nuova Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Inserisci la nuova password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Conferma Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Ripeti la password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading} style={{ marginTop: '12px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Salvataggio...' : 'Conferma e Salva'}
          </button>
        </form>
      </div>
    </div>
  );
}
