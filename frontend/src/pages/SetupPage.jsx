import React, { useState } from 'react';
import { Briefcase, Sliders, Hash, ArrowRight, Play, Check, ChevronRight } from 'lucide-react';

export default function SetupPage({ setCurrentPage, interviewSetup, setInterviewSetup }) {
  const [role, setRole] = useState(interviewSetup.role || 'Software Engineer');
  const [difficulty, setDifficulty] = useState(interviewSetup.difficulty || 'Intermediate');
  const [type, setType] = useState(interviewSetup.type || 'Technical');
  const [questionCount, setQuestionCount] = useState(interviewSetup.questionCount || 5);

  const roles = ["Software Engineer", "Frontend Developer", "Backend Developer", "AI/ML Engineer", "Data Analyst"];
  const difficulties = [
    { id: "Beginner", desc: "Foundational concepts" },
    { id: "Intermediate", desc: "Real-world depth" },
    { id: "Advanced", desc: "Senior-level rigor" },
  ];
  const types = [
    { id: "Technical", desc: "Coding & systems" },
    { id: "Behavioral", desc: "Soft skills & stories" },
    { id: "Mixed", desc: "Both question types" },
  ];
  const counts = [5, 10];

  const handleStart = () => {
    setInterviewSetup({ role, difficulty, type, questionCount: Number(questionCount) });
    setCurrentPage('interview');
  };

  const SectionLabel = ({ icon: Icon, children, color = 'var(--gold)' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <Icon size={14} color={color} />
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
        {children}
      </span>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 40 }}>
        <div className="tag-gold" style={{ marginBottom: 14 }}>Session Setup</div>
        <h1 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
          Configure your interview
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Tailor the difficulty, format, and length to match your target role and preparation level.
        </p>
      </div>

      <div className="animate-fade-up animate-delay-1" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: '36px 32px',
        display: 'flex', flexDirection: 'column', gap: 36,
      }}>

        {/* Role */}
        <div>
          <SectionLabel icon={Briefcase}>Target Role</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {roles.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="choice-btn"
                style={role === r ? {
                  background: 'var(--gold-dim)',
                  borderColor: 'rgba(201,168,76,0.35)',
                  color: 'var(--gold-light)',
                } : {}}
              >
                <span>{r}</span>
                {role === r && <Check size={13} color="var(--gold)" />}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)' }} />

        {/* Difficulty */}
        <div>
          <SectionLabel icon={Sliders} color="var(--accent-blue)">Difficulty</SectionLabel>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Beginner</strong> covers fundamentals. <strong style={{ color: 'var(--text-secondary)' }}>Intermediate</strong> adds real-world depth and trade-offs. <strong style={{ color: 'var(--text-secondary)' }}>Advanced</strong> includes system design, complexity analysis, and senior-level judgment calls.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {difficulties.map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className="choice-btn"
                style={{
                  flexDirection: 'column', alignItems: 'flex-start', gap: 3, padding: '14px 16px',
                  ...(difficulty === d.id ? {
                    background: 'rgba(74,143,212,0.1)',
                    borderColor: 'rgba(74,143,212,0.3)',
                    color: '#7ab8e8',
                  } : {})
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 13 }}>{d.id}</span>
                <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)' }} />

        {/* Type */}
        <div>
          <SectionLabel icon={Sliders} color="var(--accent-teal)">Interview Type</SectionLabel>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Technical</strong> tests coding, systems, and domain knowledge. <strong style={{ color: 'var(--text-secondary)' }}>Behavioral</strong> focuses on past experiences and soft skills — STAR answers essential. <strong style={{ color: 'var(--text-secondary)' }}>Mixed</strong> mirrors real on-site rounds.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className="choice-btn"
                style={{
                  flexDirection: 'column', alignItems: 'flex-start', gap: 3, padding: '14px 16px',
                  ...(type === t.id ? {
                    background: 'rgba(61,184,160,0.1)',
                    borderColor: 'rgba(61,184,160,0.3)',
                    color: '#6dd8c4',
                  } : {})
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 13 }}>{t.id}</span>
                <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)' }} />

        {/* Count */}
        <div>
          <SectionLabel icon={Hash} color="var(--gold)">Question Count</SectionLabel>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>5 questions</strong> (~20 min) is ideal for focused practice on a specific skill. <strong style={{ color: 'var(--text-secondary)' }}>10 questions</strong> simulates a full interview round and builds endurance.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 380 }}>
            {counts.map(c => (
              <button
                key={c}
                onClick={() => setQuestionCount(c)}
                className="choice-btn"
                style={{
                  justifyContent: 'center', padding: '16px',
                  ...(questionCount === c ? {
                    background: 'var(--gold-dim)',
                    borderColor: 'rgba(201,168,76,0.35)',
                    color: 'var(--gold-light)',
                  } : {})
                }}
              >
                <span className="font-display" style={{ fontSize: 22, fontWeight: 700, marginRight: 6 }}>{c}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>questions</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary & Launch */}
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              { label: 'Role', value: role },
              { label: 'Level', value: difficulty },
              { label: 'Type', value: type },
              { label: 'Questions', value: questionCount },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'DM Mono, monospace', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'DM Mono, monospace', opacity: 0.7 }}>
            Session Preview
          </div>
        </div>

        <button className="btn-gold" onClick={handleStart} style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 15 }}>
          <Play size={15} fill="currentColor" />
          Launch Interview Session
          <ArrowRight size={15} />
        </button>

      </div>
    </div>
  );
}
