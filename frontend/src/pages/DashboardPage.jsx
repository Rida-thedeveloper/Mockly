import React, { useState } from 'react';
import { PlusCircle, Award, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Calendar, Code, Mic, X, Lightbulb } from 'lucide-react';

const DAILY_TIPS = [
  { tip: "Begin every answer with a one-sentence summary, then elaborate. Interviewers form impressions in the first 10 seconds.", label: "Opening Impact" },
  { tip: "Aim for 120–150 WPM. Record yourself reading a 300-word passage — if it takes less than 2 minutes, slow down.", label: "Speaking Pace" },
  { tip: "Replace 'um' and 'uh' with a silent pause. Silence sounds confident; filler words signal anxiety.", label: "Filler Reduction" },
  { tip: "When asked 'Tell me about yourself', lead with your current role, one major achievement, and why you're here.", label: "Classic Opener" },
  { tip: "Use the STAR method for behavioral questions: Situation (10%), Task (10%), Action (60%), Result (20%).", label: "STAR Framework" },
  { tip: "Mirror the interviewer's vocabulary. If they say 'scale', use 'scale' — not 'grow'. It builds unconscious rapport.", label: "Rapport Building" },
  { tip: "End technical answers with 'One trade-off worth noting is…' — it shows senior-level thinking.", label: "Technical Depth" },
];

const todayTip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

export default function DashboardPage({ setCurrentPage, user }) {
  const [tipDismissed, setTipDismissed] = useState(false);
  const stats = [
    { label: "Interviews Completed", value: "14", icon: CheckCircle2, color: 'var(--gold)' },
    { label: "Average Score", value: "78", sub: "/ 100", icon: Award, color: '#7ab8e8' },
    { label: "Top Skill", value: "Clarity", icon: TrendingUp, color: 'var(--accent-teal)' },
    { label: "Focus Area", value: "Pacing", icon: AlertTriangle, color: '#e89050' },
  ];

  const recentInterviews = [
    { id: 1, role: "Software Engineer", score: 76, date: "Aug 18, 2026", type: "Technical", difficulty: "Intermediate" },
    { id: 2, role: "Frontend Developer", score: 81, date: "Aug 12, 2026", type: "Technical", difficulty: "Advanced" },
    { id: 3, role: "Backend Developer", score: 74, date: "Aug 05, 2026", type: "Mixed", difficulty: "Intermediate" },
  ];

  const scoreColor = (s) => s >= 80 ? 'var(--accent-teal)' : s >= 70 ? 'var(--gold)' : '#e89050';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

      {/* Today's Tip Banner */}
      {!tipDismissed && (
        <div
          className="animate-fade-up"
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            background: 'linear-gradient(120deg, rgba(201,168,76,0.07) 0%, rgba(61,184,160,0.05) 100%)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderLeft: '3px solid var(--gold)',
            borderRadius: 12, padding: '16px 18px',
            marginBottom: 28,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lightbulb size={15} color="var(--gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Today's Tip
              </span>
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)' }}>
                · {todayTip.label}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
              {todayTip.tip}
            </p>
          </div>
          <button
            onClick={() => setTipDismissed(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 4, flexShrink: 0,
              borderRadius: 6, lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="animate-fade-up" style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20, marginBottom: 40,
      }}>
        <div>
          <div className="tag-gold" style={{ marginBottom: 12 }}>Overview</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Rida'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            Track your verbal communication progress across all sessions.
          </p>
        </div>

        <button className="btn-gold" onClick={() => setCurrentPage('setup')} style={{ alignSelf: 'flex-start' }}>
          <PlusCircle size={15} />
          New Interview
        </button>
      </div>

      {/* Stats */}
      <div className="animate-fade-up animate-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="card" style={{ padding: '24px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{st.label}</span>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${st.color}15`,
                  border: `1px solid ${st.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={14} color={st.color} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="font-display" style={{ fontSize: 28, fontWeight: 700, color: st.color }}>{st.value}</span>
                {st.sub && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{st.sub}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent */}
      <div className="animate-fade-up animate-delay-2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Recent Sessions
          </h2>
          <button
            onClick={() => setCurrentPage('history')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', color: 'var(--gold)',
              fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
            }}
          >
            View all <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recentInterviews.map((item, idx) => (
            <div
              key={item.id}
              className={`card animate-fade-up animate-delay-${idx + 2}`}
              style={{
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 11, flexShrink: 0,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Code size={18} color="var(--text-muted)" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{item.role}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="tag-surface">{item.type}</span>
                  <span className="tag-surface">{item.difficulty}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={10} /> {item.date}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: scoreColor(item.score) }}>
                  {item.score}
                  <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>/100</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('report')}
                className="btn-surface"
                style={{ flexShrink: 0 }}
              >
                View Report <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick CTA */}
      <div className="animate-fade-up animate-delay-4" style={{
        marginTop: 40,
        background: 'linear-gradient(135deg, var(--surface) 0%, rgba(201,168,76,0.04) 100%)',
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: 16, padding: '28px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            Ready to practice again?
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Each session builds better speaking habits.
          </p>
        </div>
        <button className="btn-gold" onClick={() => setCurrentPage('setup')}>
          <Mic size={14} />
          Start Session
        </button>
      </div>
    </div>
  );
}
