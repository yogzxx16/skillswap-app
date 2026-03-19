import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QUIZ_QUESTIONS } from '../data/demoData';
import { HiAcademicCap, HiLightningBolt, HiClock, HiPhotograph, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const TABS = [
  { id: 'quiz', label: '🧠 Quick Quiz', icon: HiAcademicCap },
  { id: 'duel', label: '⚔️ Skill Duel', icon: HiLightningBolt },
  { id: 'spaced', label: '🔄 Spaced Repetition', icon: HiClock },
  { id: 'project', label: '📸 Mini Project', icon: HiPhotograph },
];

export default function PracticeZonePage() {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('quiz');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [quizState, setQuizState] = useState(null); // { q, answers, current, score, done }
  const [duelState, setDuelState] = useState(null);
  const [projectUploaded, setProjectUploaded] = useState(false);

  const totalXP = profile?.xp || 0;
  const practiceSkills = [...(profile?.teachSkills || []), ...(profile?.learnSkills || [])];

  // Quiz Logic
  const startQuiz = (skill) => {
    const questions = QUIZ_QUESTIONS[skill] || QUIZ_QUESTIONS['JavaScript'];
    setQuizState({ questions, current: 0, score: 0, done: false, selected: null, skill });
    setSelectedSkill(skill);
  };

  const answerQuiz = (idx) => {
    if (quizState.selected !== null) return;
    const isCorrect = idx === quizState.questions[quizState.current].answer;
    const newScore = quizState.score + (isCorrect ? 1 : 0);

    setQuizState(prev => ({ ...prev, selected: idx, score: newScore }));

    setTimeout(() => {
      if (quizState.current + 1 >= quizState.questions.length) {
        const xpEarned = newScore * 20;
        updateProfile({ xp: totalXP + xpEarned });
        setQuizState(prev => ({ ...prev, done: true, xpEarned }));
      } else {
        setQuizState(prev => ({ ...prev, current: prev.current + 1, selected: null }));
      }
    }, 1000);
  };

  // Duel Logic
  const startDuel = () => {
    setDuelState({ status: 'searching', opponent: null, round: 0, myScore: 0, oppScore: 0 });
    setTimeout(() => {
      setDuelState(prev => ({
        ...prev,
        status: 'battling',
        opponent: { name: 'Raj Patel', level: 'Master' },
        round: 1,
      }));
    }, 2000);
  };

  const duelAnswer = (correct) => {
    const oppCorrect = Math.random() > 0.4;
    setDuelState(prev => {
      const newRound = prev.round + 1;
      const myNew = prev.myScore + (correct ? 1 : 0);
      const oppNew = prev.oppScore + (oppCorrect ? 1 : 0);
      if (newRound > 5) {
        const xpEarned = myNew > oppNew ? 100 : 30;
        updateProfile({ xp: totalXP + xpEarned });
        return { ...prev, myScore: myNew, oppScore: oppNew, status: 'done', xpEarned, won: myNew > oppNew };
      }
      return { ...prev, myScore: myNew, oppScore: oppNew, round: newRound };
    });
  };

  // Spaced Repetition Data
  const spacedItems = [
    { skill: 'JavaScript Closures', dueIn: 'Due today', day: 1, status: 'due' },
    { skill: 'React Hooks', dueIn: 'Due in 2 days', day: 3, status: 'upcoming' },
    { skill: 'Python Decorators', dueIn: 'Due in 6 days', day: 7, status: 'upcoming' },
    { skill: 'Guitar Chord Transitions', dueIn: 'Due in 20 days', day: 21, status: 'upcoming' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Practice Zone</h1>
        <p className="text-gray-400 mt-1">Reinforce your skills and earn XP</p>
      </div>

      {/* XP Bar */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-electric/20 flex items-center justify-center shrink-0">
          <HiLightningBolt className="text-electric" size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-white">Practice XP</span>
            <span className="text-sm text-electric font-bold">⚡ {totalXP} XP</span>
          </div>
          <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-green to-electric rounded-full transition-all duration-500" style={{ width: `${Math.min((totalXP / 5000) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border-none cursor-pointer ${
              activeTab === t.id
                ? 'bg-electric/20 text-electric'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          {!quizState ? (
            <>
              <h3 className="text-lg font-semibold text-white">Select a skill to quiz on:</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {['JavaScript', 'Python', 'React', 'Guitar'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => startQuiz(skill)}
                    className="glass-card p-5 text-left hover:border-electric/30 transition-all group cursor-pointer border-white/10"
                  >
                    <h4 className="text-white font-semibold group-hover:text-electric transition-colors">{skill}</h4>
                    <p className="text-xs text-gray-500 mt-1">5 questions • +20 XP each</p>
                  </button>
                ))}
              </div>
            </>
          ) : quizState.done ? (
            <div className="glass-card p-8 text-center">
              <p className="text-5xl mb-4">{quizState.score >= 4 ? '🎉' : quizState.score >= 2 ? '👍' : '📚'}</p>
              <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
              <p className="text-gray-400 mb-2">{quizState.skill} • Score: {quizState.score}/{quizState.questions.length}</p>
              <p className="text-neon-green font-bold text-lg mb-6">+{quizState.xpEarned} XP earned!</p>
              <button onClick={() => setQuizState(null)} className="btn-primary">Try Another Quiz</button>
            </div>
          ) : (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Question {quizState.current + 1}/{quizState.questions.length}</span>
                <span className="text-sm text-neon-green font-medium">Score: {quizState.score}</span>
              </div>
              <div className="w-full h-1.5 bg-navy-800 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-electric rounded-full transition-all" style={{ width: `${((quizState.current + 1) / quizState.questions.length) * 100}%` }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-6">{quizState.questions[quizState.current].q}</h3>
              <div className="grid gap-3">
                {quizState.questions[quizState.current].options.map((opt, i) => {
                  const isAnswer = i === quizState.questions[quizState.current].answer;
                  const isSelected = quizState.selected === i;
                  let btnClass = 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10';
                  if (quizState.selected !== null) {
                    if (isAnswer) btnClass = 'bg-neon-green/20 text-neon-green border border-neon-green/30';
                    else if (isSelected) btnClass = 'bg-red-500/20 text-red-400 border border-red-500/30';
                  }
                  return (
                    <button key={i} onClick={() => answerQuiz(i)} className={`p-4 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${btnClass} flex items-center gap-3`}>
                      <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-xs">{String.fromCharCode(65 + i)}</span>
                      {opt}
                      {quizState.selected !== null && isAnswer && <HiCheckCircle className="ml-auto text-neon-green" size={20} />}
                      {quizState.selected !== null && isSelected && !isAnswer && <HiXCircle className="ml-auto text-red-400" size={20} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'duel' && (
        <div className="space-y-4">
          {!duelState ? (
            <div className="glass-card p-8 text-center">
              <p className="text-5xl mb-4">⚔️</p>
              <h3 className="text-2xl font-bold text-white mb-2">Skill Duel</h3>
              <p className="text-gray-400 mb-6">Challenge another user to a live quiz battle! Winner gets 100 XP.</p>
              <button onClick={startDuel} className="btn-primary">Find Opponent</button>
            </div>
          ) : duelState.status === 'searching' ? (
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-electric border-t-transparent animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Finding opponent...</h3>
              <p className="text-gray-400">Matching you with a worthy challenger</p>
            </div>
          ) : duelState.status === 'done' ? (
            <div className="glass-card p-8 text-center">
              <p className="text-5xl mb-4">{duelState.won ? '🏆' : '💪'}</p>
              <h3 className="text-2xl font-bold text-white mb-2">{duelState.won ? 'You Won!' : 'Good Fight!'}</h3>
              <p className="text-gray-400 mb-2">You: {duelState.myScore} vs {duelState.opponent.name}: {duelState.oppScore}</p>
              <p className="text-neon-green font-bold text-lg mb-6">+{duelState.xpEarned} XP earned!</p>
              <button onClick={() => setDuelState(null)} className="btn-primary">Play Again</button>
            </div>
          ) : (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400">You</p>
                  <p className="text-2xl font-bold text-electric">{duelState.myScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Round {duelState.round}/5</p>
                  <p className="text-2xl">⚔️</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">{duelState.opponent.name}</p>
                  <p className="text-2xl font-bold text-neon-pink">{duelState.oppScore}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Do you know the answer?</h3>
              <div className="flex gap-4 justify-center">
                <button onClick={() => duelAnswer(true)} className="btn-primary px-8">I Know It! ✓</button>
                <button onClick={() => duelAnswer(false)} className="btn-secondary px-8">Skip ✗</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'spaced' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Spaced Repetition Schedule</h3>
          <p className="text-sm text-gray-400">Review at day 1, 3, 7, and 21 for optimal retention.</p>
          <div className="space-y-3">
            {spacedItems.map((item, i) => (
              <div key={i} className={`glass-card p-4 flex items-center gap-4 ${item.status === 'due' ? 'border-neon-orange/30' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.status === 'due' ? 'bg-neon-orange/20 text-neon-orange' : 'bg-white/5 text-gray-500'
                }`}>
                  <span className="text-sm font-bold">D{item.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{item.skill}</p>
                  <p className="text-xs text-gray-500">{item.dueIn}</p>
                </div>
                <button className={`text-sm font-medium px-4 py-2 rounded-lg transition-all border-none cursor-pointer ${
                  item.status === 'due'
                    ? 'bg-neon-orange/20 text-neon-orange hover:bg-neon-orange/30'
                    : 'bg-white/5 text-gray-500'
                }`}>
                  {item.status === 'due' ? 'Review Now' : 'Scheduled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'project' && (
        <div className="space-y-4">
          {!projectUploaded ? (
            <div className="glass-card p-8 text-center border-dashed border-2 border-white/10 hover:border-electric/30 transition-colors">
              <HiPhotograph className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Upload Mini Project</h3>
              <p className="text-gray-400 mb-6">Share a photo or screenshot proving you practiced a skill.</p>
              <button
                onClick={() => { setProjectUploaded(true); updateProfile({ xp: totalXP + 50 }); }}
                className="btn-primary"
              >
                📸 Upload Photo (+50 XP)
              </button>
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="text-2xl font-bold text-white mb-2">Project Uploaded!</h3>
              <p className="text-neon-green font-bold text-lg mb-4">+50 XP earned!</p>
              <p className="text-gray-400 mb-6">Your mini project has been added to your portfolio.</p>
              <button onClick={() => setProjectUploaded(false)} className="btn-secondary">Upload Another</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
