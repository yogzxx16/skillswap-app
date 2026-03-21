import { useState, useEffect } from 'react';
import { collection, getDocs, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrGetChat } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { notifyNewSwapRequest } from '../services/notificationService';

export default function ExplorePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
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
    if (requestedUsers.includes(targetUser.uid)) return;

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
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      // Notify the target user (only works if they're on the page)
      notifyNewSwapRequest(
        profile?.displayName,
        profile?.teachSkills?.[0] || 'skills'
      );

      await createOrGetChat(
        user,
        targetUser,

      );
      navigate('/swaps');
      setToast(`Swap request sent to ${targetUser.displayName}! ✅`);
      setTimeout(() => setToast(''), 3000);
    } catch (error) {
      console.error('Error creating swap request:', error);
    }
  };

  const perfectMatch = filtered.length > 0 ? filtered[0] : null;
  const otherUsers = filtered.slice(1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-headline font-bold text-slate-500 uppercase tracking-widest text-xs animate-pulse">Loading Skills...</p>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-12 pb-20">
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary-fixed px-6 py-3 font-headline font-black uppercase tracking-widest text-xs rounded-full shadow-2xl">
          {toast}
        </div>
      )}
      {/* Header & Search */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">filter_alt</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Explore</span>
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter uppercase italic">Explore Skills</h1>
          <p className="font-label text-slate-500 uppercase tracking-widest text-[10px]">{users.length} skill providers found</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by skill or name"
            className="w-full h-14 bg-surface-container-high border-b-2 border-slate-800 focus:border-primary px-12 font-mono text-xs uppercase tracking-widest text-on-surface placeholder:text-slate-600 focus:outline-none transition-all"
          />
        </div>
      </section>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-surface-container-low rounded-xl border border-white/5"
          >
            <span className="material-symbols-outlined text-6xl text-slate-800 mb-4 italic">error</span>
            <p className="font-headline font-black text-xl text-slate-600 uppercase tracking-tighter">No skills found</p>
            <button onClick={() => setSearch('')} className="mt-4 text-primary font-mono text-[10px] tracking-widest uppercase hover:underline">Clear Search</button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Perfect Match Hero */}
            {perfectMatch && !search && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden group rounded-2xl border-2 border-primary/40 shadow-[0_0_50px_rgba(133,173,255,0.2)] bg-surface-container-low p-1 mx-1"
              >
                <div className="absolute top-0 right-0 p-12 material-symbols-outlined text-primary/5 text-[240px] rotate-12 pointer-events-none">auto_awesome</div>
                <div className="relative glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                  <div className="relative shrink-0">
                    <div className="w-48 h-48 rounded-full border-4 border-primary p-2 relative group">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-[spin_10s_linear_infinite]"></div>
                      <img
                        src={perfectMatch.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(perfectMatch.displayName)}&background=random`}
                        className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        alt={perfectMatch.displayName}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary-fixed px-3 py-1 text-[8px] font-black uppercase tracking-tighter skew-x-[-12deg]">98% Match</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-2">
                      <h2 className="text-4xl md:text-5xl font-headline font-black tracking-tighter uppercase italic">{perfectMatch.displayName}</h2>
                      <p className="font-mono text-xs text-primary tracking-[0.2em] uppercase">{perfectMatch.rank || 'Beginner'} • {perfectMatch.city || 'Global'}</p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="space-y-2">
                        <p className="font-label text-slate-500 uppercase tracking-widest text-[8px]">Teaching</p>
                        <div className="flex gap-2">
                          {perfectMatch.teachSkills?.slice(0, 3).map(s => (
                            <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold uppercase rounded-sm">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-label text-slate-500 uppercase tracking-widest text-[8px]">Learning</p>
                        <div className="flex gap-2">
                          {perfectMatch.learnSkills?.slice(0, 3).map(s => (
                            <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold uppercase rounded-sm text-secondary">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleRequest(perfectMatch)}
                        disabled={requestedUsers.includes(perfectMatch.uid)}
                        className="px-10 py-4 bg-primary text-on-primary-fixed font-headline font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale no-underline text-center"
                      >
                        {requestedUsers.includes(perfectMatch.uid) ? 'Requested' : 'Request Swap'}
                      </button>
                      <button onClick={() => navigate(`/profile/${perfectMatch.uid}`)} className="px-10 py-4 glass-panel border border-white/10 font-headline font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all text-center no-underline">View Profile</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Global Discovery Grid */}
            <div className="space-y-8">
              <h3 className="font-headline font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4">
                Available Swappers
                <div className="h-px flex-1 bg-white/10"></div>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(search ? filtered : otherUsers).map((u, i) => {
                  const isRequested = requestedUsers.includes(u.uid);

                  return (
                    <motion.div
                      key={u.uid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="tilt-card glass-panel group p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col"
                      onClick={() => navigate(`/profile/${u.uid}`)}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                          <img
                            src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName)}&background=random`}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                            alt={u.displayName}
                          />
                        </div>
                        <div className={`px-2 py-1 border rounded-xs text-[8px] font-black uppercase tracking-tighter ${u.xp >= 3000 ? 'text-secondary border-secondary' : u.xp >= 1500 ? 'text-primary border-primary' : 'text-tertiary border-tertiary'}`}>
                          {u.rank || (u.xp >= 3000 ? 'Master' : u.xp >= 1500 ? 'Expert' : u.xp >= 500 ? 'Intermediate' : 'Beginner')}
                        </div>
                      </div>

                      <div className="space-y-4 flex-1">
                        <div>
                          <h4 className="font-headline font-black text-xl uppercase tracking-tight group-hover:text-primary transition-colors">{u.displayName}</h4>
                          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{u.city || 'Global'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                          <div className="space-y-1">
                            <p className="font-label text-slate-500 text-[8px] uppercase tracking-widest leading-none">Can teach</p>
                            <p className="text-[10px] font-bold truncate leading-tight">{u.teachSkills?.[0] || 'N/A'}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="font-label text-slate-500 text-[8px] uppercase tracking-widest leading-none">Wants</p>
                            <p className="text-[10px] font-bold truncate leading-tight text-secondary">{u.learnSkills?.[0] || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleRequest(u); }}
                        disabled={isRequested}
                        className="mt-6 w-full py-3 bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary-fixed font-headline font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                      >
                        {isRequested ? 'Requested' : 'Request Swap'}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>

  );
}