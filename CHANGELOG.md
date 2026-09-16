# 📋 Changelog - Mental Math Trainer

All notable changes to this project will be documented in this file.

---

## [v3.0.0] - 2025-01-XX
### 🚀 Major Update - PWA & Update Log

#### ✨ Added
- 📋 In-app Update Log page with full version history
- 📱 PWA support (installable on phones & desktops)
- 🔔 Service Worker for offline functionality
- 📄 manifest.json for app identity
- 📄 CHANGELOG.md for tracking updates
- 📄 README.md with project documentation

#### 🔧 Changed
- Updated navigation to include Update Log section
- Improved overall code organization

#### 🐛 Fixed
- Minor UI alignment issues on mobile

#### 📝 Commit Messages
- `docs: add CHANGELOG.md and README.md`
- `feat: add in-app update log page`
- `feat: add PWA support with service worker`
- `style: update nav to include changelog link`

---

## [v2.0.0] - 2025-01-XX
### 🎮 Major Update - Games, Exponents & Gamification

#### ✨ Added
- 📐 Laws of Exponents section (8 laws with examples)
- 🔢 Powers Reference Table (base 2-15, powers 2-6)
- 🎯 Exponent Practice mode
- ⏹️ Stop Quiz button (was missing!)
- 📊 Tables extended from 12 to 35
- 🔍 Table search functionality
- 📋 Configurable reference grid (up to 35×35)
- 🔀 Mixed operation mode
- ♾️ Unlimited question mode
- 📊 Question counter & progress bar

#### 🎮 Games Added
- ⚡ Speed Round (60-second challenge)
- 🔗 Number Chain (chain answers together)
- ✅❌ True or False (3 lives system)
- ❓ Missing Number (find the operand)
- ⚔️ Beat the Clock (survive as long as possible)
- 🎯 Estimation Master (points for close guesses)

#### 🏆 Gamification Added
- 🏅 XP & Level system (earn XP globally)
- 🏆 15 Achievement badges with unlock tracking
- 📈 Enhanced stats tracking (XP, levels, sessions)
- ⌨️ ESC key shortcut to stop any game

#### 📝 Commit Messages
- `feat: add laws of exponents section with practice mode`
- `feat: add stop quiz button to all game modes`
- `feat: extend tables from 12 to 35 with search`
- `feat: add 6 math games (speed, chain, tf, missing, duel, estimation)`
- `feat: add XP/level system and 15 achievement badges`
- `feat: add mixed mode and unlimited question mode`
- `style: add game cards UI and back navigation`
- `fix: prevent quiz from running without stop option`

---

## [v1.0.0] - 2025-01-XX
### 🎉 Initial Release - Core Mental Math Trainer

#### ✨ Added
- ➕ Addition practice mode
- ➖ Subtraction practice mode
- ✖️ Multiplication practice mode
- ➗ Division practice mode
- 📊 Multiplication tables (1-12)
- 📋 12×12 Quick reference grid
- 🟢🟡🔴 Three difficulty levels (Easy, Medium, Hard)
- ⏱️ Live timer during quizzes
- 🔥 Streak tracking system
- 📊 Score tracking per session
- 📈 Session results summary
- 💾 localStorage stats persistence
- 📱 Responsive design (mobile friendly)
- 🎨 Dark gradient theme UI
- ⌨️ Enter key to submit answers
- 🌐 Deployed to Vercel

#### 📝 Commit Messages
- `🚀 Initial commit - Mental Math Trainer`
- `feat: add practice mode with 4 operations`
- `feat: add multiplication tables and reference grid`
- `feat: add difficulty levels and scoring system`
- `feat: add timer and streak tracking`
- `feat: add localStorage for stats persistence`
- `style: add dark theme with gradient background`
- `style: add responsive design for mobile`
- `deploy: connect GitHub to Vercel for auto-deploy`

---

## 🔮 Planned Updates

### [v4.0.0] - Coming Soon
- 🎵 Sound effects for correct/wrong answers
- 🌙 Dark/Light theme toggle
- 📊 Chart.js progress visualization
- 🏅 Daily challenges with streak rewards
- 🧮 Fractions & percentages practice
- 👥 Multiplayer mode
- 🔢 Square roots & cube roots

---

## 📌 Version Naming Convention

| Format | Meaning |
|--------|---------|
| v**X**.0.0 | Major release (new features, big changes) |
| v1.**X**.0 | Minor release (improvements, small features) |
| v1.0.**X** | Patch (bug fixes, small tweaks) |