import sys
import re

def modify_dashboard():
    with open('src/pages/DashboardPage.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Imports
    content = content.replace(
        "import { HiLightningBolt, HiTrendingUp, HiGift } from 'react-icons/hi';",
        "import { HiLightningBolt, HiTrendingUp, HiGift } from 'react-icons/hi';\nimport { motion, AnimatePresence } from 'framer-motion';\nimport CountUpNumber from '../components/CountUpNumber';\nimport PageTransition from '../components/PageTransition';"
    )

    # State for feed id
    content = content.replace(
        "const [feed, setFeed] = useState(ACTIVITY_FEED.slice(0, 5));",
        "const [feed, setFeed] = useState(ACTIVITY_FEED.slice(0, 5).map((f, i) => ({...f, id: i})));"
    )

    # Update feed set
    content = content.replace(
        "return [{ ...newItem, time: 'Just now' }, ...prev.slice(0, 4)];",
        "return [{ ...newItem, time: 'Just now', id: Date.now() }, ...prev.slice(0, 4)];"
    )

    # Replace wrap fade-in
    content = content.replace(
        "<div className=\"space-y-6 fade-in\">",
        "<PageTransition className=\"space-y-6\">"
    )
    content = content.replace(
        "    </div>\n  );\n}",
        "    </PageTransition>\n  );\n}"
    )

    # Count ups & Pulse
    content = content.replace(
        "<div className=\"glass-card p-5 group hover:border-neon-orange/30 transition-all\">\n          <div className=\"flex items-center justify-between mb-3\">\n            <span className=\"text-2xl\">🔥</span>\n            <span className=\"text-xs text-neon-orange bg-neon-orange/10 px-2 py-1 rounded-full\">Daily</span>\n          </div>\n          <p className=\"text-3xl font-bold text-white\">{profile?.streak || 0}</p>",
        "<motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, ease: \"easeInOut\" }} className=\"glass-card p-5 group hover:border-neon-orange/30 transition-all\">\n          <div className=\"flex items-center justify-between mb-3\">\n            <span className=\"text-2xl\">🔥</span>\n            <span className=\"text-xs text-neon-orange bg-neon-orange/10 px-2 py-1 rounded-full\">Daily</span>\n          </div>\n          <p className=\"text-3xl font-bold text-white\"><CountUpNumber value={profile?.streak || 0} /></p>"
    )
    # replace the closing div for the first motion.div
    content = content.replace(
        "<p className=\"text-sm text-gray-400 mt-1\">Day Streak</p>\n        </div>",
        "<p className=\"text-sm text-gray-400 mt-1\">Day Streak</p>\n        </motion.div>", 
        1 # only first
    )

    content = content.replace(
        "<p className=\"text-3xl font-bold text-white\">{profile?.coins || 0}</p>",
        "<p className=\"text-3xl font-bold text-white\"><CountUpNumber value={profile?.coins || 0} /></p>"
    )
    content = content.replace(
        "<p className=\"text-3xl font-bold text-white\">{profile?.xp || 0}</p>",
        "<p className=\"text-3xl font-bold text-white\"><CountUpNumber value={profile?.xp || 0} /></p>"
    )
    content = content.replace(
        "<p className=\"text-3xl font-bold text-white\">{profile?.badges?.length || 0}</p>",
        "<p className=\"text-3xl font-bold text-white\"><CountUpNumber value={profile?.badges?.length || 0} /></p>"
    )

    # Feed slide
    content = content.replace(
        "<div className=\"space-y-3\">\n            {feed.map((item, i) => (",
        "<div className=\"space-y-3 overflow-hidden\">\n            <AnimatePresence initial={false}>\n            {feed.map((item) => ("
    )
    content = content.replace(
        "key={`${item.user}-${i}`}\n                className={`flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all ${i === 0 ? 'slide-up' : ''}`}",
        "key={item.id}\n                initial={{ opacity: 0, x: 50, height: 0, marginTop: 0 }}\n                animate={{ opacity: 1, x: 0, height: 'auto', marginTop: 12 }}\n                exit={{ opacity: 0, x: -50, height: 0, marginTop: 0 }}\n                transition={{ type: \"spring\", stiffness: 200, damping: 20 }}\n                className=\"flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors\" style={{ originY: 0, overflow: 'hidden' }}"
    )
    content = content.replace(
        "</p>\n                  <p className=\"text-xs text-gray-600 mt-1\">{item.time}</p>\n                </div>\n              </div>\n            ))}\n          </div>",
        "</p>\n                  <p className=\"text-xs text-gray-600 mt-1\">{item.time}</p>\n                </div>\n              </motion.div>\n            ))}\n            </AnimatePresence>\n          </div>"
    )

    with open('src/pages/DashboardPage.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

def modify_explore():
    with open('src/pages/ExplorePage.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(
        "import { createOrGetChat } from '../services/chatService';",
        "import { createOrGetChat } from '../services/chatService';\nimport { motion } from 'framer-motion';\nimport PageTransition from '../components/PageTransition';"
    )

    content = content.replace(
        "<div className=\"space-y-6 fade-in\">",
        "<PageTransition className=\"space-y-6\">"
    )
    content = content.replace(
        "    </div>\n  );\n}",
        "    </PageTransition>\n  );\n}"
    )

    content = content.replace(
        "<div className=\"grid sm:grid-cols-2 lg:grid-cols-3 gap-5\">\n        {filtered.map(user => {",
        "<motion.div variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } }}} initial=\"hidden\" animate=\"visible\" className=\"grid sm:grid-cols-2 lg:grid-cols-3 gap-5\">\n        {filtered.map(user => {"
    )
    content = content.replace(
        "</div>\n\n      {filtered.length === 0",
        "</motion.div>\n\n      {filtered.length === 0"
    )

    content = content.replace(
        "<div key={user.uid} className=\"glass-card p-5 hover:border-electric/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col\">",
        "<motion.div variants={{hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: \"spring\", stiffness: 100 } }}} whileHover={{ y: -8, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }} key={user.uid} className=\"glass-card p-5 group flex flex-col\">"
    )
    content = content.replace(
        "              </div>\n            </div>\n          );\n        })}\n      </div>",
        "              </div>\n            </motion.div>\n          );\n        })}\n      </motion.div>"
    )

    button_str = "<button\n                  onClick={() => handleRequest(user)}\n                  disabled={isRequested}\n                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer border-none ${\n                    isRequested\n                      ? 'bg-neon-green/20 text-neon-green'\n                      : 'bg-electric/20 text-electric hover:bg-electric/30'\n                  }`}\n                >"
    content = content.replace(
        button_str,
        "<motion.button\n                  whileHover={{ scale: 1.05 }}\n                  whileTap={{ scale: 0.9 }}\n                  onClick={() => handleRequest(user)}\n                  disabled={isRequested}\n                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer border-none ${\n                    isRequested\n                      ? 'bg-neon-green/20 text-neon-green'\n                      : 'bg-electric/20 text-electric hover:bg-electric/30'\n                  }`}\n                >"
    )
    content = content.replace(
        "                  {isRequested ? 'Requested' : 'Request Swap'}\n                </button>",
        "                  {isRequested ? 'Requested' : 'Request Swap'}\n                </motion.button>"
    )

    with open('src/pages/ExplorePage.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

def modify_leaderboard():
    with open('src/pages/LeaderboardPage.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(
        "import { HiTrendingUp } from 'react-icons/hi';",
        "import { HiTrendingUp } from 'react-icons/hi';\nimport { useEffect } from 'react';\nimport confetti from 'canvas-confetti';\nimport { motion } from 'framer-motion';\nimport PageTransition from '../components/PageTransition';\nimport CountUpNumber from '../components/CountUpNumber';"
    )

    content = content.replace(
        "export default function LeaderboardPage() {\n  const sorted = [...DEMO_USERS_LIST].sort((a, b) => b.xp - a.xp).slice(0, 10);",
        "export default function LeaderboardPage() {\n  const sorted = [...DEMO_USERS_LIST].sort((a, b) => b.xp - a.xp).slice(0, 10);\n\n  useEffect(() => {\n    confetti({\n      particleCount: 150,\n      spread: 70,\n      origin: { y: 0.6 }\n    });\n  }, []);"
    )

    content = content.replace(
        "<div className=\"space-y-6 fade-in\">",
        "<PageTransition className=\"space-y-6\">"
    )
    content = content.replace(
        "    </div>\n  );\n}",
        "    </PageTransition>\n  );\n}"
    )

    content = content.replace(
        "<div key={user.uid} className={`glass-card p-5 text-center ${isFirst ? 'glow-blue -mt-4' : ''} transition-all hover:-translate-y-1`}>",
        "<motion.div key={user.uid} initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: \"spring\", bounce: 0.5, delay: idx * 0.2 }} whileHover={{ y: -5 }} className={`glass-card p-5 text-center ${isFirst ? 'glow-blue -mt-4' : ''}`}>"
    )
    content = content.replace(
        "              </div>\n            </div>\n          );\n        })}\n      </div>",
        "              </div>\n            </motion.div>\n          );\n        })}\n      </div>"
    )

    content = content.replace(
        "<span className=\"text-electric font-bold\">{user.xp.toLocaleString()} XP</span>",
        "<span className=\"text-electric font-bold\"><CountUpNumber value={user.xp} /> XP</span>"
    )
    content = content.replace(
        "<span className=\"text-electric font-bold\">⚡ {user.xp.toLocaleString()}</span>",
        "<span className=\"text-electric font-bold\">⚡ <CountUpNumber value={user.xp} /></span>"
    )

    with open('src/pages/LeaderboardPage.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    modify_dashboard()
    modify_explore()
    modify_leaderboard()
    print("Modifications complete.")
