import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function PracticeZonePage() {
  const { profile, updateProfile } = useAuth();
  const [duelState, setDuelState] = useState('IDLE'); // IDLE, SEARCHING, ACTIVE, COMPLETED
  const [syncProgress, setSyncProgress] = useState(0);
  const [logs, setLogs] = useState([
    { id: 1, text: 'System: Initializing Practice Session...', type: 'info' },
    { id: 2, text: 'System: Awaiting your input...', type: 'warning' }
  ]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev.slice(-4), { id: Date.now(), text: `Log: ${text}`, type }]);
  };

  const startDuel = () => {
    setDuelState('SEARCHING');
    addLog('Searching for partners...', 'info');
    
    setTimeout(() => {
      setDuelState('ACTIVE');
      addLog('Ready: Start practicing now', 'success');
      setSyncProgress(15);
    }, 2500);
  };

  const handleAction = (isCorrect) => {
    if (isCorrect) {
      setSyncProgress(prev => Math.min(prev + 20, 100));
      addLog('Success: Progress +20%', 'success');
    } else {
      setSyncProgress(prev => Math.max(prev - 10, 0));
      addLog('Error: Incorrect action -10%', 'error');
    }
  };

  useEffect(() => {
    if (syncProgress >= 100) {
      setDuelState('COMPLETED');
      addLog('Finished: Session complete!', 'success');
      if (updateProfile) updateProfile({ xp: (profile?.xp || 0) + 150 });
    }
  }, [syncProgress, profile?.xp, updateProfile]);

  return (
    <PageTransition className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Neural Sync Header */}
      <section className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-xs animate-pulse">psychology</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-tertiary uppercase">Practice Session</span>
          </div>
          <h1 className="font-headline font-black text-3xl uppercase italic tracking-tighter">Practice <span className="text-tertiary">Arena</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="glass-panel px-4 py-2 border-r-4 border-tertiary flex flex-col items-end">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Global Rank</span>
              <span className="font-headline font-black text-lg">Top 4%</span>
           </div>
        </div>
      </section>

      {/* Main Duel Screen */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
        <AnimatePresence mode="wait">
          {duelState === 'IDLE' ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 glass-panel border border-white/5 rounded-2xl"
            >
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-tertiary/40 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                 <span className="material-symbols-outlined text-5xl text-tertiary">bolt</span>
              </div>
              <div className="space-y-2">
                <h2 className="font-headline font-black text-4xl uppercase italic tracking-widest">Start Practice</h2>
                <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">Choose a skill to practice</p>
              </div>
              <div className="flex gap-4">
                 <button onClick={startDuel} className="px-12 py-4 bg-tertiary text-on-tertiary-fixed font-headline font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">Start Session</button>
                 <button className="px-12 py-4 glass-panel border border-white/10 font-headline font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">Leaderboard</button>
              </div>
            </motion.div>
          ) : duelState === 'SEARCHING' ? (
            <motion.div 
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 glass-panel border border-white/5 rounded-2xl"
            >
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-2 border-secondary border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              </div>
              <div className="space-y-1">
                <h2 className="font-headline font-black text-2xl uppercase italic tracking-widest animate-pulse">Setting up...</h2>
                <p className="font-mono text-[9px] text-slate-500 tracking-widest uppercase italic">Connecting to your learning path</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col md:flex-row gap-6 w-full"
            >
              {/* Left Column: OPERATOR */}
              <div className="flex-1 glass-panel rounded-2xl p-8 border-l-4 border-primary/40 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 p-4 font-mono text-[8px] text-primary/40 tracking-widest">YOU</div>
                <div className="shrink-0 flex justify-between items-start">
                  <div>
                     <h3 className="font-headline font-black text-4xl italic uppercase">{profile?.displayName?.split(' ')[0] || 'USER'}</h3>
                     <p className="font-mono text-[10px] text-primary">{profile?.rank || 'Beginner'}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1 w-4 rounded-full ${i < Math.floor(syncProgress / 20) ? 'bg-primary' : 'bg-white/10'}`}></div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                   <div className="w-48 h-48 rounded-full border-8 border-white/5 relative flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="46%" className="stroke-white/5 fill-none" strokeWidth="8"/>
                        <motion.circle 
                          cx="50%" cy="50%" r="46%" 
                          className="stroke-primary fill-none shadow-[0_0_20px_rgba(133,173,255,0.5)]" 
                          strokeWidth="8"
                          strokeDasharray="100"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 100 - syncProgress }}
                        />
                      </svg>
                      <span className="font-headline font-black text-4xl">{syncProgress}<span className="text-xs text-primary">%</span></span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => handleAction(true)} className="py-4 bg-primary/20 border border-primary/40 hover:bg-primary/40 text-on-primary-fixed font-headline font-black uppercase text-[10px] tracking-widest transition-all">Correct Action</button>
                   <button onClick={() => handleAction(false)} className="py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 font-headline font-black uppercase text-[10px] tracking-widest transition-all">Incorrect Action</button>
                </div>
              </div>

              {/* Center V/S Overlay (MD Only) */}
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-lg bg-surface-container border-2 border-tertiary items-center justify-center font-headline font-black italic shadow-[0_0_40px_rgba(255,163,133,0.3)] z-10">
                VS
              </div>

              {/* Right Column: AI / OPPONENT */}
              <div className="flex-1 glass-panel rounded-2xl p-8 border-r-4 border-secondary/40 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-secondary/40 tracking-widest text-right">OPPONENT: AI</div>
                <div className="shrink-0 flex justify-between items-start flex-row-reverse">
                  <div className="text-right">
                     <h3 className="font-headline font-black text-4xl italic uppercase text-secondary">AI BOT</h3>
                     <p className="font-mono text-[10px] text-secondary">Level 1</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1 w-4 rounded-full ${i < 3 ? 'bg-secondary' : 'bg-white/10'}`}></div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                   <div className="w-48 h-48 rounded-full border-8 border-white/5 relative flex items-center justify-center opacity-40">
                      <div className="absolute inset-0 bg-secondary/5 blur-2xl rounded-full"></div>
                      <span className="material-symbols-outlined text-6xl text-secondary animate-pulse">memory</span>
                   </div>
                </div>

                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                   <div className="flex justify-between items-center mb-2">
                     <span className="font-mono text-[8px] text-secondary uppercase">AI Difficulty</span>
                     <span className="font-headline font-bold text-xs">Medium</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[50%]"></div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Footer (Neural Log) */}
      <footer className="h-48 glass-panel rounded-xl border-t-2 border-t-tertiary p-6 flex gap-8">
        <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto pr-4 custom-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className={`flex gap-4 ${log.type === 'error' ? 'text-secondary' : log.type === 'success' ? 'text-primary' : log.type === 'warning' ? 'text-tertiary' : 'text-slate-500'}`}>
               <span className="opacity-50">[{new Date(log.id).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
               <span className="uppercase tracking-widest">{log.text}</span>
            </div>
          ))}
          <div className="animate-pulse text-tertiary">_</div>
        </div>
        
        <div className="w-1/3 border-l border-white/5 pl-8 hidden lg:block">
           <div className="space-y-4">
              <h4 className="font-headline font-bold text-xs uppercase tracking-widest text-slate-500 italic">Consistency</h4>
              <div className="flex items-end gap-2">
                 {[40, 70, 45, 90, 65, 30, 85, 95].map((v, i) => (
                   <div key={i} className="flex-1 bg-surface-container-highest rounded-t-xs relative h-12">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${v}%` }}
                        className="absolute bottom-0 inset-x-0 bg-tertiary/40"
                      />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </footer>
    </PageTransition>
  );
}
