import { useState } from 'react';
import { useApp } from '../App';
import { ShieldAlert, Trophy, UserPlus } from 'lucide-react';

export default function SetupUser() {
  const { setCurrentUser, setPlayers } = useApp();
  const [name, setName] = useState('');
  const [leagueMode, setLeagueMode] = useState('join'); // 'join' | 'create'
  const [leagueName, setLeagueName] = useState('');
  const [leagueCode, setLeagueCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Inserisci il tuo nome.');
      return;
    }
    if (leagueMode === 'create' && !leagueName.trim()) {
      setError('Inserisci il nome della Lega.');
      return;
    }
    if (leagueMode === 'join' && !leagueCode.trim()) {
      setError('Inserisci il codice della Lega.');
      return;
    }

    // Crea utente Giacomo o nome scelto
    const newUser = { id: name.toLowerCase().replace(/\s+/g, ''), name, points: 0, isMe: true };
    
    // Salva l'utente corrente nel contesto
    setCurrentUser(newUser);

    // Inizializza i player della lega
    setPlayers(prev => {
      // Se si unisce a una lega esistente di test, aggiungiamo lui ai bot storici
      const bots = [
        { id: 'andrea', name: 'Andrea', points: 42 },
        { id: 'luca', name: 'Luca', points: 30 },
        { id: 'marco', name: 'Marco', points: 15 }
      ];
      return [newUser, ...bots];
    });

    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '3.5rem' }}>🏆</span>
        <h1 style={{ fontSize: '2.2rem', marginTop: '12px' }}>Predicto<span className="text-accent">WC</span></h1>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>La lega di pronostici privata tra amici</p>
      </div>

      <div className="panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={20} className="text-accent" /> Configurazione Iniziale
        </h2>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Il tuo Nome</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Es. Giacomo" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '4px', borderRadius: '8px', marginTop: '8px' }}>
            <button 
              type="button" 
              onClick={() => setLeagueMode('join')} 
              style={{ flex: 1, padding: '10px', background: leagueMode === 'join' ? 'var(--surface-light)' : 'transparent', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Entra in Lega
            </button>
            <button 
              type="button" 
              onClick={() => setLeagueMode('create')} 
              style={{ flex: 1, padding: '10px', background: leagueMode === 'create' ? 'var(--surface-light)' : 'transparent', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Crea Lega
            </button>
          </div>

          {leagueMode === 'join' ? (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Codice Lega Privata</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Es. X7Y9Z" 
                value={leagueCode} 
                onChange={e => setLeagueCode(e.target.value.toUpperCase())} 
                maxLength={5}
                required={leagueMode === 'join'}
              />
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Nome della Lega</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Es. Gli Amici del Bar" 
                value={leagueName} 
                onChange={e => setLeagueName(e.target.value)} 
                required={leagueMode === 'create'}
              />
            </div>
          )}

          <button type="submit" className="btn" style={{ marginTop: '12px' }}>
            Inizia a Giocare
          </button>
        </form>
      </div>
    </div>
  );
}
