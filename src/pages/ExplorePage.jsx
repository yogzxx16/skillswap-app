import { useState, useEffect } from 'react';
import { collection, getDocs, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { HiSearch, HiSwitchHorizontal } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrGetChat } from '../services/chatService';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

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

export default function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [requestedUsers, setRequestedUsers] = useState(() => {
    const saved = localStorage.getItem('skillswap_requested');
    return saved ? JSON.parse(saved) : [];
  });
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'));
        const snapshot = await getDocs(q);
        const allUsers = snapshot.docs
          .map(doc => ({ uid: doc.id, ...doc.data() }))
          .filter(u => u.uid !== user?.uid);
        setUsers(allUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const filtered = users.filter(u => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.displayName?.toLowerCase().includes(s) ||
      u.teachSkills?.some(sk => sk.toLowerCase().includes(s)) ||
      u.learnSkills?.some(sk => sk.toLowerCase().includes(s))
    );
  });

  const handleRequest = async (targetUser) => {
    setRequestedUsers(prev => {
      const updated = [...prev, targetUser.uid];
      localStorage.setItem('skillswap_requested', JSON.stringify(updated));
      return updated;
    });

    try {
      await addDoc(collection(db, 'swapRequests'), {
        fromUid: user.uid,
        fromName: profile?.displayName || user.displayName,
        toUid: targetUser.uid,
        toName: targetUser.displayName,
        offeredSkill: profile?.teachSkills?.[0] || 'my skills',
        wantedSkill: targetUser.teachSkills?.[0] || 'their skills',
        message: `Hi! I'd like to swap my ${profile?.teachSkills?.[0] || 'skills'} for your ${targetUser.teachSkills?.[0] || 'skills'}. Interested?`,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      await createOrGetChat(
        user,
        targetUser,
        `Hi! I'd like to swap my ${profile?.teachSkills?.[0] || 'skills'} for your ${targetUser.teachSkills?.[0] || 'skills'}. Interested?`
      );
      navigate('/chat');
    } catch (error) {
      console.error('Error creating swap request:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Finding skill swappers near you...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-6">
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
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills or people..."
            className="w-full bg-navy-800 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-electric transition-colors text-sm"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {filtered.length} skill provider{filtered.length !== 1 ? 's' : ''} found
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-400">
            {users.length === 0
              ? 'No other users yet! Share the app and invite friends.'
              : 'No results found. Try a different search term.'}
          </p>
        </div>
      ) : (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map(u => {
            const isRequested = requestedUsers.includes(u.uid);
            return (
              <motion.div
                key={u.uid}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                }}
                whileHover={{ y: -8, boxShadow: '0 0 20px rgba(59,130,246,0.5)' }}
                className="glass-card p-5 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt={u.displayName}
                        className="w-14 h-14 rounded-2xl object-cover" />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                        style={{ background: getAvatarColor(u.displayName) }}
                      >
                        {u.displayName?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white truncate">{u.displayName}</h3>
                    <p className="text-xs text-gray-500">{u.city || 'Unknown city'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-electric font-medium">{u.level || 'Beginner'}</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-400">⚡ {u.xp || 0} XP</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-400">🪙 {u.coins || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Can teach:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(u.teachSkills || []).length > 0
                        ? u.teachSkills.map(s => (
                          <span key={s} className="tag-green text-[11px]">{s}</span>
                        ))
                        : <span className="text-xs text-gray-600">No skills listed</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Wants to learn:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(u.learnSkills || []).length > 0
                        ? u.learnSkills.map(s => (
                          <span key={s} className="tag-blue text-[11px]">{s}</span>
                        ))
                        : <span className="text-xs text-gray-600">No skills listed</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <span className="text-sm text-gray-400">🔥 {u.streak || 0} day streak</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRequest(u)}
                    disabled={isRequested}
                    className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer border-none ${isRequested
                        ? 'bg-neon-green/20 text-neon-green'
                        : 'bg-electric/20 text-electric hover:bg-electric/30'
                      }`}
                  >
                    <HiSwitchHorizontal size={16} />
                    {isRequested ? 'Requested' : 'Request Swap'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </PageTransition>
  );
}