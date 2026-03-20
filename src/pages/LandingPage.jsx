import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const Particles = () => {
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#85adff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bg-primary/20 rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -60, 0],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  return (
    <PageTransition className="relative min-h-screen bg-background text-on-background font-body overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] h-20 flex justify-between items-center px-8">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent font-headline tracking-tighter">SkillSwap</span>
          <nav className="hidden md:flex items-center space-x-8 font-headline font-bold uppercase tracking-widest text-[10px] text-slate-400">
            <a className="hover:text-slate-100 transition-colors no-underline" href="#features">Features</a>
            <a className="hover:text-slate-100 transition-colors no-underline" href="#stats">Protocol</a>
            <a className="hover:text-slate-100 transition-colors no-underline" href="#manifesto">Manifesto</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/auth" className="text-[10px] font-headline font-bold uppercase tracking-widest text-slate-400 hover:text-white no-underline">Log In</Link>
          <Link to="/auth?mode=signup" className="px-6 py-2 bg-primary-container text-on-primary-container font-headline font-bold tracking-tight rounded-sm hover:scale-105 transition-all text-xs no-underline">
            INITIALIZE
          </Link>
        </div>
      </header>

      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center px-8 md:px-24 overflow-hidden">
          <Particles />
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-[0.2em] uppercase">
                Protocol v2.4 Active
              </div>
              <h1 className="font-headline font-black text-5xl md:text-8xl tracking-tighter leading-none text-gradient">
                Trade what you know.<br />Learn what you don't.
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-xl leading-relaxed">
                The definitive peer-to-peer exchange for elite skill acquisition. Master high-stakes disciplines through the SkillSwap Protocol.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth?mode=signup" className="px-8 py-4 bg-primary-container text-on-primary-container font-headline font-bold tracking-tight rounded-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(133,173,255,0.4)] transition-all duration-300 active:scale-95 group flex items-center gap-2 no-underline">
                  INITIALIZE PROTOCOL
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <button className="px-8 py-4 glass-panel text-on-surface font-headline font-bold tracking-tight rounded-sm border border-outline-variant/30 hover:bg-white/5 transition-all duration-300">
                  VIEW MANIFESTO
                </button>
              </div>
            </motion.div>

            {/* 3D Phone Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 12 }}
              viewport={{ once: true }}
              className="relative perspective-1000 hidden lg:block"
            >
              <div className="relative w-[320px] h-[640px] mx-auto bg-surface-container-lowest border-[8px] border-surface-container-highest rounded-[3rem] shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-8 bg-surface-container-highest flex items-center justify-center z-20">
                  <div className="w-20 h-4 bg-black rounded-full"></div>
                </div>
                <img 
                  className="w-full h-full object-cover opacity-80" 
                  src="https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=2070&auto=format&fit=crop" 
                  alt="App interface" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                <div className="absolute bottom-8 inset-x-6 p-6 glass-panel rounded-xl">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-mono text-secondary mb-1">CURRENT RANK</p>
                      <p className="text-xl font-headline font-bold">Elite Swapper</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-tertiary mb-1">XP POOL</p>
                      <p className="text-xl font-headline font-bold text-tertiary">14.2k</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-24 h-24 glass-panel rounded-lg flex items-center justify-center shadow-xl"
              >
                <span className="material-symbols-outlined text-4xl text-primary">terminal</span>
              </motion.div>
              <motion.div 
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/2 -left-20 w-32 h-16 glass-panel rounded-lg flex items-center px-4 gap-3 shadow-xl"
              >
                <span className="material-symbols-outlined text-2xl text-secondary">palette</span>
                <span className="text-xs font-bold uppercase tracking-tighter">Design</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 px-8 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="md:col-span-2 group relative h-[400px] overflow-hidden rounded-xl border border-white/5 bg-surface-container-low transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            >
              <img 
                alt="The Arena" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
              <div className="absolute bottom-0 p-10 space-y-4">
                <span className="text-secondary font-mono text-xs tracking-[0.3em] uppercase">Module 01</span>
                <h3 className="text-4xl font-headline font-black tracking-tighter">Skill Forest Arena</h3>
                <p className="max-w-md text-on-surface-variant leading-relaxed">Engage in real-time knowledge exchange sessions. Every duel increases your protocol standing and unlocks tier-restricted knowledge vaults.</p>
                <div className="pt-4 flex gap-4">
                  <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-[10px] font-bold border border-white/10 uppercase">Global Access</span>
                  <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-[10px] font-bold border border-white/10 uppercase">Low Latency</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="relative group h-[400px] rounded-xl overflow-hidden border-2 border-primary/40 shadow-[0_0_30px_rgba(133,173,255,0.2)] bg-surface-container flex flex-col p-8 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-4xl text-primary">bolt</span>
                  <span className="text-[10px] font-mono text-primary font-bold animate-pulse">LIVE EVENT</span>
                </div>
                <div className="mt-auto space-y-4">
                  <h3 className="text-2xl font-headline font-bold">Daily Protocol Spike</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Complete a 15-minute Python sprint to earn double XP and a 'Code Runner' badge.</p>
                  <Link to="/dashboard" className="w-full py-4 bg-primary text-on-primary-fixed font-headline font-black text-xs tracking-widest uppercase hover:bg-white transition-colors text-center no-underline">
                    ACCEPT CHALLENGE
                  </Link>
                </div>
              </div>
            </motion.div>

            <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-4 hover:border-secondary/50 transition-all duration-300 group">
              <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform">diversity_3</span>
              <h4 className="text-xl font-headline font-bold">The Collective</h4>
              <p className="text-sm text-on-surface-variant">Connect with over 2M+ experts across 450 disciplines. The network effect is exponential.</p>
            </div>
            <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-4 hover:border-tertiary/50 transition-all duration-300 group">
              <span className="material-symbols-outlined text-tertiary text-3xl group-hover:scale-110 transition-transform">shield</span>
              <h4 className="text-xl font-headline font-bold">Vault Security</h4>
              <p className="text-sm text-on-surface-variant">Your proprietary knowledge remains yours. We use zero-knowledge proofs for verification.</p>
            </div>
            <div className="glass-panel p-8 rounded-xl border border-white/5 space-y-4 hover:border-primary/50 transition-all duration-300 group">
              <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">leaderboard</span>
              <h4 className="text-xl font-headline font-bold">Global Ranks</h4>
              <p className="text-sm text-on-surface-variant">Compete for the top spot on the seasonal leaderboard and earn governance tokens.</p>
            </div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section id="stats" className="py-24 bg-surface-container-lowest relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-12 p-12 justify-center pointer-events-none">
            <span className="text-6xl font-headline font-black opacity-20 transform translate-y-12">RUST</span>
            <span className="text-4xl font-headline font-black opacity-10 transform -translate-y-8">UI/UX</span>
            <span className="text-5xl font-headline font-black opacity-30 transform translate-y-20">SOLANA</span>
            <span className="text-3xl font-headline font-black opacity-10 transform -translate-y-24">PYTHON</span>
            <span className="text-7xl font-headline font-black opacity-20 transform translate-y-4">WEB3</span>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-headline font-black text-primary">42M+</p>
              <p className="text-[10px] font-mono tracking-widest text-on-surface-variant uppercase">Skills Swapped</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-headline font-black text-secondary">180</p>
              <p className="text-[10px] font-mono tracking-widest text-on-surface-variant uppercase">Countries Active</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-headline font-black text-tertiary">99.9%</p>
              <p className="text-[10px] font-mono tracking-widest text-on-surface-variant uppercase">Uptime protocol</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-headline font-black text-white">4.9k</p>
              <p className="text-[10px] font-mono tracking-widest text-on-surface-variant uppercase">Daily Duels</p>
            </div>
          </div>
        </section>

        {/* XP Bars / Progress */}
        <section className="py-24 px-8 md:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-panel p-12 rounded-xl relative"
          >
            <div className="absolute -top-6 left-12 px-6 py-2 bg-secondary text-on-secondary font-headline font-black text-sm uppercase tracking-tighter shadow-lg">Community Momentum</div>
            <h3 className="text-3xl font-headline font-bold mb-12">Current Seasonal Progress</h3>
            <div className="space-y-10">
              <div className="space-y-3">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <span>The Great Reset (Developer Skills)</span>
                  <span>84% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '84%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-secondary to-tertiary relative shimmer-bar"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <span>Creative Surge (Design Focus)</span>
                  <span>62% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '62%' }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary relative shimmer-bar"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <div className="text-lg font-black text-slate-100 font-headline tracking-tighter uppercase">SkillSwap Protocol</div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-slate-600 font-mono text-[10px] tracking-tight hover:text-cyan-400 transition-colors no-underline" href="#">Terms of Engagement</a>
          <a className="text-slate-600 font-mono text-[10px] tracking-tight hover:text-cyan-400 transition-colors no-underline" href="#">Privacy Grid</a>
          <a className="text-slate-600 font-mono text-[10px] tracking-tight hover:text-cyan-400 transition-colors no-underline" href="#">Kernel Status</a>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-500 hover:text-primary cursor-pointer transition-colors">brand_awareness</span>
          <span className="material-symbols-outlined text-slate-500 hover:text-primary cursor-pointer transition-colors">terminal</span>
          <span className="material-symbols-outlined text-slate-500 hover:text-primary cursor-pointer transition-colors">hub</span>
        </div>
        <p className="font-mono text-[10px] tracking-tight text-slate-700 uppercase">© 2026 SKILLSWAP PROTOCOL. ALL RIGHTS RESERVED.</p>
      </footer>
    </PageTransition>
  );
}
