import React from 'react';
import { Calendar, Code, Database, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

export default function HistoryPage({ setCurrentPage }) {
  const historyData = [
    { id: 1, date: 'Aug 18, 2026', role: 'Software Engineer',   score: 76, icon: Code,     type: 'Technical',  questions: 5 },
    { id: 2, date: 'Aug 12, 2026', role: 'Frontend Developer',  score: 81, icon: Code,     type: 'Technical',  questions: 5 },
    { id: 3, date: 'Aug 05, 2026', role: 'Backend Developer',   score: 74, icon: Database, type: 'Mixed',      questions: 10 },
    { id: 4, date: 'Jul 28, 2026', role: 'AI/ML Engineer',      score: 79, icon: Cpu,      type: 'Technical',  questions: 5 },
    { id: 5, date: 'Jul 20, 2026', role: 'Data Analyst',        score: 72, icon: Database, type: 'Behavioral', questions: 5 },
  ];

  function scoreColor(s) {
    if (s >= 80) return 'var(--accent-teal)';
    if (s >= 75) return 'var(--gold)';
    return 'var(--text-secondary)';
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        style={{ animation: 'fade-up 0.5s ease both' }}>
        <div className="space-y-2">
          <span className="tag-gold">PAST SESSIONS</span>
          <h1 className="text-4xl font-bold mt-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            Interview History
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
            Review past mock sessions, roles evaluated, and scores achieved.
          </p>
        </div>
        <button onClick={() => setCurrentPage('setup')}
          className="btn-gold self-start sm:self-auto shrink-0 px-5 py-2.5 text-xs font-semibold flex items-center gap-2">
          <span>New Session</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden" style={{ animation: 'fade-up 0.5s 0.1s ease both' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                {['Date', 'Role & Type', 'Questions', 'Score', 'Status', ''].map(h => (
                  <th key={h} className="py-4 px-6 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, i) => {
                const Icon = row.icon;
                return (
                  <tr key={row.id}
                    style={{ borderBottom: '1px solid var(--border)', animation: `fade-up 0.4s ${0.15 + i * 0.06}s ease both` }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                    {/* Date */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs"
                        style={{ color: 'var(--text-secondary)', fontFamily: "'DM Mono', monospace" }}>
                        <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                        {row.date}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                          style={{ background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)' }}>
                          <Icon className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
                            {row.role}
                          </p>
                          <p className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                            {row.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Questions */}
                    <td className="py-4 px-6 text-xs"
                      style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                      {row.questions}Q
                    </td>

                    {/* Score */}
                    <td className="py-4 px-6">
                      <span className="text-lg font-bold"
                        style={{ fontFamily: "'Playfair Display', serif", color: scoreColor(row.score) }}>
                        {row.score}
                        <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/100</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(61,184,160,0.1)', border: '1px solid rgba(61,184,160,0.25)', color: 'var(--accent-teal)', fontFamily: "'DM Mono', monospace" }}>
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => setCurrentPage('report')}
                        className="btn-ghost px-4 py-1.5 text-xs font-semibold flex items-center gap-1 ml-auto">
                        Report
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
