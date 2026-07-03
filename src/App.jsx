import { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, CalendarDays, Trophy, Settings, Bell } from 'lucide-react';
import './index.css';

import LeagueHome from './pages/LeagueHome';
import MatchesTabellone from './pages/MatchesTabellone';
import MatchDetail from './pages/MatchDetail';
import LeaderboardView from './pages/LeaderboardView';
import LeagueSettings from './pages/LeagueSettings';
import SetupUser from './pages/SetupUser';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

const initialRosters = {
  'Argentina': ['Messi', 'Alvarez', 'Di Maria', 'De Paul', 'E. Martinez', 'Mac Allister'],
  'Capo Verde': ['Bebé', 'Mendes', 'Cabral', 'Pico', 'Costa', 'Garry Rodrigues'],
  'Australia': ['Ryan', 'Souttar', 'Irvine', 'Duke', 'Mabil', 'Rowles'],
  'Egitto': ['Salah', 'Trezeguet', 'Marmoush', 'Elneny', 'Hegazy', 'Mostafa Mohamed'],
  'Colombia': ['Diaz', 'Rodriguez', 'Arias', 'Borre', 'Lerma', 'Davinson Sanchez'],
  'Ghana': ['Kudus', 'Partey', 'Williams', 'Ayew', 'Salisu', 'Semenyo']
};

const initialMatches = [
  { id: 1, team1: 'Argentina', team2: 'Capo Verde', flag1: '🇦🇷', flag2: '🇨🇻', time: '18:00', date: 'Oggi', group: 'Sedicesimi', score1: null, score2: null, status: 'scheduled', events: [] }
];

const initialTomorrowMatches = [
  { id: 2, team1: 'Australia', team2: 'Egitto', flag1: '🇦🇺', flag2: '🇪🇬', time: '20:45', date: 'Domani', group: 'Sedicesimi', score1: null, score2: null, status: 'scheduled', events: [] },
  { id: 3, team1: 'Colombia', team2: 'Ghana', flag1: '🇨🇴', flag2: '🇬🇭', time: '23:00', date: 'Domani', group: 'Sedicesimi', score1: null, score2: null, status: 'scheduled', events: [] }
];

const initialPastMatches = [
  { 
    id: 10, team1: 'Spagna', team2: 'Austria', flag1: '🇪🇸', flag2: '🇦🇹', date: 'Ieri', time: '21:00', group: 'Sedicesimi', score1: 3, score2: 0, status: 'finished',
    events: [
      { time: 12, type: 'goal', player: 'Morata', team: 'Spagna' }, 
      { time: 45, type: 'goal', player: 'Olmo', team: 'Spagna' },
      { time: 60, type: 'card', player: 'Laimer', team: 'Austria' },
      { time: 88, type: 'goal', player: 'Williams', team: 'Spagna' }
    ]
  },
  { 
    id: 11, team1: 'Svizzera', team2: 'Algeria', flag1: '🇨🇭', flag2: '🇩🇿', date: 'Ieri', time: '23:00', group: 'Sedicesimi', score1: 2, score2: 0, status: 'finished',
    events: [
      { time: 33, type: 'goal', player: 'Shaqiri', team: 'Svizzera' },
      { time: 70, type: 'card', player: 'Mahrez', team: 'Algeria' },
      { time: 80, type: 'goal', player: 'Embolo', team: 'Svizzera' }
    ]
  }
];

const botPredictions = {
  andrea: {
    1: { score1: 2, score2: 1, ou: 'O 1.5', scorers1: ['Alvarez'], scorers2: ['Bebé'], motm: 'Alvarez', card: 'De Paul' }
  },
  enea: {
    1: { score1: 1, score2: 1, ou: 'U 2.5', scorers1: ['Messi'], scorers2: ['Costa'], motm: 'Messi', card: 'Costa' }
  },
  luca: {
    1: { score1: 0, score2: 2, ou: 'O 1.5', scorers1: [], scorers2: ['Bebé', 'Mendes'], motm: 'Bebé', card: 'Pico' }
  }
};

const initialGlobalMessages = [
  { id: 1, user: 'Andrea', text: 'Stasera si cena col pesce pagato dall\'ultimo classificato!', time: '10:15' },
  { id: 2, user: 'Enea', text: 'Tranquilli, ho inserito la penitenza per chi fa meno punti.', time: '10:30' },
  { id: 3, user: 'Luca', text: 'Enea stasera ti supero di sicuro!', time: '10:32' }
];

