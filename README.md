# EcoLife AI 🌱

**Encourage • Track • Grow**

An engaging web platform that helps users build environmentally friendly habits through activity tracking, AI-powered waste guidance, challenges, streaks, and a green score system.

---

### 🔗 Live Demo

- **Frontend**: [https://ecolifeaifrontend.vercel.app](https://ecolifeaifrontend.vercel.app)
- **Backend**: [https://ecolife-ai.onrender.com](https://ecolife-ai.onrender.com)

---

### ✨ Features

#### 🏠 Landing Page
- Clean, modern hero section explaining the mission
- Smooth call-to-action to register or log in

#### 📊 Dashboard
- **Green Score** visualized as a growth-ring progress circle
- Level system (100 points = 1 level)
- Current streak tracking
- Total carbon logged
- Weekly carbon usage chart
- Quick refresh of live data

#### ➕ Add Activity
- Log daily habits:
  - Travel (km)
  - Electricity (units)
  - Water
  - Recycling
  - Plant-based meals
- Instant estimated CO₂ impact
- Clean card-based UI

#### 🤖 AI Waste Scanner (Our Flagship Feature)
Upload a photo of any waste item and get instant, intelligent guidance powered by **Google Gemini AI**.

- Identifies the exact item from the image
- Classifies it into clear categories:
  - Recyclable
  - Compostable
  - Hazardous
  - Landfill
  - E-waste
- Provides step-by-step disposal instructions
- Gives a practical eco-friendly tip
- Beautiful result card with category badge

> This is the core AI-powered feature of EcoLife AI — turning a simple photo into actionable environmental guidance.

#### 🏆 Challenges
- Dynamic challenges with live progress:
  - Getting Started
  - Weekly Warrior
  - Carbon Cutter
  - Streak Keeper
  - Century Club
- Automatic badge + XP rewards on completion

#### 🥇 Leaderboard
- Top users ranked by Green Score
- Shows streak of each user
- Your own rank is calculated even if outside top 20

#### 👤 Profile
- Green Score + Level ring
- Total activities, streak, and XP
- Badges earned showcase
- Member since date

#### 🔐 Authentication
- Secure Register / Login with JWT
- Protected routes
- Persistent session with localStorage

---

### 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Recharts
- Lucide React
- React Toastify
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI (Vision)
- Multer / Base64 image handling

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---
