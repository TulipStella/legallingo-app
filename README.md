# LegalLingo - Gamified Legal Literacy Platform

**Learn the law. Live smarter.**

LegalLingo is a gamified legal-literacy learning platform inspired by Duolingo's interaction design, progression mechanics, and engagement loops. Through bite-sized interactive lessons, users learn practical legal knowledge about contracts, consumer rights, workplace law, renting, digital privacy, police rights, money/debt, and civil disputes—all in Indian context.

## Features

✅ **Game-like Learning Experience**
- Duolingo-inspired UI with 3D tactile buttons
- 8 interactive exercise types (MCQ, True/False, Matching, Sorting, Fill-in-blank, etc.)
- Streak system with fire emoji and day counter
- Energy hearts system (5 lives per day)
- XP rewards and level progression
- Gems currency for shop purchases

✅ **Gamification Systems**
- Daily quests (complete lessons, achieve accuracy targets)
- Weekly leaderboards with promotional/demotional leagues
- Achievement badges (streaks, mastery, collector)
- Challenge modes (daily, weekly, timed, case-based)

✅ **Social & Competitive**
- Friend system with friend suggestions
- League-based rankings (Supreme Division → Trial League)
- Leaderboard filters (Global/Friends)
- Streak visibility and comparison

✅ **Content**
- 8 units covering Everyday Law for India
- 48+ lessons with 300+ interactive questions
- Admin dashboard for course management
- Practice mode with weak-area identification

✅ **Premium Plans**
- Beautiful premium modal with 8 premium features
- Streak protection, ad-free learning, advanced courses
- Regional language support (future)
- Verified certificates and skill profiles

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Lucide Icons
- Sonner Toasts
- Axios

**Backend**
- Python FastAPI
- Motor (async MongoDB driver)
- Pydantic for validation
- CORS enabled

**Database**
- MongoDB Atlas (free tier)
- Session-based auth

**Hosting**
- Frontend: Vercel (auto-deploy)
- Backend: Railway/Render (Python)
- Database: MongoDB Atlas

## Project Structure

```
legallingo/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppShell.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── Mascot.jsx
│   │   │   ├── Effects.jsx
│   │   │   └── exercises.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Learn.jsx
│   │   │   ├── Lesson.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Quests.jsx
│   │   │   ├── Friends.jsx
│   │   │   ├── Practice.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Challenges.jsx
│   │   │   ├── Premium.jsx (NEW)
│   │   │   ├── Settings.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   └── Admin.jsx
│   │   ├── lib/
│   │   │   ├── auth.jsx
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── course.js (48 lessons, 300+ questions)
│   │   ├── App.js
│   │   ├── index.css (design system)
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json (deployment config)
├── backend/
│   ├── server.py (FastAPI)
│   ├── requirements.txt
│   ├── .env.example
│   ├── vercel.json (serverless config)
│   └── api/
│       └── index.py (Vercel serverless wrapper)
├── .gitignore
├── .env.example
└── README.md
```

## Setup & Deployment

### Local Development

**Frontend**
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
echo "MONGO_URL=your_mongo_url" > .env
echo "DB_NAME=legallingo" >> .env
python -m uvicorn server:app --reload
# API at http://localhost:8000
```

### Production Deployment

**1. Frontend on Vercel**
- Push to GitHub
- Connect repo to Vercel
- Set env: `REACT_APP_BACKEND_URL=https://your-api.com`
- Auto-deploy on push

**2. Backend on Railway/Render**
- Connect GitHub repo
- Set env vars: `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`
- Deploy Python app

**3. Database on MongoDB Atlas**
- Create free cluster
- Get connection string
- Share with backend deployment

## Demo Credentials

```
Email: aarav@demo.com
Password: demo1234
```

## Features Roadmap

✅ Core gamification (streaks, XP, levels)
✅ 8 units, 48 lessons, 300+ questions
✅ Leaderboards & friend system
✅ Premium plans UI (frontend only)
⏳ Premium payment integration
⏳ Regional language content
⏳ Certificate generation
⏳ Legal skill profile
⏳ Admin CMS

## Colors

- **Burgundy**: #6B1D2F (primary)
- **Emerald**: #10B981 (secondary/success)
- **Fire**: #FF6B00 (streak)
- **Gold**: #FFB800 (XP)
- **Cream**: #FAF7F2 (background)

## Contributing

Fork → Branch → PR. Ensure:
- Components use data-testid
- Colors follow design system
- Mobile-responsive
- No external CDN fonts (Google Fonts embedded)

## License

MIT - Open source legal education for all.

---

**Made with ❤️ for legal literacy in India.**
