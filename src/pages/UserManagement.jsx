import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ArrowLeft, UserCheck, Shield, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserManagement() {
  const { setPlayers } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isDemoMode = auth.config?.apiKey === 'AIzaSyDummyKeyReplaceThisWithRealKey' || !auth.config?.apiKey;

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      if (isDemoMode) {
        const storedUsers = localStorage.getItem('localUsers');
        const usersList = storedUsers ? JSON.parse(storedUsers) : [
          { uid: 'andrea', name: 'Andrea', email: 'andrea@example.com', points: 42, role: 'player', status: 'approved' },
          { uid: 'enea', name: 'Enea', email: 'enea@example.com', points: 30, role: 'player', status: 'approved' },
          { uid: 'luca', name: 'Luca', email: 'luca@example.com', points: 15, role: 'player', status: 'approved' },
          { uid: 'admin', name: 'Admin', email: 'admin@ermalgame.com', points: 0, role: 'admin', status: 'approved', requiresPasswordChange: true }
        ];
        setUsers(usersList);
      } else {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() });
        });
        setUsers(usersList);
      }
    } catch (err) {
      console.error(err);
      setError('Impossibile caricare gli utenti: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId, role) => {
    setError('');
    setSuccess('');
    try {
      if (isDemoMode) {
        const storedUsers = localStorage.getItem('localUsers');
        let usersList = storedUsers ? JSON.parse(storedUsers) : [];
        usersList = usersList.map(u => u.uid === userId ? { ...u, status: 'approved', role } : u);
        localStorage.setItem('localUsers', JSON.stringify(usersList));
        setUsers(usersList);
        setPlayers(usersList.filter(u => u.status === 'approved'));
      } else {
        await updateDoc(doc(db, 'users', userId), {
          status: 'approved',
          role: role
        });
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() });
        });
        setUsers(usersList);
        setPlayers(usersList.filter(u => u.status === 'approved'));
      }
      setSuccess('Utente approvato con successo!');
    } catch (err) {
      console.error(err);
      setError("Errore durante l'approvazione: " + err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setError('');
    setSuccess('');
    try {
      if (isDemoMode) {
        const storedUsers = localStorage.getItem('localUsers');
        let usersList = storedUsers ? JSON.parse(storedUsers) : [];
        usersList = usersList.map(u => u.uid === userId ? { ...u, role: newRole } : u);
        localStorage.setItem('localUsers', JSON.stringify(usersList));
        setUsers(usersList);
        setPlayers(usersList.filter(u => u.status === 'approved'));
      } else {
        await updateDoc(doc(db, 'users', userId), {
          role: newRole
        });
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() });
        });
        setUsers(usersList);
        setPlayers(usersList.filter(u => u.status === 'approved'));
      }
      setSuccess('Ruolo aggiornato con successo!');
    } catch (err) {
      console.error(err);
      setError("Errore durante l'aggiornamento del ruolo: " + err.message);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Sei sicuro di voler rifiutare/eliminare questo utente?")) return;
    setError('');
    setSuccess('');
    try {
      if (isDemoMode) {
        const storedUsers = localStorage.getItem('localUsers');
        let usersList = storedUsers ? JSON.parse(storedUsers) : [];
        usersList = usersList.filter(u => u.uid !== userId);
        localStorage.setItem('localUsers', JSON.stringify(usersList));
        setUsers(usersList);
        setPlayers(usersList.filter(u => u.status === 'approved'));
      } else {
        await deleteDoc(doc(db, 'users', userId));
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() });
        });
        setUsers(usersList);
        setPlayers(usersList.filter(u => u.status === 'approved'));
      }
      setSuccess('Utente rimosso con successo!');
    } catch (err) {
      console.error(err);
      setError("Errore durante la rimozione dell'utente: " + err.message);
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status !== 'pending');

  return (
    <div style={{ paddingBottom: '30px' }}>
      <div className="header-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </Link>
          <h2>Gestione Utenti</h2>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {isDemoMode && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--warning)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} /> Esecuzione in modalità Demo Locale
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--danger)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid var(--accent)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold' }}>
            {success}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            Caricamento utenti in corso...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Sezione Pendenti */}
            <div className="panel">
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} /> In attesa di approvazione ({pendingUsers.length})
              </h3>
              
              {pendingUsers.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Nessun utente in attesa di approvazione.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingUsers.map(u => (
                    <div key={u.uid} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: 'var(--surface-light)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'white' }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleApprove(u.uid, 'player')}
                          className="btn" 
                          style={{ flex: 1, fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <UserCheck size={14} /> Giocatore
                        </button>
                        <button 
                          onClick={() => handleApprove(u.uid, 'admin')}
                          className="btn" 
                          style={{ flex: 1, fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'var(--accent)' }}
                        >
                          <Shield size={14} /> Admin
                        </button>
                        <button 
                          onClick={() => handleReject(u.uid)}
                          className="btn" 
                          style={{ width: '40px', fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger)' }}
                          title="Rifiuta utente"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sezione Approvati */}
            <div className="panel">
              <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} /> Utenti Attivi ({approvedUsers.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {approvedUsers.map(u => (
                  <div key={u.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--surface-light)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'white' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select 
                        value={u.role || 'player'} 
                        onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                        className="input-field" 
                        style={{ width: '100px', fontSize: '0.8rem', padding: '4px 8px', height: 'auto', background: 'var(--surface)', border: '1px solid var(--border)' }}
                      >
                        <option value="player">Player</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      <button 
                        onClick={() => handleReject(u.uid)}
                        className="btn" 
                        style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger)' }}
                        title="Elimina utente"
                        disabled={u.uid === 'admin'} 
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
