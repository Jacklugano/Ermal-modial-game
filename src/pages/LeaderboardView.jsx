import { useState } from 'react';
import { Trophy, AlertOctagon, Activity, Send, Check, MessageSquare } from 'lucide-react';
import { useApp } from '../App';

export default function LeaderboardView() {
  const { players, matches, simulateLiveMatch, penalties, setPenalties, globalMessages, addGlobalMessage, currentUser } = useApp();
  const [newPenaltyText, setNewPenaltyText] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [viewTab, setViewTab] = useState('ranking'); // 'ranking' | 'chat' | 'penalties'
  
  const simulationMatch = matches.find(m => m.id === 1 && m.status === 'scheduled');

  const handleAddPenalty = (e) => {
    e.preventDefault();
    if (!newPenaltyText || !targetUser) return;
    
    setPenalties(prev => [
      ...prev,
      {
        id: Date.now(),
        from: currentUser?.name || 'Giacomo',
        to: targetUser,
        text: newPenaltyText,
        status: 'pending'
      }
    ]);
    setNewPenaltyText('');
  };

  const handleCompletePenalty = (id) => {
    setPenalties(prev => 
      prev.map(p => p.id === id ? { ...p, status: 'completed' } : p)
    );
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addGlobalMessage(chatInput);
    setChatInput('');
  };

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  const loser = sortedPlayers[sortedPlayers.length - 1];

  return (
    <div style={{ paddingBottom: '30px' }}>
      <div className="header-top">
        <h2>Lega: Amici al Bar</h2>
      </div>

      {/* Tabs di sezione interni per migliorare l'esperienza mobile */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button onClick={() => setViewTab('ranking')} style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', borderBottom: viewTab === 'ranking' ? '3px solid var(--accent)' : 'none', color: viewTab === 'ranking' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
          Classifica
        </button>
        <button onClick={() => setViewTab('chat')} style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', borderBottom: viewTab === 'chat' ? '3px solid var(--accent)' : 'none', color: viewTab === 'chat' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          Chat <MessageSquare size={14} />
        </button>
        <button onClick={() => setViewTab('penalties')} style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', borderBottom: viewTab === 'penalties' ? '3px solid var(--accent)' : 'none', color: viewTab === 'penalties' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
          Penitenze
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        
        {/* TAB 1: CLASSIFICA */}
        {viewTab === 'ranking' && (
          <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ background: 'var(--surface-light)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} className="text-accent" /> Standings Live
              </h3>
              {simulationMatch && (
                <button 
                  onClick={() => simulateLiveMatch(1)} 
                  className="btn" 
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Activity size={14} /> Simula Partita
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sortedPlayers.map((u, index) => {
                const rank = index + 1;
                return (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border)', background: u.isMe ? 'rgba(20, 184, 166, 0.1)' : 'transparent' }}>
                    <div style={{ width: '30px', fontWeight: '700', color: rank === 1 ? 'var(--warning)' : rank === sortedPlayers.length ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {rank}°
                    </div>
                    <div style={{ flex: 1, fontWeight: '500' }}>
                      {u.name} {u.isMe && '(Tu)'}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                      {u.points} pt
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHAT DI LEGA */}
        {viewTab === 'chat' && (
          <div className="panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '400px' }}>
            <div style={{ background: 'var(--surface-light)', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} className="text-accent" /> Messaggi della Lega
              </h3>
            </div>
            
            {/* Area Messaggi */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-dark)' }}>
              {globalMessages.map((m) => {
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
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} style={{ display: 'flex', padding: '12px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Scrivi un messaggio di sfida..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
              <button type="submit" className="btn" style={{ width: '60px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: 0 }}>
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PENITENZE */}
        {viewTab === 'penalties' && (
          <div>
            {/* Assegna Nuova Penitenza */}
            <div className="panel" style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'white' }}>Assegna Penitenza (Solo chi vince/sfida)</h4>
              <form onSubmit={handleAddPenalty} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Destinatario (Attualmente a rischio: {loser?.name})</label>
                  <select className="select-field" value={targetUser} onChange={e=>setTargetUser(e.target.value)} required>
                    <option value="">Scegli un amico</option>
                    {players.filter(p => !p.isMe).map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Descrizione Penitenza / Sfida</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Es. Pagare il caffè a tutti per un mese..." 
                    value={newPenaltyText} 
                    onChange={e=>setNewPenaltyText(e.target.value)} 
                    required
                  />
                </div>
                <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} /> Invia Penitenza
                </button>
              </form>
            </div>

            {/* Lista Penitenze */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {penalties.map(p => (
                <div key={p.id} className="panel" style={{ borderLeft: p.status === 'completed' ? '4px solid var(--accent)' : '4px solid var(--danger)', padding: '16px', opacity: p.status === 'completed' ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                    <span className="text-muted">Da: {p.from}</span>
                    <span style={{ color: p.status === 'completed' ? 'var(--accent)' : 'var(--danger)', fontWeight: 'bold' }}>
                      A: {p.to} ({p.status === 'completed' ? 'Scontata' : 'Da Fare'})
                    </span>
                  </div>
                  <p style={{ fontWeight: '500', lineHeight: '1.4', fontSize: '0.95rem', color: 'white', textDecoration: p.status === 'completed' ? 'line-through' : 'none' }}>
                    "{p.text}"
                  </p>
                  {p.status === 'pending' && (
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleCompletePenalty(p.id)} 
                        className="btn" 
                        style={{ background: 'var(--accent)', color: '#000', padding: '6px 12px', width: 'auto', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={14} /> Segna come Scontata
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
