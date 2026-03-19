// Demo data for the entire application

export const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'Rust',
  'Guitar', 'Piano', 'Drums', 'Violin', 'Singing', 'Music Production',
  'Photography', 'Video Editing', 'Graphic Design', 'UI/UX Design', 'Illustration',
  'Spanish', 'French', 'Japanese', 'Mandarin', 'Korean', 'German',
  'Cooking', 'Baking', 'Yoga', 'Meditation', 'Dance', 'Martial Arts',
  'Public Speaking', 'Writing', 'Marketing', 'Data Science', 'Machine Learning',
  'Blockchain', 'Cybersecurity', 'Cloud Computing', 'DevOps', '3D Modeling',
];

export const DEMO_USERS_LIST = [
  {
    uid: 'user-1',
    displayName: 'Priya Sharma',
    email: 'priya@demo.com',
    photoURL: null,
    teachSkills: ['Guitar', 'Singing', 'Music Production'],
    learnSkills: ['Python', 'React'],
    xp: 3200,
    coins: 520,
    streak: 21,
    level: 'Master',
    badges: ['first_swap', '7_day_streak', 'top_teacher', 'master_musician'],
    city: 'Chennai',
    online: true,
  },
  {
    uid: 'user-2',
    displayName: 'Marcus Chen',
    email: 'marcus@demo.com',
    photoURL: null,
    teachSkills: ['React', 'TypeScript', 'Node.js'],
    learnSkills: ['Guitar', 'Photography'],
    xp: 4100,
    coins: 680,
    streak: 34,
    level: 'Master',
    badges: ['first_swap', '7_day_streak', 'top_teacher', 'code_wizard'],
    city: 'San Francisco',
    online: true,
  },
  {
    uid: 'user-3',
    displayName: 'Sofia Rodriguez',
    email: 'sofia@demo.com',
    photoURL: null,
    teachSkills: ['Spanish', 'Photography', 'Yoga'],
    learnSkills: ['JavaScript', 'UI/UX Design'],
    xp: 2800,
    coins: 430,
    streak: 15,
    level: 'Expert',
    badges: ['first_swap', '7_day_streak', 'polyglot'],
    city: 'Barcelona',
    online: false,
  },
  {
    uid: 'user-4',
    displayName: 'Aiden Park',
    email: 'aiden@demo.com',
    photoURL: null,
    teachSkills: ['Korean', 'Martial Arts', 'Cooking'],
    learnSkills: ['Python', 'Machine Learning'],
    xp: 1950,
    coins: 290,
    streak: 8,
    level: 'Expert',
    badges: ['first_swap', '7_day_streak'],
    city: 'Seoul',
    online: true,
  },
  {
    uid: 'user-5',
    displayName: 'Emma Watson',
    email: 'emma@demo.com',
    photoURL: null,
    teachSkills: ['Writing', 'Public Speaking', 'French'],
    learnSkills: ['Data Science', 'Python'],
    xp: 3600,
    coins: 550,
    streak: 28,
    level: 'Master',
    badges: ['first_swap', '7_day_streak', 'top_teacher', 'wordsmith'],
    city: 'London',
    online: false,
  },
  {
    uid: 'user-6',
    displayName: 'Raj Patel',
    email: 'raj@demo.com',
    photoURL: null,
    teachSkills: ['Python', 'Machine Learning', 'Data Science'],
    learnSkills: ['Guitar', 'Spanish'],
    xp: 5200,
    coins: 890,
    streak: 45,
    level: 'Master',
    badges: ['first_swap', '7_day_streak', 'top_teacher', 'data_guru', 'legend'],
    city: 'Mumbai',
    online: true,
  },
  {
    uid: 'user-7',
    displayName: 'Yuki Tanaka',
    email: 'yuki@demo.com',
    photoURL: null,
    teachSkills: ['Japanese', 'Illustration', '3D Modeling'],
    learnSkills: ['React', 'Node.js'],
    xp: 2100,
    coins: 340,
    streak: 11,
    level: 'Expert',
    badges: ['first_swap', '7_day_streak', 'artist'],
    city: 'Tokyo',
    online: true,
  },
  {
    uid: 'user-8',
    displayName: 'Luna Martinez',
    email: 'luna@demo.com',
    photoURL: null,
    teachSkills: ['Dance', 'Yoga', 'Meditation'],
    learnSkills: ['Graphic Design', 'Video Editing'],
    xp: 1600,
    coins: 210,
    streak: 5,
    level: 'Beginner',
    badges: ['first_swap'],
    city: 'Mexico City',
    online: false,
  },
  {
    uid: 'user-9',
    displayName: 'Noah Williams',
    email: 'noah@demo.com',
    photoURL: null,
    teachSkills: ['Video Editing', 'Graphic Design', 'UI/UX Design'],
    learnSkills: ['Piano', 'French'],
    xp: 2900,
    coins: 460,
    streak: 19,
    level: 'Expert',
    badges: ['first_swap', '7_day_streak', 'designer'],
    city: 'New York',
    online: true,
  },
  {
    uid: 'user-10',
    displayName: 'Zara Ahmed',
    email: 'zara@demo.com',
    photoURL: null,
    teachSkills: ['Cybersecurity', 'Cloud Computing', 'DevOps'],
    learnSkills: ['Cooking', 'Dance'],
    xp: 3900,
    coins: 620,
    streak: 25,
    level: 'Master',
    badges: ['first_swap', '7_day_streak', 'top_teacher', 'security_pro'],
    city: 'Dubai',
    online: true,
  },
];

