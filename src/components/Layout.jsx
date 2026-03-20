import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToChats } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/explore', icon: 'explore', label: 'Explore' },
  { path: '/practice', icon: 'fitness_center', label: 'Practice' },
  { path: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

const sideNavItems = [
  { path: '/dashboard', icon: 'home', label: 'Home' },
  { path: '/explore', icon: 'search', label: 'Explore Skills' },
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Skip layout for landing page or auth page if needed, but usually Layout is used for internal pages.
  // The mockup shows specific layouts for Landing and Dashboard.
  // I will assume Layout is for internal authenticated pages.
  const isLandingPage = location.pathname === '/';
  
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary/30">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] h-20 flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
          </button>
          
          <Link to="/dashboard" className="text-2xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent font-headline tracking-tighter no-underline">
            SkillSwap
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 font-headline font-bold uppercase tracking-widest text-[10px]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors no-underline ${
                  location.pathname === item.path 
                    ? 'text-blue-400 border-b-2 border-blue-500 pb-1' 
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-all duration-300 hover:scale-105">
            notifications
          </button>
          <Link to="/chat" className="relative material-symbols-outlined text-slate-400 hover:text-primary transition-all duration-300 hover:scale-105 no-underline">
            chat_bubble
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error rounded-full text-[8px] flex items-center justify-center font-bold">
                {totalUnread}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-secondary-fixed p-0.5 overflow-hidden block">
            <img 
              src={profile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'U')}&background=random`} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover" 
            />
          </Link>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className={`fixed left-0 top-0 flex flex-col py-8 px-4 h-full w-72 border-r border-white/5 bg-slate-950/80 backdrop-blur-2xl z-40 pt-24 transition-transform duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 px-4">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/10">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed shadow-[0_0_15px_rgba(133,173,255,0.4)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
            </div>
            <div>
              <h3 className="font-headline font-black text-on-surface text-lg leading-none">Level {profile?.level || 1}</h3>
              <p className="font-label text-[10px] text-secondary uppercase tracking-widest mt-1">{profile?.rank || 'Beginner'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {sideNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-300 no-underline hover:translate-x-2 ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 border-r-4 border-blue-500 shadow-[10px_0_15px_-5px_rgba(59,130,246,0.4)]' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-headline font-medium uppercase tracking-widest text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex justify-around py-4">
            <div className="relative group">
              <button className="material-symbols-outlined text-slate-600 hover:text-on-surface transition-colors">help</button>
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-64 p-4 glass-panel border border-white/10 text-[10px] leading-relaxed text-slate-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-2xl">
                <p className="font-headline font-black text-primary uppercase tracking-widest mb-1 text-[8px]">SkillSwap Guide</p>
                SkillSwap — Trade your skills, learn new ones. Teach what you know and learn what you don't — completely free, no money involved. Find a swap partner → Chat → Exchange skills → Practice what you learned → Earn XP and badges!
              </div>
            </div>
            <button onClick={handleLogout} className="material-symbols-outlined text-slate-600 hover:text-error transition-colors">logout</button>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-72 pt-28 px-4 md:px-10 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
