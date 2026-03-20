import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

// ── Edit Modal ───────────────────────────────────────────────
function EditModal({ profile, onSave, onClose }) {
  const [city, setCity] = useState(profile?.city || '');
  const [teachSkills, setTeachSkills] = useState(profile?.teachSkills?.join(', ') || '');
  const [learnSkills, setLearnSkills] = useState(profile?.learnSkills?.join(', ') || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ 
      city, 
      teachSkills: teachSkills.split(',').map(s => s.trim()).filter(Boolean), 
      learnSkills: learnSkills.split(',').map(s => s.trim()).filter(Boolean) 
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
       <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-lg border-2 border-primary/20 p-8 space-y-6"
       >
          <div className="flex justify-between items-center bg-surface-container-high -mx-8 -mt-8 p-6 border-b border-primary/20">
             <h2 className="font-headline font-black text-xl uppercase italic tracking-widest text-primary">Edit Profile</h2>
             <button onClick={onClose} className="material-symbols-outlined text-slate-500 hover:text-white transition-colors">close</button>
          </div>

          <div className="space-y-4 pt-4">
             <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Your City</label>
                <input 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface-container-high border-b border-slate-700 py-3 px-4 focus:border-primary outline-none transition-all font-mono text-xs uppercase"
                  placeholder="Enter your city"
                />
             </div>
             <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Teaching (Comma separated)</label>
                <input 
                  value={teachSkills}
                  onChange={(e) => setTeachSkills(e.target.value)}
                  className="w-full bg-surface-container-high border-b border-slate-700 py-3 px-4 focus:border-primary outline-none transition-all font-mono text-xs uppercase text-primary"
                  placeholder="Cooking, Guitar, Physics"
                />
             </div>
             <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Learning (Comma separated)</label>
                <input 
                  value={learnSkills}
                  onChange={(e) => setLearnSkills(e.target.value)}
                  className="w-full bg-surface-container-high border-b border-slate-700 py-3 px-4 focus:border-primary outline-none transition-all font-mono text-xs uppercase text-secondary"
                  placeholder="Spanish, Coding, Chess"
                />
             </div>
          </div>

          <button 
             onClick={handleSave}
             disabled={saving}
             className="w-full py-4 bg-primary text-on-primary-fixed font-headline font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all disabled:opacity-50"
          >
             {saving ? 'Saving...' : 'Save Changes'}
          </button>
       </motion.div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('Badges');
  const [swaps, setSwaps] = useState([]);
  const [swapsCount, setSwapsCount] = useState(0);
  const [loadingSwaps, setLoadingSwaps] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Calculate Level
  const getLevel = (xp) => {
    if (xp >= 3000) return 'Master';
    if (xp >= 1500) return 'Expert';
    if (xp >= 500) return 'Intermediate';
    return 'Beginner';
  };

  const userLevel = getLevel(profile?.xp || 0);

  useEffect(() => {
    if (!profile?.uid) return;

    const fetchSwaps = async () => {
      try {
        const q = query(
          collection(db, 'swapRequests'),
          where('status', '==', 'accepted')
        );
        const snapshot = await getDocs(q);
        
        // Filter manually for either fromUid or toUid
        const userSwaps = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(s => s.fromUid === profile.uid || s.toUid === profile.uid)
          .sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));

        setSwaps(userSwaps);
        setSwapsCount(userSwaps.length);
      } catch (err) {
        console.error('Error fetching swaps:', err);
      } finally {
        setLoadingSwaps(false);
      }
    };

    fetchSwaps();
  }, [profile?.uid]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied to clipboard!');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Upload failed. Make sure image is under 5MB');
      return;
    }

    setUploading(true);
    try {
      // Use FileReader to convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64string = await base64Promise;

      const apiKey = import.meta.env.VITE_IMGBB_KEY;
      if (!apiKey || apiKey === 'your_key_here') {
        throw new Error('imgbb API key not configured. Please add VITE_IMGBB_KEY to your .env file.');
      }

      const formData = new FormData();
      formData.append('image', base64string);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Upload to imgbb failed');
      
      const downloadURL = data.data.url;
      
      // Update Firestore via AuthContext
      if (updateProfile) {
        await updateProfile({ photoURL: downloadURL });
      }

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateAuthProfile(auth.currentUser, { photoURL: downloadURL });
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Upload failed error:', err);
      alert(err.message || 'Upload failed. Make sure image is under 5MB');
    } finally {
      setUploading(false);
      // Ensure input is cleared so same file can be selected again
      e.target.value = '';
    }
  };

  const handleSave = async (updates) => {
    if (updateProfile) await updateProfile(updates);
  };

  return (
    <PageTransition className="space-y-12 pb-24 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <AnimatePresence>
        {showEdit && <EditModal profile={profile} onClose={() => setShowEdit(false)} onSave={handleSave} />}
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-on-primary-fixed px-6 py-3 rounded-full font-headline font-black uppercase tracking-widest text-xs shadow-2xl"
          >
            Profile photo updated! 📸
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Profile Header */}
      <section className="relative flex flex-col lg:flex-row items-center lg:items-end gap-12 pt-12">
         <div className="relative shrink-0">
            <div className="w-64 h-64 rounded-xl border-2 border-primary/20 p-2 relative group cursor-pointer">
               <input 
                 type="file" 
                 id="avatar-upload" 
                 className="hidden" 
                 accept="image/*"
                 onChange={handlePhotoUpload}
                 disabled={uploading}
               />
               <label htmlFor="avatar-upload" className="block w-full h-full cursor-pointer relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 border border-primary/10 -m-4 rounded-xl pointer-events-none animate-pulse"></div>
                  <div className="w-full h-full bg-surface-container-highest relative">
                     <img 
                       src={profile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'U')}&background=random&size=512`} 
                       className={`w-full h-full object-cover transition-all duration-700 ${uploading ? 'opacity-50 blur-sm' : 'grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100'}`} 
                       alt="OPERATOR"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                     
                     {/* Hover Overlay */}
                     {!uploading && (
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[2px]">
                          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                             <span className="material-symbols-outlined text-3xl text-primary animate-pulse">photo_camera</span>
                          </div>
                       </div>
                     )}

                     {/* Uploading Spinner */}
                     {uploading && (
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                       </div>
                     )}
                  </div>
               </label>
               <div className="absolute -bottom-4 -left-4 bg-primary text-on-primary-fixed px-4 py-2 font-headline font-black uppercase italic tracking-tighter skew-x-[-15deg] shadow-[0_10px_20px_rgba(133,173,255,0.3)]">ID: {profile?.uid?.slice(0, 8) || 'OP_01'}</div>
            </div>
         </div>

         <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-2">
               <div className="flex items-center justify-center lg:justify-start gap-3">
                  <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter uppercase italic">{profile?.displayName || 'USER'}</h1>
               </div>
               <p className="font-mono text-xs text-primary tracking-[0.4em] uppercase">{profile?.city || 'Your City'}</p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
               <div className="space-y-1">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Accuracy</span>
                  <div className="flex items-baseline gap-2">
                     <span className="font-headline font-black text-3xl">{profile?.streak || 0}</span>
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
                     <span className="font-headline font-black text-3xl uppercase">{userLevel}</span>
                  </div>
               </div>
            </div>

            <div className="flex justify-center lg:justify-start gap-4">
               <button onClick={handleShare} className="px-8 py-3 bg-white/5 border border-white/10 font-headline font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Share Profile
               </button>
               <button onClick={() => setShowEdit(true)} className="px-8 py-3 bg-surface-container-highest border border-white/5 font-headline font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
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
                        <span className="text-primary">{Math.min((profile?.teachSkills?.length || 0) * 20, 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min((profile?.teachSkills?.length || 0) * 20, 100)}%` }}></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                        <span>Learning</span>
                        <span className="text-secondary">{Math.min((profile?.learnSkills?.length || 0) * 20, 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: `${Math.min((profile?.learnSkills?.length || 0) * 20, 100)}%` }}></div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                        <span>Activity</span>
                        <span className="text-tertiary">{Math.min(((profile?.streak || 0) / 30) * 100, 100)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary" style={{ width: `${Math.min(((profile?.streak || 0) / 30) * 100, 100)}%` }}></div>
                     </div>
                  </div>
               </div>

               <div className="pt-8 grid grid-cols-2 gap-4 border-t border-white/5">
                  <div className="text-center">
                     <p className="text-2xl font-headline font-black italic">{profile?.coins || 0}</p>
                     <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">SkillCoins</p>
                  </div>
                  <div className="text-center">
                     <p className="text-2xl font-headline font-black italic">{profile?.xp || 0}</p>
                     <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Total XP</p>
                  </div>
               </div>
            </div>
         </aside>

         {/* Content Tabs */}
         <main className="lg:col-span-2 space-y-8 overflow-hidden">
            <div className="flex gap-4 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar">
               {['Badges', 'My Skills', 'Swap History'].map(tab => (
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
                  {(profile?.badges && profile.badges.length > 0) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {profile.badges.map((b, i) => (
                        <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center gap-4 group hover:border-primary/40 transition-all">
                           <div className="w-20 h-20 rounded-full border-4 border-white/5 p-1 relative">
                              <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                              <div className="w-full h-full bg-surface-container rounded-full flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
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
                       <p className="text-slate-400 font-headline uppercase tracking-widest text-sm">Complete your first swap to earn badges! 🏅</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'My Skills' && (
                <motion.div 
                  key="skills"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {(profile?.teachSkills?.length || profile?.learnSkills?.length) ? (
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h5 className="font-mono text-[10px] uppercase tracking-widest text-primary">I can teach</h5>
                          <div className="flex flex-wrap gap-2">
                             {(profile?.teachSkills || []).map(s => (
                               <div key={s} className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary-fixed rounded-lg font-headline font-bold text-xs uppercase">
                                  {s}
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h5 className="font-mono text-[10px] uppercase tracking-widest text-secondary">I want to learn</h5>
                          <div className="flex flex-wrap gap-2">
                             {(profile?.learnSkills || []).map(s => (
                               <div key={s} className="px-4 py-2 bg-secondary/10 border border-secondary/30 text-secondary-fixed rounded-lg font-headline font-bold text-xs uppercase">
                                  {s}
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="glass-panel p-12 rounded-xl border border-dashed border-white/10 text-center space-y-4">
                       <p className="text-slate-400 font-headline uppercase tracking-widest text-sm">No skills added yet — click Edit Profile to add!</p>
                       <button onClick={() => setShowEdit(true)} className="px-6 py-2 bg-white/5 border border-white/10 font-headline text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Edit Skills</button>
                    </div>
                  )}
                  { (profile?.teachSkills?.length || profile?.learnSkills?.length) && (
                    <button onClick={() => setShowEdit(true)} className="w-full py-4 glass-panel border border-dashed border-white/10 text-slate-500 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-all">Edit Skills</button>
                  )}
                </motion.div>
              )}

              {activeTab === 'Swap History' && (
                <motion.div 
                  key="sync"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {loadingSwaps ? (
                    <div className="py-12 flex justify-center">
                       <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : swaps.length > 0 ? (
                    swaps.map((swap, i) => {
                      const isSender = swap.fromUid === profile.uid;
                      const partnerName = isSender ? swap.toName : swap.fromName;
                      const mySkill = isSender ? swap.offeredSkill : swap.wantedSkill;
                      const theirSkill = isSender ? swap.wantedSkill : swap.offeredSkill;
                      
                      return (
                        <div key={swap.id} className="glass-panel p-6 rounded-xl flex items-center gap-6 border border-white/5 hover:border-white/10 transition-all group">
                           <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center font-black text-primary uppercase">
                              {partnerName?.charAt(0)}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="font-headline font-black uppercase text-sm">{partnerName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="font-mono text-[8px] uppercase tracking-widest text-primary">{mySkill}</span>
                                 <span className="material-symbols-outlined text-[10px] text-slate-700">arrow_forward</span>
                                 <span className="font-mono text-[8px] uppercase tracking-widest text-secondary">{theirSkill}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-headline font-black text-lg text-primary">+50 XP</p>
                              <p className="font-mono text-[8px] text-slate-700 uppercase">
                                {swap.updatedAt?.toDate ? swap.updatedAt.toDate().toLocaleDateString() : 'Recent'}
                              </p>
                           </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="glass-panel p-12 rounded-xl border border-dashed border-white/10 text-center">
                       <p className="text-slate-400 font-headline uppercase tracking-widest text-sm">No completed swaps yet. Go explore and request your first swap!</p>
                    </div>
                  )}
                  {swaps.length > 0 && (
                    <button className="w-full py-4 glass-panel border border-dashed border-white/10 text-slate-500 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-all">Request History Export</button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
         </main>
      </div>
    </PageTransition>
  );
}