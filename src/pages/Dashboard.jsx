import { useState, useEffect } from 'react';
import { Trophy, Calendar, Settings, LogOut, Radio, Activity, History, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const rosters = {
  'Argentina': ['Messi', 'Alvarez', 'Di Maria', 'De Paul', 'Martinez', 'Mac Allister'],
  'Capo Verde': ['Bebé', 'Mendes', 'Cabral', 'Pico', 'Costa'],
  'Australia': ['Ryan', 'Souttar', 'Irvine', 'Duke', 'Mabil'],
  'Egitto': ['Salah', 'Trezeguet', 'Marmoush', 'Elneny', 'Hegazy'],
  'Colombia': ['Diaz', 'Rodriguez', 'Arias', 'Borre', 'Lerma'],
  'Ghana': ['Kudus', 'Partey', 'Williams', 'Ayew', 'Salisu']
};

const pastMatches = [
  { 
    id: 10, team1: 'Spagna', team2: 'Austria', flag1: '🇪🇸', flag2: '🇦🇹', date: 'Ieri, 21:00', group: 'Sedicesimi', score1: 3, score2: 0, 
    events: [
      { time: 12, type: 'goal', player: 'Morata', team: 'Spagna' }, 
      { time: 45, type: 'goal', player: 'Olmo', team: 'Spagna' },
      { time: 60, type: 'card', player: 'Laimer', team: 'Austria' },
      { time: 88, type: 'goal', player: 'Williams', team: 'Spagna' }
    ],
    myPoints: { total: 4, breakdown: 'Ris. Esatto (+3), Ammonito (+1)' }
  },
  { 
    id: 11, team1: 'Svizzera', team2: 'Algeria', flag1: '🇨🇭', flag2: '🇩🇿', date: 'Ieri, 23:00', group: 'Sedicesimi', score1: 2, score2: 0,
    events: [
      { time: 33, type: 'goal', player: 'Shaqiri', team: 'Svizzera' },
      { time: 70, type: 'card', player: 'Mahrez', team: 'Algeria' },
      { time: 80, type: 'goal', player: 'Embolo', team: 'Svizzera' }
    ],
    myPoints: { total: 1, breakdown: 'Esito 1X2 (+1)' }
  },
  { 
    id: 12, team1: 'Inghilterra', team2: 'RD Congo', flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag2: '🇨🇩', date: 'L\'altro ieri, 21:00', group: 'Sedicesimi', score1: 2, score2: 1,
    events: [
      { time: 20, type: 'goal', player: 'Kane', team: 'Inghilterra' },
      { time: 55, type: 'goal', player: 'Bokadi', team: 'RD Congo' },
      { time: 89, type: 'goal', player: 'Bellingham', team: 'Inghilterra' },
      { time: 92, type: 'card', player: 'Maguire', team: 'Inghilterra' }
    ],
    myPoints: { total: 5, breakdown: 'Ris. Esatto (+3), Marcatore (+2)' }
  }
];

const initialMatches = [
  { id: 0, team1: 'Portogallo', team2: 'Croazia', flag1: '🇵🇹', flag2: '🇭🇷', date: 'Oggi, 02:00', group: 'Sedicesimi', score1: 2, score2: 1, isLive: false, 
    events: [
      { time: 10, type: 'goal', player: 'Kramaric', team: 'Croazia' },
      { time: 40, type: 'card', player: 'Pepe', team: 'Portogallo' },
      { time: 65, type: 'goal', player: 'Ronaldo', team: 'Portogallo' },
      { time: 85, type: 'goal', player: 'Leao', team: 'Portogallo' },
      { time: 90, type: 'info', text: 'Partita Terminata' }
    ],
    myPoints: { total: 0, breakdown: 'Nessun punto (Pronostico Errato)' }
  },
  { id: 1, team1: 'Argentina', team2: 'Capo Verde', flag1: '🇦🇷', flag2: '🇨🇻', date: 'Oggi, 18:00', group: 'Sedicesimi', score1: null, score2: null, isLive: false, events: [] },
  { id: 2, team1: 'Australia', team2: 'Egitto', flag1: '🇦🇺', flag2: '🇪🇬', date: 'Oggi, 20:45', group: 'Sedicesimi', score1: null, score2: null, isLive: false, events: [] },
  { id: 3, team1: 'Colombia', team2: 'Ghana', flag1: '🇨🇴', flag2: '🇬🇭', date: 'Oggi, 23:00', group: 'Sedicesimi', score1: null, score2: null, isLive: false, events: [] }
];

const initialLeaderboard = [
  { name: 'Giacomo', points: 45, isMe: true, currentPreds: { match1: { s1: 3, s2: 0, goal1: 'Messi', card1: 'De Paul', goal2: '', card2: 'Costa' } } },
  { name: 'Andrea', points: 42, isMe: false, currentPreds: { match1: { s1: 2, s2: 1, goal1: 'Alvarez', card1: '', goal2: 'Bebé', card2: 'Mendes' } } },
  { name: 'Luca', points: 30, isMe: false, currentPreds: { match1: { s1: 1, s2: 1, goal1: 'Di Maria', card1: 'Martinez', goal2: 'Bebé', card2: '' } } },
  { name: 'Marco', points: 15, isMe: false, currentPreds: { match1: { s1: 4, s2: 0, goal1: 'Messi', card1: '', goal2: '', card2: '' } } }
];

export default function Dashboard() {
  const [matches, setMatches] = useState(initialMatches);
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('oggi'); // 'oggi' | 'passate'

  // Simulazione Live (per demo)
  useEffect(() => {
    let interval;
    if (simulating) {
      interval = setInterval(() => {
        setMatches(prevMatches => {
          const newMatches = [...prevMatches];
          const match = { ...newMatches[1] }; // match id:1 Argentina vs Capo Verde
          
          if (!match.isLive && match.events.length === 0) {
            match.isLive = true;
            match.minute = 1;
            match.score1 = 0;
            match.score2 = 0;
            match.events = [{ time: 1, type: 'info', text: 'Partita Iniziata! Fatti sotto.' }];
          } else if (match.isLive) {
            match.minute += 8;
            
            if (match.minute >= 15 && match.events.length === 1) {
              match.score1 += 1;
              match.events.unshift({ time: 15, type: 'goal', player: 'Messi', team: 'Argentina' });
            }
            if (match.minute >= 35 && match.events.length === 2) {
              match.events.unshift({ time: 35, type: 'card', player: 'Costa', team: 'Capo Verde' });
            }
            if (match.minute >= 45 && match.events.length === 3) {
              match.score2 += 1;
              match.events.unshift({ time: 45, type: 'goal', player: 'Bebé', team: 'Capo Verde' });
            }
            if (match.minute >= 75 && match.events.length === 4) {
              match.score1 += 1;
              match.events.unshift({ time: 75, type: 'goal', player: 'Alvarez', team: 'Argentina' });
            }
            if (match.minute >= 90 && match.events.length === 5) {
              match.isLive = false;
              match.events.unshift({ time: 90, type: 'info', text: 'Triplice fischio. Partita Terminata!' });
              setSimulating(false);
            }
          }
          newMatches[1] = match;
          recalculatePoints(match);
          return newMatches;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [simulating]);

  const recalculatePoints = (liveMatch) => {
    setLeaderboard(prev => {
      const newLeaderboard = [...prev].map(user => {
        let livePoints = 0;
        const p = user.currentPreds.match1;
        if (!p) return user;
        
        if (p.s1 === liveMatch.score1 && p.s2 === liveMatch.score2) {
          livePoints += 3;
        } else if (
          (p.s1 > p.s2 && liveMatch.score1 > liveMatch.score2) ||
          (p.s1 < p.s2 && liveMatch.score1 < liveMatch.score2) ||
          (p.s1 === p.s2 && liveMatch.score1 === liveMatch.score2)
        ) {
          livePoints += 1;
        }

        liveMatch.events.forEach(e => {
          if (e.type === 'goal') {
             if (e.team === liveMatch.team1 && p.goal1 === e.player) livePoints += 2;
             if (e.team === liveMatch.team2 && p.goal2 === e.player) livePoints += 2;
          }
          if (e.type === 'card') {
             if (e.team === liveMatch.team1 && p.card1 === e.player) livePoints += 1;
             if (e.team === liveMatch.team2 && p.card2 === e.player) livePoints += 1;
          }
        });

        return { ...user, livePoints };
      });
      
      return newLeaderboard.sort((a,b) => (b.points + (b.livePoints||0)) - (a.points + (a.livePoints||0)));
    });
  };

  const resetSimulation = () => {
    setMatches(initialMatches);
    setLeaderboard(initialLeaderboard);
    setSimulating(false);
  }

  const renderMatchCard = (match, isPast) => {
    const isFinished = match.score1 !== null && !match.isLive;
    
    return (
      <div key={match.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: match.isLive ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
        {match.isLive && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-color)', animation: 'pulse 1.5s infinite' }} />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span>{match.group}</span>
          <span style={{ color: match.isLive ? 'var(--accent-color)' : 'inherit', fontWeight: match.isLive ? 'bold' : 'normal', display: 'flex', alignItems:'center', gap: '4px' }}>
            {match.isLive && <Radio size={14} className="pulse-anim" />}
            {match.isLive ? `Live ${match.minute}'` : match.date}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {match.flag1} <span>{match.team1}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {match.isLive || isFinished ? (
               <div style={{ fontSize: '2.5rem', fontWeight: '800', width: '60px', textAlign: 'center' }}>{match.score1}</div>
            ) : (
               <input type="number" min="0" max="20" className="input-field" style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem', padding: '8px' }} placeholder="-" />
            )}
            <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>-</span>
            {match.isLive || isFinished ? (
               <div style={{ fontSize: '2.5rem', fontWeight: '800', width: '60px', textAlign: 'center' }}>{match.score2}</div>
            ) : (
               <input type="number" min="0" max="20" className="input-field" style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem', padding: '8px' }} placeholder="-" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold', flexDirection: 'row-reverse' }}>
            {match.flag2} <span>{match.team2}</span>
          </div>
        </div>

        {/* Form Pronostici (solo se non iniziata) */}
        {!isFinished && !match.isLive && (
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Marcatore {match.team1}</label>
                <select className="input-field" style={{ padding: '8px', fontSize: '0.85rem' }}>
                  <option value="">Nessuno</option>
                  {rosters[match.team1]?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Ammonito {match.team1}</label>
                <select className="input-field" style={{ padding: '8px', fontSize: '0.85rem' }}>
                  <option value="">Nessuno</option>
                  {rosters[match.team1]?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Marcatore {match.team2}</label>
                <select className="input-field" style={{ padding: '8px', fontSize: '0.85rem' }}>
                  <option value="">Nessuno</option>
                  {rosters[match.team2]?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Ammonito {match.team2}</label>
                <select className="input-field" style={{ padding: '8px', fontSize: '0.85rem' }}>
                  <option value="">Nessuno</option>
                  {rosters[match.team2]?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button className="btn" style={{ alignSelf: 'center', width: '100%', marginTop: '0.5rem' }}>Salva Pronostici</button>
          </div>
        )}

        {/* Cronaca e Punti (per partite in corso o finite) */}
        {(match.isLive || isFinished) && match.events && match.events.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Box Eventi (Gol/Cartellini) */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.2rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <History size={16}/> Resoconto Eventi
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {match.events.map((e, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', animation: 'slideUp 0.3s ease' }}>
                    <span style={{ color: 'var(--text-muted)', width: '30px', fontWeight: 'bold' }}>{e.time}'</span>
                    <span>
                      {e.type === 'goal' && <>⚽ <strong>GOL {e.team?.toUpperCase() || ''}</strong> da <strong style={{color:'white'}}>{e.player}</strong></>}
                      {e.type === 'card' && <>🟨 <strong>Cartellino!</strong> Ammonito <strong style={{color:'white'}}>{e.player}</strong> {e.team ? `(${e.team})` : ''}</>}
                      {e.type === 'info' && <em style={{ color: 'var(--secondary-color)' }}>{e.text}</em>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box Punteggio Ottenuto */}
            {match.myPoints && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <CheckCircle size={18} /> Punti Guadagnati
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Dettaglio: {match.myPoints.breakdown}</p>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                  +{match.myPoints.total} pt
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Lega <span className="text-gradient">Amici al Bar</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Bentornato, Giacomo. I tuoi amici ti temono.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {!simulating && matches[1].events.length === 0 && activeTab === 'oggi' && (
             <button onClick={() => setSimulating(true)} className="btn btn-outline" style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
               <Activity size={20} /> Simula Live (Arg-CV)
             </button>
          )}
          {(simulating || matches[1].events.length > 0) && (
             <button onClick={resetSimulation} className="btn btn-outline">Reset Demo</button>
          )}
          <button className="btn btn-outline" title="Impostazioni Lega"><Settings size={20}/></button>
          <Link to="/" className="btn btn-outline" title="Esci"><LogOut size={20}/></Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Colonna Sinistra: Partite */}
        <div style={{ gridColumn: 'span 2' }}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('oggi')} 
              className={`btn ${activeTab === 'oggi' ? '' : 'btn-outline'}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={18} /> In Programma
            </button>
            <button 
              onClick={() => setActiveTab('passate')} 
              className={`btn ${activeTab === 'passate' ? '' : 'btn-outline'}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <History size={18} /> Archivio Risultati
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeTab === 'oggi' && matches.map(match => renderMatchCard(match, false))}
            {activeTab === 'passate' && pastMatches.map(match => renderMatchCard(match, true))}
          </div>
        </div>

        {/* Colonna Destra: Classifica & Penitenze */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', gridColumn: 'span 1' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={20} color="#fbbf24" /> Classifica
              </h2>
              {simulating && <span style={{ color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 'bold', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px' }} className="pulse-anim">LIVE RECALC</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {leaderboard.map((user, index) => {
                const totalPoints = user.points + (user.livePoints || 0);
                return (
                <div key={user.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: user.isMe ? 'rgba(26, 92, 255, 0.2)' : 'rgba(255,255,255,0.05)', borderRadius: '8px', border: user.isMe ? '1px solid var(--primary-color)' : '1px solid transparent', transition: 'all 0.4s ease', transform: 'translateY(0)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: index === 0 ? '#fbbf24' : index === leaderboard.length -1 ? 'var(--accent-color)' : 'var(--text-muted)', width: '20px' }}>
                      {index + 1}°
                    </span>
                    <span>{user.name} {user.isMe && '(Tu)'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {user.livePoints > 0 && <span style={{ color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 'bold', animation: 'slideUp 0.3s ease' }}>+{user.livePoints}pt live</span>}
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{totalPoints}</span>
                  </div>
                </div>
              )})}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
              🤡 La Penitenza
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic', lineHeight: '1.5' }}>
              "L'ultimo classificato dovrà pagare una cena completa al vincitore e presentarsi in divisa completa del Brasile."
            </p>
            <div style={{ fontSize: '0.9rem', background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '8px', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}>
              A rischio attuale: 
              <strong style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>
                {leaderboard[leaderboard.length - 1].name}
              </strong>
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        .pulse-anim { animation: pulse 1s infinite; }
      `}</style>
    </div>
  );
}
