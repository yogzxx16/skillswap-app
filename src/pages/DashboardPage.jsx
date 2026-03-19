import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { HiTrendingUp, HiGift, HiCheckCircle } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import CountUpNumber from '../components/CountUpNumber';
import PageTransition from '../components/PageTransition';

export default function DashboardPage() {
  const { profile, updateProfile } = useAuth();
  const [feed, setFeed] = useState([]);
  const [showChallenge, setShowChallenge] = useState(
    () => localStorage.getItem('skillswap_challenge_dismissed') !== 'true'
  );
  const [challengeAccepted, setChallengeAccepted] = useState(
    () => localStorage.getItem('skillswap_challenge_accepted') === 'true'
  );
  const [timeLeft, setTimeLeft] = useState('');

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
    return { label: next.label, current: xp - current.min, next: current.max - current.min };
  }

  const xpInfo = getLevelInfo(profile?.xp || 0);
  const xpProgress = Math.min(((xpInfo.current / xpInfo.next) * 100).toFixed(0), 100);

  // Real-time activity feed from Firestore
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

  // Countdown timer
  useEffect(() => {
    if (!challengeAccepted) return;
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [challengeAccepted]);

  const handleDismiss = () => {
    setShowChallenge(false);
    localStorage.setItem('skillswap_challenge_dismissed', 'true');
  };

  const handleAccept = () => {
    setChallengeAccepted(true);
    localStorage.setItem('skillswap_challenge_accepted', 'true');
    if (updateProfile) updateProfile({ coins: (profile?.coins || 0) + 50 });
  };

  const firstName = profile?.displayName?.split(' ')[0] || 'there';

  return (
    <PageTransition className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {profile?.photoURL ? (
          <img src={profile.photoURL} alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-electric shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-electric bg-navy-800 shrink-0">
            {profile?.displayName?.charAt(0) || 'U'}
          </div>
        )}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's your skill journey overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}
          className="glass-card p-5 hover:border-neon-orange/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🔥</span>
            <span className="text-xs text-neon-orange bg-neon-orange/10 px-2 py-1 rounded-full">Daily</span>
          </div>
          <p className="text-3xl font-bold text-white"><CountUpNumber value={profile?.streak || 0} /></p>
          <p className="text-sm text-gray-400 mt-1">Day Streak</p>
        </motion.div>

        <div className="glass-card p-5 hover:border-neon-green/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🪙</span>
            <span className="text-xs text-neon-green bg-neon-green/10 px-2 py-1 rounded-full">+50</span>
          </div>
          <p className="text-3xl font-bold text-white"><CountUpNumber value={profile?.coins || 0} /></p>
          <p className="text-sm text-gray-400 mt-1">SkillCoins</p>
        </div>

        <div className="glass-card p-5 hover:border-electric/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">⚡</span>
            <HiTrendingUp className="text-electric" size={18} />
          </div>
          <p className="text-3xl font-bold text-white"><CountUpNumber value={profile?.xp || 0} /></p>
          <p className="text-sm text-gray-400 mt-1">Total XP</p>
        </div>

        <div className="glass-card p-5 hover:border-neon-purple/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🏆</span>
            <span className="text-xs text-neon-purple bg-neon-purple/10 px-2 py-1 rounded-full">
              {profile?.level || 'Beginner'}
            </span>
          </div>
          <p className="text-3xl font-bold text-white"><CountUpNumber value={profile?.badges?.length || 0} /></p>
          <p className="text-sm text-gray-400 mt-1">Badges</p>
        </div>
      </div>

      {/* XP Progress */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Level Progress</h3>
            <p className="text-xs text-gray-400">{profile?.level || 'Beginner'} → {xpInfo.label}</p>
          </div>
          <span className="text-sm font-bold text-electric">{xpProgress}%</span>
        </div>
        <div className="w-full h-3 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-electric to-neon-purple rounded-full transition-all duration-1000"
            style={{ width: `${xpProgress}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">{xpInfo.current} / {xpInfo.next} XP to {xpInfo.label}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Daily Challenge */}
        <AnimatePresence>
          {showChallenge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`glass-card p-6 flex flex-col ${challengeAccepted ? 'border-neon-green/30' : 'border-neon-orange/20'}`}
            >
              <div className="flex items-center gap-2 mb-3">
                {challengeAccepted
                  ? <HiCheckCircle className="text-neon-green" size={24} />
                  : <HiGift className="text-neon-orange" size={24} />}
                <h3 className={`text-sm font-semibold ${challengeAccepted ? 'text-neon-green' : 'text-neon-orange'}`}>
                  Daily Challenge
                </h3>
                {!challengeAccepted && (
                  <span className="text-xs bg-neon-orange/20 text-neon-orange px-2 py-0.5 rounded-full ml-auto">2x Coins</span>
                )}
              </div>

              {challengeAccepted ? (
                <div className="flex flex-col gap-3">
                  <p className="text-white font-medium text-lg">Challenge Accepted! 🎉</p>
                  <p className="text-sm text-gray-300">Complete a swap today for 2x coins 🔥</p>
                  <p className="text-sm text-neon-green font-medium">+50 bonus coins added!</p>
                  <div className="p-4 bg-navy-900/50 rounded-xl border border-white/5 text-center">
                    <p className="text-xs text-gray-500 mb-1">Time Remaining</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-wider">{timeLeft}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-white font-medium text-lg">Complete one swap today!</p>
                  <p className="text-sm text-gray-400">Finish a skill exchange to earn double SkillCoins today.</p>
                  <div className="flex gap-3 mt-2">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleAccept}
                      className="btn-primary text-sm py-3 px-5 flex-1 border-none cursor-pointer">
                      Accept Challenge
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleDismiss}
                      className="text-sm text-gray-400 bg-navy-800/50 border border-white/5 cursor-pointer py-3 px-5 rounded-xl">
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Activity Feed — REAL from Firestore */}
        <div className={`glass-card p-6 flex flex-col ${!showChallenge ? 'lg:col-span-2' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Live Activity</h3>
          </div>

          {feed.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center">
                No activity yet!<br />Be the first to complete a swap 🔥
              </p>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              <AnimatePresence initial={false}>
                {feed.map(item => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric/30 to-neon-purple/30 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {item.userName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold text-white">{item.userName}</span>{' '}
                        {item.userCity && <span className="text-gray-500">({item.userCity})</span>}{' '}
                        {item.action}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.timestamp?.toDate
                          ? new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Just now'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="pt-4 mt-2 border-t border-white/5 text-center">
            <button className="text-xs text-electric bg-transparent border-none cursor-pointer">
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Your Skills */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Your Skills</h3>
        {(profile?.teachSkills?.length || 0) + (profile?.learnSkills?.length || 0) === 0 ? (
          <p className="text-sm text-gray-500">No skills added yet. <a href="/onboarding" className="text-electric">Complete your profile →</a></p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile?.teachSkills || []).map(s => <span key={s} className="tag-green">{s}</span>)}
            {(profile?.learnSkills || []).map(s => <span key={s} className="tag-blue">{s}</span>)}
          </div>
        )}
      </div>
    </PageTransition>
  );
}