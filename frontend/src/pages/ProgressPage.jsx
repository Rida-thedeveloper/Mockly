import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function ProgressPage({ setCurrentPage }) {
  const progressData = [
    { label: 'Interview 1', score: 72, date: 'Jul 20', role: 'Data Analyst' },
    { label: 'Interview 2', score: 75, date: 'Jul 28', role: 'AI/ML Engineer' },
    { label: 'Interview 3', score: 81, date: 'Aug 12', role: 'Frontend Developer' },
    { label: 'Interview 4', score: 84, date: 'Aug 18', role: 'Software Engineer' },
  ];

  const maxScore = 100;
  const delta = progressData[progressData.length - 1].score - progressData[0].score;

  function barColor(score) {
    if (score >= 80) return 'linear-gradient(to top, #2d9e84, var(--accent-teal))';
    if (score >= 75) return 'linear-gradient(to top, #a07830, var(--gold))';
    return 'linear-gradient(to top, #3a4a8a, var(--accent-blue))';
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-3" style={{ animation: 'fade-up 0.5s ease both' }}>
        <span className="tag-gold">ANALYTICS & TRENDS</span>
        <h1 className="text-4xl font-bold mt-2"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Interview Progress
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
          Track your performance trajectory across consecutive mock sessions.
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ animation: 'fade-up 0.5s 0.1s ease both' }}>
        {[
          { label: 'Total Sessions', value: progressData.length },
          { label: 'Latest Score', value: `${progressData[progressData.length - 1].score}/100` },
          { label: 'Score Growth', value: `+${delta} pts` },
        ].map(({ label, value }) => (
          <div key={label} className="card p-5 text-center space-y-1">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{label}</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card p-8 space-y-8" style={{ animation: 'fade-up 0.5s 0.15s ease both' }}>
        <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-teal)' }} />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
              Score Improvement Trajectory
            </h2>
          </div>
          <span className="tag-gold text-[10px]">DEMO DATA</span>
        </div>

        {/* Bars */}
        <div className="grid grid-cols-4 gap-4 sm:gap-8 items-end px-4"
          style={{ height: '240px', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          {progressData.map((item, idx) => {
            const heightPercent = (item.score / maxScore) * 100;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                {/* Score label */}
                <div className="mb-2 px-2.5 py-1 rounded-md text-xs font-bold transition-all"
                  style={{ background: 'var(--gold-dim)', color: 'var(--gold)', fontFamily: "'DM Mono', monospace",
                    border: '1px solid rgba(201,168,76,0.25)', animation: `fade-up 0.5s ${0.2 + idx * 0.1}s ease both` }}>
                  {item.score}
                </div>
                {/* Bar */}
                <div
                  className="w-full max-w-[56px] rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                  style={{
                    height: `${heightPercent}%`,
                    background: barColor(item.score),
                    boxShadow: '0 0 16px rgba(201,168,76,0.15)',
                    animation: `fade-up 0.6s ${0.25 + idx * 0.1}s ease both`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="grid grid-cols-4 gap-4 sm:gap-8 px-4 text-center">
          {progressData.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-session legend cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" style={{ animation: 'fade-up 0.5s 0.2s ease both' }}>
        {progressData.map((item, idx) => (
          <div key={idx} className="card p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
              {item.label}
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>{item.role}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{item.date}</span>
              <span className="text-sm font-bold" style={{ color: 'var(--gold)', fontFamily: "'Playfair Display', serif" }}>{item.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center" style={{ animation: 'fade-up 0.5s 0.3s ease both' }}>
        <button onClick={() => setCurrentPage('setup')}
          className="btn-gold px-8 py-3 font-semibold text-sm flex items-center gap-2">
          <span>Practice Another Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
