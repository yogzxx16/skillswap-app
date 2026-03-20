export const AVATAR_COLORS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

export function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name?.length || 0); i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export const BADGES = {
  top_swapper: { name: 'Top Swapper', icon: '🏆' },
  fast_learner: { name: 'Fast Learner', icon: '⚡' },
  helpful_mentor: { name: 'Helpful Mentor', icon: '🤝' },
  streak_master: { name: 'Streak Master', icon: '🔥' },
  community_star: { name: 'Community Star', icon: '🌟' },
  verified_swapper: { name: 'Verified', icon: '✅' },
};

export const DEMO_USERS_LIST = [
  { uid: 'demo1', displayName: 'Sarah Chen', city: 'Singapore', xp: 2850, level: 'Expert', streak: 12, coins: 450, badges: ['top_swapper', 'fast_learner'], online: true },
  { uid: 'demo2', displayName: 'John Doe', city: 'New York', xp: 2100, level: 'Expert', streak: 8, coins: 300, badges: ['helpful_mentor'], online: false },
  { uid: 'demo3', displayName: 'Alex Rivera', city: 'Madrid', xp: 1850, level: 'Expert', streak: 5, coins: 250, badges: ['streak_master'], online: true },
  { uid: 'demo4', displayName: 'Priya Sharma', city: 'Mumbai', xp: 1450, level: 'Intermediate', streak: 3, coins: 200, badges: ['community_star'], online: false },
  { uid: 'demo5', displayName: 'Liam Wilson', city: 'London', xp: 950, level: 'Intermediate', streak: 1, coins: 150, badges: [], online: true },
];

export const SWAP_REQUESTS = [
  {
    id: 1,
    direction: 'incoming',
    from: { uid: 'demo3', displayName: 'Alex Rivera', photoURL: null },
    offerSkill: 'Python',
    wantSkill: 'UI Design',
    message: "Hey! I saw you're looking to learn Python. I'd love to swap for some UI design tips.",
    status: 'pending',
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    direction: 'outgoing',
    to: { uid: 'demo1', displayName: 'Sarah Chen', photoURL: null },
    offerSkill: 'UI Design',
    wantSkill: 'React',
    message: "Hi Sarah, I'm interested in learning React from an expert!",
    status: 'accepted',
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    direction: 'incoming',
    from: { uid: 'demo4', displayName: 'Priya Sharma', photoURL: null },
    offerSkill: 'Yoga',
    wantSkill: 'French',
    message: "Namaste! Would you like to swap French lessons for Yoga?",
    status: 'rejected',
    timestamp: new Date().toISOString(),
  }
];

export const QUIZ_QUESTIONS = {
  JavaScript: [
    { q: "What is the correct way to declare a constant in JS?", options: ["let", "var", "const", "constant"], answer: 2 },
    { q: "Which of these is NOT a JS data type?", options: ["String", "Number", "Float", "Boolean"], answer: 2 },
    { q: "What does '===' operator check?", options: ["Value only", "Type only", "Value and Type", "Memory reference"], answer: 2 },
    { q: "How do you write an arrow function?", options: ["function() => {}", "() => {}", "=> () {}", "arrow function() {}"], answer: 1 },
    { q: "What is the result of 'typeof null'?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], answer: 2 }
  ],
  Python: [
    { q: "How do you define a function in Python?", options: ["func name():", "define name():", "def name():", "function name():"], answer: 2 },
    { q: "Which data structure uses key-value pairs?", options: ["List", "Tuple", "Set", "Dictionary"], answer: 3 },
    { q: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], answer: 2 },
    { q: "What is the output of len('abc')?", options: ["2", "3", "4", "0"], answer: 1 },
    { q: "How do you import a module?", options: ["include module", "import module", "require module", "using module"], answer: 1 }
  ],
  React: [
    { q: "What is JSX?", options: ["A CSS framework", "JavaScript XML", "A database", "A testing tool"], answer: 1 },
    { q: "Which hook is used for side effects?", options: ["useState", "useMemo", "useEffect", "useCallback"], answer: 2 },
    { q: "How do you pass data between components?", options: ["Using state", "Using props", "Using refs", "Using IDs"], answer: 1 },
    { q: "What is the virtual DOM?", options: ["A direct copy of the DOM", "A lightweight copy of the real DOM", "A server-side DOM", "An external library"], answer: 1 },
    { q: "What is the use of 'key' prop in lists?", options: ["To style elements", "To track items uniquely", "To set the index", "To hide elements"], answer: 1 }
  ],
  Guitar: [
    { q: "How many strings does a standard guitar have?", options: ["4", "5", "6", "12"], answer: 2 },
    { q: "What is a 'capo' used for?", options: ["Changing the key", "Tuning the strings", "Polishing the wood", "Holding the pick"], answer: 0 },
    { q: "Which chord is often called 'The People's Key'?", options: ["C Major", "G Major", "E Minor", "D Major"], answer: 1 },
    { q: "What is fingerpicking?", options: ["Using a pick", "Using fingers to pluck strings", "Tapping the body", "Slapping the strings"], answer: 1 },
    { q: "What is the standard tuning?", options: ["EADGBE", "DADGBE", "EADGCE", "EADFBE"], answer: 0 }
  ]
};

export const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'React', 'TypeScript', 'Node.js',
  'UI Design', 'UX Research', 'Graphic Design', 'Figma',
  'Piano', 'Guitar', 'Drums', 'Singing', 'Music Theory',
  'French', 'Spanish', 'German', 'Japanese', 'Hindi',
  'Yoga', 'Meditation', 'Public Speaking', 'Photography', 'Cooking'
];
