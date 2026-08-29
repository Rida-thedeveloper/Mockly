import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 9 Frontend Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SetupPage from './pages/SetupPage';
import InterviewScreenPage from './pages/InterviewScreenPage';
import QuestionFeedbackPage from './pages/QuestionFeedbackPage';
import FinalReportPage from './pages/FinalReportPage';
import HistoryPage from './pages/HistoryPage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  // Page Routing State
  const [currentPage, setCurrentPage] = useState('landing');

  // User Auth Demo State
  const [user, setUser] = useState({
    name: 'Rida Fatima',
    email: 'rida@example.com'
  });

  // Interview Setup State
  const [interviewSetup, setInterviewSetup] = useState({
    role: 'Software Engineer',
    difficulty: 'Intermediate',
    type: 'Technical',
    questionCount: 5
  });

  // Recorded Audio Answers State (Question Index -> Audio Object)
  const [recordedAnswers, setRecordedAnswers] = useState({});

  // Tracks which question's analysis to show on the feedback page
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState(null);

  // Render Page Content based on active state
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;

      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;

      case 'dashboard':
        return <DashboardPage setCurrentPage={setCurrentPage} user={user} />;

      case 'setup':
        return (
          <SetupPage
            setCurrentPage={setCurrentPage}
            interviewSetup={interviewSetup}
            setInterviewSetup={setInterviewSetup}
          />
        );

      case 'interview':
        return (
          <InterviewScreenPage
            setCurrentPage={setCurrentPage}
            interviewSetup={interviewSetup}
            recordedAnswers={recordedAnswers}
            setRecordedAnswers={setRecordedAnswers}
            setSelectedAnswerIdx={setSelectedAnswerIdx}
          />
        );

      case 'feedback':
        return (
          <QuestionFeedbackPage
            setCurrentPage={setCurrentPage}
            recordedAnswers={recordedAnswers}
            selectedAnswerIdx={selectedAnswerIdx}
          />
        );

      case 'report':
        return (
          <FinalReportPage
            setCurrentPage={setCurrentPage}
            recordedAnswers={recordedAnswers}
          />
        );

      case 'history':
        return <HistoryPage setCurrentPage={setCurrentPage} />;

      case 'progress':
        return <ProgressPage setCurrentPage={setCurrentPage} />;

      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
      />

      {/* Main Page View Container */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
