import { useAuth } from '../contexts/AuthContext';
import { HiPencil, HiShare } from 'react-icons/hi';

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
    label: next.label,
    current: xp - current.min,
    next: current.max - current.min,
  };
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name?.length || 0); i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function ProfilePage() {
  const { profile } = useAuth();
  const xpInfo = getLevelInfo(profile?.xp || 0);
  const xpProgress = Math.min(((xpInfo.current / xpInfo.next) * 100).toFixed(0), 100);

  return (
    <div className="space-y-6 fade-in">
      {/* Profile Header */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-neon-purple/5" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="avatar"
                className="w-24 h-24 rounded-3xl ring-4 ring-electric/20 object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-4xl font-bold ring-4 ring-electric/20"
                style={{ background: getAvatarColor(profile?.displayName || 'U') }}>
                {profile?.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-neon-green flex items-center justify-center text-white text-sm">✓</div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold text-white">{profile?.displayName || 'User'}</h1>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-electric/20 text-electric border border-electric/30">
                {profile?.level || 'Beginner'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{profile?.email}</p>
            {profile?.city && <p className="text-gray-500 text-xs mt-1">📍 {profile.city}</p>}

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
                <p className="text-xl font-bold text-white">🏆 {profile?.badges?.length || 0}</p>
                <p className="text-xs text-gray-500">Badges</p>
              </div>
            </div>
          </div>

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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Skills</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Teaching</p>
              <div className="flex flex-wrap gap-2">
                {(profile?.teachSkills || []).length > 0
                  ? profile.teachSkills.map(s => <span key={s} className="tag-green">{s}</span>)
                  : <p className="text-xs text-gray-600">No skills added yet</p>}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Learning</p>
              <div className="flex flex-wrap gap-2">
                {(profile?.learnSkills || []).length > 0
                  ? profile.learnSkills.map(s => <span key={s} className="tag-blue">{s}</span>)
                  : <p className="text-xs text-gray-600">No skills added yet</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Badges Earned</h3>
          {(profile?.badges || []).length === 0
            ? <p className="text-sm text-gray-500">No badges yet. Start swapping!</p>
            : (
              <div className="grid grid-cols-3 gap-3">
                {profile.badges.map((badge, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                    <span className="text-2xl block mb-1">{badge.icon || '🏅'}</span>
                    <p className="text-xs font-semibold text-white">{badge.name || badge}</p>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Swap History */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Swap History</h3>
        {(profile?.swapHistory || []).length === 0
          ? <p className="text-sm text-gray-500">No swaps yet. Go explore and request your first swap!</p>
          : (
            <div className="space-y-3">
              {profile.swapHistory.map((swap, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: getAvatarColor(swap.partner) }}>
                    {swap.partner?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{swap.partner}</p>
                    <p className="text-xs text-gray-500">
                      <span className="tag-green text-[10px] mr-1">{swap.gave}</span>→
                      <span className="tag-blue text-[10px] ml-1">{swap.got}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-neon-green font-medium">+{swap.xp} XP</p>
                    <p className="text-[10px] text-gray-600">{swap.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Portfolio */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Mini Project Portfolio</h3>
        {(profile?.portfolio || []).length === 0
          ? <p className="text-sm text-gray-500">No projects yet. Complete a Practice Zone mini project!</p>
          : (
            <div className="grid sm:grid-cols-3 gap-3">
              {profile.portfolio.map((p, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <div className="w-full h-24 rounded-lg bg-navy-800 flex items-center justify-center text-3xl mb-3">📸</div>
                  <h4 className="text-sm font-semibold text-white">{p.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{p.skill} • {p.date}</p>
                  <p className="text-xs text-neon-green mt-1">+{p.xp} XP</p>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}