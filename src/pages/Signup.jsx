import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Signup() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel animate-slide-up" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Crea Account</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => { e.preventDefault(); window.location.href='/dashboard'; }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nome Utente</label>
            <input type="text" className="input-field" placeholder="Es. Fantallenatore" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
            <input type="email" className="input-field" placeholder="tu@email.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>
            <UserPlus size={20} /> Registrati
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Hai già un account? <Link to="/login" className="text-gradient">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
