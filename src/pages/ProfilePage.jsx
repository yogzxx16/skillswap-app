import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HiPencil, HiShare, HiX, HiPlus, HiCheck } from 'react-icons/hi';

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

// ── Skill Tag Input ──────────────────────────────────────────
function SkillTagInput({ skills, onChange, color = 'green' }) {
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim();
    if (val && !skills.includes(val) && skills.length < 5) {
      onChange([...skills, val]);
      setInput('');
    }
  };

  const remove = (s) => onChange(skills.filter(x => x !== s));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map(s => (
          <span key={s}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${color === 'green' ? 'bg-neon-green/20 text-neon-green' : 'bg-electric/20 text-electric'
              }`}>
            {s}
            <button onClick={() => remove(s)}
              className="hover:opacity-70 bg-transparent border-none cursor-pointer p-0 leading-none">
              <HiX size={10} />
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <span className="text-xs text-gray-600">No skills added yet</span>
        )}
      </div>
      {skills.length < 5 && (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Type a skill + Enter"
            className="flex-1 bg-navy-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric"
          />
          <button onClick={add}
            className="bg-electric/20 text-electric border border-electric/30 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-electric/30 transition-colors">
            <HiPlus size={14} />
          </button>
        </div>
      )}
      <p className="text-[10px] text-gray-600 mt-1">{skills.length}/5 skills</p>
    </div>
  );
}

// ── Edit Modal ───────────────────────────────────────────────
function EditModal({ profile, onSave, onClose }) {
  const [city, setCity] = useState(profile?.city || '');
  const [teachSkills, setTeachSkills] = useState(profile?.teachSkills || []);
  const [learnSkills, setLearnSkills] = useState(profile?.learnSkills || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ city, teachSkills, learnSkills });
    setSaving(false);
    onClose();
  };

  return (
    <div
      style={{ minHeight: 400, background: 'rgba(0,0,0,0.7)' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1">
            <HiX size={20} />
          </button>
        </div>

        {/* City */}
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">Your city</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="e.g. Chennai, Mumbai..."
            className="w-full bg-navy-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric"
          />
        </div>

        {/* Skills I teach */}
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">
            Skills I can teach <span className="text-gray-600">(max 5)</span>
          </label>
          <SkillTagInput skills={teachSkills} onChange={setTeachSkills} color="green" />
        </div>

        {/* Skills I want */}
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">
            Skills I want to learn <span className="text-gray-600">(max 5)</span>
          </label>
          <SkillTagInput skills={learnSkills} onChange={setLearnSkills} color="blue" />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary py-3 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer border-none"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <><HiCheck size={16} /> Save changes</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Toast notification ───────────────────────────────────────
function Toast({ message, show }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neon-green/20 border border-neon-green/30 text-neon-green text-sm font-medium px-5 py-3 rounded-full backdrop-blur-sm">
      {message}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const xpInfo = getLevelInfo(profile?.xp || 0);
  const xpProgress = Math.min(((xpInfo.current / xpInfo.next) * 100).toFixed(0), 100);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSave = async (updates) => {
    await updateProfile(updates);
    showToast('✅ Profile saved successfully!');
  };

  const handleShare = () => {
    const link = `${window.location.origin}/profile/${profile?.uid}`;
    navigator.clipboard.writeText(link).then(() => {
      showToast('🔗 Profile link copied to clipboard!');
    }).catch(() => {
      // Fallback for browsers that block clipboard
      showToast(`🔗 Your link: /profile/${profile?.uid}`);
    });
  };

  return (
    <div className="space-y-6 fade-in">

      {/* Edit Modal */}
      {showEdit && (
        <EditModal
          profile={profile}
          onSave={handleSave}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Toast */}
      <Toast show={toast.show} message={toast.message} />

      {/* Profile Header */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-neon-purple/5" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar */}
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

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold text-white">{profile?.displayName || 'User'}</h1>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-electric/20 text-electric border border-electric/30">
                {profile?.level || 'Beginner'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{profile?.email}</p>
            {profile?.city
              ? <p className="text-gray-500 text-xs mt-1">📍 {profile.city}</p>
              : <button onClick={() => setShowEdit(true)}
                className="text-xs text-electric mt-1 bg-transparent border-none cursor-pointer hover:underline">
                + Add your city
              </button>
            }

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

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowEdit(true)}
              className="btn-secondary py-2 px-4 text-sm flex items-center gap-1.5 cursor-pointer">
              <HiPencil size={14} /> Edit
            </button>
            <button
              onClick={handleShare}
              className="btn-secondary py-2 px-4 text-sm flex items-center gap-1.5 cursor-pointer">
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Skills</h3>
            <button onClick={() => setShowEdit(true)}
              className="text-xs text-electric bg-transparent border-none cursor-pointer hover:underline">
              Edit skills
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Teaching</p>
              <div className="flex flex-wrap gap-2">
                {(profile?.teachSkills || []).length > 0
                  ? profile.teachSkills.map(s => <span key={s} className="tag-green">{s}</span>)
                  : <button onClick={() => setShowEdit(true)}
                    className="text-xs text-gray-600 bg-transparent border-none cursor-pointer hover:text-electric">
                    + Add skills you teach
                  </button>}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Learning</p>
              <div className="flex flex-wrap gap-2">
                {(profile?.learnSkills || []).length > 0
                  ? profile.learnSkills.map(s => <span key={s} className="tag-blue">{s}</span>)
                  : <button onClick={() => setShowEdit(true)}
                    className="text-xs text-gray-600 bg-transparent border-none cursor-pointer hover:text-electric">
                    + Add skills you want to learn
                  </button>}
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