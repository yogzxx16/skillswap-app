import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notifySwapAccepted } from '../services/notificationService';
import { db } from '../firebase';
import {
  collection, query, where, onSnapshot,
  doc, updateDoc, addDoc, serverTimestamp
} from 'firebase/firestore';
import { HiCheck, HiX, HiSwitchHorizontal, HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const AVATAR_COLORS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < (name?.length || 0); i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const statusConfig = {
  pending: { color: 'text-neon-orange', bg: 'bg-neon-orange/10', border: 'border-neon-orange/30', label: 'Pending' },
  accepted: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', label: 'Accepted ✓' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Rejected' },
  completed: { color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/30', label: 'Completed 🎉' },
};

export default function SwapRequestsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    let incomingDone = false;
    let outgoingDone = false;
    const checkDone = () => {
      if (incomingDone && outgoingDone) setLoading(false);
    };

    const incomingQ = query(
      collection(db, 'swapRequests'),
      where('toUid', '==', user.uid)
    );
    const unsubIncoming = onSnapshot(incomingQ,
      (snap) => {
        setIncoming(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        incomingDone = true;
        checkDone();
      },
      (err) => { console.error(err); incomingDone = true; checkDone(); }
    );

    const outgoingQ = query(
      collection(db, 'swapRequests'),
      where('fromUid', '==', user.uid)
    );
    const unsubOutgoing = onSnapshot(outgoingQ,
      (snap) => {
        setOutgoing(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        outgoingDone = true;
        checkDone();
      },
      (err) => { console.error(err); outgoingDone = true; checkDone(); }
    );

    return () => { unsubIncoming(); unsubOutgoing(); };
  }, [user]);

  const handleAccept = async (req) => {
    try {
      await updateDoc(doc(db, 'swapRequests', req.id), {
        status: 'accepted',
        updatedAt: serverTimestamp(),
      });

      // ✅ Notify the person who sent the request
      notifySwapAccepted(profile?.displayName);

      await addDoc(collection(db, 'activity'), {
        userName: profile?.displayName,
        userCity: profile?.city || '',
        action: `accepted a swap with ${req.fromName}! 🤝`,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleReject = async (req) => {
    try {
      await updateDoc(doc(db, 'swapRequests', req.id), {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const displayed = tab === 'incoming' ? incoming : outgoing;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-primary text-xs">swap_horiz</span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Skill Exchange</span>
        </div>
        <h1 className="font-headline font-black text-3xl uppercase italic tracking-tighter">
          Swap Requests
        </h1>
        <p className="text-slate-400 mt-1 font-body text-sm">
          Manage your skill exchange requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'incoming', label: 'Incoming', count: incoming.length },
          { key: 'outgoing', label: 'Outgoing', count: outgoing.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 font-headline font-bold text-xs uppercase tracking-widest transition-all border-none cursor-pointer ${tab === t.key
              ? 'bg-primary/20 text-primary border-b-2 border-primary'
              : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/5">
            <HiSwitchHorizontal className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-400 font-headline uppercase tracking-widest text-sm">
              No {tab} swap requests yet
            </p>
            {tab === 'incoming' && (
              <p className="text-slate-600 text-xs mt-2 font-mono uppercase tracking-widest">
                When someone requests a swap with you, it'll appear here!
              </p>
            )}
            {tab === 'outgoing' && (
              <div className="mt-4">
                <button
                  onClick={() => navigate('/explore')}
                  className="px-6 py-2 bg-primary/20 text-primary border border-primary/30 font-headline font-black uppercase tracking-widest text-xs hover:bg-primary/30 transition-all"
                >
                  Go Explore Skills
                </button>
              </div>
            )}
          </div>
        ) : (
          displayed.map(req => {
            const isIncoming = tab === 'incoming';
            const personName = isIncoming ? req.fromName : req.toName;
            const status = statusConfig[req.status] || statusConfig.pending;
            const isAccepted = req.status === 'accepted';
            const isCompleted = req.status === 'completed';

            return (
              <div
                key={req.id}
                className={`glass-panel p-5 rounded-2xl border transition-all ${isAccepted ? 'border-primary/20' :
                  isCompleted ? 'border-tertiary/20' :
                    'border-white/5 hover:border-white/10'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* Person */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0 text-lg"
                      style={{ background: getAvatarColor(personName || 'U') }}
                    >
                      {personName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline font-bold text-white truncate uppercase">{personName}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] uppercase rounded">
                          {req.offeredSkill}
                        </span>
                        <HiArrowRight size={12} className="text-slate-600 shrink-0" />
                        <span className="px-2 py-0.5 bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[10px] uppercase rounded">
                          {req.wantedSkill}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-mono">
                        {req.createdAt?.toDate
                          ? req.createdAt.toDate().toLocaleDateString()
                          : 'Just now'}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <p className="text-sm text-slate-500 italic flex-1 hidden lg:block">
                      "{req.message}"
                    </p>
                  )}

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    {/* Status Badge */}
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${status.bg} ${status.color} border ${status.border}`}>
                      {status.label}
                    </span>

                    {/* ✅ ACCEPT / REJECT buttons for pending incoming */}
                    {req.status === 'pending' && isIncoming && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(req)}
                          className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors border-none cursor-pointer"
                          title="Accept"
                        >
                          <HiCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(req)}
                          className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors border-none cursor-pointer"
                          title="Reject"
                        >
                          <HiX size={18} />
                        </button>
                      </div>
                    )}

                    {/* ✅ START SESSION button for accepted swaps */}
                    {isAccepted && (
                      <button
                        onClick={() => navigate(`/session/${req.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary-fixed font-headline font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(133,173,255,0.3)]"
                      >
                        <span className="material-symbols-outlined text-sm">video_call</span>
                        Start Session
                      </button>
                    )}

                    {/* ✅ VIEW SESSION button for completed swaps */}
                    {isCompleted && (
                      <button
                        onClick={() => navigate(`/session/${req.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-tertiary/20 text-tertiary border border-tertiary/30 font-headline font-black uppercase tracking-widest text-[10px] hover:bg-tertiary/30 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">celebration</span>
                        View Session
                      </button>
                    )}
                  </div>
                </div>

                {/* Message on mobile */}
                {req.message && (
                  <p className="text-sm text-slate-500 italic mt-3 lg:hidden">
                    "{req.message}"
                  </p>
                )}

                {/* ✅ Accepted banner hint */}
                {isAccepted && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
                      Swap accepted! Click "Start Session" to begin your video call and teach each other.
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}