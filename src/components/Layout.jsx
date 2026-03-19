import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarColor } from '../data/demoData';
import {
  HiHome, HiGlobe, HiSwitchHorizontal, HiChatAlt2,
  HiAcademicCap, HiChartBar, HiUser, HiLogout, HiMenu, HiX, HiLightningBolt
} from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { path: '/explore', icon: HiGlobe, label: 'Explore' },
  { path: '/swaps', icon: HiSwitchHorizontal, label: 'Swaps' },
  { path: '/chat', icon: HiChatAlt2, label: 'Chat' },
  { path: '/practice', icon: HiAcademicCap, label: 'Practice' },
  { path: '/leaderboard', icon: HiChartBar, label: 'Leaderboard' },
  { path: '/profile', icon: HiUser, label: 'Profile' },
];

export default function Layout({ children }) {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const avatarColor = getAvatarColor(profile?.displayName || 'User');

  return (
    <div className="flex min-h-screen bg-navy-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy-950/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
          {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <HiLightningBolt className="text-electric" size={24} />
          <span className="font-bold text-lg bg-gradient-to-r from-electric to-neon-purple bg-clip-text text-transparent">SkillSwap</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: avatarColor }}>
          {profile?.displayName?.charAt(0) || 'U'}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-950/60 backdrop-blur-2xl border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.2)] transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-3 no-underline" onClick={() => setSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-neon-purple flex items-center justify-center">
              <HiLightningBolt className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-electric to-neon-purple bg-clip-text text-transparent">SkillSwap</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="px-4 py-4">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: avatarColor }}>
              {profile?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile?.displayName}</p>
              <p className="text-xs text-gray-400">{profile?.level || 'Beginner'} • {profile?.xp || 0} XP</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                  isActive
                    ? 'bg-electric/20 text-electric border border-electric/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Stats Quick View */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-white">🔥 {profile?.streak || 0}</p>
              <p className="text-[10px] text-gray-500">Streak</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">🪙 {profile?.coins || 0}</p>
              <p className="text-[10px] text-gray-500">Coins</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">⚡ {profile?.xp || 0}</p>
              <p className="text-[10px] text-gray-500">XP</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <HiLogout size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0 overflow-y-auto">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
