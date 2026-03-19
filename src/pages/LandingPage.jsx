import { Link } from 'react-router-dom';
import { HiArrowRight, HiStar, HiAcademicCap, HiUserGroup, HiShieldCheck, HiSwitchHorizontal, HiRefresh } from 'react-icons/hi';
import { getAvatarColor } from '../utils/constants';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const features = [
  { icon: HiSwitchHorizontal, title: 'Skill Exchange', desc: 'Trade your expertise for new knowledge. No money needed.' },
  { icon: HiAcademicCap, title: 'Gamified Learning', desc: 'Earn XP, coins, and badges as you learn and teach.' },
  { icon: HiUserGroup, title: 'Global Community', desc: 'Connect with learners and teachers from around the world.' },
  { icon: HiShieldCheck, title: 'Verified Skills', desc: 'Quiz-based verification ensures quality skill exchanges.' },
];

const steps = [
  { num: '01', title: 'List Your Skills', desc: 'Tell us what you can teach and what you want to learn.' },
  { num: '02', title: 'Find a Match', desc: 'Browse skill providers and send swap requests.' },
  { num: '03', title: 'Swap & Grow', desc: 'Exchange lessons, earn XP, and level up!' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Guitar Teacher', quote: 'I traded my guitar skills for Python lessons. Best decision ever! Already built my first web app.', rating: 5 },
  { name: 'Marcus Chen', role: 'Full-Stack Dev', quote: 'SkillSwap changed how I learn. Teaching React helped me understand it even better.', rating: 5 },
  { name: 'Sofia Rodriguez', role: 'Photographer', quote: 'The gamification keeps me motivated. My 30-day streak is my proudest achievement!', rating: 5 },
];

const Particles = () => {
    // Generate random stable particles inside the component to prevent react recreating DOM
    const particles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
  
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute bg-electric/30 rounded-full"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
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

const TypewriterText = ({ text, className }) => {
    const letters = Array.from(text);
    const container = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: 0.2 }
      }
    };
    const child = {
      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100 } },
      hidden: { opacity: 0, y: 10, filter: "blur(4px)" }
    };
    return (
      <motion.span variants={container} initial="hidden" animate="visible" className={className}>
        {letters.map((letter, index) => (
          <motion.span variants={child} key={index} className="inline-block">
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    );
};

export default function LandingPage() {
  return (
    <PageTransition className="min-h-screen bg-navy-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric to-neon-purple flex items-center justify-center">
              <motion.div
                whileHover={{ rotate: 360, transition: { repeat: Infinity, duration: 4, ease: "linear" } }}
              >
                <HiRefresh className="text-white" size={20} />
              </motion.div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-electric to-neon-purple bg-clip-text text-transparent">SkillSwap</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="btn-secondary text-sm py-2 px-5 no-underline">Log In</Link>
            <Link to="/auth?mode=signup" className="btn-primary text-sm py-2 px-5 no-underline">Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <Particles />
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px]" />
          
          {/* Floating Skill Tags */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-32 left-1/5 bg-white/5 border border-white/10 text-electric px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md hidden lg:block"
            style={{ left: '15%' }}
          >
            React
          </motion.div>
          <motion.div
            animate={{ y: [20, -20, 20] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
            className="absolute top-48 right-1/4 bg-white/5 border border-white/10 text-neon-pink px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md hidden lg:block"
            style={{ right: '15%' }}
          >
            Guitar
          </motion.div>
          <motion.div
            animate={{ y: [-10, 20, -10] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-32 left-1/3 bg-white/5 border border-white/10 text-neon-green px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md hidden lg:block"
            style={{ left: '25%' }}
          >
            Python
          </motion.div>
          <motion.div
            animate={{ y: [15, -15, 15] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-40 right-1/3 bg-white/5 border border-white/10 text-neon-purple px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md hidden lg:block"
            style={{ right: '25%' }}
          >
            Photography
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric/10 border border-electric/20 text-electric text-sm font-medium mb-8"
          >
            <HiRefresh size={16} /> The Future of Skill Exchange
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 flex flex-col items-center">
            <TypewriterText text="Trade What You Know," />
            <span className="bg-gradient-to-r from-electric via-neon-purple to-neon-pink bg-clip-text text-transparent mt-2">
                <TypewriterText text="Learn What You Don't" />
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Connect with skilled people worldwide. Exchange lessons in coding, music, languages, design, and more. No money — just pure knowledge trading.
          </motion.p>
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 2.2, duration: 0.5 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }} whileTap={{ scale: 0.95 }}>
                <Link to="/auth?mode=signup" className="btn-primary text-lg py-4 px-10 no-underline flex items-center gap-2 shrink-0">
                Start Swapping <HiArrowRight />
                </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/auth" className="btn-secondary text-lg py-4 px-10 no-underline shrink-0">Watch Demo</Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16"
          >
            <div><p className="text-3xl font-bold text-white">10K+</p><p className="text-sm text-gray-500">Active Users</p></div>
            <div><p className="text-3xl font-bold text-white">50K+</p><p className="text-sm text-gray-500">Skill Swaps</p></div>
            <div><p className="text-3xl font-bold text-white">120+</p><p className="text-sm text-gray-500">Skills Available</p></div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why SkillSwap?</h2>
            <p className="text-gray-400 text-lg">Everything you need to learn and teach, all in one platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="glass-card p-6 hover:border-electric/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric/20 to-neon-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="text-electric" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-navy-900/50 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Three simple steps to start your skill exchange journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i} 
                className="relative text-center group"
              >
                <div className="text-6xl font-extrabold text-electric/10 mb-4 group-hover:text-electric/20 transition-colors">{s.num}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
                {i < 2 && <div className="hidden md:block absolute top-8 -right-4 text-electric/30 text-3xl">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Learners</h2>
            <p className="text-gray-400 text-lg">Hear from our community of skill swappers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                key={i} 
                className="glass-card p-6 hover:border-electric/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <HiStar key={j} className="text-neon-orange" size={18} />)}
                </div>
                <p className="text-gray-300 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: getAvatarColor(t.name) }}>{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="glass-card p-12 glow-blue relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-electric/10 to-neon-purple/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Swapping?</h2>
              <p className="text-gray-400 mb-8 text-lg">Join thousands of learners and teachers. It's completely free.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link to="/auth?mode=signup" className="btn-primary text-lg py-4 px-10 no-underline flex items-center gap-2">Get Started Free <HiArrowRight /></Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HiRefresh className="text-electric" size={20} />
            <span className="font-bold text-white">SkillSwap</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 SkillSwap. Trade skills, not money.</p>
        </div>
      </footer>
    </PageTransition>
  );
}
