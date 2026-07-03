import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Minus, CheckCircle, Trophy, MessageSquare, Send, AlertOctagon } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../App';

export default function MatchDetail() {
  const { id } = useParams();
  const matchId = parseInt(id);
  const navigate = useNavigate();
  const { matches, pastMatches, tomorrowMatches, rosters, predictions, setPredictions, conditionalPenalties, setConditionalPenalties, players, getPointsForPrediction, matchMessages, addMatchMessage, currentUser } = useApp();
  
  const match = matches.find(m => m.id === matchId) || pastMatches.find(m => m.id === matchId) || tomorrowMatches.find(m => m.id === matchId);
  const [chatInput, setChatInput] = useState('');
  
  if (!match) {
    return <div style={{ padding: '20px' }}>Partita non trovata.</div>;
  }

  const isFinished = match.status === 'finished';

  const existingPred = predictions[matchId] || {
    score1: 0,
    score2: 0,
    ou: 'O 1.5',
    scorers1: [],
    scorers2: [],
    motm: '',
    card: ''
  };

  const existingCondPenalty = conditionalPenalties[matchId] || {
    targetPlayer: '',
    cond1Pts: 2,
    cond1Text: '',
    cond2Pts: 5,
    cond2Text: ''
  };

  const [score1, setScore1] = useState(existingPred.score1);
  const [score2, setScore2] = useState(existingPred.score2);
  const [ou, setOu] = useState(existingPred.ou);
  const [scorers1, setScorers1] = useState(existingPred.scorers1 || []);
  const [scorers2, setScorers2] = useState(existingPred.scorers2 || []);
  const [motm, setMotm] = useState(existingPred.motm || '');
  const [card, setCard] = useState(existingPred.card || '');

  // Stato per la penitenza condizionale
  const [targetPlayer, setTargetPlayer] = useState(existingCondPenalty.targetPlayer);
  const [cond1Pts, setCond1Pts] = useState(existingCondPenalty.cond1Pts);
  const [cond1Text, setCond1Text] = useState(existingCondPenalty.cond1Text);
  const [cond2Pts, setCond2Pts] = useState(existingCondPenalty.cond2Pts);
  const [cond2Text, setCond2Text] = useState(existingCondPenalty.cond2Text);

  const toggleScorer = (player, teamNum) => {
    if (teamNum === 1) {
      setScorers1(prev => 
        prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]
      );
    } else {
      setScorers2(prev => 
        prev.includes(player) ? prev.filter(p => p !== player) : [...prev, player]
      );
    }
  };

  const savePrediction = () => {
    // Salva pronostico
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        score1,
        score2,
        ou,
        scorers1,
        scorers2,
        motm,
        card
      }
    }));
    
    // Salva penitenza condizionale
    setConditionalPenalties(prev => ({
      ...prev,
      [matchId]: {
        targetPlayer,
        cond1Pts,
        cond1Text,
        cond2Pts,
        cond2Text
      }
    }));

    navigate('/matches');
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addMatchMessage(matchId, chatInput);
    setChatInput('');
  };

  const t1Roster = rosters[match.team1] || [];
  const t2Roster = rosters[match.team2] || [];
  const fullRoster = [...t1Roster, ...t2Roster];

  const pointsEarned = isFinished ? getPointsForPrediction(existingPred, match) : 0;
  const messagesList = matchMessages[matchId] || [];

  return (
    <div style={{ paddingBottom: '30px' }}>
      <div className="header-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h2>{isFinished ? 'Riepilogo Partita' : 'Piazza Pronostico'}</h2>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        
        {/* Info Partita / Risultato */}
        <div className="panel" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span style={{ fontSize: '2.5rem' }}>{match.flag1}</span>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{match.team1}</span>
            </div>
            <div style={{ fontWeight: '900', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '4px 10px', background: 'var(--surface-light)', borderRadius: '4px' }}>VS</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span style={{ fontSize: '2.5rem' }}>{match.flag2}</span>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{match.team2}</span>
            </div>
          </div>
          
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
            {isFinished ? 'Risultato Finale' : 'Risultato Esatto (5pt)'}
          </h3>

          {isFinished ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '3rem', fontWeight: '900', color: 'var(--accent)' }}>
              <span>{match.score1}</span>
              <span>-</span>
              <span>{match.score2}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <button className="odd-btn" style={{ padding: '10px' }} onClick={() => setScore1(prev => Math.max(0, prev - 1))}><Minus size={20} /></button>
              <div className="score-box" style={{ fontSize: '2.2rem', height: '55px', width: '55px' }}>{score1}</div>
              <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>-</span>
              <div className="score-box" style={{ fontSize: '2.2rem', height: '55px', width: '55px' }}>{score2}</div>
              <button className="odd-btn" style={{ padding: '10px' }} onClick={() => setScore2(prev => Math.max(0, prev - 1))}><Minus size={20} /></button>
              <button className="odd-btn" style={{ padding: '10px', background: 'var(--surface-light)' }} onClick={() => setScore1(prev => prev + 1)}><Plus size={20} /></button>
              <button className="odd-btn" style={{ padding: '10px', background: 'var(--surface-light)' }} onClick={() => setScore2(prev => prev + 1)}><Plus size={20} /></button>
            </div>
          )}
        </div>

        {/* Se finita mostra resoconto punti dell'utente */}
        {isFinished && (
          <div className="panel" style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid var(--accent)', padding: '16px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '4px', display: 'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              <Trophy size={20} /> Pronostico Concluso
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>Hai indovinato gli esiti guadagnando:</p>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white' }}>+{pointsEarned} pt</div>
          </div>
        )}

        {/* Ticker Eventi Reali se terminata */}
        {isFinished && match.events && match.events.length > 0 && (
          <div className="panel">
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Eventi del Match</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              {match.events.map((e, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{e.time}'</span>
                  <span>{e.type === 'goal' ? '⚽' : '🟨'} {e.player} ({e.team})</span>
                </div>
              ))}
              {match.motm && (
                <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Man of the Match:</span>
                  <span style={{ fontWeight: 'bold' }}>⭐ {match.motm}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Over/Under Pronostico */}
        <div className="panel">
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Totale Gol (Over/Under) (2pt)
          </h3>
          {isFinished ? (
            <div className="odd-btn selected" style={{ width: '100%' }}>
              <span className="odd-label">Pronosticato: {existingPred.ou}</span>
            </div>
          ) : (
            <div className="market-grid">
              {['O 0.5', 'U 0.5', 'O 1.5', 'U 1.5', 'O 2.5', 'U 2.5', 'O 3.5', 'U 3.5'].map(m => (
                <div key={m} className={`odd-btn ${ou === m ? 'selected' : ''}`} onClick={() => setOu(m)}>
                  <span className="odd-label">{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Marcatori Pronostico */}
        <div className="panel">
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Marcatori (1pt per gol)
          </h3>
          
          {isFinished ? (
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '8px' }}>
                <span className="text-muted">{match.team1}:</span> {existingPred.scorers1?.join(', ') || 'Nessun gol'}
              </div>
              <div>
                <span className="text-muted">{match.team2}:</span> {existingPred.scorers2?.join(', ') || 'Nessun gol'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>{match.team1}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {t1Roster.map(p => {
                    const isSel = scorers1.includes(p);
                    return (
                      <div key={p} className={`odd-btn ${isSel ? 'selected' : ''}`} onClick={() => toggleScorer(p, 1)}>
                        <span className="odd-label">{p}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>{match.team2}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {t2Roster.map(p => {
                    const isSel = scorers2.includes(p);
                    return (
                      <div key={p} className={`odd-btn ${isSel ? 'selected' : ''}`} onClick={() => toggleScorer(p, 2)}>
                        <span className="odd-label">{p}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Speciali Pronostico */}
        <div className="panel">
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
            Speciali
          </h3>
          
          {isFinished ? (
            <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><span className="text-muted">Man of the Match:</span> {existingPred.motm || 'Non scelto'}</div>
              <div><span className="text-muted">Cartellino:</span> {existingPred.card || 'Non scelto'}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Man of the Match (3pt)</label>
                <select className="select-field" value={motm} onChange={e=>setMotm(e.target.value)}>
                  <option value="">Seleziona Giocatore</option>
                  {fullRoster.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Primo Cartellino del Match (2pt)</label>
                <select className="select-field" value={card} onChange={e=>setCard(e.target.value)}>
                  <option value="">Seleziona Giocatore</option>
                  {fullRoster.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ASSEGNAZIONE PENITENZA CONDIZIONALE (Solo per match da giocare) */}
        {!isFinished && (
          <div className="panel" style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--danger)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertOctagon size={18} /> Penitenza Condizionale
            </h3>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '12px' }}>
              Pianifica la penitenza. Se indovini il pronostico e raggiungi i punti indicati, la sfida verrà assegnata al giocatore scelto!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Sfidato</label>
                <select className="select-field" value={targetPlayer} onChange={e=>setTargetPlayer(e.target.value)}>
                  <option value="">Nessuno</option>
                  {players.filter(p => !p.isMe).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Soglia Punti 1</label>
                  <input type="number" className="input-field" style={{ padding: '8px' }} value={cond1Pts} onChange={e=>setCond1Pts(e.target.value)} />
                </div>
                <div style={{ flex: 3 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Cosa deve fare (Sfida 1)</label>
                  <input type="text" className="input-field" style={{ padding: '8px' }} placeholder="Es. Enea mi offre la birra" value={cond1Text} onChange={e=>setCond1Text(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Soglia Punti 2</label>
                  <input type="number" className="input-field" style={{ padding: '8px' }} value={cond2Pts} onChange={e=>setCond2Pts(e.target.value)} />
                </div>
                <div style={{ flex: 3 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Cosa deve fare (Sfida 2)</label>
                  <input type="text" className="input-field" style={{ padding: '8px' }} placeholder="Es. Enea paga la cena di pesce!" value={cond2Text} onChange={e=>setCond2Text(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isFinished && (
          <button className="btn" style={{ marginTop: '16px', marginBottom: '24px' }} onClick={savePrediction}>
            <Check size={20} /> Piazza Pronostico
          </button>
        )}

        {/* CHAT DEL MATCH (Banter Room) */}
        <div className="panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '300px', border: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--surface-light)', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} className="text-accent" /> Banter Room Partita
            </h3>
          </div>
          
          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-dark)', minHeight: '180px', maxHeight: '300px', overflowY: 'auto' }}>
            {messagesList.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', margin: 'auto' }}>
                Nessun messaggio per questa partita. Inizia il banter! ⚽
              </div>
            ) : (
              messagesList.map((m) => {
                const isMe = m.user === currentUser?.name;
                return (
                  <div key={m.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textAlign: isMe ? 'right' : 'left' }}>
                      {m.user} • {m.time}
                    </div>
                    <div style={{ background: isMe ? 'var(--accent)' : 'var(--surface)', color: isMe ? '#000' : '#fff', padding: '10px 14px', borderRadius: '12px', borderBottomRightRadius: isMe ? '2px' : '12px', borderBottomLeftRadius: isMe ? '12px' : '2px', fontWeight: '500', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', padding: '10px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Scrivi qualcosa sulla partita..." 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: '10px' }}
            />
            <button type="submit" className="btn" style={{ width: '50px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: 0 }}>
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
