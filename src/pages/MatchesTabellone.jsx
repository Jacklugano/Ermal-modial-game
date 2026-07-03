import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function MatchesTabellone() {
  const { matches, tomorrowMatches, pastMatches, predictions } = useApp();
  const [tab, setTab] = useState('Oggi');
  
  const currentMatchesList = 
    tab === 'Oggi' ? matches : 
    tab === 'Domani' ? tomorrowMatches : 
    pastMatches;
  
  return (
    <div>
      <div className="header-top">
        <h2>Mondiali 2026</h2>
      </div>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        {['Ieri', 'Oggi', 'Domani'].map(t => (
          <div 
            key={t} 
            onClick={() => setTab(t)} 
            style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: '16px', 
              fontWeight: tab === t ? '700' : '500', 
              color: tab === t ? 'var(--accent)' : 'var(--text-muted)', 
              borderBottom: tab === t ? '3px solid var(--accent)' : 'none', 
              cursor: 'pointer' 
            }}
          >
            {t}
          </div>
        ))}
      </div>
      
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sedicesimi di Finale
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentMatchesList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Nessuna partita programmata per questa giornata.
            </div>
          ) : (
            currentMatchesList.map(m => {
              const hasPred = predictions[m.id] !== undefined;
              const predData = predictions[m.id];
              const isFinished = m.status === 'finished';

              return (
                <Link key={m.id} to={`/match/${m.id}`} className="panel" style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '16px', borderLeft: isFinished ? 'none' : hasPred ? '4px solid var(--accent)' : '4px solid var(--warning)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{m.group}</span>
                    <span>{isFinished ? 'Terminata' : m.time}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <div className="team-line">
                        <span className="team-name" style={{ fontSize: '1.05rem' }}>{m.flag1} {m.team1}</span>
                        {isFinished && <span className="match-score">{m.score1}</span>}
                      </div>
                      <div className="team-line">
                        <span className="team-name" style={{ fontSize: '1.05rem' }}>{m.flag2} {m.team2}</span>
                        {isFinished && <span className="match-score">{m.score2}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    {isFinished ? (
                      <div className="text-accent" style={{ fontWeight: '500' }}>Vedi Dettaglio Partita e Punti</div>
                    ) : hasPred ? (
                      <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} /> Pronostico: {predData.score1} - {predData.score2}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={16} /> Pronostico mancante!
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
