import React from 'react';
import { Award, AlertCircle, CheckCircle2, TrendingUp, FileText, Play, ArrowRight } from 'lucide-react';

export default function FinalReportPage({ setCurrentPage, recordedAnswers }) {
  const hasAnswers = Object.keys(recordedAnswers).length > 0;
  const answerCount = Object.keys(recordedAnswers).length;

  const metrics = [
    { label: 'Answer Relevance', value: '—' },
    { label: 'Speaking Pace', value: '—' },
    { label: 'Hesitation Level', value: '—' },
    { label: 'Filler Words', value: '—' },
    { label: 'Pause Count', value: '—' },
    { label: 'Acoustic Clarity', value: '—' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

      {/* Page header */}
      <div className="text-center space-y-3" style={{ animation: 'fade-up 0.5s ease both' }}>
        <span className="tag-gold">FINAL ASSESSMENT</span>
        <h1 className="text-4xl font-bold mt-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Interview Report
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
          Comprehensive summary of verbal communication indicators and actionable guidance.
        </p>
      </div>

      {/* Status banner */}
      <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ animation: 'fade-up 0.5s 0.1s ease both' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <FileText className="w-6 h-6" style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
              {hasAnswers ? `${answerCount} response${answerCount > 1 ? 's' : ''} recorded` : 'No session data yet'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
              {hasAnswers ? 'Awaiting ML scoring pipeline integration' : 'Complete an interview to generate your report'}
            </p>
          </div>
        </div>
        <button onClick={() => setCurrentPage('setup')} className="btn-gold shrink-0 px-5 py-2.5 text-xs font-semibold flex items-center gap-2">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Interview</span>
        </button>
      </div>

      {/* Overall score */}
      <div className="card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
        style={{ animation: 'fade-up 0.5s 0.15s ease both' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)' }} />
        <div className="space-y-1 relative">
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
            Overall Score
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>—</span>
            <span className="text-xl" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>/100</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
            Awaiting ML scoring pipeline
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative">
          {[
            { label: 'Session', value: '#MOCK-2026-08' },
            { label: 'Recordings', value: `${answerCount} saved` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center px-5 py-3 rounded-xl"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{label}</p>
              <p className="text-sm font-bold" style={{ color: 'var(--gold)', fontFamily: "'DM Mono', monospace" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ animation: 'fade-up 0.5s 0.2s ease both' }}>
        {metrics.map(({ label, value }, i) => (
          <div key={i} className="card p-5 space-y-2">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{label}</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-muted)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* 3 insight sections */}
      <div className="space-y-4" style={{ animation: 'fade-up 0.5s 0.25s ease both' }}>
        {[
          {
            icon: CheckCircle2,
            color: 'var(--accent-teal)',
            title: 'Strengths',
            items: [
              'Consistent response structure and technical terminology.',
              'Clear microphone audio signal captured via browser MediaRecorder.',
              'Completed interview questions within requested timeline limits.',
            ],
          },
          {
            icon: AlertCircle,
            color: '#d4a84c',
            title: 'Areas to Improve',
            items: [
              'Reduce initial hesitation pauses before commencing detailed explanations.',
              'Maintain steady cadence during complex database and OOP questions.',
            ],
          },
          {
            icon: TrendingUp,
            color: 'var(--accent-blue)',
            title: 'Recommendations',
            items: [
              'Practice 2–3 mock sessions per week to build verbal confidence.',
              'Use structured answer models (STAR / Problem-Solution-Result).',
              'Listen back to your audio recordings in the Interview Room player.',
            ],
          },
        ].map(({ icon: Icon, color, title, items }) => (
          <div key={title} className="card p-6 space-y-4">
            <h3 className="flex items-center gap-2.5 font-semibold text-sm"
              style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
              <Icon className="w-4 h-4 shrink-0" style={{ color }} />
              {title}
            </h3>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm"
                  style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2" style={{ animation: 'fade-up 0.5s 0.3s ease both' }}>
        <button onClick={() => setCurrentPage('history')}
          className="btn-ghost flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold">
          View History
        </button>
        <button onClick={() => setCurrentPage('setup')}
          className="btn-gold flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold">
          <span>New Interview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
