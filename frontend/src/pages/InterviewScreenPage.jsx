import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, Square, Play, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Award } from 'lucide-react';

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

  // Get existing recorded audio URL for current question if present
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

        // Capture the timer value here before we reset state
        const recordedDuration = timer;

        // Store blob, audioUrl and initial parsing state in state for this question
        setRecordedAnswers(prev => ({
          ...prev,
          [currentIdx]: {
            blob: audioBlob,
            url: audioUrl,
            duration: recordedDuration,
            timestamp: new Date().toLocaleTimeString(),
            isTranscribing: false,
            transcript: ''
          }
        }));

        // Stop all audio tracks from mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);

      timerIntervalRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);

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

  // Reset timer on question change
  useEffect(() => {
    if (isRecording) {
      stopRecording();
    }
    setTimer(0);
    setErrorMsg('');
  }, [currentIdx]);

  // Clean up timer on unmount
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

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer || !currentAnswer.blob || currentAnswer.isTranscribing) return;

    // Set loading state
    setRecordedAnswers(prev => ({
      ...prev,
      [currentIdx]: { ...prev[currentIdx], isTranscribing: true }
    }));

    try {
      const formData = new FormData();
      formData.append('audio', currentAnswer.blob, 'recording.webm');

      const response = await fetch('http://localhost:8000/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('API transcription error');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: {
          ...prev[currentIdx],
          transcript: data.transcript,
          isTranscribing: false,
        }
      }));
    } catch (err) {
      console.error("Transcription error:", err);
      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: {
          ...prev[currentIdx],
          transcript: "We couldn't process your recording. Please try again.",
          isTranscribing: false,
        }
      }));
    }
  };

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
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/30 transition-transform active:scale-95 mic-recording-pulse"
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

                {/* Transcript Section */}
                <div className="pt-3 mt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    AI Transcript
                  </span>
                  {currentAnswer.isTranscribing ? (
                    <div className="flex items-center space-x-2 text-indigo-400 text-sm font-semibold animate-pulse bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/50">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing your answer...</span>
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <p className="text-slate-200 text-sm leading-relaxed font-medium">
                        {currentAnswer.transcript ? (
                          <span className="italic">"{currentAnswer.transcript}"</span>
                        ) : (
                          <span className="text-slate-500">Submit to view AI transcript.</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Answer Submit & Per-Question Action */}
          {currentAnswer && !isRecording && !currentAnswer.transcript && !currentAnswer.isTranscribing && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmitAnswer}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition-colors"
                disabled={currentAnswer.isTranscribing}
              >
                <Award className="w-4 h-4" />
                <span>{currentAnswer.isTranscribing ? 'Submitting...' : 'Submit Answer'}</span>
              </button>
            </div>
          )}
          {currentAnswer && !isRecording && currentAnswer.transcript && (
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
