import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import CountUpNumber from '../components/CountUpNumber';

export default function DashboardPage() {
  const { profile, refillStreak } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [refillMsg, setRefillMsg] = useState('');
  const [refilling, setRefilling] = useState(false);
  const scrollTimerRef = useRef(null);

  const [challengeState, setChallengeState] = useState(() => {
    const saved = localStorage.getItem('skillswap_daily_challenge');
    if (saved) {
      const { state, date } = JSON.parse(saved);
      if (date === new Date().toDateString()) return state;
    }
    return 'idle';
  });

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (challengeState !== 'accepted') return;
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [challengeState]);

  const handleChallengeAction = (action) => {
    setChallengeState(action);
    localStorage.setItem('skillswap_daily_challenge', JSON.stringify({
      state: action,
      date: new Date().toDateString()
    }));
  };

  const handleRefillStreak = async () => {
    if (refilling) return;
    setRefilling(true);
    const result = await refillStreak();
    setRefillMsg(result.reason);
    setTimeout(() => setRefillMsg(''), 5000);
    setRefilling(false);
  };

  const LEVEL_THRESHOLDS = [
    { label: 'Beginner', min: 0, max: 500 },
    { label: 'Intermediate', min: 500, max: 1500 },
    { label: 'Expert', min: 1500, max: 3000 },
    { label: 'Master', min: 3000, max: 5000 },
  ];

  function getLevelInfo(xp) {
    const current = LEVEL_THRESHOLDS.find(l => xp >= l.min && xp < l.max) || LEVEL_THRESHOLDS[3];
    const nextIdx = LEVEL_THRESHOLDS.indexOf(current) + 1;
    const next = LEVEL_THRESHOLDS[nextIdx] || current;
    return {
      label: current.label,
      nextLabel: next.label,
      currentXpInLevel: xp - current.min,
      xpNeededForNext: current.max - current.min
    };
  }

  const xpInfo = getLevelInfo(profile?.xp || 0);
  const xpProgress = Math.min(((xpInfo.currentXpInLevel / xpInfo.xpNeededForNext) * 100), 100);
  const accuracy = Math.min(Math.round((profile?.xp || 0) / 50), 100);
  const teachPct = Math.min((profile?.teachSkills?.length || 0) * 20, 100);
  const learnPct = Math.min((profile?.learnSkills?.length || 0) * 20, 100);
  const streakPct = Math.min(((profile?.streak || 0) / 30) * 100, 100);

  // Debounced feed — won't interrupt scroll
  useEffect(() => {
    const q = query(collection(db, 'activity'), orderBy('timestamp', 'desc'), limit(6));
    const unsub = onSnapshot(q, snapshot => {
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        setFeed(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, 800);
    });
    return () => { unsub(); clearTimeout(scrollTimerRef.current); };
  }, []);

  const firstName = profile?.displayName?.split(' ')[0] || 'OPERATOR';
  const refillsLeft = profile?.streakRefillsLeft ?? 4;

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-secondary uppercase">Welcome back, {firstName}!</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-6xl tracking-tighter uppercase italic">
            Good to see you, <span className="text-gradient">{firstName}</span>.
          </h1>
          <p className="font-label text-slate-500 uppercase tracking-widest text-[10px] mt-2">Your learning journey</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel p-4 rounded-lg flex flex-col items-end border-l-4 border-primary min-w-[150px]">
            <span className="font-mono text-[10px] text-slate-500 uppercase">Your Location</span>
            <span className="font-headline font-black text-xl">{profile?.city || 'Global'}</span>
          </div>
          <div className="glass-panel p-4 rounded-lg flex flex-col items-end border-l-4 border-secondary min-w-[120px]">
            <span className="font-mono text-[10px] text-slate-500 uppercase">Level Badge</span>
            <span className="font-headline font-black text-xl text-secondary">{xpInfo.label}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Performance Card */}
            <div className="relative h-64 rounded-xl overflow-hidden border border-white/10 bg-surface-container-low p-8">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase">Your performance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-headline font-black">
                    <CountUpNumber value={accuracy} />
                  </span>
                  <span className="text-xl font-headline font-bold text-primary">%</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                  XP-based score. Earn more XP through swaps and practice!
                </p>
              </div>
            </div>

            {/* Daily Streak Card */}
            <div className="relative rounded-xl overflow-hidden border-2 border-secondary/40 bg-surface-container p-6 flex flex-col">
              <div className="flex flex-col h-full gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest text-secondary uppercase">Daily Streak</span>
                  <span className="material-symbols-outlined text-secondary">local_fire_department</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-headline font-black">
                    <CountUpNumber value={profile?.streak || 0} />
                  </span>
                  <span className="text-sm font-mono text-secondary">DAYS</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i < (profile?.streak % 7 || 0) ? 'bg-secondary' : 'bg-white/10'}`} />
                  ))}
                </div>
                <div className="mt-auto space-y-2">
                  <button
                    onClick={handleRefillStreak}
                    disabled={refilling || refillsLeft <= 0}
                    className={`w-full py-2 px-3 font-headline font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-colors ${refillsLeft <= 0
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                      : 'bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20'}`}
                  >
                    <span className="material-symbols-outlined text-sm">local_fire_department</span>
                    {refilling ? 'Refilling...' : 'Refill Streak (-150 XP)'}
                  </button>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[8px] text-slate-600 uppercase tracking-widest">Refills this week:</p>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full border ${i < refillsLeft ? 'bg-secondary border-secondary' : 'bg-transparent border-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                  {refillMsg && (
                    <p className={`text-[9px] font-mono text-center leading-relaxed ${refillMsg.includes('restored') || refillMsg.includes('🔥') ? 'text-secondary' : 'text-error'}`}>
                      {refillMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* XP Progress Card */}
            <div className="md:col-span-2 glass-panel p-8 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Your Level</span>
                <h3 className="text-3xl font-headline font-black text-gradient uppercase italic">{xpInfo.label}</h3>
              </div>
              <div className="flex-1 w-full max-w-md space-y-4">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest">
                  <span>Progress to {xpInfo.nextLabel}</span>
                  <span className="text-tertiary">{xpProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-center text-slate-500 font-mono tracking-tighter italic">
                  XP needed to level up: {xpInfo.xpNeededForNext - xpInfo.currentXpInLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Your Growth */}
          <div className="glass-panel p-8 rounded-xl border border-white/5 min-h-[320px] flex flex-col">
            <h4 className="font-headline font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">analytics</span>
              Your Growth
            </h4>
            {(profile?.teachSkills?.length || profile?.learnSkills?.length || profile?.streak) ? (
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                {[
                  { label: 'Skills you teach', pct: teachPct, color: 'bg-primary', textColor: 'text-primary' },
                  { label: 'Skills you want to learn', pct: learnPct, color: 'bg-secondary', textColor: 'text-secondary' },
                  { label: 'Daily streak progress', pct: streakPct, color: 'bg-tertiary', textColor: 'text-tertiary' },
                ].map(bar => (
                  <div key={bar.label} className="space-y-2">
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                      <span>{bar.label}</span>
                      <span className={bar.textColor}>{bar.pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Add your skills in Profile to track your growth!</p>
                <button onClick={() => navigate('/profile')} className="px-6 py-2 bg-white/5 border border-white/10 font-headline text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Go to Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <aside className="space-y-8">
          <div className="glass-panel p-6 rounded-xl border border-white/5 min-h-[600px] flex flex-col">
            <h3 className="font-headline font-black text-sm uppercase tracking-widest mb-6 flex justify-between items-center">
              <span>Live Activity</span>
              <span className="material-symbols-outlined text-sm text-secondary">sync</span>
            </h3>
            <div className="space-y-4 flex-1">
              {feed.length === 0 ? (
                <div className="space-y-4">
                  {[
                    { icon: '🔥', text: 'This is where live activity appears' },
                    { icon: '📍', text: 'When someone completes a swap it shows here' },
                    { icon: '🤝', text: 'Invite friends to start seeing activity!' }
                  ].map((sample, idx) => (
                    <div key={idx} className="relative flex gap-4 p-3 rounded-lg border border-white/5 opacity-50">
                      <div className="absolute top-1 right-2 font-mono text-[7px] text-slate-600 uppercase">Sample</div>
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest border border-white/10 flex items-center justify-center text-lg shrink-0">
                        {sample.icon}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight flex-1 flex items-center">{sample.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                feed.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest border border-white/10 flex items-center justify-center font-black text-xs text-primary shrink-0">
                      {item.userName?.charAt(0) || '?'}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-xs font-headline font-bold truncate">
                        {item.userName} <span className="font-normal text-slate-500">({item.userCity || 'Global'})</span>
                      </p>
                      <p className="text-[10px] text-slate-400 capitalize">{item.action}</p>
                      <p className="text-[9px] font-mono text-primary/60">
                        {item.timestamp?.toDate
                          ? new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Syncing...'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate('/swaps')}
              className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 text-[10px] font-headline font-bold uppercase tracking-widest rounded-sm transition-colors border-t-2 border-t-primary"
            >
              View Activity History
            </button>
          </div>

          {/* Daily Challenge Card */}
          {challengeState !== 'dismissed' && (
            <div className={`relative overflow-hidden p-6 rounded-xl border ${challengeState === 'accepted' ? 'bg-primary/10 border-primary/40' : 'bg-surface-container border-white/10'}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-headline font-bold text-sm tracking-tight">Today's Challenge</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-headline font-black uppercase italic">Complete one skill swap today!</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Reward: Earn 2x coins 🔥</p>
                </div>
                {challengeState === 'accepted' ? (
                  <div className="pt-2">
                    <p className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-1">Challenge Accepted!</p>
                    <p className="font-headline font-black text-2xl tracking-tighter italic">{timeLeft}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => handleChallengeAction('accepted')} className="py-2 bg-primary text-on-primary-fixed font-headline font-black text-[10px] uppercase tracking-widest transition-colors">
                      Accept
                    </button>
                    <button onClick={() => handleChallengeAction('dismissed')} className="py-2 bg-white/5 border border-white/10 text-slate-400 font-headline font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
