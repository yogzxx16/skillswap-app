import { useState } from 'react';
import { DEMO_USERS_LIST, getAvatarColor, getLevelFromXP } from '../data/demoData';
import { HiSearch, HiStar, HiSwitchHorizontal } from 'react-icons/hi';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [requestedUsers, setRequestedUsers] = useState([]);

  const filtered = DEMO_USERS_LIST.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(s) ||
      u.teachSkills.some(sk => sk.toLowerCase().includes(s)) ||
      u.learnSkills.some(sk => sk.toLowerCase().includes(s))
    );
  });

  const handleRequest = (uid) => {
    setRequestedUsers(prev => [...prev, uid]);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Explore Skills</h1>
          <p className="text-gray-400 mt-1">Find your perfect skill exchange partner</p>
        </div>
        <div className="relative w-full sm:w-72">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills or people..."
            className="w-full bg-navy-800 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-electric transition-colors text-sm"
          />
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">{filtered.length} skill providers found</p>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(user => {
          const isRequested = requestedUsers.includes(user.uid);
          return (
            <div key={user.uid} className="glass-card p-5 hover:border-electric/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col">
              {/* User Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                    style={{ background: getAvatarColor(user.displayName) }}
                  >
                    {user.displayName.charAt(0)}
                  </div>
                  {user.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-neon-green rounded-full border-2 border-navy-900" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white truncate">{user.displayName}</h3>
                  <p className="text-xs text-gray-500">{user.city}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-electric font-medium">{user.level}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-400">⚡ {user.xp} XP</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-400">🪙 {user.coins}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Can teach:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.teachSkills.map(s => <span key={s} className="tag-green text-[11px]">{s}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Wants to learn:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.learnSkills.map(s => <span key={s} className="tag-blue text-[11px]">{s}</span>)}
                  </div>
                </div>
              </div>

              {/* Streak + Request Button */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-sm text-gray-400">🔥 {user.streak} day streak</span>
                <button
                  onClick={() => handleRequest(user.uid)}
                  disabled={isRequested}
                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer border-none ${
                    isRequested
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-electric/20 text-electric hover:bg-electric/30'
                  }`}
                >
                  <HiSwitchHorizontal size={16} />
                  {isRequested ? 'Requested' : 'Request Swap'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-400">No skill providers found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
