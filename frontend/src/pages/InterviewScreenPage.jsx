import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Mic, Square, ArrowLeft, ArrowRight,
  CheckCircle, AlertCircle, Award,
  Activity, Clock, MessageSquare, Repeat2, Zap
} from 'lucide-react';

function MetricTile({ label, value, sub, color = 'var(--gold)' }) {
  return (
    <div className="metric-card" style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: 8 }}>{label}</div>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={sub}>{sub}</div>
    </div>
  );
}

function SpeechAnalysisPanel({ features, transcript, hesitation, feedback, isLoading, error }) {
  if (isLoading) {
    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Activity size={14} color="var(--gold)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
            Analyzing Speech...
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="metric-card" style={{ height: 78, background: 'var(--surface-3)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        marginTop: 20, background: 'rgba(212,106,106,0.08)',
        border: '1px solid rgba(212,106,106,0.25)', borderRadius: 12, padding: 16,
        display: 'flex', gap: 12,
      }}>
        <AlertCircle size={16} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-rose)', margin: '0 0 4px' }}>Analysis Failed</p>
          <p style={{ fontSize: 12, color: 'rgba(212,106,106,0.7)', margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!features) return null;

  const silencePct = features.silence_ratio != null ? `${(features.silence_ratio * 100).toFixed(1)}%` : '—';

  const metrics = [
    { label: 'Speaking Rate', value: features.wpm != null ? `${features.wpm}` : '—', sub: 'words / min', color: 'var(--gold)' },
    { label: 'Pause Count', value: features.pause_count ?? '—', sub: 'detected pauses', color: '#7ab8e8' },
    { label: 'Avg Pause', value: features.average_pause != null ? `${features.average_pause}s` : '—', sub: 'per silence', color: 'var(--accent-teal)' },
    { label: 'Silence Ratio', value: silencePct, sub: 'of recording', color: '#e89050' },
    { label: 'Filler Words', value: features.filler_count ?? '—', sub: features.fillers?.length ? features.fillers.join(', ') : 'none', color: 'var(--accent-rose)' },
    { label: 'Repetitions', value: features.repetition_count ?? '—', sub: features.repeated_items?.length ? `"${features.repeated_items[0]}"…` : 'none', color: '#b07ae8' },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Activity size={14} color="var(--gold)" />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
          Speech Analysis
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {metrics.map(m => <MetricTile key={m.label} {...m} />)}
      </div>

      {/* ML Hesitation */}
      {hesitation && !hesitation.error && (
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 18, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
              ML Hesitation Model
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>RF v2</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Predicted Level:</span>
            <span style={{
              fontSize: 13, fontWeight: 700,
              padding: '4px 12px', borderRadius: 6,
              background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)',
              color: 'var(--gold-light)',
              fontFamily: 'DM Mono, monospace',
            }}>
              {hesitation.prediction || 'N/A'}
            </span>
          </div>

          {hesitation.probabilities && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
              {['Low', 'Medium', 'High'].map(lbl => {
                const v = hesitation.probabilities[lbl];
                const pct = v != null ? `${(v * 100).toFixed(0)}%` : '0%';
                return (
                  <div key={lbl} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</div>
                    <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{pct}</div>
                    <div style={{ height: 3, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', marginTop: 6 }}>
                      <div style={{ height: '100%', width: pct, background: 'linear-gradient(90deg, var(--gold), var(--gold-light))', borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {feedback && feedback.summary && (
        <div style={{
          background: 'rgba(61,184,160,0.06)', border: '1px solid rgba(61,184,160,0.2)',
          borderRadius: 12, padding: 18, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MessageSquare size={13} color="var(--accent-teal)" />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace' }}>
              Feedback
            </span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.6 }}>{feedback.summary}</p>
          {feedback.suggestions?.length > 0 && (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feedback.suggestions.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 16,
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'DM Mono, monospace', marginBottom: 10 }}>
            Transcript
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>
            "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
}

export default function InterviewScreenPage({
  setCurrentPage, interviewSetup, recordedAnswers, setRecordedAnswers,
  setSelectedAnswerIdx, selectedAnswerIdx,
}) {
  const defaultQuestions = [
    "What is inheritance in object-oriented programming?",
    "What is the difference between stack and queue?",
    "What is normalization in databases?",
    "What is an API?",
    "Explain the difference between authentication and authorization.",
  ];

  const questions = defaultQuestions.slice(0, interviewSetup?.questionCount || 5);
  const [currentIdx, setCurrentIdx] = useState(selectedAnswerIdx ?? 0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const spokenIdxRef = useRef(-1);

  const currentAnswer = recordedAnswers[currentIdx];

  const handlePlayQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(questions[currentIdx]);
    u.rate = 0.95;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (spokenIdxRef.current !== currentIdx) {
      spokenIdxRef.current = currentIdx;
      if (!recordedAnswers[currentIdx]?.transcript) {
        const tid = setTimeout(handlePlayQuestion, 500);
        return () => { clearTimeout(tid); if (spokenIdxRef.current === currentIdx) spokenIdxRef.current = -1; };
      }
    }
  }, [currentIdx]);

  const startRecording = async () => {
    setErrorMsg('');
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data?.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAnswers(prev => ({
          ...prev,
          [currentIdx]: {
            blob, url: URL.createObjectURL(blob), duration: timer,
            timestamp: new Date().toLocaleTimeString(),
            isAnalyzing: false, analyzeError: null, transcript: null, features: null,
          }
        }));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setTimer(0);
      timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } catch (err) {
      setErrorMsg("Microphone permission denied or device not found.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  useEffect(() => { if (isRecording) stopRecording(); setTimer(0); setErrorMsg(''); }, [currentIdx]);
  useEffect(() => () => {
    clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
  }, []);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleSubmitAnswer = async () => {
    if (!currentAnswer?.blob || currentAnswer.isAnalyzing) return;
    setRecordedAnswers(prev => ({ ...prev, [currentIdx]: { ...prev[currentIdx], isAnalyzing: true, analyzeError: null } }));
    try {
      const fd = new FormData();
      fd.append('audio', currentAnswer.blob, 'recording.webm');
      fd.append('question', questions[currentIdx]);
      const res = await fetch('http://127.0.0.1:8000/api/analyze', { method: 'POST', body: fd });
      if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.detail || `Error ${res.status}`); }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Analysis failed');
      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: { ...prev[currentIdx], transcript: data.transcript, features: data.features, hesitation: data.hesitation, feedback: data.feedback, relevance: data.relevance, isAnalyzing: false, analyzeError: null }
      }));
    } catch (err) {
      setRecordedAnswers(prev => ({
        ...prev,
        [currentIdx]: { ...prev[currentIdx], isAnalyzing: false, analyzeError: err.message || "Could not reach backend at http://127.0.0.1:8000" }
      }));
    }
  };

  const hasResult = currentAnswer?.transcript != null || currentAnswer?.features != null;
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>

      {/* ── Left Column ─────────────────────────────────────────── */}
      <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Progress bar */}
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {interviewSetup?.role || 'Interview'}
            </span>
            <span className="tag-surface" style={{ whiteSpace: 'nowrap' }}>{interviewSetup?.difficulty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
              {currentIdx + 1} / {questions.length}
            </span>
            <div className="progress-bar-track" style={{ width: 80 }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="card" style={{ padding: '32px 28px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="tag-gold">Question {currentIdx + 1}</div>
            <button
              onClick={handlePlayQuestion}
              className="btn-surface"
              style={{ padding: '7px 14px', fontSize: 12 }}
            >
              <Volume2 size={13} color={isSpeaking ? 'var(--gold)' : undefined} />
              {isSpeaking ? 'Playing…' : 'Play Aloud'}
            </button>
          </div>

          <h2 className="font-display" style={{
            fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700,
            color: 'var(--text-primary)', lineHeight: 1.35,
            marginBottom: 28,
            borderLeft: '3px solid var(--gold)',
            paddingLeft: 18,
            marginLeft: -18 + 28,
          }}>
            "{questions[currentIdx]}"
          </h2>

          {/* Recording zone */}
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Your Response</span>
            {currentAnswer && !isRecording && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent-teal)', fontFamily: 'DM Mono, monospace' }}>
                <CheckCircle size={11} /> {currentAnswer.duration}s captured
              </span>
            )}
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(212,106,106,0.08)', border: '1px solid rgba(212,106,106,0.25)',
              borderRadius: 10, padding: '10px 14px',
              display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16,
            }}>
              <AlertCircle size={14} color="var(--accent-rose)" />
              <span style={{ fontSize: 12, color: 'var(--accent-rose)' }}>{errorMsg}</span>
            </div>
          )}

          {/* Mic area */}
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '36px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            {isRecording ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 16px', borderRadius: 999,
                  background: 'rgba(212,106,106,0.12)', border: '1px solid rgba(212,106,106,0.3)',
                  fontSize: 12, color: 'var(--accent-rose)', fontFamily: 'DM Mono, monospace', fontWeight: 600,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-rose)', animation: 'pulse-dot 1s ease-in-out infinite', display: 'inline-block' }} />
                  REC  {fmt(timer)}
                </div>
                <button
                  onClick={stopRecording}
                  className="mic-recording-pulse"
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--accent-rose)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Square size={24} fill="white" />
                </button>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Click to stop recording</p>
              </>
            ) : (
              <>
                <button
                  onClick={startRecording}
                  className="mic-pulse"
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))',
                    border: '1px solid rgba(201,168,76,0.3)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold)',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Mic size={26} />
                </button>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    {currentAnswer ? 'Re-record Response' : 'Record Response'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    Click the microphone to begin
                  </p>
                </div>
              </>
            )}

            {currentAnswer && !isRecording && (
              <div style={{
                width: '100%', maxWidth: 400,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Audio Preview</span>
                  <span style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'DM Mono, monospace' }}>{currentAnswer.timestamp}</span>
                </div>
                <audio controls src={currentAnswer.url} style={{ width: '100%', height: 36 }} />
              </div>
            )}
          </div>

          {/* Analysis panel */}
          {currentAnswer && !isRecording && (
            <SpeechAnalysisPanel
              features={currentAnswer.features}
              transcript={currentAnswer.transcript}
              hesitation={currentAnswer.hesitation}
              feedback={currentAnswer.feedback}
              isLoading={currentAnswer.isAnalyzing}
              error={currentAnswer.analyzeError}
            />
          )}

          {/* Action buttons */}
          {currentAnswer && !isRecording && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              {!hasResult && !currentAnswer.isAnalyzing && (
                <button
                  onClick={handleSubmitAnswer}
                  className="btn-gold"
                  style={{ padding: '10px 22px', fontSize: 13 }}
                >
                  <Award size={14} />
                  Analyze Answer
                </button>
              )}
              {hasResult && !currentAnswer.isAnalyzing && (
                <button
                  onClick={() => { setSelectedAnswerIdx(currentIdx); setCurrentPage('feedback'); }}
                  className="btn-ghost"
                  style={{ padding: '10px 22px', fontSize: 13, color: 'var(--text-primary)' }}
                >
                  <Award size={14} />
                  Full Feedback
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="btn-surface"
            style={{ opacity: currentIdx === 0 ? 0.35 : 1 }}
          >
            <ArrowLeft size={14} /> Previous
          </button>

          <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)' }}>
            {currentIdx + 1} of {questions.length}
          </span>

          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(i => i + 1)} className="btn-surface">
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={() => setCurrentPage('report')} className="btn-gold" style={{ padding: '10px 20px', fontSize: 13 }}>
              Finish & View Report <Award size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Right Column: History ─────────────────────────────────── */}
      <div style={{
        width: 280, flexShrink: 0,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '24px 20px',
        maxHeight: 'calc(100vh - 100px)', position: 'sticky', top: 88,
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
        alignSelf: 'flex-start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <MessageSquare size={14} color="var(--gold)" />
          <span className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Session Log
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {questions.slice(0, currentIdx + 1).map((q, idx) => {
            const a = recordedAnswers[idx];
            const isActive = idx === currentIdx;
            return (
              <div
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentIdx(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: isActive ? 'var(--gold-dim)' : 'var(--surface-3)',
                    border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                    fontFamily: 'DM Mono, monospace',
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: 10, color: isActive ? 'var(--gold)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
                    Q{idx + 1}
                  </span>
                  {a?.transcript && (
                    <CheckCircle size={10} color="var(--accent-teal)" style={{ marginLeft: 'auto' }} />
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 6px', paddingLeft: 30 }}>
                  {q.length > 80 ? q.slice(0, 80) + '…' : q}
                </p>
                {a?.transcript && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, paddingLeft: 30, lineHeight: 1.4 }}>
                    "{a.transcript.slice(0, 80)}{a.transcript.length > 80 ? '…' : ''}"
                  </p>
                )}
                {idx < currentIdx && (
                  <div style={{ height: 1, background: 'var(--border)', margin: '16px 0 0' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 900px) {
          .sticky-sidebar { position: static !important; max-height: none !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
