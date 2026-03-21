import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { HiTrendingUp } from 'react-icons/hi';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import CountUpNumber from '../components/CountUpNumber';

const AVATAR_COLORS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < (name?.length || 0); i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('xp', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(data);

        // Find current user's rank
        const rank = data.findIndex(u => u.uid === user?.uid);
        if (rank !== -1) {
          setMyRank(rank + 1);
          // Only confetti if user is in top 3
          if (rank < 3) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          }
        }
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const getRankStyle = (rank) => {
    if (rank === 0) return { bg: 'from-yellow-500/20 to-yellow-600/5', border: 'border-yellow-500/30', medal: '🥇' };
    if (rank === 1) return { bg: 'from-gray-300/20 to-gray-400/5', border: 'border-gray-400/30', medal: '🥈' };
    if (rank === 2) return { bg: 'from-amber-700/20 to-amber-800/5', border: 'border-amber-600/30', medal: '🥉' };
    return { bg: 'from-white/5 to-white/0', border: 'border-white/10', medal: `#${rank + 1}` };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <PageTransition className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xs">leaderboard</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Rankings</span>
          </div>
          <h1 className="font-headline font-black text-3xl uppercase italic tracking-tighter">Leaderboard</h1>
        </div>
        <div className="glass-panel p-16 rounded-2xl border border-white/5 text-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-slate-700">leaderboard</span>
          <p className="font-headline font-black text-xl uppercase text-slate-400">No players yet!</p>
          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">
            Complete swaps and practice to earn XP and appear here!
          </p>
        </div>
      </PageTransition>
    );
  }

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <PageTransition className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xs">leaderboard</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Rankings</span>
          </div>
          <h1 className="font-headline font-black text-3xl uppercase italic tracking-tighter">Leaderboard</h1>
          <p className="text-slate-400 mt-1 font-body text-sm">Top skill swappers ranked by XP</p>
        </div>

        {/* My Rank Badge */}
        {myRank && (
          <div className="glass-panel px-6 py-3 rounded-xl border border-primary/20 text-center">
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Your Rank</p>
            <p className="font-headline font-black text-3xl text-primary">#{myRank}</p>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map(idx => {
            const u = top3[idx];
            if (!u) return <div key={idx} />;
            const isFirst = idx === 0;
            const isCurrentUser = u.uid === user?.uid;
            const medals = ['🥇', '🥈', '🥉'];

            return (
              <motion.div
                key={u.id}
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -5 }}
                className={`glass-panel p-6 rounded-2xl text-center border transition-all ${isFirst
                    ? 'border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)] -mt-4'
                    : isCurrentUser
                      ? 'border-primary/30'
                      : 'border-white/5'
                  }`}
              >
                <div className="text-4xl mb-3">{medals[idx]}</div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 overflow-hidden"
                  style={{ background: u.photoURL ? 'transparent' : getAvatarColor(u.displayName) }}
                >
                  {u.photoURL
                    ? <img src={u.photoURL} className="w-full h-full object-cover rounded-2xl" alt={u.displayName} />
                    : u.displayName?.charAt(0)?.toUpperCase()
                  }
                </div>
                <h3 className="font-headline font-black text-sm uppercase truncate">
                  {u.displayName}
                  {isCurrentUser && <span className="text-primary"> (You)</span>}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{u.city || 'Global'}</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <HiTrendingUp className="text-primary" size={14} />
                  <span className="text-primary font-headline font-black">
                    <CountUpNumber value={u.xp || 0} /> XP
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-slate-500">
                  <span>🔥 {u.streak || 0}</span>
                  <span>🪙 {u.coins || 0}</span>
                </div>
                {/* Level badge */}
                <div className="mt-3">
                  <span className="px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[9px] uppercase rounded-full">
                    {u.level || 'Beginner'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full List (4th onwards) */}
      {rest.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">All Rankings</h3>
          {users.map((u, i) => {
            const rank = getRankStyle(i);
            const isCurrentUser = u.uid === user?.uid;

            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-panel p-4 rounded-xl flex items-center gap-4 bg-gradient-to-r ${rank.bg} border ${isCurrentUser ? 'border-primary/40 shadow-[0_0_15px_rgba(133,173,255,0.1)]' : rank.border
                  } hover:scale-[1.01] transition-all`}
              >
                {/* Rank */}
                <div className="w-10 text-center shrink-0">
                  <span className={`text-lg font-headline font-black ${i < 3 ? '' : 'text-slate-500'}`}>
                    {rank.medal}
                  </span>
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black overflow-hidden"
                    style={{ background: u.photoURL ? 'transparent' : getAvatarColor(u.displayName) }}
                  >
                    {u.photoURL
                      ? <img src={u.photoURL} className="w-full h-full object-cover" alt={u.displayName} />
                      : u.displayName?.charAt(0)?.toUpperCase()
                    }
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-white truncate uppercase text-sm">
                    {u.displayName}
                    {isCurrentUser && (
                      <span className="ml-2 text-[10px] text-primary font-mono normal-case">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {u.level || 'Beginner'} • {u.city || 'Global'}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm shrink-0">
                  <div className="text-center">
                    <p className="font-headline font-black text-primary">
                      ⚡ <CountUpNumber value={u.xp || 0} />
                    </p>
                    <p className="font-mono text-[8px] text-slate-600 uppercase">XP</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="font-headline font-black text-slate-300">🔥 {u.streak || 0}</p>
                    <p className="font-mono text-[8px] text-slate-600 uppercase">Streak</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="font-headline font-black text-secondary">🪙 {u.coins || 0}</p>
                    <p className="font-mono text-[8px] text-slate-600 uppercase">Coins</p>
                  </div>
                  {/* Badges */}
                  {u.badges?.length > 0 && (
                    <div className="hidden lg:flex gap-1">
                      {u.badges.slice(0, 3).map((b, bi) => (
                        <span key={bi} className="text-base" title={b.name}>
                          {b.icon || '🏅'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom message */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center space-y-2">
        <p className="font-headline font-black text-sm uppercase text-slate-400">
          Want to climb the ranks? 🚀
        </p>
        <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
          Complete swaps → earn XP → level up → dominate the leaderboard!
        </p>
      </div>
    </PageTransition>
  );
}