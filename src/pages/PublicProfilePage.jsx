import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function PublicProfilePage() {
  const { uid } = useParams();
  const { user: currentUser, profile: currentProfile } = useAuth();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Badges');
  const [swapsCount, setSwapsCount] = useState(0);

  useEffect(() => {
    if (uid === currentUser?.uid) {
      navigate('/profile');
      return;
    }

    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setTargetUser(userDoc.data());
          
          // Fetch swap count
          const q = query(
            collection(db, 'swapRequests'),
            where('status', '==', 'accepted')
          );
          const snapshot = await getDocs(q);
          const count = snapshot.docs.filter(d => d.data().fromUid === uid || d.data().toUid === uid).length;
          setSwapsCount(count);
        } else {
          console.error('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid, currentUser, navigate]);

  const handleSendMessage = async () => {
    // Navigate to chat with this user
    navigate(`/chat?userId=${uid}`);
  };

  const handleRequestSwap = async () => {
    // Simple logic to create a request or just navigate to chat to discuss
    // For now, let's navigate to chat as it's the primary way to initiate
    navigate(`/chat?userId=${uid}&request=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-headline font-black uppercase italic">User Not Found</h2>
        <button onClick={() => navigate('/explore')} className="px-6 py-2 bg-white/5 border border-white/10 font-headline text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Back to Explore</button>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-12 pb-24 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      {/* Header */}
      <section className="relative flex flex-col lg:flex-row items-center lg:items-end gap-12 pt-12">
         <div className="relative shrink-0">
            <div className="w-64 h-64 rounded-xl border-2 border-primary/20 p-2 relative">
               <div className="w-full h-full bg-surface-container-highest rounded-lg overflow-hidden relative">
                  <img 
                    src={targetUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser.displayName || 'U')}&background=random&size=512`} 
                    className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 hover:grayscale-0 hover:brightness-100" 
                    alt="PROFILER"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
               </div>
               <div className="absolute -bottom-4 -left-4 bg-primary text-on-primary-fixed px-4 py-2 font-headline font-black uppercase italic tracking-tighter skew-x-[-15deg] shadow-[0_10px_20px_rgba(133,173,255,0.3)]">LVL: {targetUser.level || 1}</div>
            </div>
         </div>

         <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-2">
               <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter uppercase italic">{targetUser.displayName || 'USER'}</h1>
               <p className="font-mono text-xs text-primary tracking-[0.4em] uppercase">{targetUser.city || 'Global'}</p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
               <div className="space-y-1">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Accuracy</span>
                  <div className="flex items-baseline gap-2">
                     <span className="font-headline font-black text-3xl">{targetUser.streak || 0}</span>
                     <span className="text-primary font-headline font-bold text-xs uppercase">Day Streak</span>
                  </div>
               </div>
               <div className="w-px h-12 bg-white/5 hidden sm:block"></div>
               <div className="space-y-1">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Swaps Done</span>
                  <div className="flex items-baseline gap-2">
                     <span className="font-headline font-black text-3xl">{swapsCount}</span>
                     <span className="text-secondary font-headline font-bold text-xs uppercase">Completed</span>
                  </div>
               </div>
               <div className="w-px h-12 bg-white/5 hidden sm:block"></div>
               <div className="space-y-1">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Rating</span>
                  <div className="flex items-baseline gap-2">
                     <span className="font-headline font-black text-3xl uppercase italic text-gradient">{targetUser.rank || 'Beginner'}</span>
                  </div>
               </div>
            </div>

            <div className="flex justify-center lg:justify-start gap-4">
               <button onClick={handleRequestSwap} className="px-8 py-3 bg-primary text-on-primary-fixed font-headline font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(133,173,255,0.3)]">
                  <span className="material-symbols-outlined text-sm">sync</span>
                  Request Swap
               </button>
               <button onClick={handleSendMessage} className="px-8 py-3 bg-white/5 border border-white/10 font-headline font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  Send Message
               </button>
            </div>
         </div>
      </section>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Side Stats */}
         <aside className="space-y-8 lg:col-span-1">
            <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-8">
               <h4 className="font-headline font-black text-xs uppercase tracking-widest text-slate-500 italic flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">settings_input_component</span>
                  Knowledge Matrix
               </h4>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                        <span>Teaching</span>
                        <span className="text-primary">{Math.min((targetUser.teachSkills?.length || 0) * 20, 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min((targetUser.teachSkills?.length || 0) * 20, 100)}%` }}></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                        <span>Learning</span>
                        <span className="text-secondary">{Math.min((targetUser.learnSkills?.length || 0) * 20, 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: `${Math.min((targetUser.learnSkills?.length || 0) * 20, 100)}%` }}></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                        <span>Activity</span>
                        <span className="text-tertiary">{Math.min(((targetUser.streak || 0) / 30) * 100, 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary" style={{ width: `${Math.min(((targetUser.streak || 0) / 30) * 100, 100)}%` }}></div>
                     </div>
                  </div>
               </div>

               <div className="pt-8 grid grid-cols-2 gap-4 border-t border-white/5">
                  <div className="text-center">
                     <p className="text-2xl font-headline font-black italic">{targetUser.coins || 0}</p>
                     <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">SkillCoins</p>
                  </div>
                  <div className="text-center">
                     <p className="text-2xl font-headline font-black italic">{targetUser.xp || 0}</p>
                     <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Total XP</p>
                  </div>
               </div>
            </div>
         </aside>

         {/* Content Tabs */}
         <main className="lg:col-span-2 space-y-8">
            <div className="flex gap-4 border-b border-white/5 pb-4">
               {['Badges', 'Skills'].map(tab => (
                 <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`font-headline font-black text-xs uppercase tracking-[0.2em] px-4 py-2 transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                 >
                   {tab}
                   {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-[-17px] left-0 right-0 h-1 bg-primary shadow-[0_0_10px_rgba(133,173,255,1)]" />}
                 </button>
               ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'Badges' && (
                <motion.div 
                  key="ach"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {(targetUser.badges && targetUser.badges.length > 0) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {targetUser.badges.map((b, i) => (
                        <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center gap-4">
                           <div className="w-20 h-20 rounded-full border-4 border-white/5 p-1 relative">
                              <div className="w-full h-full bg-surface-container rounded-full flex items-center justify-center text-3xl">
                                 {b.icon || '🏅'}
                              </div>
                           </div>
                           <p className="font-headline font-black text-[10px] uppercase text-center tracking-widest">{b.name || b}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel p-12 rounded-xl border border-dashed border-white/10 text-center space-y-4">
                       <span className="material-symbols-outlined text-5xl text-slate-600">military_tech</span>
                       <p className="text-slate-400 font-headline uppercase tracking-widest text-sm">No badges yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'Skills' && (
                <motion.div 
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h5 className="font-mono text-[10px] uppercase tracking-widest text-primary">Can teach</h5>
                        <div className="flex flex-wrap gap-2">
                           {(targetUser.teachSkills || []).map(s => (
                             <div key={s} className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary-fixed rounded-lg font-headline font-bold text-xs uppercase">
                                {s}
                             </div>
                           ))}
                           {!targetUser.teachSkills?.length && <p className="text-slate-500 font-mono text-[10px] uppercase">None listed</p>}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h5 className="font-mono text-[10px] uppercase tracking-widest text-secondary">Wants to learn</h5>
                        <div className="flex flex-wrap gap-2">
                           {(targetUser.learnSkills || []).map(s => (
                             <div key={s} className="px-4 py-2 bg-secondary/10 border border-secondary/30 text-secondary-fixed rounded-lg font-headline font-bold text-xs uppercase">
                                {s}
                             </div>
                           ))}
                           {!targetUser.learnSkills?.length && <p className="text-slate-500 font-mono text-[10px] uppercase">None listed</p>}
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </main>
      </div>
    </PageTransition>
  );
}
