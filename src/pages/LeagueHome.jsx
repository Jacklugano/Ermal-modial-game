import { Users, Plus, Key, Trophy, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';

export default function LeagueHome() {
  const { currentUser, handleLogout, players } = useApp();

  // Calcola il posizionamento in classifica
  const sorted = [...players].sort((a,b) => b.points - a.points);
  const myRank = sorted.findIndex(p => p.id === currentUser?.id) + 1;

  return (
    <div>
      <div className="header-top">
        <h2 className="text-accent">PredictoWC</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold' }}>{currentUser?.name}</span>
          <button onClick={handleLogout} className="odd-btn" style={{ padding: '6px', border: 'none', background: 'transparent' }} title="Disconnetti">
            <LogOut size={20} color="var(--danger)" />
          </button>
        </div>
      </div>
      
      <div style={{ padding: '16px' }}>
        <h3 style={{ marginBottom: '16px' }}>Le tue Leghe</h3>
        
        <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
          <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ background: 'var(--surface-light)', padding: '12px', borderRadius: '50%' }}>
              <Trophy size={24} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ color: 'white', marginBottom: '4px' }}>Amici al Bar</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                4 Giocatori • Sei al {myRank}° posto
              </p>
            </div>
          </div>
        </Link>
        
        <h3 style={{ margin: '32px 0 16px 0' }}>Gestione</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
            <Plus size={20} className="text-accent" /> Crea Nuova Lega
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
            <Key size={20} className="text-accent" /> Unisciti con Codice
          </button>
        </div>
      </div>
    </div>
  );
}
