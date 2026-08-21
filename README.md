# Mockly - AI-Powered Mock Interview Platform

> **Tagline:** *"Practice how you communicate, not just what you know."*

---

## 📌 Project Overview

**Mockly** is an AI-powered mock interview platform engineered specifically for students and fresh graduates. While traditional interview prep platforms only evaluate *what* you say, Mockly is designed to analyze *how* you communicate—evaluating vocal delivery, speaking pace, hesitation, filler words, pause frequency, and semantic answer relevance.

> [!IMPORTANT]
> **Day 1 Foundation Notice**: 
> **ML analysis is not implemented yet. It will be added in later development phases.**
> Today's release delivers the full interactive UI foundation, 9 working navigation pages, browser MediaRecorder microphone recording, setup state management, and the FastAPI backend skeleton.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19
  - Vite 8
  - JavaScript (ESNext)
  - Tailwind CSS v4 & Lucide Icons
  - MediaRecorder API (Browser Microphone Recording)
  - Web Speech API (SpeechSynthesis for question playback)
- **Backend**:
  - Python 3.12
  - FastAPI (REST API & CORS middleware)
  - Uvicorn (ASGI server)
- **Database**:
  - Planned: SQLite (No database today for Day 1 setup)
- **Machine Learning (Upcoming Phases)**:
  - OpenAI Whisper (Speech-to-Text)
  - Random Forest (Scoring & classification)
  - Sentence Transformers (Semantic answer relevance)

---

## 📁 Project Structure

```
Mockly/
├── frontend/                 # Vite + React + Tailwind CSS Application
│   ├── public/               # Public assets
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   │   ├── Navbar.jsx    # Top navigation & active page indicator
│   │   │   └── Footer.jsx    # Footer with Day 1 badge
│   │   ├── pages/            # 9 Full Application Pages
│   │   │   ├── LandingPage.jsx         # Landing page with 4-step visual flow
│   │   │   ├── LoginPage.jsx           # Login page
│   │   │   ├── DashboardPage.jsx       # User dashboard overview
│   │   │   ├── SetupPage.jsx           # Interview setup configuration
│   │   │   ├── InterviewScreenPage.jsx # Microphone recording & questions
│   │   │   ├── QuestionFeedbackPage.jsx# Question feedback UI
│   │   │   ├── FinalReportPage.jsx     # Comprehensive report view
│   │   │   ├── HistoryPage.jsx         # Interview history table
│   │   │   └── ProgressPage.jsx        # Visual score progress chart
│   │   ├── App.jsx           # Central page routing & state manager
│   │   ├── index.css         # Tailwind CSS imports & theme styles
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/                  # FastAPI Application
│   ├── main.py               # REST API endpoints (GET / and GET /api/health)
│   └── requirements.txt      # Dependencies (fastapi, uvicorn)
├── ml/                       # Future ML Models Directory
│   └── README.md
├── dataset/                  # Future Datasets Directory
│   └── README.md
└── README.md                 # Project Documentation
```

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18+ or v24+
- **Python**: v3.10+ or v3.12+

---

### 1. Running the Frontend (React + Vite)

Navigate to the `frontend/` directory and install dependencies if not already installed:

```bash
cd Mockly/frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend application will be running locally at:
👉 `http://localhost:5173`

---

### 2. Running the Backend (FastAPI + Uvicorn)

Navigate to the `backend/` directory and install Python dependencies:

```bash
cd Mockly/backend
pip install -r requirements.txt
```

Start the FastAPI ASGI server:

```bash
python -m uvicorn main:app --reload --port 8000
```

The backend API will be available at:
- Root API: `http://localhost:8000/`
- Health Check: `http://localhost:8000/api/health`
- Interactive API Documentation: `http://localhost:8000/docs`

---

## ✨ Day 1 Features Built Today

1. **9 Fully Functional Navigation Pages**:
   - **Landing Page**: Modern career product aesthetic, tagline, 4-step visual flow (Choose Role → Answer Questions → AI Analysis → Personalized Feedback), CTA buttons.
   - **Login Page**: Name, Email, Password fields with direct navigation to Dashboard.
   - **Dashboard**: "Welcome back, Rida" welcome banner, 4 metric overview cards, quick start CTA, and recent interview cards.
   - **Interview Setup**: Role selection (Software Engineer, Frontend, Backend, AI/ML, Data Analyst), Difficulty level, Type, and Question Count saved in React state.
   - **Interview Screen**: Question reader (`🔊 Play Question`), 5 Software Engineer questions, Next/Previous controls, and **live MediaRecorder browser microphone recording** with live timer (`🔴 Recording... 00:15`) and **recorded audio preview player**.
   - **Question Feedback UI**: Per-question evaluation layout with explicit notice that ML pipeline connects later.
   - **Final Report UI**: Comprehensive report cards (Overall score, Answer relevance, Pace, Hesitation, Filler words, Pauses, Strengths, Areas to Improve, Recommendations).
   - **Interview History**: Clean table layout of past sessions.
   - **Progress Page**: Score progression visual chart (Interview 1 → 72, Interview 2 → 75, Interview 3 → 81, Interview 4 → 84) ready for backend/database sync.
2. **FastAPI Backend Skeleton**:
   - `GET /` returns `{"message": "Mockly API is running"}`
   - `GET /api/health` returns `{"status": "ok"}`
   - CORS middleware configured for React frontend communication.

---

## 🔮 Upcoming Features (Future Phases)

- **Speech-to-Text Integration**: OpenAI Whisper for transcribing recorded audio responses.
- **Acoustic Audio Analysis**: Librosa/Praat extraction for speaking pace (WPM), pitch variations, and pause lengths.
- **NLP & Filler Detection**: Transformer models for detecting filler words ("um", "like", "you know") and hesitation patterns.
- **Semantic Answer Relevance**: Sentence Transformers for computing question-answer similarity scores against ideal technical responses.
- **Database & Auth Persistence**: SQLite/PostgreSQL database integration for real user accounts, session storage, and historical tracking.
