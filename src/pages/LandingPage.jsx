import { Link } from 'react-router-dom';
import { HiLightningBolt, HiArrowRight, HiStar, HiAcademicCap, HiUserGroup, HiShieldCheck, HiSwitchHorizontal } from 'react-icons/hi';
import { getAvatarColor } from '../data/demoData';

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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric to-neon-purple flex items-center justify-center">
              <HiLightningBolt className="text-white" size={20} />
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric/10 border border-electric/20 text-electric text-sm font-medium mb-8 slide-up">
            <HiLightningBolt size={16} /> The Future of Skill Exchange
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 slide-up">
            Trade What You Know,<br />
            <span className="bg-gradient-to-r from-electric via-neon-purple to-neon-pink bg-clip-text text-transparent">Learn What You Don't</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 slide-up">
            Connect with skilled people worldwide. Exchange lessons in coding, music, languages, design, and more. No money — just pure knowledge trading.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 slide-up">
            <Link to="/auth?mode=signup" className="btn-primary text-lg py-4 px-10 no-underline flex items-center gap-2 pulse-glow">
              Start Swapping <HiArrowRight />
            </Link>
            <Link to="/auth" className="btn-secondary text-lg py-4 px-10 no-underline">Watch Demo</Link>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 slide-up">
            <div><p className="text-3xl font-bold text-white">10K+</p><p className="text-sm text-gray-500">Active Users</p></div>
            <div><p className="text-3xl font-bold text-white">50K+</p><p className="text-sm text-gray-500">Skill Swaps</p></div>
            <div><p className="text-3xl font-bold text-white">120+</p><p className="text-sm text-gray-500">Skills Available</p></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why SkillSwap?</h2>
            <p className="text-gray-400 text-lg">Everything you need to learn and teach, all in one platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6 hover:border-electric/30 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric/20 to-neon-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="text-electric" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-navy-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Three simple steps to start your skill exchange journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-6xl font-extrabold text-electric/10 mb-4 group-hover:text-electric/20 transition-colors">{s.num}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
                {i < 2 && <div className="hidden md:block absolute top-8 -right-4 text-electric/30 text-3xl">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Learners</h2>
            <p className="text-gray-400 text-lg">Hear from our community of skill swappers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6 hover:border-electric/30 transition-all duration-300">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 glow-blue relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-electric/10 to-neon-purple/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Swapping?</h2>
              <p className="text-gray-400 mb-8 text-lg">Join thousands of learners and teachers. It's completely free.</p>
              <Link to="/auth?mode=signup" className="btn-primary text-lg py-4 px-10 no-underline inline-flex items-center gap-2">Get Started Free <HiArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HiLightningBolt className="text-electric" size={20} />
            <span className="font-bold text-white">SkillSwap</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 SkillSwap. Trade skills, not money.</p>
        </div>
      </footer>
    </div>
  );
}
