# Mockly - AI-Powered Mock Interview Platform

> **Tagline:** *"Practice how you communicate, not just what you know."*

---

## 📌 Project Overview

**Mockly** is an AI-powered mock interview platform engineered specifically for students and fresh graduates. While traditional interview prep platforms only evaluate *what* you say, Mockly is designed to analyze *how* you communicate—evaluating vocal delivery, speaking pace, hesitation, filler words, pause frequency, and semantic answer relevance.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19
  - Vite 8
  - JavaScript (ESNext)
  - Tailwind CSS v4 & Lucide Icons
  - **MediaRecorder API** (real browser microphone recording — captures actual audio blob)
  - Web Speech API (SpeechSynthesis for question playback)
- **Backend**:
  - Python 3.12
  - FastAPI (REST API & CORS middleware)
  - Uvicorn (ASGI server)
  - **OpenAI Whisper** (local speech-to-text, `base` model, CPU inference)
  - **FFmpeg** (required by Whisper for audio format decoding)
- **Database**:
  - Planned: SQLite (No database yet)
- **Machine Learning (Upcoming Phases)**:
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
│   │   │   └── Footer.jsx    # Footer component
│   │   ├── pages/            # 9 Full Application Pages
│   │   │   ├── LandingPage.jsx         # Landing page with 4-step visual flow
│   │   │   ├── LoginPage.jsx           # Login page
│   │   │   ├── DashboardPage.jsx       # User dashboard overview
│   │   │   ├── SetupPage.jsx           # Interview setup configuration
│   │   │   ├── InterviewScreenPage.jsx # Mic recording + Whisper transcript display
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
│   ├── main.py               # REST API endpoints including POST /api/transcribe
│   ├── services/
│   │   └── speech_to_text.py # Whisper model loading & transcription service
│   ├── test_whisper.py       # Local test script for Whisper (.mp3/.wav)
│   └── requirements.txt      # Python dependencies
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
- **FFmpeg**: Required by Whisper for audio decoding

Install FFmpeg on Windows (run once):
```bash
winget install --id=Gyan.FFmpeg -e --accept-package-agreements --accept-source-agreements
```
> After installation, **restart your terminal** so FFmpeg is recognized in PATH.

---

### 1. Running the Frontend (React + Vite)

```bash
cd Mockly/frontend
npm install
npm run dev
```

Frontend runs at: 👉 `http://localhost:5173`

---

### 2. Running the Backend (FastAPI + Uvicorn)

```bash
cd Mockly/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install openai-whisper python-multipart
python -m uvicorn main:app --reload
```

Backend endpoints:
- Root: `http://localhost:8000/`
- Health: `http://localhost:8000/api/health`
- **Transcribe**: `POST http://localhost:8000/api/transcribe`
- API Docs: `http://localhost:8000/docs`

---

### 3. Testing Whisper Locally (without browser)

Place a `.mp3` or `.wav` file named `test.mp3` inside `backend/`, then:

```bash
cd Mockly/backend
venv\Scripts\activate
python test_whisper.py

# Or pass a custom filename:
python test_whisper.py my_recording.mp3
```

---

## ✨ Day 1 Features

1. **9 Fully Functional Navigation Pages** — Landing, Login, Dashboard, Setup, Interview Screen, Question Feedback, Final Report, History, Progress.
2. **Browser MediaRecorder API** — Real microphone access, live timer, audio preview player.
3. **FastAPI Backend Skeleton** — `GET /`, `GET /api/health`, CORS enabled.

---

## ✨ Day 2 Features

1. **Local Whisper Speech-to-Text**:
   - Installed `openai-whisper` in the backend virtual environment.
   - Created `backend/services/speech_to_text.py` — dedicated, reusable transcription service.
   - Whisper `base` model loaded once and cached globally for efficient repeated use.
   - Uses `initial_prompt` to preserve natural filler words (um, uh, like, you know) in the transcript.

2. **`POST /api/transcribe` Endpoint**:
   - Accepts an uploaded audio file via `multipart/form-data`.
   - Saves to temp file → passes to `speech_to_text.py` → runs Whisper → deletes temp file.
   - Returns `{ "success": true, "transcript": "..." }`.
   - Graceful error handling — returns `{ "success": false, "error": "..." }` on failure.

3. **React Frontend Integration**:
   - User records answer via mic (MediaRecorder API).
   - Clicks **Submit Answer** button.
   - Audio blob packaged into `FormData` and `POST`ed to `/api/transcribe`.
   - Loading state: *"Analyzing your answer..."* (animated spinner).
   - On success: transcript shown under **"AI Transcript"** in the Your Answer section.
   - On error: *"We couldn't process your recording. Please try again."*
   - After transcript appears, **View Question Feedback** button is shown.

---

## 🔮 Upcoming Features (Future Phases)

- **Acoustic Audio Analysis**: Librosa/Praat for speaking pace (WPM), pitch, and pause detection.
- **NLP & Filler Detection**: Transformer models for quantifying hesitation in transcripts.
- **Semantic Answer Relevance**: Sentence Transformers for question–answer similarity scoring.
- **ML Scoring**: Random Forest combining audio features + NLP + transcript quality into an interview score.
- **Database & Auth**: SQLite/PostgreSQL for real user accounts, session storage, and historical tracking.