export const ACTIVITY_FEED = [
  { user: 'Priya', city: 'Chennai', action: 'completed a Guitar lesson 🎸', time: '2 min ago' },
  { user: 'Marcus', city: 'San Francisco', action: 'earned the "Code Wizard" badge 🏆', time: '5 min ago' },
  { user: 'Sofia', city: 'Barcelona', action: 'started learning JavaScript 💻', time: '8 min ago' },
  { user: 'Aiden', city: 'Seoul', action: 'hit a 7-day streak 🔥', time: '12 min ago' },
  { user: 'Emma', city: 'London', action: 'completed a Writing workshop ✍️', time: '15 min ago' },
  { user: 'Raj', city: 'Mumbai', action: 'reached Master level in Python 🐍', time: '20 min ago' },
  { user: 'Yuki', city: 'Tokyo', action: 'shared a new illustration 🎨', time: '25 min ago' },
  { user: 'Luna', city: 'Mexico City', action: 'started a yoga session 🧘', time: '30 min ago' },
  { user: 'Noah', city: 'New York', action: 'earned 50 SkillCoins 🪙', time: '35 min ago' },
  { user: 'Zara', city: 'Dubai', action: 'swapped DevOps for Cooking 🍳', time: '40 min ago' },
];

export const SWAP_REQUESTS = [
  {
    id: 'swap-1',
    from: DEMO_USERS_LIST[0],
    to: null,
    offerSkill: 'Guitar',
    wantSkill: 'React',
    status: 'pending',
    direction: 'incoming',
    createdAt: '2026-03-19T10:00:00',
    message: 'Hey! I love teaching guitar. Want to swap for React lessons?',
  },
  {
    id: 'swap-2',
    from: DEMO_USERS_LIST[3],
    to: null,
    offerSkill: 'Korean',
    wantSkill: 'Python',
    status: 'pending',
    direction: 'incoming',
    createdAt: '2026-03-18T15:30:00',
    message: 'I can teach you Korean in exchange for Python basics!',
  },
  {
    id: 'swap-3',
    from: null,
    to: DEMO_USERS_LIST[1],
    offerSkill: 'Python',
    wantSkill: 'TypeScript',
    status: 'accepted',
    direction: 'outgoing',
    createdAt: '2026-03-17T09:00:00',
    message: 'Would love to learn TypeScript from you!',
  },
  {
    id: 'swap-4',
    from: null,
    to: DEMO_USERS_LIST[4],
    offerSkill: 'React',
    wantSkill: 'Writing',
    status: 'rejected',
    direction: 'outgoing',
    createdAt: '2026-03-16T14:00:00',
    message: 'Can we swap React for creative writing sessions?',
  },
];

export const CHAT_MESSAGES = [
  {
    id: 1,
    senderId: 'user-2',
    text: 'Hey! Ready for our TypeScript session today? 🚀',
    timestamp: '2026-03-19T09:00:00',
  },
  {
    id: 2,
    senderId: 'demo-user-1',
    text: 'Absolutely! I\'ve been practicing the generics exercises you sent.',
    timestamp: '2026-03-19T09:02:00',
  },
  {
    id: 3,
    senderId: 'user-2',
    text: 'Great! Let\'s dive into advanced types today. I\'ll share my screen at 3pm.',
    timestamp: '2026-03-19T09:05:00',
  },
  {
    id: 4,
    senderId: 'demo-user-1',
    text: 'Perfect. And I prepared some Python data structures content for our swap back.',
    timestamp: '2026-03-19T09:07:00',
  },
  {
    id: 5,
    senderId: 'user-2',
    text: 'You\'re the best! See you at 3 🎯',
    timestamp: '2026-03-19T09:10:00',
  },
];

