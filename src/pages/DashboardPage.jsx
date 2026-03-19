import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ACTIVITY_FEED, getXPForNextLevel } from '../data/demoData';
import { HiLightningBolt, HiTrendingUp, HiGift } from 'react-icons/hi';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [feed, setFeed] = useState(ACTIVITY_FEED.slice(0, 5));
  const [feedIndex, setFeedIndex] = useState(5);
  const [showChallenge, setShowChallenge] = useState(true);

  const xpInfo = getXPForNextLevel(profile?.xp || 0);
  const xpProgress = ((xpInfo.current / xpInfo.next) * 100).toFixed(0);

  // Rotate activity feed every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => {
        const newItem = ACTIVITY_FEED[feedIndex % ACTIVITY_FEED.length];
        setFeedIndex(i => i + 1);
        return [{ ...newItem, time: 'Just now' }, ...prev.slice(0, 4)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [feedIndex]);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Welcome back, {profile?.displayName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's your skill journey overview</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 group hover:border-neon-orange/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🔥</span>
            <span className="text-xs text-neon-orange bg-neon-orange/10 px-2 py-1 rounded-full">Daily</span>
          </div>
          <p className="text-3xl font-bold text-white">{profile?.streak || 0}</p>
          <p className="text-sm text-gray-400 mt-1">Day Streak</p>
        </div>

        <div className="glass-card p-5 group hover:border-neon-orange/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🪙</span>
            <span className="text-xs text-neon-green bg-neon-green/10 px-2 py-1 rounded-full">+50</span>
          </div>
          <p className="text-3xl font-bold text-white">{profile?.coins || 0}</p>
          <p className="text-sm text-gray-400 mt-1">SkillCoins</p>
        </div>

        <div className="glass-card p-5 group hover:border-electric/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">⚡</span>
            <HiTrendingUp className="text-electric" size={18} />
          </div>
          <p className="text-3xl font-bold text-white">{profile?.xp || 0}</p>
          <p className="text-sm text-gray-400 mt-1">Total XP</p>
        </div>

        <div className="glass-card p-5 group hover:border-neon-purple/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🏆</span>
            <span className="text-xs text-neon-purple bg-neon-purple/10 px-2 py-1 rounded-full">{profile?.level || 'Beginner'}</span>
          </div>
          <p className="text-3xl font-bold text-white">{profile?.badges?.length || 0}</p>
          <p className="text-sm text-gray-400 mt-1">Badges</p>
        </div>
      </div>

      {/* XP Progress */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Level Progress</h3>
            <p className="text-xs text-gray-400">{profile?.level} → {xpInfo.label}</p>
          </div>
          <span className="text-sm font-bold text-electric">{xpProgress}%</span>
        </div>
        <div className="w-full h-3 bg-navy-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-electric to-neon-purple rounded-full transition-all duration-1000"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{xpInfo.current} / {xpInfo.next} XP to {xpInfo.label}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Challenge */}
        {showChallenge && (
          <div className="glass-card p-5 border-neon-orange/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-orange/5 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <HiGift className="text-neon-orange" size={20} />
                <h3 className="text-sm font-semibold text-neon-orange">Daily Challenge</h3>
                <span className="text-xs bg-neon-orange/20 text-neon-orange px-2 py-0.5 rounded-full ml-auto">2x Coins</span>
              </div>
              <p className="text-white font-medium mb-1">Complete one swap today!</p>
              <p className="text-sm text-gray-400 mb-4">Finish a skill exchange session to earn double SkillCoins today.</p>
              <div className="flex items-center gap-3">
                <button className="btn-primary text-sm py-2 px-5">Accept Challenge</button>
                <button onClick={() => setShowChallenge(false)} className="text-sm text-gray-500 hover:text-gray-300 bg-transparent border-none cursor-pointer">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className={`glass-card p-5 ${!showChallenge ? 'lg:col-span-2' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Live Activity</h3>
          </div>
          <div className="space-y-3">
            {feed.map((item, i) => (
              <div
                key={`${item.user}-${i}`}
                className={`flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all ${i === 0 ? 'slide-up' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric/30 to-neon-purple/30 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                  {item.user.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">{item.user}</span>{' '}
                    <span className="text-gray-500">({item.city})</span>{' '}
                    {item.action}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Skills */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Your Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profile?.teachSkills?.map(s => <span key={s} className="tag-green">{s}</span>)}
          {profile?.learnSkills?.map(s => <span key={s} className="tag-blue">{s}</span>)}
        </div>
      </div>
    </div>
  );
}
