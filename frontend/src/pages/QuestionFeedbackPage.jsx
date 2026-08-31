import React from 'react';
import { Award, Clock, Activity, ArrowLeft, ArrowRight, Zap, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

function paceBadge(wpm) {
  if (wpm == null) return null;
  if (wpm < 110) return { label: 'Slow', color: '#d4a84c' };
  if (wpm > 160) return { label: 'Fast', color: 'var(--accent-rose)' };
  return { label: 'Normal', color: 'var(--accent-teal)' };
}

function hesitationColor(pred) {
  if (pred === 'Low')    return 'var(--accent-teal)';
  if (pred === 'Medium') return '#d4a84c';
  if (pred === 'High')   return 'var(--accent-rose)';
  return 'var(--text-muted)';
}

function MetricCard({ label, icon: Icon, iconColor, value, unit, sub }) {
  return (
    <div className="card p-5 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: iconColor }} />
        <span className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          {value ?? '—'}
        </span>
        {unit && (
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{unit}</span>
        )}
      </div>
      {sub && (
        <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }} title={sub}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function QuestionFeedbackPage({ setCurrentPage, recordedAnswers, selectedAnswerIdx }) {
  const answerCount = Object.keys(recordedAnswers).length;
  const answer     = selectedAnswerIdx != null ? recordedAnswers[selectedAnswerIdx] : null;
  const features   = answer?.features ?? null;
  const hesitation = answer?.hesitation ?? null;
  const feedback   = answer?.feedback ?? null;
  const transcript = answer?.transcript ?? null;
  const hasData    = features != null;
  const wpm        = features?.wpm;
  const pace       = paceBadge(wpm);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-3" style={{ animation: 'fade-up 0.5s ease both' }}>
        <span className="tag-gold">QUESTION ANALYSIS</span>
        <h1 className="text-4xl font-bold mt-2"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Answer Analysis
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
          Per-question verbal performance indicators from the ML pipeline.
        </p>
      </div>

      {/* No-data guard */}
      {!hasData ? (
        <div className="card p-12 text-center space-y-5" style={{ animation: 'fade-up 0.5s 0.1s ease both' }}>
          <AlertCircle className="w-10 h-10 mx-auto" style={{ color: 'var(--text-muted)' }} />
          <div className="space-y-2">
            <p className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
              Analysis not available
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
              Submit an answer on the interview screen and click "View Question Feedback" to see results here.
            </p>
          </div>
          <button onClick={() => setCurrentPage('interview')}
            className="btn-gold mx-auto px-6 py-2.5 text-sm font-semibold flex items-center gap-2 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interview</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8" style={{ animation: 'fade-up 0.5s 0.1s ease both' }}>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Relevance */}
            <div className="card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
                <span className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                  AI Semantic Relevance
                </span>
              </div>
              {answer?.relevance ? (
                <>
                  <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                    {answer.relevance.score}%
                  </p>
                  <p className="text-xs font-semibold" style={{
                    color: answer.relevance.score > 70 ? 'var(--accent-teal)' : answer.relevance.score > 40 ? '#d4a84c' : 'var(--accent-rose)',
                    fontFamily: "'DM Mono', monospace"
                  }}>
                    {answer.relevance.score > 70 ? 'High' : answer.relevance.score > 40 ? 'Moderate' : 'Low'} Relevance
                  </p>
                </>
              ) : (
                <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-muted)' }}>N/A</p>
              )}
            </div>

            {/* Speaking Pace */}
            <div className="card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
                <span className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                  Speaking Pace
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                  {wpm ?? '—'}
                </span>
                {wpm != null && <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>WPM</span>}
              </div>
              {pace && (
                <p className="text-xs font-semibold" style={{ color: pace.color, fontFamily: "'DM Mono', monospace" }}>
                  {pace.label}
                </p>
              )}
            </div>

            {/* Hesitation */}
            <div className="card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" style={{ color: '#a078d0' }} />
                <span className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                  Hesitation Level
                </span>
              </div>
              {hesitation && !hesitation.error ? (
                <>
                  <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: hesitationColor(hesitation.prediction) }}>
                    {hesitation.prediction ?? '—'}
                  </p>
                  {hesitation.probabilities && (
                    <div className="grid grid-cols-3 gap-1 pt-1 text-center">
                      {['Low', 'Medium', 'High'].map(lbl => (
                        <div key={lbl} className="rounded-md p-1.5"
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <span className="block text-[9px]" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{lbl}</span>
                          <span className="text-xs font-bold" style={{ color: 'var(--text-primary)', fontFamily: "'DM Mono', monospace" }}>
                            {hesitation.probabilities[lbl] != null
                              ? `${(hesitation.probabilities[lbl] * 100).toFixed(0)}%`
                              : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-muted)' }}>—</p>
              )}
            </div>

            <MetricCard label="Filler Words" icon={MessageSquare} iconColor="var(--accent-rose)"
              value={features.filler_count}
              sub={features.fillers?.length ? `Detected: ${features.fillers.join(', ')}` : 'None detected'} />

            <MetricCard label="Pauses & Silences" icon={Clock} iconColor="var(--accent-teal)"
              value={features.pause_count}
              sub={features.average_pause != null ? `Avg ${features.average_pause}s${features.longest_pause ? ` · Max ${features.longest_pause}s` : ''}` : undefined} />

            <MetricCard label="Audio Captured" icon={CheckCircle} iconColor="var(--gold)"
              value={answerCount} unit="answers"
              sub="Stored in frontend state" />
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="card p-6 space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-semibold"
                style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                Transcript
              </p>
              <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
                "{transcript}"
              </p>
            </div>
          )}

          {/* Personalized Feedback */}
          {feedback?.summary && (
            <div className="card p-6 space-y-4"
              style={{ borderLeft: '3px solid var(--accent-teal)' }}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: 'var(--accent-teal)' }} />
                <span className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--accent-teal)', fontFamily: "'DM Mono', monospace" }}>
                  Personalized Feedback
                </span>
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
                {feedback.summary}
              </p>
              {feedback.suggestions?.length > 0 && (
                <ul className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  {feedback.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm"
                      style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
                      <span style={{ color: 'var(--accent-teal)' }}>→</span>
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2" style={{ animation: 'fade-up 0.5s 0.25s ease both' }}>
        <button onClick={() => setCurrentPage('interview')}
          className="btn-ghost flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interview Room</span>
        </button>
        <button onClick={() => setCurrentPage('report')}
          className="btn-gold flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold">
          <span>View Final Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
