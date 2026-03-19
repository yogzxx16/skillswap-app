import { useAuth } from '../contexts/AuthContext';
import { getAvatarColor, BADGES, getXPForNextLevel, getLevelFromXP } from '../data/demoData';
import { HiPencil, HiShare, HiStar } from 'react-icons/hi';

export default function ProfilePage() {
  const { profile } = useAuth();
  const avatarColor = getAvatarColor(profile?.displayName || 'User');
  const xpInfo = getXPForNextLevel(profile?.xp || 0);
  const xpProgress = ((xpInfo.current / xpInfo.next) * 100).toFixed(0);

  const userBadges = (profile?.badges || []).map(b => BADGES[b]).filter(Boolean);

  const swapHistory = [
    { partner: 'Priya Sharma', gave: 'React', got: 'Guitar', date: 'Mar 15, 2026', xp: 100 },
    { partner: 'Marcus Chen', gave: 'Python', got: 'TypeScript', date: 'Mar 12, 2026', xp: 80 },
    { partner: 'Sofia Rodriguez', gave: 'JavaScript', got: 'Spanish', date: 'Mar 8, 2026', xp: 120 },
    { partner: 'Aiden Park', gave: 'React', got: 'Korean', date: 'Mar 4, 2026', xp: 90 },
  ];

  const portfolio = [
    { title: 'My First Guitar Chord', skill: 'Guitar', date: 'Mar 16', xp: 50 },
    { title: 'Spanish Conversation Recording', skill: 'Spanish', date: 'Mar 10', xp: 50 },
    { title: 'TypeScript Todo App', skill: 'TypeScript', date: 'Mar 13', xp: 50 },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Profile Header */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-neon-purple/5" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-4xl font-bold ring-4 ring-electric/20"
              style={{ background: avatarColor }}
            >
              {profile?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-neon-green flex items-center justify-center text-white text-sm">
              ✓
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold text-white">{profile?.displayName}</h1>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-electric/20 text-electric border border-electric/30">
                {profile?.level || 'Beginner'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{profile?.email}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-xl font-bold text-white">🔥 {profile?.streak || 0}</p>
                <p className="text-xs text-gray-500">Streak</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">🪙 {profile?.coins || 0}</p>
                <p className="text-xs text-gray-500">Coins</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">⚡ {profile?.xp || 0}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">🏆 {userBadges.length}</p>
                <p className="text-xs text-gray-500">Badges</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-1.5">
              <HiPencil size={14} /> Edit
            </button>
            <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-1.5">
              <HiShare size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Level Progress</h3>
            <p className="text-xs text-gray-400">{profile?.level} → {xpInfo.label}</p>
          </div>
          <span className="text-sm font-bold text-electric">{xpProgress}%</span>
        </div>
        <div className="w-full h-3 bg-navy-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-electric to-neon-purple rounded-full transition-all duration-1000" style={{ width: `${xpProgress}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">{xpInfo.current} / {xpInfo.next} XP to {xpInfo.label}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Skills</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Teaching</p>
              <div className="flex flex-wrap gap-2">
                {profile?.teachSkills?.map(s => <span key={s} className="tag-green">{s}</span>)}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Learning</p>
              <div className="flex flex-wrap gap-2">
                {profile?.learnSkills?.map(s => <span key={s} className="tag-blue">{s}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Badges Earned</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userBadges.map((badge, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-xs font-semibold text-white">{badge.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{badge.description}</p>
              </div>
            ))}
            {userBadges.length === 0 && <p className="text-sm text-gray-500 col-span-3">No badges earned yet. Start swapping!</p>}
          </div>
        </div>
      </div>

      {/* Swap History */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Swap History</h3>
        <div className="space-y-3">
          {swapHistory.map((swap, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                style={{ background: getAvatarColor(swap.partner) }}
              >
                {swap.partner.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{swap.partner}</p>
                <p className="text-xs text-gray-500">
                  <span className="tag-green text-[10px] mr-1">{swap.gave}</span> →{' '}
                  <span className="tag-blue text-[10px]">{swap.got}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-neon-green font-medium">+{swap.xp} XP</p>
                <p className="text-[10px] text-gray-600">{swap.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Project Portfolio */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Mini Project Portfolio</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {portfolio.map((p, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="w-full h-24 rounded-lg bg-navy-800 flex items-center justify-center text-3xl mb-3">📸</div>
              <h4 className="text-sm font-semibold text-white">{p.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{p.skill} • {p.date}</p>
              <p className="text-xs text-neon-green mt-1">+{p.xp} XP</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
