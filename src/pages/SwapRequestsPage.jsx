import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection, query, where, onSnapshot,
  doc, updateDoc, addDoc, serverTimestamp
} from 'firebase/firestore';
import { HiCheck, HiX, HiSwitchHorizontal, HiArrowRight } from 'react-icons/hi';

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
  accepted: { color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30', label: 'Accepted' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Rejected' },
};

export default function SwapRequestsPage() {
  const { user, profile } = useAuth();
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

    // Listen to incoming requests (where I am the receiver)
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
      (err) => {
        console.error('Incoming requests error:', err);
        incomingDone = true;
        checkDone();
      }
    );

    // Listen to outgoing requests (where I am the sender)
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
      (err) => {
        console.error('Outgoing requests error:', err);
        outgoingDone = true;
        checkDone();
      }
    );

    return () => { unsubIncoming(); unsubOutgoing(); };
  }, [user]);

  const handleAccept = async (req) => {
    try {
      // Update request status
      await updateDoc(doc(db, 'swapRequests', req.id), {
        status: 'accepted',
        updatedAt: serverTimestamp(),
      });

      // Add to activity feed
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
        <div className="w-10 h-10 border-4 border-electric border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Swap Requests</h1>
        <p className="text-gray-400 mt-1">Manage your skill exchange requests</p>
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
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border-none cursor-pointer ${tab === t.key
                ? 'bg-electric/20 text-electric border border-electric/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <HiSwitchHorizontal className="mx-auto text-gray-600" size={48} />
            <p className="text-gray-400 mt-4">No {tab} swap requests yet</p>
            {tab === 'incoming' && (
              <p className="text-gray-600 text-sm mt-2">
                When someone requests a swap with you, it'll appear here!
              </p>
            )}
            {tab === 'outgoing' && (
              <p className="text-gray-600 text-sm mt-2">
                Go to <a href="/explore" className="text-electric">Explore</a> to request a swap!
              </p>
            )}
          </div>
        ) : (
          displayed.map(req => {
            const isIncoming = tab === 'incoming';
            const personName = isIncoming ? req.fromName : req.toName;
            const status = statusConfig[req.status] || statusConfig.pending;

            return (
              <div key={req.id} className="glass-card p-5 hover:border-white/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* Person */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                      style={{ background: getAvatarColor(personName || 'U') }}
                    >
                      {personName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{personName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                        <span className="tag-green text-[11px]">{req.offeredSkill}</span>
                        <HiArrowRight size={12} className="text-gray-600 shrink-0" />
                        <span className="tag-blue text-[11px]">{req.wantedSkill}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {req.createdAt?.toDate
                          ? req.createdAt.toDate().toLocaleDateString()
                          : 'Just now'}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <p className="text-sm text-gray-400 italic flex-1 hidden lg:block">
                      "{req.message}"
                    </p>
                  )}

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.bg} ${status.color} border ${status.border}`}>
                      {status.label}
                    </span>

                    {req.status === 'pending' && isIncoming && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(req)}
                          className="w-9 h-9 rounded-lg bg-neon-green/20 text-neon-green flex items-center justify-center hover:bg-neon-green/30 transition-colors border-none cursor-pointer"
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
                  </div>
                </div>

                {/* Message on mobile */}
                {req.message && (
                  <p className="text-sm text-gray-400 italic mt-3 lg:hidden">
                    "{req.message}"
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}