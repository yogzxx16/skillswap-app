import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import CountUpNumber from '../components/CountUpNumber';
import PageTransition from '../components/PageTransition';

export default function DashboardPage() {
  const { profile, refillStreak } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [refillMsg, setRefillMsg] = useState('');
  const [refilling, setRefilling] = useState(false);

  // Daily Challenge State
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

  // ✅ Streak Refill Handler
  const handleRefillStreak = async () => {
    if (refilling) return;
    setRefilling(true);
    const result = await refillStreak();
    setRefillMsg(result.reason);
    setTimeout(() => setRefillMsg(''), 5000);
    setRefilling(false);
  };

  // XP Progress
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

  // Real-time activity feed
  useEffect(() => {
    const q = query(
      collection(db, 'activity'),
      orderBy('timestamp', 'desc'),
      limit(6)
    );
    const unsub = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeed(items);
    });
    return () => unsub();
  }, []);

  const firstName = profile?.displayName?.split(' ')[0] || 'OPERATOR';
  const refillsLeft = profile?.streakRefillsLeft ?? 4;

  return (
    <PageTransition className="space-y-10">
      {/* Greeting */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-secondary rounded-full animate-ping"></span>
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
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Performance Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative group h-64 rounded-xl overflow-hidden border border-white/10 bg-surface-container-low p-8 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-4 material-symbols-outlined text-primary/20 text-8xl group-hover:text-primary/40 transition-colors">monitoring</div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase">Your performance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-headline font-black"><CountUpNumber value={profile?.accuracy || 94} /></span>
                  <span className="text-xl font-headline font-bold text-primary">%</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">Overall accuracy across all skill swaps this season.</p>
              </div>
            </motion.div>

            {/* ✅ Daily Streak Card with Refill Button */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative group rounded-xl overflow-hidden border-2 border-secondary/40 shadow-[0_0_30px_rgba(255,163,133,0.15)] bg-surface-container p-6 transition-all duration-300 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent"></div>
              <div className="relative z-10 flex flex-col h-full gap-3">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest text-secondary uppercase">Daily Streak</span>
                  <span className="material-symbols-outlined text-secondary animate-bounce">local_fire_department</span>
                </div>

                {/* Streak Number */}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-headline font-black">
                    <CountUpNumber value={profile?.streak || 0} />
                  </span>
                  <span className="text-sm font-mono text-secondary">DAYS</span>
                </div>

                {/* Weekly dots */}
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${i < (profile?.streak % 7 || 0) ? 'bg-secondary' : 'bg-white/10'}`}
                    />
                  ))}
                </div>

                {/* ✅ Refill Button */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={handleRefillStreak}
                    disabled={refilling || refillsLeft <= 0}
                    className={`w-full py-2 px-3 font-headline font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all ${refillsLeft <= 0
                        ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                        : 'bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 hover:scale-[1.02]'
                      }`}
                  >
                    <span className="material-symbols-outlined text-sm">local_fire_department</span>
                    {refilling ? 'Refilling...' : `Refill Streak (-150 XP)`}
                  </button>

                  {/* Refills left indicator */}
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[8px] text-slate-600 uppercase tracking-widest">
                      Refills this week:
                    </p>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full border ${i < refillsLeft
                              ? 'bg-secondary border-secondary'
                              : 'bg-transparent border-slate-700'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Refill message */}
                  {refillMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[9px] font-mono text-center leading-relaxed ${refillMsg.includes('restored') || refillMsg.includes('🔥')
                          ? 'text-secondary'
                          : 'text-error'
                        }`}
                    >
                      {refillMsg}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

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
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary shimmer-bar"
                  />
                </div>
                <p className="text-[10px] text-center text-slate-500 font-mono tracking-tighter italic">
                  XP needed to level up: {xpInfo.xpNeededForNext - xpInfo.currentXpInLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Your Growth */}
          <div className="glass-panel p-8 rounded-xl border border-white/5 min-h-[320px] relative overflow-hidden flex flex-col">
            <h4 className="font-headline font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">analytics</span>
              Your Growth
            </h4>

            {(profile?.teachSkills?.length || profile?.learnSkills?.length || profile?.streak) ? (
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                    <span>Skills you teach</span>
                    <span className="text-primary">{Math.min((profile?.teachSkills?.length || 0) * 20, 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((profile?.teachSkills?.length || 0) * 20, 100)}%` }} className="h-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                    <span>Skills you want to learn</span>
                    <span className="text-secondary">{Math.min((profile?.learnSkills?.length || 0) * 20, 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((profile?.learnSkills?.length || 0) * 20, 100)}%` }} className="h-full bg-secondary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                    <span>Daily streak progress</span>
                    <span className="text-tertiary">{Math.min(((profile?.streak || 0) / 30) * 100, 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(((profile?.streak || 0) / 30) * 100, 100)}%` }} className="h-full bg-tertiary" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Add your skills in Profile to track your growth!</p>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-2 bg-white/5 border border-white/10 font-headline text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Go to Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <aside className="space-y-8">
          <div className="glass-panel p-6 rounded-xl border border-white/5 h-full min-h-[600px] flex flex-col">
            <h3 className="font-headline font-black text-sm uppercase tracking-widest mb-6 flex justify-between items-center">
              <span>Live Activity</span>
              <span className="material-symbols-outlined text-sm text-secondary animate-spin">sync</span>
            </h3>

            <div className="space-y-6 flex-1">
              <AnimatePresence initial={false}>
                {feed.length === 0 ? (
                  <div className="space-y-4">
                    {[
                      { icon: '🔥', text: 'This is where live activity appears' },
                      { icon: '📍', text: 'When someone completes a swap near you, it shows up here in real time' },
                      { icon: '🤝', text: 'Invite friends to start seeing activity!' }
                    ].map((sample, idx) => (
                      <div key={idx} className="flex gap-4 p-3 rounded-lg border border-white/5 opacity-50">
                        <div className="absolute top-1 right-2 font-mono text-[7px] text-slate-600 uppercase tracking-widest">Sample</div>
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest border border-white/10 flex items-center justify-center text-lg grayscale shrink-0">
                          {sample.icon}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight flex-1 flex items-center">{sample.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  feed.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
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
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate('/swaps')}
              className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 text-[10px] font-headline font-bold uppercase tracking-widest rounded-sm transition-all border border-white/5 border-t-2 border-t-primary"
            >
              View Activity History
            </button>
          </div>

          {/* Daily Challenge Card */}
          <AnimatePresence>
            {challengeState !== 'dismissed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative overflow-hidden p-6 rounded-xl border transition-all duration-500 ${challengeState === 'accepted'
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-surface-container border-white/10'
                  }`}
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-headline font-bold text-sm tracking-tight">Today's Challenge</h4>
                    {challengeState === 'accepted' && (
                      <span className="material-symbols-outlined text-primary text-sm animate-pulse">timer</span>
                    )}
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
                      <button
                        onClick={() => handleChallengeAction('accepted')}
                        className="py-2 bg-primary text-on-primary-fixed font-headline font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleChallengeAction('dismissed')}
                        className="py-2 bg-white/5 border border-white/10 text-slate-400 font-headline font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </PageTransition>
  );
}