import React from 'react';
import { Award, Clock, Activity, ArrowLeft, ArrowRight, Zap, MessageSquare, Repeat2, AlertCircle, CheckCircle } from 'lucide-react';

// ── Simple WPM → pace label ───────────────────────────────────────────────────
function paceBadge(wpm) {
  if (wpm == null) return null;
  if (wpm < 110) return { label: 'Slow', color: 'text-amber-400' };
  if (wpm > 160) return { label: 'Fast', color: 'text-rose-400' };
  return { label: 'Normal', color: 'text-emerald-400' };
}

// ── Hesitation colour ─────────────────────────────────────────────────────────
function hesitationColor(pred) {
  if (pred === 'Low') return 'text-emerald-400';
  if (pred === 'Medium') return 'text-amber-400';
  if (pred === 'High') return 'text-rose-400';
  return 'text-slate-400';
}

export default function QuestionFeedbackPage({ setCurrentPage, recordedAnswers, selectedAnswerIdx }) {
  const answerCount = Object.keys(recordedAnswers).length;

  // Safely derive the selected answer's analysis
  const answer = selectedAnswerIdx != null ? recordedAnswers[selectedAnswerIdx] : null;
  const features = answer?.features ?? null;
  const hesitation = answer?.hesitation ?? null;
  const feedback = answer?.feedback ?? null;
  const transcript = answer?.transcript ?? null;

  const hasData = features != null;

  // WPM helpers
  const wpm = features?.wpm;
  const pace = paceBadge(wpm);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
          QUESTION ANALYSIS
        </div>
        <h1 className="text-3xl font-extrabold text-white">Answer Analysis</h1>
        <p className="text-sm text-slate-400">
          Per-question verbal performance indicators from the ML pipeline.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">

        {/* ── No data guard ── */}
        {!hasData ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-slate-300 font-semibold">Analysis not available</p>
            <p className="text-xs text-slate-500">
              Submit an answer on the interview screen and click "View Question Feedback" to see your results here.
            </p>
            <button
              onClick={() => setCurrentPage('interview')}
              className="mt-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Interview</span>
            </button>
          </div>
        ) : (
          <>
            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Answer Relevance */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-semibold block">AI Semantic Relevance</span>
                {answer?.relevance ? (
                  <>
                    <div className="text-3xl font-extrabold text-white font-mono">
                      {answer.relevance.score}%
                    </div>
                    <div className={`text-sm font-bold ${answer.relevance.score > 70 ? 'text-emerald-400' : answer.relevance.score > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {answer.relevance.score > 70 ? 'High' : answer.relevance.score > 40 ? 'Moderate' : 'Low'}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      Sentence Transformer similarity
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-extrabold text-slate-500 font-mono">N/A</div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      Requires question and transcript.
                    </div>
                  </>
                )}
              </div>

              {/* Speaking Pace */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-indigo-400 inline" /> Speaking Pace
                </span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {wpm != null ? `${wpm}` : '—'}
                  {wpm != null && <span className="text-base font-semibold text-slate-400 ml-1">WPM</span>}
                </div>
                {pace && (
                  <div className={`text-sm font-bold ${pace.color}`}>{pace.label}</div>
                )}
                <div className="text-[11px] text-slate-500">words per minute</div>
              </div>

              {/* Hesitation Marker */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-violet-400 inline" /> Hesitation Marker
                </span>
                {hesitation && !hesitation.error ? (
                  <>
                    <div className={`text-2xl font-extrabold font-mono ${hesitationColor(hesitation.prediction)}`}>
                      {hesitation.prediction ?? '—'}
                    </div>
                    {hesitation.probabilities && (
                      <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[10px]">
                        {['Low', 'Medium', 'High'].map(lbl => (
                          <div key={lbl} className="bg-slate-800 rounded-lg p-1.5">
                            <span className="text-slate-400 block">{lbl}</span>
                            <span className="text-white font-bold">
                              {hesitation.probabilities[lbl] != null
                                ? `${(hesitation.probabilities[lbl] * 100).toFixed(0)}%`
                                : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500 font-mono">{hesitation.model}</div>
                  </>
                ) : (
                  <div className="text-slate-500 text-sm">—</div>
                )}
              </div>

              {/* Filler Words */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400 inline" /> Filler Words
                </span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {features.filler_count ?? '—'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {features.fillers?.length
                    ? `Detected: ${features.fillers.join(', ')}`
                    : 'None detected'}
                </div>
              </div>

              {/* Pauses & Silences */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 inline" /> Pauses &amp; Silences
                </span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {features.pause_count ?? '—'}
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  {features.average_pause != null && (
                    <div>Avg: {features.average_pause}s</div>
                  )}
                  {features.longest_pause != null && (
                    <div>Longest: {features.longest_pause}s</div>
                  )}
                </div>
              </div>

              {/* Audio Captured */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline" /> Audio Captured
                </span>
                <div className="text-2xl font-bold text-indigo-400 font-mono">{answerCount} Answers</div>
                <div className="text-[11px] text-slate-500">Stored in frontend state</div>
              </div>

            </div>

            {/* ── Transcript ── */}
            {transcript && (
              <div className="border-t border-slate-800/80 pt-6 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Transcript
                </span>
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-200 text-sm leading-relaxed italic">"{transcript}"</p>
                </div>
              </div>
            )}

            {/* ── Personalized Feedback ── */}
            {feedback && (
              <div className="border-t border-slate-800/80 pt-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Personalized Feedback
                  </span>
                </div>
                {feedback.summary ? (
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                    <p className="text-sm font-semibold text-slate-200">{feedback.summary}</p>
                    {feedback.suggestions?.length > 0 && (
                      <div className="space-y-1.5 border-t border-slate-800/60 pt-2.5">
                        <span className="text-[11px] font-semibold text-slate-400 block">
                          Suggestions for Improvement:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {feedback.suggestions.map((sug, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-emerald-400 font-bold mt-0.5">•</span>
                              <span className="leading-relaxed">{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-xs text-slate-400 italic">
                    Personalized feedback is temporarily unavailable.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-6">
          <button
            onClick={() => setCurrentPage('interview')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interview Room</span>
          </button>

          <button
            onClick={() => setCurrentPage('report')}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-colors"
          >
            <span>View Full Final Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
