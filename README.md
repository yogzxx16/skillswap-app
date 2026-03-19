<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# SkillSwap 🔄

> **Trade what you know. Learn what you don't.**

SkillSwap is a skill exchange platform where people swap skills instead of money. You teach me Python, I teach you Guitar — zero money exchanged, real learning happens.

Think **Tinder meets Duolingo** — built for people who want to learn without paying ₹5,000 for a course.

![Status](https://img.shields.io/badge/status-in%20development-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Firebase-orange)

---

## The problem it solves

- People want to learn new skills but coaching is too expensive
- Millions of people have valuable skills they never monetize
- There's no easy way to find a trustworthy person to learn from locally
- Existing platforms charge money — SkillSwap doesn't

---

## Features

### Core
- **Skill matching** — get paired with someone whose skills you want, who wants yours
- **Swap requests** — send, accept, and manage skill swap sessions
- **Real-time chat** — talk to your match in-app before and after sessions
- **User profiles** — showcase the skills you teach with ratings and reviews

### Addiction engine (what keeps users coming back)
- **Daily streaks** — keep your learning streak alive or lose it all
- **SkillCoins** — earn coins for teaching (+50) and learning (+20)
- **XP leveling** — Beginner → Intermediate → Expert → Master
- **Leaderboard** — top 10 swappers in your city, resets weekly
- **FOMO activity feed** — live updates of what people around you are learning
- **Daily challenges** — complete tasks for 2x coins before midnight

### Practice Zone (what makes skills actually stick)
- **Quick Quiz** — 5 MCQs generated from your swap session
- **Skill Duel** — live 1v1 quiz battle with another user, winner takes the coins
- **Spaced repetition** — reminders at day 1, 3, 7, 21 based on memory science
- **Mini Projects** — upload real proof you practiced (photo, code snippet, recording)
- **Teach It Back** — record a 60-second voice explanation, AI scores your clarity

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication |
| Database | Firestore (real-time) |
| Storage | Firebase Storage |
| Hosting | Firebase Hosting |
| AI features | Google Gemini API |

---

## Getting started

### Prerequisites
- Node.js 18+
- A Firebase project (free tier works fine)
- A Google account

### Installation

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/skillswap-app.git
cd skillswap-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase config keys in .env

# Start the dev server
npm run dev
```

### Environment variables

Create a `.env` file in the root with your Firebase config:

```
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

---

## Pages

| Page | Description |
|---|---|
| `/` | Landing page |
| `/signup` | Create account |
| `/login` | Sign in |
| `/onboarding` | Add your skills |
| `/dashboard` | Activity feed + stats |
| `/explore` | Browse skill providers |
| `/swaps` | Manage swap requests |
| `/chat/:id` | Real-time chat with match |
| `/practice` | Practice Zone (quiz, duel, projects) |
| `/leaderboard` | Top swappers this week |
| `/profile/:id` | User profile + portfolio |

---

## Roadmap

- [x] Project setup
- [x] Firebase auth
- [x] User profiles + skill tags
- [x] Explore page + swap requests
- [x] Real-time chat
- [x] Dashboard activity feed
- [ ] Practice Zone — Quick Quiz
- [ ] Skill Duel (multiplayer)
- [ ] Spaced repetition reminders
- [ ] Mobile responsive polish
- [ ] Launch in Chennai

---

## Contributing

Pull requests are welcome! If you want to add a feature or fix a bug:

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Built by

Made with a lot of prompting and a little patience. If you're building something similar or want to collaborate, open an issue or reach out.

> "The best way to learn something is to teach it to someone else." — and now you can do both at the same time.
>>>>>>> fd52ede86e4cc6a05eb177d6f1512b6352a5adf5
