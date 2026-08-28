# Mockly — AI-Powered Voice Mock Interview Platform

> **Tagline:** *“Practice how you communicate, not just what you know.”*

---

## 📌 Project Overview

**Mockly** is an AI-powered, voice-first mock interview platform designed specifically for students and fresh graduates.

Traditional interview preparation tools mainly focus on **what** a candidate says. Mockly focuses on **how** the candidate communicates. It analyzes communication behaviors such as speaking pace, pauses, silence, filler words, repetitions, answer relevance, and response structure.

Mockly is designed to simulate a realistic interview experience. Instead of typing answers, candidates **listen to interview questions delivered through voice and respond naturally through their microphone**.

To make the experience more engaging and closer to a real interview, Mockly is also working toward integrating an **AI interviewer avatar** that will provide a human-like visual presence, deliver interview questions, and make the interaction feel more natural.

The overall experience follows:

> **AI Interviewer → Voice Question → Candidate Speaks → AI Analysis → Feedback → Improvement**

Mockly aims to make interview preparation more realistic, personalized, measurable, and accessible for students who may not have regular access to professional interview coaching.

---

## 🎯 Problem

Students and fresh graduates may have strong technical knowledge but still struggle during interviews because of communication issues.

Common problems include:

* Speaking too quickly or too slowly
* Excessive filler words such as *um, uh, like, basically*
* Frequent hesitation
* Long or unnecessary pauses
* Repeating words or ideas
* Poor answer structure
* Answers that are not sufficiently relevant to the question
* Difficulty identifying their own communication weaknesses

Most traditional preparation platforms focus primarily on interview questions and answer content. They do not provide detailed analysis of the candidate's actual speaking behavior.

### 💡 Our Solution

Mockly creates a **voice-first interview simulation** where candidates speak naturally and receive AI-assisted analysis of both their answer and communication style.

The goal is not simply to tell a candidate whether an answer is correct.

The goal is to help them understand:

> **“How did I communicate my answer, and how can I improve?”**

---

## 🎤 Core User Experience

Mockly is designed around a realistic voice interaction.

1. The user starts a mock interview.
2. The AI interviewer presents a question through voice.
3. The candidate listens to the question.
4. The candidate answers through their microphone.
5. Mockly records the response.
6. The audio is sent to the backend.
7. Whisper converts the response into text.
8. Audio and transcript features are analyzed.
9. Mockly evaluates communication and answer quality.
10. The candidate receives question-level feedback.
11. A final performance report summarizes the interview.
12. The candidate can review previous attempts and track improvement.

### Planned AI Interviewer Experience

We are also working toward integrating an **AI interviewer avatar** that will visually represent the interviewer during the session.

The avatar is intended to:

* Provide a human-like interviewer presence
* Deliver interview questions
* Make the interaction more engaging
* Reduce the feeling of interacting with a static application
* Create a more realistic interview practice environment

The avatar is part of the ongoing build phase and will be integrated with the existing voice-based interview flow.

---

## ✨ Key Features

### 🎙️ Voice-Based Interviews

Candidates answer questions naturally using their microphone instead of typing responses.

### 🔊 Voice Question Delivery

Interview questions are delivered through voice to simulate an actual spoken interview.

### 🤖 AI Interviewer Avatar — In Development

A human-like AI interviewer avatar is being integrated to make the interview experience more natural and engaging.

### 📝 AI Speech-to-Text

Recorded answers are converted into transcripts using OpenAI Whisper.

### 🗣️ Communication Analysis

Mockly analyzes measurable communication characteristics including:

* Speaking rate / WPM
* Pauses
* Silence ratio
* Filler words
* Repetitions
* Hesitation patterns

### 🧠 Answer Analysis

The system is being extended to evaluate:

* Question-answer relevance
* Semantic similarity
* Response structure
* Answer completeness

### 📊 Performance Feedback

Candidates receive question-level feedback and actionable suggestions for improvement.

### 📈 Progress Tracking

Candidates can review previous attempts and monitor their communication improvement over time.

---

## 🛠️ Technology Stack

### Frontend

* **React 19**
* **Vite 8**
* **JavaScript (ESNext)**
* **Tailwind CSS v4**
* **Lucide Icons**
* **MediaRecorder API** — real browser microphone recording
* **Web Speech API** — voice question playback

### Backend

* **Python 3.12**
* **FastAPI** — REST API and backend services
* **Uvicorn** — ASGI server
* **FFmpeg** — audio format decoding and preprocessing
* **OpenAI Whisper** — local speech-to-text using the `base` model

### AI / Machine Learning

The AI analysis pipeline is being developed in multiple layers:

* **Whisper** — speech-to-text
* **Librosa / Praat** — acoustic and speech analysis
* **NLP processing** — filler words, hesitation and repetitions
* **Sentence Transformers** — semantic question-answer similarity
* **Random Forest** — planned scoring/classification layer for combining communication and answer-quality features

### Database

* **SQLite / PostgreSQL** — planned for interview sessions, results, history and progress persistence

---

## 🧠 AI Analysis Pipeline

Mockly follows a modular AI pipeline:

```text
Candidate
    ↓
Microphone Recording
    ↓
Audio Processing
    ↓
Whisper Speech-to-Text
    ↓
┌───────────────────────────────┐
│                               │
↓                               ↓
Audio Feature Extraction       NLP Analysis
│                               │
├─ Speaking Rate                ├─ Filler Words
├─ Pauses                       ├─ Repetitions
├─ Silence Ratio                ├─ Hesitation
└─ Other Speech Features        └─ Response Patterns
│                               │
└───────────────┬───────────────┘
                ↓
       Answer Relevance
       & Structure Analysis
                ↓
        Performance Scoring
                ↓
      Personalized Feedback
                ↓
       Progress Tracking
```

This modular architecture allows individual components to be developed and tested independently before being integrated into the complete interview experience.

---

## 📁 Project Structure

```text
Mockly/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── SetupPage.jsx
│   │   │   ├── InterviewScreenPage.jsx
│   │   │   ├── QuestionFeedbackPage.jsx
│   │   │   ├── FinalReportPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── ProgressPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── main.py
│   ├── services/
│   │   └── speech_to_text.py
│   ├── test_whisper.py
│   └── requirements.txt
│
├── ml/
│   └── README.md
│
├── dataset/
│   └── README.md
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

* **Node.js:** v18+ or v24+
* **Python:** v3.10+ or v3.12+
* **FFmpeg:** Required by Whisper for audio decoding

### Install FFmpeg on Windows

```bash
winget install --id=Gyan.FFmpeg -e --accept-package-agreements --accept-source-agreements
```

After installation, restart your terminal so FFmpeg is recognized in PATH.

---

### 1. Run the Frontend

```bash
cd Mockly/frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

### 2. Run the Backend

```bash
cd Mockly/backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
pip install openai-whisper python-multipart

python -m uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000/
```

Health check:

```text
http://localhost:8000/api/health
```

API documentation:

```text
http://localhost:8000/docs
```

Transcription endpoint:

```text
POST http://localhost:8000/api/transcribe
```

---


```
