import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Code, Database, Cpu, CheckCircle,
  ArrowRight, Layers, TrendingUp, Award, HelpCircle,
} from 'lucide-react';
import ScrollStroke from '../components/ScrollStroke';

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
    return '#e89050';
  }

  // Visual-only filter pills (no filtering logic)
  const filters = ['All Sessions', 'Technical', 'Behavioral'];
  const [activeFilter, setActiveFilter] = useState('All Sessions');

  const summaryStats = [
    { icon: Layers,     label: 'Total',     value: '5 Sessions',          color: 'var(--accent-blue)' },
    { icon: TrendingUp, label: 'Average',   value: 'Avg Score: 76.4',     color: 'var(--gold)' },
    { icon: Award,      label: 'Personal Best', value: 'Best: 81 (Frontend Dev)', color: 'var(--accent-teal)' },
  ];

  const [hoveredId, setHoveredId] = useState(null);

  const difficultyFor = (q) => (q >= 10 ? 'Extended' : 'Standard');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', isolation: 'isolate' }}>
      <ScrollStroke
        filterId="history"
        viewBox="0 0 1200 2000"
        path="M100,0 C200,80 400,60 500,160 C600,260 500,400 600,500 C700,600 900,580 1000,680 C1100,780 1000,920 1000,1040 C1000,1160 1100,1220 1080,1340 C1060,1460 900,1500 860,1620 C820,1740 900,1860 880,2000"
        color="rgba(74,143,212,0.42)"
        glowColor="rgba(74,143,212,0.16)"
        dotColor="#4A8FD4"
        strokeWidth={2.5}
        side="center"
        scrollRange={[0, 0.88]}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1120,
          margin: '0 auto',
          padding: '56px 24px 80px',
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span className="tag-gold">Past Sessions</span>
              <h1
                className="font-display"
                style={{
                  fontSize: 38,
                  fontStyle: 'italic',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: 'var(--text-primary)',
                  margin: '16px 0 10px',
                  letterSpacing: '-0.01em',
                }}
              >
                Interview History
              </h1>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                  margin: 0,
                  maxWidth: 520,
                }}
              >
                Review your past mock sessions, performance trends, and full reports.
              </p>
            </div>

            <button
              className="btn-gold"
              onClick={() => setCurrentPage('setup')}
              style={{ flexShrink: 0 }}
            >
              New Session
              <ArrowRight size={14} />
            </button>
          </div>

          {/* thin gold gradient line */}
          <div
            style={{
              marginTop: 28,
              height: 1,
              background:
                'linear-gradient(90deg, rgba(201,168,76,0.55) 0%, rgba(201,168,76,0.18) 45%, transparent 100%)',
            }}
          />
        </motion.div>

        {/* ── Filter bar (visual only) ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 30 }}
        >
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <motion.button
                key={f}
                onClick={() => setActiveFilter(f)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  fontFamily: "'DM Mono', monospace",
                  transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                  background: active ? 'var(--gold-dim)' : 'var(--surface-2)',
                  border: `1px solid ${active ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
                  color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                }}
              >
                {f}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Summary strip ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginTop: 22,
          }}
        >
          {summaryStats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="metric-card"
                style={{ display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--surface-3)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-display"
                    style={{
                      margin: '3px 0 0',
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Session list ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 26 }}>
          <AnimatePresence initial={false}>
            {historyData.map((row, i) => {
              const Icon = row.icon;
              const color = scoreColor(row.score);
              const isHovered = hoveredId === row.id;

              return (
                <motion.div
                  key={row.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.45, delay: 0.22 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ backgroundColor: 'var(--surface-2)', x: 2 }}
                  onHoverStart={() => setHoveredId(row.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderLeft: `2px solid ${isHovered ? color : 'transparent'}`,
                    borderRadius: 14,
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    flexWrap: 'wrap',
                    transition: 'border-color 0.25s ease',
                  }}
                >
                  {/* Score ring badge */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: [0.7, 1.12, 1], opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${color}`,
                      background: 'var(--surface-2)',
                      boxShadow: isHovered ? `0 0 16px -4px ${color}` : 'none',
                    }}
                  >
                    <span
                      className="font-display"
                      style={{ fontSize: 17, fontWeight: 700, color }}
                    >
                      {row.score}
                    </span>
                  </motion.div>

                  {/* Role + type */}
                  <div style={{ minWidth: 172, flex: '1 1 172px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <p
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {row.role}
                      </p>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: 7,
                        padding: '3px 9px',
                        borderRadius: 5,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: "'DM Mono', monospace",
                        color: 'var(--accent-blue)',
                        background: 'rgba(74,143,212,0.1)',
                        border: '1px solid rgba(74,143,212,0.22)',
                      }}
                    >
                      {row.type}
                    </span>
                  </div>

                  {/* Meta: difficulty, questions, date */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      flexWrap: 'wrap',
                      flex: '1 1 auto',
                    }}
                  >
                    <span className="tag-surface">{difficultyFor(row.questions)}</span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      <HelpCircle size={12} />
                      {row.questions}Q
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                      {row.date}
                    </span>
                  </div>

                  {/* Score + status */}
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 104 }}>
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.34 + i * 0.06, ease: 'easeOut' }}
                      className="font-display"
                      style={{ margin: 0, fontSize: 28, fontWeight: 700, lineHeight: 1, color }}
                    >
                      {row.score}
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                          color: 'var(--text-muted)',
                          marginLeft: 3,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        /100
                      </span>
                    </motion.p>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        marginTop: 9,
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 10,
                        letterSpacing: '0.05em',
                        fontFamily: "'DM Mono', monospace",
                        color: 'var(--accent-teal)',
                        background: 'rgba(61,184,160,0.1)',
                        border: '1px solid rgba(61,184,160,0.25)',
                      }}
                    >
                      <CheckCircle size={10} />
                      Completed
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    className="btn-surface"
                    onClick={() => setCurrentPage('report')}
                    style={{ flexShrink: 0 }}
                  >
                    View Report
                    <ArrowRight size={13} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── CTA footer ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 40,
            background:
              'linear-gradient(135deg, var(--surface) 0%, rgba(201,168,76,0.04) 100%)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 16,
            padding: '28px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h3
              className="font-display"
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 4px',
              }}
            >
              Ready to practice?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Each session sharpens your delivery and builds lasting confidence.
            </p>
          </div>
          <button className="btn-gold" onClick={() => setCurrentPage('setup')}>
            Start New Session
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
