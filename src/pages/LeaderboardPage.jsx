import { DEMO_USERS_LIST, getAvatarColor, BADGES } from '../data/demoData';
import { HiTrendingUp } from 'react-icons/hi';

export default function LeaderboardPage() {
  const sorted = [...DEMO_USERS_LIST].sort((a, b) => b.xp - a.xp).slice(0, 10);

  const getRankStyle = (rank) => {
    if (rank === 0) return { bg: 'from-yellow-500/20 to-yellow-600/5', border: 'border-yellow-500/30', medal: '🥇' };
    if (rank === 1) return { bg: 'from-gray-300/20 to-gray-400/5', border: 'border-gray-400/30', medal: '🥈' };
    if (rank === 2) return { bg: 'from-amber-700/20 to-amber-800/5', border: 'border-amber-600/30', medal: '🥉' };
    return { bg: 'from-white/5 to-white/0', border: 'border-white/10', medal: `#${rank + 1}` };
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Leaderboard</h1>
        <p className="text-gray-400 mt-1">Top skill swappers this week</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[1, 0, 2].map(idx => {
          const user = sorted[idx];
          if (!user) return null;
          const isFirst = idx === 0;
          return (
            <div key={user.uid} className={`glass-card p-5 text-center ${isFirst ? 'glow-blue -mt-4' : ''} transition-all hover:-translate-y-1`}>
              <div className="text-3xl mb-3">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 ${isFirst ? 'ring-2 ring-yellow-500/50' : ''}`}
                style={{ background: getAvatarColor(user.displayName) }}
              >
                {user.displayName.charAt(0)}
              </div>
              <h3 className="font-semibold text-white text-sm truncate">{user.displayName}</h3>
              <p className="text-xs text-gray-500">{user.city}</p>
              <div className="mt-3 flex items-center justify-center gap-1">
                <HiTrendingUp className="text-electric" size={14} />
                <span className="text-electric font-bold">{user.xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
                <span>🔥 {user.streak}</span>
                <span>🪙 {user.coins}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="space-y-2">
        {sorted.map((user, i) => {
          const rank = getRankStyle(i);
          return (
            <div
              key={user.uid}
              className={`glass-card p-4 flex items-center gap-4 bg-gradient-to-r ${rank.bg} border ${rank.border} hover:scale-[1.01] transition-all`}
            >
              {/* Rank */}
              <div className="w-10 text-center shrink-0">
                <span className={`text-lg ${i < 3 ? '' : 'text-gray-500 font-medium'}`}>{rank.medal}</span>
              </div>

              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: getAvatarColor(user.displayName) }}
                >
                  {user.displayName.charAt(0)}
                </div>
                {user.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-navy-900" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                <p className="text-xs text-gray-500">{user.level} • {user.city}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm shrink-0">
                <span className="text-electric font-bold">⚡ {user.xp.toLocaleString()}</span>
                <span className="text-gray-400 hidden sm:inline">🔥 {user.streak}</span>
                <div className="hidden lg:flex gap-1">
                  {user.badges.slice(0, 3).map(b => (
                    <span key={b} title={BADGES[b]?.name} className="text-base">{BADGES[b]?.icon || '🏅'}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
