import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToChats } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/explore', icon: 'explore', label: 'Explore' },
  { path: '/swaps', icon: 'swap_horiz', label: 'Swaps' },
  { path: '/practice', icon: 'fitness_center', label: 'Practice' },
  { path: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

const sideNavItems = [
  { path: '/dashboard', icon: 'home', label: 'Home' },
  { path: '/explore', icon: 'search', label: 'Explore Skills' },
  { path: '/swaps', icon: 'swap_horiz', label: 'My Swaps' },
  { path: '/practice', icon: 'exercise', label: 'Practice' },
  { path: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

export default function Layout({ children }) {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToChats(user.uid, (chats) => {
      const unreadCount = chats.reduce((sum, chat) => {
        return sum + (chat.unreadCount?.[user.uid] || 0);
      }, 0);
      setTotalUnread(unreadCount);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';
  if (isLandingPage) return <>{children}</>;

  const isChat = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary/30 overflow-x-hidden">

      {/* ── Top App Bar ─────────────────────────────────────── */}
      <header
        style={{ width: '100vw', left: 0, transform: 'translateZ(0)' }}
        className="fixed top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl h-16 md:h-20 flex justify-between items-center px-4 md:px-8"
      >
        <div className="flex items-center gap-3 md:gap-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              {sidebarOpen ? 'close' : 'menu'}
            </span>
          </button>

          <Link
            to="/dashboard"
            className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent font-headline tracking-tighter no-underline"
          >
            SkillSwap
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 font-headline font-bold uppercase tracking-widest text-[10px]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors no-underline ${location.pathname === item.path
                  ? 'text-blue-400 border-b-2 border-blue-500 pb-1'
                  : 'text-slate-400 hover:text-slate-100'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-all text-xl">
            notifications
          </button>
          <Link
            to="/chat"
            className="relative material-symbols-outlined text-slate-400 hover:text-primary transition-all text-xl no-underline"
          >
            chat_bubble
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-secondary/50 p-0.5 overflow-hidden block shrink-0">
            <img
              src={profile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'U')}&background=random`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </Link>
        </div>
      </header>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={`
        fixed left-0 top-0 flex flex-col h-full w-72
        border-r border-white/5 bg-slate-950/95 backdrop-blur-2xl
        z-40 pt-20 pb-6 px-4
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-white/5">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed shadow-[0_0_15px_rgba(133,173,255,0.4)] shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-headline font-black text-on-surface text-base leading-none truncate">
                {profile?.displayName || 'User'}
              </h3>
              <p className="font-label text-[10px] text-secondary uppercase tracking-widest mt-1">
                {profile?.level || 'Beginner'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sideNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 py-3 px-4 rounded-xl
                  transition-colors duration-200 no-underline
                  ${isActive
                    ? 'bg-primary/10 text-primary border-r-4 border-primary'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }
                `}
              >
                <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
                <span className="font-headline font-bold uppercase tracking-widest text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="font-headline font-black text-xs text-primary">⚡{profile?.xp || 0}</p>
                <p className="font-mono text-[7px] text-slate-600 uppercase">XP</p>
              </div>
              <div className="text-center">
                <p className="font-headline font-black text-xs text-secondary">🪙{profile?.coins || 0}</p>
                <p className="font-mono text-[7px] text-slate-600 uppercase">Coins</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="material-symbols-outlined text-slate-600 hover:text-error transition-colors p-2"
              title="Logout"
            >
              logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="lg:ml-72 pt-16 md:pt-20 overflow-x-hidden">
        {isChat ? (
          <div className="h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] px-4 md:px-8 py-4">
            {children}
          </div>
        ) : (
          // ✅ pb-24 ensures content isn't hidden behind bottom nav
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24">
            {children}
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Nav ────────────────────────────────── */}
      {/* ✅ bottom-nav-safe class uses translateZ(0) to pin to GPU layer
          This stops Chrome Android from bouncing it when address bar hides/shows */}
      <nav className="bottom-nav-safe lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { path: '/dashboard', icon: 'home' },
            { path: '/explore', icon: 'search' },
            { path: '/swaps', icon: 'swap_horiz' },
            { path: '/practice', icon: 'fitness_center' },
            { path: '/profile', icon: 'person' },
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center
                  w-12 h-12 rounded-xl transition-colors no-underline
                  ${isActive ? 'bg-primary/20 text-primary' : 'text-slate-600'}
                `}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
