import { useState } from 'react';
import { useApp } from '../App';
import { Settings, Save, AlertCircle } from 'lucide-react';

export default function LeagueSettings() {
  const { scoringConfig, setScoringConfig, leagueSettings, setLeagueSettings } = useApp();
  
  const [exactScore, setExactScore] = useState(scoringConfig.exactScore);
  const [overUnder, setOverUnder] = useState(scoringConfig.overUnder);
  const [goal, setGoal] = useState(scoringConfig.goal);
  const [motm, setMotm] = useState(scoringConfig.motm);
  const [card, setCard] = useState(scoringConfig.card);
  
  const [penaltyRule, setPenaltyRule] = useState(leagueSettings.penaltyRule);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setScoringConfig({
      exactScore: parseInt(exactScore),
      overUnder: parseInt(overUnder),
      goal: parseInt(goal),
      motm: parseInt(motm),
      card: parseInt(card)
    });
    setLeagueSettings({
      penaltyRule
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ paddingBottom: '30px' }}>
      <div className="header-top">
        <h2>Regole e Punteggi</h2>
      </div>

      <div style={{ padding: '16px' }}>
        {saved && (
          <div style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid var(--accent)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: 'var(--accent)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
            Impostazioni Salvate con Successo!
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Sezione Punteggi */}
          <div className="panel">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} /> Definizione Punti
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>Risultato Esatto</span>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '80px', textAlign: 'center', padding: '8px' }}
                  value={exactScore} 
                  onChange={e => setExactScore(e.target.value)} 
                  min="0"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>Totale Gol (Over/Under)</span>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '80px', textAlign: 'center', padding: '8px' }}
                  value={overUnder} 
                  onChange={e => setOverUnder(e.target.value)} 
                  min="0"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>Gol Marcatore (singolo)</span>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '80px', textAlign: 'center', padding: '8px' }}
                  value={goal} 
                  onChange={e => setGoal(e.target.value)} 
                  min="0"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>Man of the Match (MOTM)</span>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '80px', textAlign: 'center', padding: '8px' }}
                  value={motm} 
                  onChange={e => setMotm(e.target.value)} 
                  min="0"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>Cartellino Giallo/Rosso</span>
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '80px', textAlign: 'center', padding: '8px' }}
                  value={card} 
                  onChange={e => setCard(e.target.value)} 
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Sezione Penitenze */}
          <div className="panel">
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} /> Regola Penitenza di Lega
            </h3>
            
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Definisci la penitenza per chi perde o finisce ultimo</label>
              <textarea 
                className="input-field" 
                style={{ height: '100px', resize: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
                placeholder="Es. Chi arriva ultimo alla fine dei gironi deve pagare la birra a tutti..."
                value={penaltyRule}
                onChange={e => setPenaltyRule(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn">
            <Save size={20} /> Salva Configurazione
          </button>
        </form>
      </div>
    </div>
  );
}