const initialMatchMessages = {
  1: [
    { id: 1, user: 'Luca', text: 'Messi segna sicuro entro il 15°.', time: '11:00' },
    { id: 2, user: 'Andrea', text: 'Ma va, finisce 1-0 tiratissimo.', time: '11:05' }
  ]
};

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  
  if (path.startsWith('/match/')) return null;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      <Link to="/matches" className={`nav-item ${path === '/matches' ? 'active' : ''}`}>
        <CalendarDays size={24} />
        <span>Partite</span>
      </Link>
      <Link to="/leaderboard" className={`nav-item ${path === '/leaderboard' ? 'active' : ''}`}>
        <Trophy size={24} />
        <span>Lega</span>
      </Link>
      <Link to="/settings" className={`nav-item ${path === '/settings' ? 'active' : ''}`}>
        <Settings size={24} />
        <span>Regole</span>
      </Link>
    </nav>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [matches, setMatches] = useState(initialMatches);
  const [tomorrowMatches, setTomorrowMatches] = useState(initialTomorrowMatches);
  const [pastMatches, setPastMatches] = useState(initialPastMatches);
  const [players, setPlayers] = useState(() => {
    const bots = [
      { id: 'andrea', name: 'Andrea', points: 42 },
      { id: 'enea', name: 'Enea', points: 30 },
      { id: 'luca', name: 'Luca', points: 15 }
    ];
    if (currentUser) {
      return [{ ...currentUser, points: 45 }, ...bots];
    }
    return [];
  });

  const [predictions, setPredictions] = useState({});
  const [conditionalPenalties, setConditionalPenalties] = useState({}); // { matchId: { targetPlayer, cond1Pts, cond1Text, cond2Pts, cond2Text } }
  const [penalties, setPenalties] = useState([
    { id: 1, from: 'Andrea', to: 'Luca', text: 'Fare una story su Instagram ringraziandomi per avergli insegnato il calcio.', status: 'pending' }
  ]);

  // Stato per la notifica push simulata (in-app banner)
  const [pushNotification, setPushNotification] = useState(null);

  const triggerPush = (title, message) => {
    setPushNotification({ title, message });
    setTimeout(() => {
      setPushNotification(null);
    }, 5000);
  };

  const [scoringConfig, setScoringConfig] = useState({
    exactScore: 5,
    overUnder: 2,
    goal: 1,
    motm: 3,
    card: 2
  });

  const [leagueSettings, setLeagueSettings] = useState({
    penaltyRule: 'L\'ultimo classificato dovrà pagare una cena completa al vincitore e presentarsi in divisa completa del Brasile.'
  });

  const [globalMessages, setGlobalMessages] = useState(initialGlobalMessages);
  const [matchMessages, setMatchMessages] = useState(initialMatchMessages);

  const addGlobalMessage = (text) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setGlobalMessages(prev => [
      ...prev,
      { id: Date.now(), user: currentUser.name, text, time: timeStr }
    ]);
  };

  const addMatchMessage = (matchId, text) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMatchMessages(prev => {
      const currentList = prev[matchId] || [];
      return {
        ...prev,
        [matchId]: [...currentList, { id: Date.now(), user: currentUser.name, text, time: timeStr }]
      };
    });
  };

  const getPointsForPrediction = (pred, match) => {
    if (!pred || match.score1 === null) return 0;
    let pts = 0;

    if (parseInt(pred.score1) === match.score1 && parseInt(pred.score2) === match.score2) {
      pts += scoringConfig.exactScore;
    }

    const totalGoals = match.score1 + match.score2;
    if (pred.ou) {
      const [type, valStr] = pred.ou.split(' ');
      const limit = parseFloat(valStr);
      const isOver = type === 'O';
      if ((isOver && totalGoals > limit) || (!isOver && totalGoals < limit)) {
        pts += scoringConfig.overUnder;
      }
    }

    match.events.forEach(e => {
      if (e.type === 'goal') {
        if (pred.scorers1?.includes(e.player) || pred.scorers2?.includes(e.player)) {
          pts += scoringConfig.goal;
        }
      }
    });

    if (match.motm && pred.motm === match.motm) {
      pts += scoringConfig.motm;
    }

    const firstCardEvent = match.events.find(e => e.type === 'card');
    if (firstCardEvent && pred.card === firstCardEvent.player) {
      pts += scoringConfig.card;
    }

    return pts;
  };

  // Aggiornamento simulato ogni 5 minuti (nella demo ridotto a 30s per mostrare notifiche)
  useEffect(() => {
    const timer = setInterval(() => {
      // Simula aggiornamenti minori o ping
      console.log("Aggiornamento dati in corso...");
    }, 300000); // 5 minuti

    return () => clearInterval(timer);
  }, []);

  const simulateLiveMatch = (matchId) => {
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;

    // 1. Notifica inizio match
    triggerPush("⚽ Partita Iniziata!", `Argentina vs Capo Verde è iniziata live.`);

    setTimeout(() => {
      triggerPush("⚽ GOL ARGENTINA!", "Messi sblocca il risultato al 10'! 1-0.");
    }, 1500);

    setTimeout(() => {
      triggerPush("🟨 Cartellino Giallo!", "Ammonito Costa al 35' per Capo Verde.");
    }, 3000);

    setTimeout(() => {
      triggerPush("⚽ GOL CAPO VERDE!", "Incredibile pareggio di Bebé al 68'! 1-1.");
    }, 4500);

    setTimeout(() => {
      triggerPush("⚽ GOL ARGENTINA!", "Alvarez segna il definitivo 3-1 al 89'.");
    }, 6000);

    setTimeout(() => {
      const simulatedEvents = [
        { time: 10, type: 'goal', player: 'Messi', team: 'Argentina' },
        { time: 35, type: 'card', player: 'Costa', team: 'Capo Verde' },
        { time: 44, type: 'goal', player: 'Alvarez', team: 'Argentina' },
        { time: 68, type: 'goal', player: 'Bebé', team: 'Capo Verde' },
        { time: 89, type: 'goal', player: 'Messi', team: 'Argentina' }
      ];
      const finalMOTM = 'Messi';

      setMatches(prev => {
        const copy = [...prev];
        copy[matchIndex] = {
          ...copy[matchIndex],
          score1: 3,
          score2: 1,
          status: 'finished',
          events: simulatedEvents,
          motm: finalMOTM
        };
        return copy;
      });

      // Ricalcola punteggio utente
      let myPts = 0;
      setPlayers(prevPlayers => {
        return prevPlayers.map(player => {
          let additionalPts = 0;
          const targetMatch = { id: matchId, score1: 3, score2: 1, events: simulatedEvents, motm: finalMOTM };
          
          if (player.isMe) {
            const myPred = predictions[matchId];
            additionalPts = getPointsForPrediction(myPred, targetMatch);
            myPts = additionalPts;
          } else {
            const botPred = botPredictions[player.id]?.[matchId];
            additionalPts = getPointsForPrediction(botPred, targetMatch);
          }

          return {
            ...player,
            points: player.points + additionalPts
          };
        }).sort((a, b) => b.points - a.points);
      });

      triggerPush("🏁 Partita Terminata!", `Risultato finale Argentina 3 - 1 Capo Verde. Hai totalizzato +${myPts} punti.`);

      // Controlla le penitenze condizionali impostate per questo match
      const condPenalty = conditionalPenalties[matchId];
      if (condPenalty && condPenalty.targetPlayer) {
        let triggeredText = "";
        
        if (myPts >= parseInt(condPenalty.cond2Pts) && condPenalty.cond2Text) {
          triggeredText = condPenalty.cond2Text;
        } else if (myPts >= parseInt(condPenalty.cond1Pts) && condPenalty.cond1Text) {
          triggeredText = condPenalty.cond1Text;
        }

        if (triggeredText) {
          setTimeout(() => {
            setPenalties(prev => [
              ...prev,
              {
                id: Date.now(),
                from: currentUser?.name || 'Giacomo',
                to: condPenalty.targetPlayer,
                text: triggeredText,
                status: 'pending'
              }
            ]);
            triggerPush("🤡 Penitenza Assegnata!", `Hai fatto abbastanza punti! Nuova penitenza sbloccata per ${condPenalty.targetPlayer}.`);
          }, 2000);
        }
      }
    }, 7500);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      rosters: initialRosters,
      matches,
      setMatches,
      tomorrowMatches,
      pastMatches,
      setPastMatches,
      players,
      setPlayers,
      predictions,
      setPredictions,
      conditionalPenalties,
      setConditionalPenalties,
      penalties,
      setPenalties,
      scoringConfig,
      setScoringConfig,
      leagueSettings,
      setLeagueSettings,
      globalMessages,
      addGlobalMessage,
      matchMessages,
      addMatchMessage,
      simulateLiveMatch,
      getPointsForPrediction,
      handleLogout
    }}>
      <Router>
        <div className="app-container">
          
          {/* iOS Push Notification Banner */}
          {pushNotification && (
            <div className="push-banner">
              <div className="push-icon-container">
                <Bell size={18} color="#14b8a6" />
              </div>
              <div className="push-content">
                <h4 className="push-title">{pushNotification.title}</h4>
                <p className="push-desc">{pushNotification.message}</p>
              </div>
            </div>
          )}

          {!currentUser ? (
            <SetupUser />
          ) : (
            <>
              <Routes>
                <Route path="/" element={<LeagueHome />} />
                <Route path="/matches" element={<MatchesTabellone />} />
                <Route path="/match/:id" element={<MatchDetail />} />
                <Route path="/leaderboard" element={<LeaderboardView />} />
                <Route path="/settings" element={<LeagueSettings />} />
              </Routes>
              <BottomNav />
            </>
          )}
        </div>
      </Router>
    </AppContext.Provider>
  );
}