export const QUIZ_QUESTIONS = {
  JavaScript: [
    { q: 'What keyword declares a block-scoped variable?', options: ['var', 'let', 'dim', 'set'], answer: 1 },
    { q: 'Which method converts JSON string to object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.decode()'], answer: 0 },
    { q: 'What does "===" check?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], answer: 2 },
    { q: 'Which is NOT a JavaScript data type?', options: ['Boolean', 'Float', 'Symbol', 'BigInt'], answer: 1 },
    { q: 'What does Array.map() return?', options: ['Nothing', 'Modified original array', 'New array', 'Boolean'], answer: 2 },
  ],
  Python: [
    { q: 'Which keyword defines a function in Python?', options: ['func', 'function', 'def', 'lambda'], answer: 2 },
    { q: 'What is the output of print(type([]))?', options: ['<class "array">', '<class "list">', '<class "tuple">', '<class "set">'], answer: 1 },
    { q: 'Which operator is used for floor division?', options: ['/', '//', '%', '**'], answer: 1 },
    { q: 'What does len() do?', options: ['Calculates length', 'Calculates logarithm', 'Creates a list', 'Loops elements'], answer: 0 },
    { q: 'Which is immutable in Python?', options: ['List', 'Dictionary', 'Set', 'Tuple'], answer: 3 },
  ],
  Guitar: [
    { q: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '8'], answer: 2 },
    { q: 'What does "capo" do?', options: ['Tune strings', 'Change key', 'Add distortion', 'Mute strings'], answer: 1 },
    { q: 'Which chord is G - B - D?', options: ['C Major', 'G Major', 'D Major', 'A Major'], answer: 1 },
    { q: 'What is the thickest string on standard guitar?', options: ['1st (high E)', '3rd (G)', '5th (A)', '6th (low E)'], answer: 3 },
    { q: 'What does "strum" mean?', options: ['Pick individual notes', 'Brush across strings', 'Bend a string', 'Tap the body'], answer: 1 },
  ],
  React: [
    { q: 'What hook manages state in functional components?', options: ['useEffect', 'useState', 'useContext', 'useRef'], answer: 1 },
    { q: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extra'], answer: 0 },
    { q: 'Which lifecycle does useEffect replace?', options: ['constructor only', 'render only', 'componentDidMount and more', 'None'], answer: 2 },
    { q: 'What is the virtual DOM?', options: ['Browser DOM', 'Lightweight copy of DOM', 'Server-side DOM', 'Shadow DOM'], answer: 1 },
    { q: 'How do you pass data to child components?', options: ['State', 'Props', 'Context only', 'Redux only'], answer: 1 },
  ],
};

export const BADGES = {
  first_swap: { name: 'First Swap', icon: '🤝', description: 'Completed your first skill swap' },
  '7_day_streak': { name: '7-Day Streak', icon: '🔥', description: 'Maintained a 7-day streak' },
  top_teacher: { name: 'Top Teacher', icon: '🏆', description: 'Rated 5 stars by 10+ learners' },
  code_wizard: { name: 'Code Wizard', icon: '🧙', description: 'Completed 20+ coding swaps' },
  master_musician: { name: 'Master Musician', icon: '🎵', description: 'Taught music to 15+ users' },
  polyglot: { name: 'Polyglot', icon: '🌍', description: 'Taught 3+ different languages' },
  wordsmith: { name: 'Wordsmith', icon: '✍️', description: 'Completed 10+ writing swaps' },
  artist: { name: 'Artist', icon: '🎨', description: 'Created 5+ mini art projects' },
  designer: { name: 'Designer', icon: '💎', description: 'Completed 15+ design swaps' },
  security_pro: { name: 'Security Pro', icon: '🛡️', description: 'Taught cybersecurity to 10+ users' },
  data_guru: { name: 'Data Guru', icon: '📊', description: 'Mastered data science skills' },
  legend: { name: 'Legend', icon: '⭐', description: 'Reached 5000+ XP' },
};

export function getLevelFromXP(xp) {
  if (xp >= 5000) return 'Master';
  if (xp >= 2000) return 'Expert';
  if (xp >= 500) return 'Intermediate';
  return 'Beginner';
}

export function getXPForNextLevel(xp) {
  if (xp >= 5000) return { current: xp, next: 10000, label: 'Legend' };
  if (xp >= 2000) return { current: xp, next: 5000, label: 'Master' };
  if (xp >= 500) return { current: xp, next: 2000, label: 'Expert' };
  return { current: xp, next: 500, label: 'Intermediate' };
}

export function getAvatarColor(name) {
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
