import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const QUESTIONS = {
  JavaScript: [
    { q: "What does 'typeof null' return in JavaScript?", 
      options: ["null", "object", "undefined", "string"], 
      correct: 1 },
    { q: "Which method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correct: 0 },
    { q: "What is a closure in JavaScript?",
      options: [
        "A function with no parameters",
        "A function that remembers its outer scope",
        "A loop that never ends",
        "An error handling method"
      ],
      correct: 1 },
    { q: "What does '===' check in JavaScript?",
      options: [
        "Only value",
        "Only type", 
        "Both value and type",
        "Neither"
      ],
      correct: 2 },
    { q: "Which keyword declares a block-scoped variable?",
      options: ["var", "let", "function", "global"],
      correct: 1 }
  ],
  Python: [
    { q: "What is the output of print(type([]))?",
      options: ["list", "<class 'list'>", "array", "[]"],
      correct: 1 },
    { q: "Which symbol is used for comments in Python?",
      options: ["//", "/*", "#", "--"],
      correct: 2 },
    { q: "What does len() function do?",
      options: [
        "Returns the last element",
        "Returns the length of an object",
        "Deletes an element",
        "Loops through a list"
      ],
      correct: 1 },
    { q: "How do you create a dictionary in Python?",
      options: ["[]", "()", "{}", "<>"],
      correct: 2 },
    { q: "What is a lambda in Python?",
      options: [
        "A type of loop",
        "An anonymous function",
        "A class method",
        "A variable type"
      ],
      correct: 1 }
  ],
  Guitar: [
    { q: "How many strings does a standard guitar have?",
      options: ["4", "5", "6", "8"],
      correct: 2 },
    { q: "What is a chord?",
      options: [
        "A single note",
        "Multiple notes played together",
        "A type of guitar",
        "A music genre"
      ],
      correct: 1 },
    { q: "What does a capo do?",
      options: [
        "Tunes the guitar",
        "Changes the key without retuning",
        "Mutes the strings",
        "Holds the pick"
      ],
      correct: 1 },
    { q: "Which part do you press to change notes?",
      options: ["Body", "Fretboard", "Bridge", "Tuning peg"],
      correct: 1 },
    { q: "What is strumming?",
      options: [
        "Pressing the strings",
        "Tuning the guitar",
        "Sweeping across strings with a pick",
        "Removing strings"
      ],
      correct: 2 }
  ],
  Design: [
    { q: "What does UI stand for?",
      options: [
        "User Interface",
        "Universal Integration",
        "Unique Identity",
        "User Interaction"
      ],
      correct: 0 },
    { q: "What is the rule of thirds in design?",
      options: [
        "Use 3 colors only",
        "Divide canvas into 9 equal parts",
        "Use 3 fonts maximum",
        "Design in 3 steps"
      ],
      correct: 1 },
    { q: "What does whitespace do in design?",
      options: [
        "Wastes space",
        "Improves readability and focus",
        "Makes designs look empty",
        "Reduces file size"
      ],
      correct: 1 },
    { q: "What is a wireframe?",
      options: [
        "A finished design",
        "A basic layout blueprint",
        "A color scheme",
        "A font collection"
      ],
      correct: 1 },
    { q: "What does contrast mean in design?",
      options: [
        "Using similar colors",
        "Making everything the same size",
        "Difference between elements to create emphasis",
        "Adding shadows"
      ],
      correct: 2 }
  ],
  Spanish: [
    { q: "How do you say 'Hello' in Spanish?",
      options: ["Bonjour", "Hola", "Ciao", "Hallo"],
      correct: 1 },
    { q: "What does 'Gracias' mean?",
      options: ["Please", "Sorry", "Thank you", "Hello"],
      correct: 2 },
    { q: "How do you say 'Good morning' in Spanish?",
      options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hola"],
      correct: 1 },
    { q: "What does 'Casa' mean in Spanish?",
      options: ["Car", "House", "Street", "Food"],
      correct: 1 },
    { q: "How do you say 'I don't understand' in Spanish?",
      options: [
        "No entiendo",
        "No problema",
        "No gracias",
        "No habla"
      ],
      correct: 0 }
  ]
};

const POPULAR_SKILLS = ["JavaScript", "Python", "Guitar", "Design", "Spanish"];

export default function PracticeZonePage() {
  const { profile, updateProfile } = useAuth();
  const [duelState, setDuelState] = useState('SKILL_SELECTION'); // SKILL_SELECTION, QUIZ, RESULTS
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastUserAnswer, setLastUserAnswer] = useState(null);
  const [lastAiAnswer, setLastAiAnswer] = useState(null);
  const [showXpGain, setShowXpGain] = useState(false);

  const startPractice = (skill) => {
    setSelectedSkill(skill);
    setDuelState('QUIZ');
    setCurrentQuestionIndex(0);
    setUserScore(0);
    setAiScore(0);
    setIsAnswered(false);
    setLastUserAnswer(null);
    setLastAiAnswer(null);
  };

  const handleUserAnswer = (index) => {
    if (isAnswered) return;
    
    const currentQuestions = QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'];
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = index === question.correct;
    
    setLastUserAnswer(index);
    setIsAnswered(true);

    if (isCorrect) {
      setUserScore(prev => prev + 1);
      setShowXpGain(true);
      setTimeout(() => setShowXpGain(false), 1000);
    }

    // AI logic
    setTimeout(() => {
      const aiCorrect = Math.random() < 0.7; // 70% accuracy
      let aiAns;
      if (aiCorrect) {
        aiAns = question.correct;
        setAiScore(prev => prev + 1);
      } else {
        const wrongOptions = [0, 1, 2, 3].filter(i => i !== question.correct);
        aiAns = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      }
      setLastAiAnswer(aiAns);

      // Next question after a delay
      setTimeout(() => {
        if (currentQuestionIndex < 4) {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsAnswered(false);
          setLastUserAnswer(null);
          setLastAiAnswer(null);
        } else {
          setDuelState('RESULTS');
          // Update XP in Firestore
          const finalScore = userScore + (isCorrect ? 1 : 0);
          const xpGained = finalScore * 20;
          if (updateProfile) {
             updateProfile({ xp: (profile?.xp || 0) + xpGained });
          }
        }
      }, 2000);
    }, 1500);
  };

  const availableSkills = Array.from(new Set([
    ...(profile?.teachSkills || []),
    ...(profile?.learnSkills || []),
    ...POPULAR_SKILLS
  ]));

  return (
    <PageTransition className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Neural Sync Header */}
      <section className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-xs animate-pulse">psychology</span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-tertiary uppercase">Practice Session</span>
          </div>
          <h1 className="font-headline font-black text-3xl uppercase italic tracking-tighter">Practice <span className="text-tertiary">Arena</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="glass-panel px-4 py-2 border-r-4 border-tertiary flex flex-col items-end">
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Global Rank</span>
              <span className="font-headline font-black text-lg">Top 4%</span>
           </div>
        </div>
      </section>

      {/* Main Duel Screen */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
        <AnimatePresence mode="wait">
          {duelState === 'SKILL_SELECTION' ? (
            <motion.div 
              key="skill_selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 glass-panel border border-white/5 rounded-2xl p-8 overflow-y-auto"
            >
              <div className="space-y-2">
                <h2 className="font-headline font-black text-4xl uppercase italic tracking-widest">Choose a Skill</h2>
                <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">Select a topic to start your practice duel</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-4xl">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-6 glass-panel border-2 transition-all flex flex-col items-center gap-3 group ${
                      selectedSkill === skill ? 'border-tertiary bg-tertiary/10 scale-105' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
                      {skill === 'JavaScript' ? 'javascript' : skill === 'Python' ? 'terminal' : skill === 'Guitar' ? 'music_note' : skill === 'Design' ? 'palette' : 'language'}
                    </span>
                    <span className="font-headline font-bold text-xs uppercase tracking-tighter">{skill}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => selectedSkill && startPractice(selectedSkill)}
                disabled={!selectedSkill}
                className={`px-12 py-4 font-headline font-black uppercase tracking-widest text-xs transition-all ${
                  selectedSkill 
                    ? 'bg-tertiary text-on-tertiary-fixed hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,163,133,0.3)]' 
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
                }`}
              >
                Start Practice
              </button>
            </motion.div>
          ) : duelState === 'QUIZ' ? (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col w-full gap-6"
            >
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-tertiary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                />
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-6 relative">
                {/* User Side */}
                <div className={`flex-1 glass-panel rounded-2xl p-8 border-l-4 transition-all ${isAnswered && lastUserAnswer === (QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].correct ? 'border-primary' : 'border-white/10'} relative flex flex-col justify-between`}>
                  <div className="absolute top-0 left-0 p-4 font-mono text-[8px] text-slate-500 tracking-widest uppercase">You</div>
                  <div className="text-center space-y-2">
                    <h3 className="font-headline font-black text-3xl italic uppercase">{profile?.displayName?.split(' ')[0] || 'USER'}</h3>
                    <div className="font-headline font-black text-5xl text-primary">{userScore}</div>
                  </div>

                  <AnimatePresence>
                    {showXpGain && (
                      <motion.div 
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -50 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 -translate-x-1/2 top-1/2 font-headline font-black text-2xl text-primary pointer-events-none"
                      >
                        +20 XP
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="h-24 flex items-center justify-center">
                    {isAnswered && lastUserAnswer !== null && (
                      <span className={`material-symbols-outlined text-6xl ${lastUserAnswer === (QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].correct ? 'text-primary' : 'text-secondary'}`}>
                        {lastUserAnswer === (QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].correct ? 'check_circle' : 'cancel'}
                      </span>
                    )}
                  </div>
                </div>

                {/* VS & Question Center */}
                <div className="flex-[2] flex flex-col gap-6">
                   <div className="glass-panel rounded-2xl p-8 border border-white/5 flex-1 flex flex-col items-center justify-center text-center space-y-8">
                      <div className="font-mono text-[10px] text-tertiary uppercase tracking-[0.3em]">Question {currentQuestionIndex + 1} / 5</div>
                      <h2 className="font-headline font-black text-2xl md:text-3xl uppercase italic leading-tight">
                        {(QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].q}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {(QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].options.map((option, idx) => {
                          const isCorrect = idx === (QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].correct;
                          const isSelected = lastUserAnswer === idx;
                          const isAiSelected = lastAiAnswer === idx;
                          
                          let btnClass = "border-white/10 hover:border-white/30";
                          if (isAnswered) {
                            if (isCorrect) btnClass = "border-primary bg-primary/10 text-primary";
                            else if (isSelected) btnClass = "border-secondary bg-secondary/10 text-secondary";
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleUserAnswer(idx)}
                              disabled={isAnswered}
                              className={`p-4 border-2 font-headline font-bold text-sm uppercase tracking-tighter transition-all relative flex items-center justify-center ${btnClass} ${isAnswered ? 'cursor-default' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                              {option}
                              {isAiSelected && (
                                <div className="absolute -right-2 -top-2 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-[10px] animate-bounce">AI</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                   </div>
                </div>

                {/* AI Side */}
                <div className={`flex-1 glass-panel rounded-2xl p-8 border-r-4 transition-all ${isAnswered && lastAiAnswer === (QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].correct ? 'border-secondary' : 'border-white/10'} relative flex flex-col justify-between`}>
                  <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-slate-500 tracking-widest uppercase text-right">Opponent: AI</div>
                  <div className="text-center space-y-2">
                    <h3 className="font-headline font-black text-3xl italic uppercase text-secondary">AI BOT</h3>
                    <div className="font-headline font-black text-5xl text-secondary">{aiScore}</div>
                  </div>
                  
                  <div className="h-24 flex items-center justify-center">
                    {lastAiAnswer !== null ? (
                      <span className={`material-symbols-outlined text-6xl ${lastAiAnswer === (QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].correct ? 'text-secondary' : 'text-slate-600'}`}>
                        {lastAiAnswer === (QUESTIONS[selectedSkill] || QUESTIONS['JavaScript'])[currentQuestionIndex].correct ? 'check_circle' : 'cancel'}
                      </span>
                    ) : isAnswered ? (
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-slate-800">memory</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 glass-panel border border-white/5 rounded-2xl p-8"
            >
              <div className="w-32 h-32 rounded-full border-4 border-tertiary flex items-center justify-center shadow-[0_0_40px_rgba(255,163,133,0.2)]">
                <span className="material-symbols-outlined text-6xl text-tertiary">
                  {userScore > aiScore ? 'emoji_events' : userScore < aiScore ? 'sentiment_very_dissatisfied' : 'handshake'}
                </span>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-headline font-black text-5xl uppercase italic tracking-widest text-tertiary">
                  {userScore > aiScore ? 'You Victory!' : userScore < aiScore ? 'Defeated' : 'Draw'}
                </h2>
                <div className="flex items-center gap-8 justify-center">
                  <div className="text-center">
                    <div className="font-mono text-[10px] text-slate-500 uppercase">Your Score</div>
                    <div className="font-headline font-black text-4xl">{userScore}/5</div>
                  </div>
                  <div className="font-headline font-black text-2xl text-slate-700 italic">VS</div>
                  <div className="text-center">
                    <div className="font-mono text-[10px] text-slate-500 uppercase">AI Score</div>
                    <div className="font-headline font-black text-4xl text-secondary">{aiScore}/5</div>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-xl inline-block">
                  <span className="font-headline font-black text-xl text-primary">+{userScore * 20} XP EARNED</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => startPractice(selectedSkill)}
                  className="px-10 py-4 bg-tertiary text-on-tertiary-fixed font-headline font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                >
                  Play Again
                </button>
                <button 
                  onClick={() => {
                    setDuelState('SKILL_SELECTION');
                    setSelectedSkill(null);
                  }}
                  className="px-10 py-4 glass-panel border border-white/10 font-headline font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Try Another Skill
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
