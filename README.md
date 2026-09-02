# Mockly — AI-Powered Voice Mock Interview Platform

> *"Practice how you communicate, not just what you know."*

---

## 📌 Project Overview

**Mockly** is a voice-first, AI-powered mock interview platform designed for students and fresh graduates.

Rather than evaluating *what* a candidate says, Mockly analyzes *how* they say it — speaking pace, pauses, silence ratio, filler words, repetitions, answer relevance, and hesitation patterns — then delivers immediate, personalized feedback.

---

## ✨ Features

| Feature | Status |
|---|---|
| Voice-based interview session (microphone recording) | ✅ Live |
| Speech-to-text via Groq Whisper API | ✅ Live |
| Audio feature extraction (WPM, pauses, silence, fillers) | ✅ Live |
| Hesitation prediction (Random Forest classifier) | ✅ Live |
| Semantic answer relevance (Sentence Transformers) | ✅ Live |
| AI-generated question-level feedback | ✅ Live |
| Final interview performance report | ✅ Live |
| Email/password authentication (Supabase) | ✅ Live |
| Google OAuth sign-in | ✅ Live |
| Persistent interview history (Supabase Postgres) | ✅ Live |
| Real progress analytics from history data | ✅ Live |
| Mobile-responsive interview UI | ✅ Live |
| Full session log (no truncation) | ✅ Live |
| Interview question auto-playback (Web Speech API) | ✅ Live |
| AI Interviewer Avatar | 🔄 Planned |

---

## 🏗️ Architecture

```
Browser (React/Vite) — Vercel
        │
        │  REST (FormData, JSON)
        ▼
FastAPI Backend — Railway
        │
        ├── Groq Speech-to-Text (Whisper large-v3-turbo via API)
        ├── Librosa  — audio feature extraction (WPM, pauses, etc.)
        ├── Sentence Transformers — semantic relevance scoring
        └── Random Forest — hesitation level classification
        
Supabase (Postgres + Auth)
        ├── User accounts (email/password + Google OAuth)
        └── Interview history & session records
```

---

## 📁 Project Structure

```
Mockly/
├── frontend/              # React + Vite SPA (deployed on Vercel)
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.jsx          # Auth (email + Google OAuth)
│       │   ├── DashboardPage.jsx      # Real user metrics
│       │   ├── SetupPage.jsx          # Interview configuration
│       │   ├── InterviewScreenPage.jsx# Interview session + session log
│       │   ├── QuestionFeedbackPage.jsx
│       │   ├── FinalReportPage.jsx    # Idempotent save + report
│       │   ├── HistoryPage.jsx        # Past sessions from Supabase
│       │   └── ProgressPage.jsx       # Real analytics from history
│       └── supabaseClient.js
│
├── backend/               # Python FastAPI (deployed on Railway)
│   ├── main.py
│   ├── services/
│   │   ├── speech_to_text.py  # Groq Whisper API
│   │   ├── audio_features.py  # Librosa audio analysis
│   │   ├── nlp_analysis.py    # Filler/repetition detection
│   │   ├── feedback.py        # AI feedback generation
│   │   └── hesitation.py      # Random Forest model
│   ├── Procfile               # Single-worker Uvicorn for Railway
│   └── requirements.txt
│
└── README.md
```

---

## 🔐 Authentication

Mockly uses **Supabase Auth** for user management.

- **Email/Password** — standard sign-up and sign-in
- **Google OAuth** — one-click sign-in via `supabase.auth.signInWithOAuth`

After Google sign-in, Supabase redirects back to `window.location.origin`, which works correctly for both local development and production Vercel deployments automatically.

### Required Supabase Configuration

Before Google OAuth works, configure the following in Supabase:

1. **Authentication → Providers → Google** — Enable and paste your Google OAuth Client ID and Secret.
2. **Authentication → URL Configuration → Redirect URLs** — Add:
   - `http://localhost:5173` (local dev)
   - `https://your-app.vercel.app` (production)

---

## 🔄 Interview Flow

```
1. User signs in (email or Google)
2. Configures interview: role, difficulty, type, question count
3. Interview session starts — questions read aloud automatically
4. User records audio answer via microphone
5. Audio sent to Railway backend via POST /api/analyze
6. Backend:
   a. Groq Whisper → transcript
   b. Librosa → WPM, pauses, silence ratio, fillers
   c. Random Forest → hesitation level prediction
   d. Sentence Transformers → answer relevance score
   e. Feedback generation → suggestions
7. Results displayed in the session UI
8. User navigates questions → finishes interview
9. Final report saved to Supabase (idempotent — one record per sessionId)
10. History and Progress pages reflect new data
```

---

## 🚀 Local Development

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **FFmpeg** (required by the audio pipeline)
  ```bash
  # Windows
  winget install --id=Gyan.FFmpeg -e
  ```
- A **Supabase** project (free tier is fine)
- A **Groq** API key (free tier provides Whisper access)

---

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Create `frontend/.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

---

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
```

Create `backend/.env`:
```
GROQ_API_KEY=your-groq-api-key
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Never commit `.env` files.** They are excluded by `.gitignore`. Manage secrets via Railway/Vercel/Supabase environment variable dashboards in production.

---

## 🌐 Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys from `main` branch |
| Backend | Railway | Runs `uvicorn main:app` via `Procfile`, 1 worker |
| Database + Auth | Supabase | Postgres + Row Level Security |
| Speech-to-Text | Groq API | Whisper `large-v3-turbo` model via REST |

### Required Environment Variables

**Railway (Backend):**
```
GROQ_API_KEY        — Groq API key for Whisper transcription
FRONTEND_URL        — Vercel production URL (for CORS)
```

**Vercel (Frontend):**
```
VITE_SUPABASE_URL       — Supabase project URL
VITE_SUPABASE_ANON_KEY  — Supabase anon/public key
VITE_API_URL            — Railway backend URL
```

> All secrets must be configured as environment variables in the respective platform dashboards. **Do not hardcode or commit any API keys, passwords, or secrets.**

---

## 🔒 Security Notes

- `.env`, `.env.local`, `.env.production` are excluded from Git via `.gitignore`
- Supabase Row Level Security (RLS) ensures users can only read/write their own interview records
- The `GROQ_API_KEY` is only present on the Railway backend — never exposed to the browser
- The Supabase `anon` key is safe to include in frontend builds; RLS enforces access control

---

## 📊 ML Pipeline

```
Audio (WebM)
    ↓
Groq Whisper large-v3-turbo  →  Transcript
    ↓
Librosa Audio Analysis
    ├─ WPM (words per minute)
    ├─ Pause count + average pause duration
    ├─ Silence ratio
    ├─ Filler word detection (um, uh, like, basically …)
    └─ Repetition detection
    ↓
Random Forest Classifier  →  Hesitation level (Low / Medium / High)
    ↓
Sentence Transformers (all-MiniLM-L6-v2)  →  Semantic relevance score
    ↓
Feedback Generator  →  Summary + actionable suggestions
```

---

## 📄 License

This project was built as part of the **BanoQabil** program. All rights reserved.
