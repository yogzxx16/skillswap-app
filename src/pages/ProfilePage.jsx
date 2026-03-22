import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { requestNotificationPermission } from '../services/notificationService';

// ── Edit Modal ───────────────────────────────────────────────
function EditModal({ profile, onSave, onClose }) {
   const [displayName, setDisplayName] = useState(profile?.displayName || '');
   const [city, setCity] = useState(profile?.city || '');
   const [teachSkills, setTeachSkills] = useState(profile?.teachSkills?.join(', ') || '');
   const [learnSkills, setLearnSkills] = useState(profile?.learnSkills?.join(', ') || '');
   const [saving, setSaving] = useState(false);

   const handleSave = async () => {
      setSaving(true);
      await onSave({
         displayName: displayName.trim() || profile?.displayName,
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
                  <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Your Name</label>
                  <input
                     value={displayName}
                     onChange={(e) => setDisplayName(e.target.value)}
                     className="w-full bg-surface-container-high border-b border-slate-700 py-3 px-4 focus:border-primary outline-none transition-all font-mono text-xs uppercase"
                     placeholder="Enter your name"
                  />
               </div>
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
   const [toastMsg, setToastMsg] = useState('');
   const [notifEnabled, setNotifEnabled] = useState(
      typeof Notification !== 'undefined' && Notification.permission === 'granted'
   );

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

   const showToastMsg = (msg) => {
      setToastMsg(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
   };

   const handleShare = () => {
      navigator.clipboard.writeText(`${window.location.origin}/profile/${profile?.uid}`);
      showToastMsg('Profile link copied! 🔗');
   };

   const handlePhotoUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
         alert('Image must be under 5MB');
         return;
      }
      setUploading(true);
      try {
         const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
         });

         const formData = new FormData();
         formData.append('image', base64);
         const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
            { method: 'POST', body: formData }
         );
         const data = await res.json();
         if (!data.success) throw new Error('Upload failed');
         const url = data.data.url;
         if (updateProfile) await updateProfile({ photoURL: url });
         if (auth.currentUser) await updateAuthProfile(auth.currentUser, { photoURL: url });
         showToastMsg('Profile photo updated! 📸');
      } catch (err) {
         console.error('Upload error:', err);
         alert('Upload failed. Please try again!');
      } finally {
         setUploading(false);
         e.target.value = '';
      }
   };

   const handleSave = async (updates) => {
      if (updateProfile) await updateProfile(updates);
   };

   const handleNotifToggle = async () => {
      const granted = await requestNotificationPermission();
      setNotifEnabled(granted);
      showToastMsg(granted ? 'Notifications enabled! 🔔' : 'Notifications blocked. Please allow in browser settings.');
   };

   return (
      <PageTransition className="space-y-12 pb-24 relative overflow-hidden">
         {/* Background */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

         <AnimatePresence>
            {showEdit && <EditModal profile={profile} onClose={() => setShowEdit(false)} onSave={handleSave} />}
            {showToast && (
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-on-primary-fixed px-6 py-3 rounded-full font-headline font-black uppercase tracking-widest text-xs shadow-2xl"
               >
                  {toastMsg}
               </motion.div>
            )}
         </AnimatePresence>

         {/* Profile Header */}
         <section className="relative flex flex-col lg:flex-row items-center lg:items-end gap-12 pt-12">
            {/* Avatar */}
            <div className="relative shrink-0">
               <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl border-2 border-primary/20 p-2 relative group cursor-pointer">
                  <input
                     type="file"
                     id="avatar-upload"
                     className="hidden"
                     accept="image/*"
                     onChange={handlePhotoUpload}
                     disabled={uploading}
                  />
                  <label htmlFor="avatar-upload" className="block w-full h-full cursor-pointer relative overflow-hidden rounded-lg">
                     <div className="w-full h-full bg-surface-container-highest relative">
                        <img
                           src={profile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'U')}&background=random&size=512`}
                           className={`w-full h-full object-cover transition-all duration-700 ${uploading ? 'opacity-50 blur-sm' : 'grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100'}`}
                           alt="Profile"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                        {!uploading && (
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[2px]">
                              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                                 <span className="material-symbols-outlined text-3xl text-primary">photo_camera</span>
                              </div>
                           </div>
                        )}
                        {uploading && (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                           </div>
                        )}
                     </div>
                  </label>
                  <div className="absolute -bottom-4 -left-4 bg-primary text-on-primary-fixed px-4 py-2 font-headline font-black uppercase italic tracking-tighter skew-x-[-15deg] shadow-[0_10px_20px_rgba(133,173,255,0.3)] text-xs">
                     ID: {profile?.uid?.slice(0, 8) || 'OP_01'}
                  </div>
               </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
               <div className="space-y-2">
                  <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tighter uppercase italic">
                     {profile?.displayName || 'USER'}
                  </h1>
                  <p className="font-mono text-xs text-primary tracking-[0.4em] uppercase">
                     {profile?.city || 'Your City'}
                  </p>
               </div>

               {/* Stats */}
               <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8">
                  <div className="space-y-1">
                     <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Day Streak</span>
                     <div className="flex items-baseline gap-2">
                        <span className="font-headline font-black text-3xl">{profile?.streak || 0}</span>
                        <span className="text-primary font-headline font-bold text-xs uppercase">🔥</span>
                     </div>
                  </div>
                  <div className="w-px h-12 bg-white/5 hidden sm:block" />
                  <div className="space-y-1">
                     <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Swaps Done</span>
                     <div className="flex items-baseline gap-2">
                        <span className="font-headline font-black text-3xl">{swapsCount}</span>
                        <span className="text-secondary font-headline font-bold text-xs uppercase">Completed</span>
                     </div>
                  </div>
                  <div className="w-px h-12 bg-white/5 hidden sm:block" />
                  <div className="space-y-1">
                     <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Level</span>
                     <div className="flex items-baseline gap-2">
                        <span className="font-headline font-black text-2xl uppercase">{userLevel}</span>
                     </div>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <button
                     onClick={handleShare}
                     className="px-6 py-3 bg-white/5 border border-white/10 font-headline font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                     <span className="material-symbols-outlined text-sm">content_copy</span>
                     Share Profile
                  </button>
                  <button
                     onClick={() => setShowEdit(true)}
                     className="px-6 py-3 bg-surface-container-highest border border-white/5 font-headline font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white/10 transition-all"
                  >
                     <span className="material-symbols-outlined text-sm">edit</span>
                     Edit Profile
                  </button>
                  <button
                     onClick={handleNotifToggle}
                     className={`px-6 py-3 border font-headline font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all ${notifEnabled
                        ? 'bg-primary/20 border-primary/30 text-primary'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                  >
                     <span className="material-symbols-outlined text-sm">
                        {notifEnabled ? 'notifications_active' : 'notifications_off'}
                     </span>
                     {notifEnabled ? 'Notifications On' : 'Enable Notifications'}
                  </button>
               </div>
            </div>
         </section>

         {/* Profile Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Knowledge Matrix */}
            <aside className="space-y-8 lg:col-span-1">
               <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-8">
                  <h4 className="font-headline font-black text-xs uppercase tracking-widest text-slate-500 italic flex items-center gap-2">
                     <span className="material-symbols-outlined text-xs">settings_input_component</span>
                     Knowledge Matrix
                  </h4>
                  <div className="space-y-6">
                     {[
                        { label: 'Teaching', value: Math.min((profile?.teachSkills?.length || 0) * 20, 100), color: 'bg-primary', textColor: 'text-primary' },
                        { label: 'Learning', value: Math.min((profile?.learnSkills?.length || 0) * 20, 100), color: 'bg-secondary', textColor: 'text-secondary' },
                        { label: 'Activity', value: Math.min(((profile?.streak || 0) / 30) * 100, 100), color: 'bg-tertiary', textColor: 'text-tertiary' },
                     ].map(bar => (
                        <div key={bar.label} className="space-y-2">
                           <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                              <span>{bar.label}</span>
                              <span className={bar.textColor}>{bar.value.toFixed(0)}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${bar.color}`} style={{ width: `${bar.value}%` }} />
                           </div>
                        </div>
                     ))}
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

            {/* Tabs */}
            <main className="lg:col-span-2 space-y-8 overflow-hidden">
               <div className="flex gap-4 border-b border-white/5 pb-4 overflow-x-auto">
                  {['Badges', 'My Skills', 'Swap History'].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`font-headline font-black text-xs uppercase tracking-[0.2em] px-4 py-2 transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                     >
                        {tab}
                        {activeTab === tab && (
                           <motion.div layoutId="tab-underline" className="absolute bottom-[-17px] left-0 right-0 h-1 bg-primary shadow-[0_0_10px_rgba(133,173,255,1)]" />
                        )}
                     </button>
                  ))}
               </div>

               <AnimatePresence mode="wait">
                  {activeTab === 'Badges' && (
                     <motion.div key="badges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        {(profile?.badges && profile.badges.length > 0) ? (
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {profile.badges.map((b, i) => (
                                 <div key={i} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col items-center gap-3 group hover:border-primary/40 transition-all">
                                    <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center text-3xl">
                                       {b.icon || '🏅'}
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
                     <motion.div key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        {(profile?.teachSkills?.length || profile?.learnSkills?.length) ? (
                           <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <h5 className="font-mono text-[10px] uppercase tracking-widest text-primary">I can teach</h5>
                                 <div className="flex flex-wrap gap-2">
                                    {(profile?.teachSkills || []).map(s => (
                                       <div key={s} className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg font-headline font-bold text-xs uppercase">{s}</div>
                                    ))}
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h5 className="font-mono text-[10px] uppercase tracking-widest text-secondary">I want to learn</h5>
                                 <div className="flex flex-wrap gap-2">
                                    {(profile?.learnSkills || []).map(s => (
                                       <div key={s} className="px-4 py-2 bg-secondary/10 border border-secondary/30 text-secondary rounded-lg font-headline font-bold text-xs uppercase">{s}</div>
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
                        {(profile?.teachSkills?.length || profile?.learnSkills?.length) ? (
                           <button onClick={() => setShowEdit(true)} className="w-full py-4 glass-panel border border-dashed border-white/10 text-slate-500 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-all">
                              Edit Skills
                           </button>
                        ) : null}
                     </motion.div>
                  )}

                  {activeTab === 'Swap History' && (
                     <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        {loadingSwaps ? (
                           <div className="py-12 flex justify-center">
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                           </div>
                        ) : swaps.length > 0 ? (
                           swaps.map((swap) => {
                              const isSender = swap.fromUid === profile.uid;
                              const partnerName = isSender ? swap.toName : swap.fromName;
                              const mySkill = isSender ? swap.offeredSkill : swap.wantedSkill;
                              const theirSkill = isSender ? swap.wantedSkill : swap.offeredSkill;
                              return (
                                 <div key={swap.id} className="glass-panel p-6 rounded-xl flex items-center gap-6 border border-white/5 hover:border-white/10 transition-all">
                                    <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center font-black text-primary uppercase text-lg">
                                       {partnerName?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="font-headline font-black uppercase text-sm">{partnerName}</p>
                                       <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <span className="font-mono text-[8px] uppercase tracking-widest text-primary">{mySkill}</span>
                                          <span className="material-symbols-outlined text-[10px] text-slate-700">arrow_forward</span>
                                          <span className="font-mono text-[8px] uppercase tracking-widest text-secondary">{theirSkill}</span>
                                       </div>
                                    </div>
                                    <div className="text-right shrink-0">
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
                     </motion.div>
                  )}
               </AnimatePresence>
            </main>
         </div>
      </PageTransition>
   );
}