import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Clock, Activity, ArrowLeft, ArrowRight, Zap,
  MessageSquare, CheckCircle, AlertCircle,
} from 'lucide-react';
import ScrollStroke from '../components/ScrollStroke';

/* ─── Preserved logic ───────────────────────────────────────── */
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

/* ─── Design tokens ─────────────────────────────────────────── */
const DISPLAY = "'Playfair Display', Georgia, serif";
const SANS    = "'DM Sans', sans-serif";
const MONO    = "'DM Mono', monospace";
const PURPLE  = '#a078d0';

const EASE = [0.22, 0.61, 0.36, 1];

/* ─── Shared atoms ──────────────────────────────────────────── */
function CardLabel({ icon: Icon, iconColor, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-3)',
          border: '1px solid var(--border)',
        }}
      >
        <Icon size={13} style={{ color: iconColor }} />
      </span>
      <span
        style={{
          fontFamily: MONO, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {children}
      </span>
    </div>
  );
}

function BigValue({ children, color = 'var(--text-primary)', unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 700, lineHeight: 1, color }}>
        {children}
      </span>
      {unit && (
        <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          {unit}
        </span>
      )}
    </div>
  );
}

/* Animated horizontal probability / meter bar */
function ProbBar({ label, value, color, delay = 0 }) {
  const pct = value != null ? Math.max(0, Math.min(1, value)) * 100 : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          {label}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: pct != null ? color : 'var(--text-muted)' }}>
          {pct != null ? `${pct.toFixed(0)}%` : '—'}
        </span>
      </div>
      <div
        style={{
          height: 5, borderRadius: 999, overflow: 'hidden',
          background: 'var(--surface-3)',
          border: '1px solid var(--border)',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct ?? 0}%` }}
          transition={{ duration: 1, delay, ease: EASE }}
          style={{
            height: '100%', borderRadius: 999,
            background: `linear-gradient(90deg, ${color}88 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

/* Circular ring progress for relevance score */
function RingProgress({ value, size = 74, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <defs>
          <linearGradient id="qf-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold-light)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--surface-3)" strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#qf-ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
          transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.45))' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: MONO, fontSize: 12, fontWeight: 700, color: 'var(--gold-light)',
        }}
      >
        {pct}%
      </div>
    </div>
  );
}

/* Speaking-pace scale with a pointer at the current speed */
function PaceScale({ wpm, color }) {
  // Map 60→0% .. 220→100%
  const posPct = wpm == null ? null : Math.max(0, Math.min(100, ((wpm - 60) / 160) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 2 }}>
      <div style={{ position: 'relative', height: 6 }}>
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: 999,
            background: 'linear-gradient(90deg, #d4a84c 0%, var(--accent-teal) 45%, var(--accent-teal) 62%, var(--accent-rose) 100%)',
            opacity: 0.35,
          }}
        />
        {posPct != null && (
          <motion.div
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: `${posPct}%`, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            style={{
              position: 'absolute', top: '50%',
              width: 12, height: 12, borderRadius: 999,
              marginLeft: -6, marginTop: -6,
              background: color,
              border: '2px solid var(--obsidian)',
              boxShadow: `0 0 12px ${color}`,
            }}
          />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
        <span>SLOW</span>
        <span>NORMAL</span>
        <span>FAST</span>
      </div>
    </div>
  );
}

