import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Mic, Square, ArrowLeft, ArrowRight,
  CheckCircle, AlertCircle, RefreshCw, Award,
  Activity, Clock, MessageSquare, Repeat2, Zap
} from 'lucide-react';

// ─── Speech Analysis Panel ────────────────────────────────────────────────────
function SpeechAnalysisPanel({ features, transcript, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="mt-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 animate-pulse">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">
          Speech Analysis
        </h3>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-slate-800/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 bg-red-950/40 border border-red-800/60 rounded-2xl p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-300">Analysis Failed</p>
          <p className="text-xs text-red-400/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!features) return null;

  const silencePct = features.silence_ratio != null
    ? (features.silence_ratio * 100).toFixed(1) + '%'
    : '—';

  const stats = [
    {
      label: 'Speaking Rate',
      value: features.wpm != null ? `${features.wpm} WPM` : '—',
      icon: <Zap className="w-4 h-4 text-indigo-400" />,
      sub: 'words per minute',
      color: 'indigo',
    },
    {
      label: 'Pause Count',
      value: features.pause_count ?? '—',
      icon: <Clock className="w-4 h-4 text-violet-400" />,
      sub: 'detected pauses',
      color: 'violet',
    },
    {
      label: 'Average Pause',
      value: features.average_pause != null ? `${features.average_pause} sec` : '—',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      sub: 'per silent segment',
      color: 'cyan',
    },
    {
      label: 'Silence Ratio',
      value: silencePct,
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      sub: 'of total recording',
      color: 'amber',
    },
    {
      label: 'Filler Words',
      value: features.filler_count ?? '—',
      icon: <MessageSquare className="w-4 h-4 text-rose-400" />,
      sub: features.fillers?.length ? features.fillers.join(', ') : 'none detected',
      color: 'rose',
    },
    {
      label: 'Repetitions',
      value: features.repetition_count ?? '—',
      icon: <Repeat2 className="w-4 h-4 text-orange-400" />,
      sub: features.repeated_items?.length ? `"${features.repeated_items.join('", "')}"` : 'none detected',
      color: 'orange',
    },
  ];

  const colorMap = {
    indigo: 'border-indigo-900/60 bg-indigo-950/30',
    violet: 'border-violet-900/60 bg-violet-950/30',
    cyan: 'border-cyan-900/60 bg-cyan-950/30',
    amber: 'border-amber-900/60 bg-amber-950/30',
    rose: 'border-rose-900/60 bg-rose-950/30',
    orange: 'border-orange-900/60 bg-orange-950/30',
  };

  return (
    <div className="mt-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
      {/* Section title */}
      <div className="flex items-center space-x-2">
        <Activity className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
          Speech Analysis
        </h3>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ label, value, icon, sub, color }) => (
          <div
            key={label}
            className={`border ${colorMap[color]} rounded-xl p-3 space-y-1`}
          >
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
              {icon}
              <span>{label}</span>
            </div>
            <p className="text-xl font-extrabold text-white">{value}</p>
            <p className="text-[10px] text-slate-500 leading-tight truncate" title={sub}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="border-t border-slate-800/80 pt-4 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Transcript
          </span>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <p className="text-slate-200 text-sm leading-relaxed italic">
              "{transcript}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InterviewScreenPage({
  setCurrentPage,
  interviewSetup,
  recordedAnswers,
  setRecordedAnswers
}) {
  const defaultQuestions = [
    "What is inheritance in object-oriented programming?",
    "What is the difference between stack and queue?",
    "What is normalization in databases?",
    "What is an API?",
    "Explain the difference between authentication and authorization."
  ];

  const questions = defaultQuestions.slice(0, interviewSetup?.questionCount || 5);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // MediaRecorder refs & state
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Get existing answer for current question
  const currentAnswer = recordedAnswers[currentIdx];

  // Speech synthesis for 🔊 Play Question
  const handlePlayQuestion = () => {
    if (!('speechSynthesis' in window)) {
      alert("Browser speech synthesis not supported.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questions[currentIdx]);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Start MediaRecorder audio capture
  const startRecording = async () => {
    setErrorMsg('');
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const recordedDuration = timer;

        setRecordedAnswers(prev => ({
          ...prev,
          [currentIdx]: {
            blob: audioBlob,
            url: audioUrl,
            duration: recordedDuration,
            timestamp: new Date().toLocaleTimeString(),
            isAnalyzing: false,
            analyzeError: null,
            transcript: null,
            features: null,
          }
        }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
      timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);

    } catch (err) {
      console.error("Microphone access error:", err);
      setErrorMsg("Microphone permission denied or device not found. Please allow microphone access.");
    }
  };

  // Stop MediaRecorder capture
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  // Reset on question change
  useEffect(() => {
    if (isRecording) stopRecording();
    setTimer(0);
    setErrorMsg('');
  }, [currentIdx]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => { if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1); };
  const handlePrev = () => { if (currentIdx > 0) setCurrentIdx(currentIdx - 1); };

  // Submit: call /api/analyze and store transcript + features
  const handleSubmitAnswer = async () => {
    if (!currentAnswer || !currentAnswer.blob || currentAnswer.isAnalyzing) return;

    // Set loading state
    setRecordedAnswers(prev => ({
      ...prev,
      [currentIdx]: { ...prev[currentIdx], isAnalyzing: true, analyzeError: null }
    }));

    try {
      const formData = new FormData();
      formData.append('audio', currentAnswer.blob, 'recording.webm');

      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Server error ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Analysis failed');

      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: {
          ...prev[currentIdx],
          transcript: data.transcript,
          features: data.features,
          isAnalyzing: false,
          analyzeError: null,
        }
      }));

    } catch (err) {
      console.error("Analysis error:", err);
      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: {
          ...prev[currentIdx],
          isAnalyzing: false,
          analyzeError: err.message || "Could not reach the backend. Make sure it is running at http://127.0.0.1:8000",
        }
      }));
    }
  };

  const hasResult = currentAnswer?.transcript != null || currentAnswer?.features != null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Top Session Progress Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-white">Mockly</span>
          <span className="text-xs text-slate-500 font-mono">|</span>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800">
            {interviewSetup?.role || 'Software Engineer'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <div className="w-24 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Technical Question {currentIdx + 1}
            </span>
            <button
              onClick={handlePlayQuestion}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isSpeaking
                ? 'bg-violet-600 text-white animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700'
                }`}
            >
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>{isSpeaking ? 'Playing Audio...' : '🔊 Play Question'}</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            "{questions[currentIdx]}"
          </h2>
        </div>

        {/* Microphone Recording Section */}
        <div className="border-t border-slate-800/80 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300">Your Answer</h3>
            {currentAnswer && (
              <span className="text-xs text-emerald-400 flex items-center space-x-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Audio Captured ({currentAnswer.duration}s)</span>
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="bg-red-950/60 border border-red-800 p-3 rounded-xl flex items-center space-x-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Recording Status & Main Mic Button */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
            {isRecording ? (
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 font-mono text-sm font-bold animate-pulse">
                  <span>🔴 Recording...</span>
                  <span>{formatTimer(timer)}</span>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/30 transition-transform active:scale-95"
                  >
                    <Square className="w-8 h-8 fill-white" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">Click to stop recording when finished speaking</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 transition-transform active:scale-95 hover:scale-105"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                </div>
                <p className="text-sm font-bold text-white">🎤 Start Recording</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the microphone to record your verbal response using MediaRecorder API.
                </p>
              </div>
            )}

            {/* Recorded Audio Preview Player */}
            {currentAnswer && !isRecording && (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Recorded Audio Preview</span>
                  <span className="font-mono text-indigo-400">{currentAnswer.timestamp}</span>
                </div>
                <audio controls src={currentAnswer.url} className="w-full h-10 accent-indigo-500 rounded-lg" />
              </div>
            )}
          </div>

          {/* Speech Analysis Panel (shown after submit) */}
          {currentAnswer && !isRecording && (
            <SpeechAnalysisPanel
              features={currentAnswer.features}
              transcript={currentAnswer.transcript}
              isLoading={currentAnswer.isAnalyzing}
              error={currentAnswer.analyzeError}
            />
          )}

          {/* Submit Button */}
          {currentAnswer && !isRecording && !hasResult && !currentAnswer.isAnalyzing && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmitAnswer}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Submit Answer</span>
              </button>
            </div>
          )}

          {/* View Feedback (after result arrives) */}
          {hasResult && !currentAnswer.isAnalyzing && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentPage('feedback')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-2 transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>View Question Feedback</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer Nav Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${currentIdx === 0
            ? 'opacity-40 cursor-not-allowed text-slate-500 border-slate-800'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          Question {currentIdx + 1} / {questions.length}
        </span>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage('report')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 transition-colors"
          >
            <span>Finish Interview & Report</span>
            <Award className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
