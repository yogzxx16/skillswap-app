import { useState } from 'react';
import { SWAP_REQUESTS, getAvatarColor } from '../utils/constants';
import { HiCheck, HiX, HiClock, HiSwitchHorizontal, HiArrowRight } from 'react-icons/hi';

const statusConfig = {
  pending: { color: 'text-neon-orange', bg: 'bg-neon-orange/10', border: 'border-neon-orange/30', label: 'Pending' },
  accepted: { color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30', label: 'Accepted' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Rejected' },
};

export default function SwapRequestsPage() {
  const [tab, setTab] = useState('incoming');
  const [requests, setRequests] = useState(SWAP_REQUESTS);

  const filtered = requests.filter(r => r.direction === tab);

  const handleAccept = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Swap Requests</h1>
        <p className="text-gray-400 mt-1">Manage your skill exchange requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['incoming', 'outgoing'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border-none cursor-pointer capitalize ${
              tab === t
                ? 'bg-electric/20 text-electric border border-electric/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t} ({requests.filter(r => r.direction === t).length})
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {filtered.map(req => {
          const person = req.direction === 'incoming' ? req.from : req.to;
          const status = statusConfig[req.status];

          return (
            <div key={req.id} className="glass-card p-5 hover:border-white/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Person */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: getAvatarColor(person?.displayName || 'U') }}
                  >
                    {person?.displayName?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{person?.displayName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                      <span className="tag-green text-[11px]">{req.offerSkill}</span>
                      <HiArrowRight size={12} className="text-gray-600 shrink-0" />
                      <span className="tag-blue text-[11px]">{req.wantSkill}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-400 italic flex-1 hidden lg:block">"{req.message}"</p>

                {/* Status + Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.bg} ${status.color} border ${status.border}`}>
                    {status.label}
                  </span>

                  {req.status === 'pending' && req.direction === 'incoming' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="w-9 h-9 rounded-lg bg-neon-green/20 text-neon-green flex items-center justify-center hover:bg-neon-green/30 transition-colors border-none cursor-pointer"
                      >
                        <HiCheck size={18} />
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors border-none cursor-pointer"
                      >
                        <HiX size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Message on mobile */}
              <p className="text-sm text-gray-400 italic mt-3 lg:hidden">"{req.message}"</p>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <HiSwitchHorizontal className="mx-auto text-gray-600" size={48} />
            <p className="text-gray-400 mt-4">No {tab} swap requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