/* Staggered entrance wrapper for metric cards */
function MetricShell({ index = 0, children, style }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 22, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.12 + index * 0.09, ease: EASE }}
      style={{
        padding: 22,
        display: 'flex', flexDirection: 'column', gap: 12,
        position: 'relative', overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* Compact secondary metric card */
function SecondaryCard({ index, label, icon, iconColor, value, unit, children }) {
  return (
    <MetricShell index={index}>
      <CardLabel icon={icon} iconColor={iconColor}>{label}</CardLabel>
      <BigValue unit={unit}>{value ?? '—'}</BigValue>
      {children}
    </MetricShell>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
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

  const relevance      = answer?.relevance ?? null;
  const relevanceScore = relevance?.score;
  const relevanceLabel = relevanceScore > 70 ? 'High' : relevanceScore > 40 ? 'Moderate' : 'Low';
  const relevanceTone  = relevanceScore > 70
    ? 'var(--accent-teal)'
    : relevanceScore > 40 ? '#d4a84c' : 'var(--accent-rose)';

  const hesitationOk = hesitation && !hesitation.error;
  const probs        = hesitationOk ? hesitation.probabilities : null;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', isolation: 'isolate' }}>
      <ScrollStroke
        filterId="feedback"
        viewBox="0 0 1200 2000"
        path="M600,0 C560,100 480,140 460,240 C440,340 500,420 480,520 C460,620 380,660 360,760 C340,860 400,940 400,1040 C400,1140 320,1180 300,1280 C280,1380 340,1460 360,1560 C380,1660 320,1740 340,1840 C360,1940 420,1980 440,2000"
        color="rgba(220,100,100,0.4)"
        glowColor="rgba(220,100,100,0.15)"
        dotColor="#DC6464"
        strokeWidth={2.5}
        side="left"
        scrollRange={[0, 0.88]}
      />

      <div
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 960, margin: '0 auto',
          padding: '56px 20px 72px',
          display: 'flex', flexDirection: 'column', gap: 40,
        }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
        >
          <span className="tag-gold">QUESTION ANALYSIS</span>
          <h1
            className="font-display"
            style={{
              fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 40,
              fontWeight: 500, lineHeight: 1.1, margin: 0,
              color: 'var(--text-primary)',
            }}
          >
            Answer Analysis
          </h1>
          <p
            style={{
              fontFamily: SANS, fontSize: 14, margin: 0, maxWidth: 520,
              lineHeight: 1.6, color: 'var(--text-secondary)',
            }}
          >
            Per-question verbal performance indicators from the ML pipeline.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!hasData ? (
            /* ── No-data state ── */
            <motion.div
              key="empty"
              className="card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
              style={{
                padding: '64px 32px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', gap: 20, position: 'relative', overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(212,106,106,0.06) 0%, transparent 65%)',
                }}
              />
              <AlertCircle size={40} style={{ color: 'var(--text-muted)', position: 'relative' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                <p style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                  Analysis not available
                </p>
                <p style={{ fontFamily: SANS, fontSize: 12.5, margin: 0, maxWidth: 380, lineHeight: 1.65, color: 'var(--text-muted)' }}>
                  Submit an answer on the interview screen and click "View Question Feedback" to see results here.
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('interview')}
                className="btn-gold"
                style={{ position: 'relative' }}
              >
                <ArrowLeft size={16} />
                <span>Back to Interview</span>
              </button>
            </motion.div>
          ) : (
            /* ── Has-data state ── */
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {/* ── Top 3 primary metrics ── */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 20,
                }}
              >
                {/* 1 — AI Semantic Relevance */}
                <MetricShell index={0}>
                  <div
                    style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'radial-gradient(ellipse at 100% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)',
                    }}
                  />
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <CardLabel icon={Award} iconColor="var(--gold)">AI Semantic Relevance</CardLabel>
                    {relevance ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <BigValue>{relevanceScore}%</BigValue>
                          <span
                            style={{
                              fontFamily: MONO, fontSize: 11, fontWeight: 700,
                              letterSpacing: '0.08em', color: relevanceTone,
                            }}
                          >
                            {relevanceLabel} Relevance
                          </span>
                        </div>
                        <RingProgress value={relevanceScore} />
                      </div>
                    ) : (
                      <>
                        <BigValue color="var(--text-muted)">N/A</BigValue>
                        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                          NOT SCORED
                        </span>
                      </>
                    )}
                  </div>
                </MetricShell>

                {/* 2 — Speaking Pace */}
                <MetricShell index={1}>
                  <CardLabel icon={Zap} iconColor="var(--accent-blue)">Speaking Pace</CardLabel>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <BigValue unit={wpm != null ? 'WPM' : undefined}>{wpm ?? '—'}</BigValue>
                    {pace && (
                      <span
                        style={{
                          fontFamily: MONO, fontSize: 10, fontWeight: 700,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '4px 11px', borderRadius: 999,
                          color: pace.color,
                          background: 'var(--surface-3)',
                          border: `1px solid ${pace.color}`,
                        }}
                      >
                        {pace.label}
                      </span>
                    )}
                  </div>
                  <PaceScale wpm={wpm} color={pace ? pace.color : 'var(--text-muted)'} />
                </MetricShell>

                {/* 3 — Hesitation Level */}
                <MetricShell index={2}>
                  <CardLabel icon={Activity} iconColor={PURPLE}>Hesitation Level</CardLabel>
                  {hesitationOk ? (
                    <>
                      <BigValue color={hesitationColor(hesitation.prediction)}>
                        {hesitation.prediction ?? '—'}
                      </BigValue>
                      {probs && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 2 }}>
                          <ProbBar label="Low"    value={probs['Low']}    color="var(--accent-teal)" delay={0.45} />
                          <ProbBar label="Medium" value={probs['Medium']} color="var(--gold)"        delay={0.55} />
                          <ProbBar label="High"   value={probs['High']}   color="var(--accent-rose)" delay={0.65} />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <BigValue color="var(--text-muted)">—</BigValue>
                      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                        MODEL UNAVAILABLE
                      </span>
                    </>
                  )}
                </MetricShell>
              </div>

              {/* ── Secondary metrics grid ── */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                }}
              >
                {/* Filler Words */}
                <SecondaryCard
                  index={3}
                  label="Filler Words"
                  icon={MessageSquare}
                  iconColor="var(--accent-rose)"
                  value={features.filler_count}
                >
                  {features.fillers?.length ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {features.fillers.map((f, i) => (
                        <motion.span
                          key={`${f}-${i}`}
                          className="tag-surface"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.32, delay: 0.5 + i * 0.05, ease: EASE }}
                          style={{ textTransform: 'lowercase', letterSpacing: '0.04em' }}
                        >
                          {f}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: SANS, fontSize: 11.5, margin: 0, color: 'var(--text-muted)' }}>
                      None detected
                    </p>
                  )}
                </SecondaryCard>

                {/* Pauses & Silences */}
                <SecondaryCard
                  index={4}
                  label="Pauses & Silences"
                  icon={Clock}
                  iconColor="var(--accent-teal)"
                  value={features.pause_count}
                >
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { k: 'AVG', v: features.average_pause != null ? `${features.average_pause}s` : '—' },
                      { k: 'MAX', v: features.longest_pause != null ? `${features.longest_pause}s` : '—' },
                    ].map(({ k, v }) => (
                      <div
                        key={k}
                        style={{
                          flex: 1, padding: '7px 10px', borderRadius: 9,
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <span style={{ display: 'block', fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                          {k}
                        </span>
                        <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </SecondaryCard>

                {/* Audio Captured */}
                <SecondaryCard
                  index={5}
                  label="Audio Captured"
                  icon={CheckCircle}
                  iconColor="var(--gold)"
                  value={answerCount}
                  unit="answers"
                >
                  <p style={{ fontFamily: SANS, fontSize: 11.5, margin: 0, color: 'var(--text-muted)' }}>
                    Stored in frontend state
                  </p>
                </SecondaryCard>
              </div>

              {/* ── Transcript ── */}
              {transcript && (
                <motion.div
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
                  style={{ padding: '30px 30px 30px 34px', position: 'relative', overflow: 'hidden' }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: -6, left: 14,
                      fontFamily: DISPLAY, fontSize: 64, lineHeight: 1,
                      color: 'var(--gold)', opacity: 0.2, pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    &ldquo;
                  </span>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 30 }}>
                    <span
                      style={{
                        fontFamily: MONO, fontSize: 10, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Transcript
                    </span>
                    <p
                      style={{
                        fontFamily: SANS, fontSize: 14.5, fontStyle: 'italic',
                        lineHeight: 1.75, margin: 0, color: 'var(--text-secondary)',
                      }}
                    >
                      {transcript}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── Personalized Feedback ── */}
              {feedback?.summary && (
                <motion.div
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
                  style={{
                    padding: 28,
                    borderLeft: '3px solid var(--accent-teal)',
                    display: 'flex', flexDirection: 'column', gap: 16,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'radial-gradient(ellipse at 0% 0%, rgba(61,184,160,0.07) 0%, transparent 60%)',
                    }}
                  />
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MessageSquare size={15} style={{ color: 'var(--accent-teal)' }} />
                    <span
                      style={{
                        fontFamily: MONO, fontSize: 10, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: 'var(--accent-teal)',
                      }}
                    >
                      Personalized Feedback
                    </span>
                  </div>
                  <p
                    style={{
                      position: 'relative', fontFamily: SANS, fontSize: 14.5,
                      fontWeight: 600, lineHeight: 1.6, margin: 0,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {feedback.summary}
                  </p>
                  {feedback.suggestions?.length > 0 && (
                    <ul
                      style={{
                        position: 'relative', listStyle: 'none', margin: 0,
                        padding: '16px 0 0', borderTop: '1px solid var(--border)',
                        display: 'flex', flexDirection: 'column', gap: 11,
                      }}
                    >
                      {feedback.suggestions.map((sug, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.45, delay: 0.85 + idx * 0.1, ease: EASE }}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            fontFamily: SANS, fontSize: 13.5, lineHeight: 1.65,
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <span style={{ color: 'var(--accent-teal)', flexShrink: 0, lineHeight: 1.5 }}>&rarr;</span>
                          <span>{sug}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.9, ease: EASE }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}
        >
          <button
            onClick={() => setCurrentPage('interview')}
            className="btn-ghost"
            style={{ flex: '1 1 220px', justifyContent: 'center' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Interview Room</span>
          </button>
          <button
            onClick={() => setCurrentPage('report')}
            className="btn-gold"
            style={{ flex: '1 1 220px', justifyContent: 'center' }}
          >
            <span>View Final Report</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
