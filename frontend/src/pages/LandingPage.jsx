import React, { useRef } from 'react';
import {
  motion,
  useScroll, useTransform, useSpring,
  useInView,
} from 'framer-motion';
import { ArrowRight, Mic, Activity, Clock, FileText, Sparkles, Target, Zap, Star, Brain, Volume2 } from 'lucide-react';

// ── Reusable scroll-reveal wrapper ────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 32, style = {}, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger child for use inside a stagger parent ─────────────────────────────
const fadeUpChild = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function StaggerGrid({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div
      ref={ref}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Animated orb ──────────────────────────────────────────────────────────────
function AnimatedOrb({ style }) {
  return (
    <div style={{
      position: 'absolute', borderRadius: '50%',
      filter: 'blur(80px)', pointerEvents: 'none', ...style,
    }} />
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, badge, desc }) {
  return (
    <motion.div
      variants={fadeUpChild}
      className="card"
      style={{ padding: 24, display: 'flex', gap: 18, alignItems: 'flex-start' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: 'var(--surface-3)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
      }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
          <span className="tag-surface">{badge}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ num, title, desc, icon: Icon }) {
  return (
    <motion.div
      variants={fadeUpChild}
      className="card"
      style={{ padding: '28px 24px', position: 'relative', overflow: 'hidden', height: '100%' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="step-num" style={{ position: 'absolute', top: -8, right: 16, fontSize: 80 }}>{num}</div>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gold)', marginBottom: 20,
      }}>
        <Icon size={18} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </motion.div>
  );
}

function TipCard({ icon: Icon, iconColor, title, tag, children }) {
  return (
    <motion.div
      variants={fadeUpChild}
      className="card"
      style={{ padding: '28px 24px', position: 'relative', overflow: 'hidden', borderTop: `3px solid ${iconColor}` }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: `${iconColor}15`, border: `1px solid ${iconColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor,
        }}>
          <Icon size={16} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
          <span style={{
            fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase', color: iconColor,
          }}>{tag}</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{children}</div>
    </motion.div>
  );
}

// ── Scroll-driven SVG path decoration ─────────────────────────────────────────
function HeroSvgPath() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const rawLength = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const pathLength = useSpring(rawLength, { stiffness: 60, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.75, 1], [0, 0.5, 0.5, 0]);

  // Dot position along path (approximate via offsetDistance)
  const dotProgress = useTransform(scrollYProgress, [0, 0.85], ['0%', '100%']);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        display: 'none',
      }}
    >
      <style>{`@media (min-width: 768px) { .hero-svg-wrap { display: block !important; } }`}</style>
      <div className="hero-svg-wrap" style={{ display: 'none', position: 'absolute', inset: 0 }}>
        <svg
          viewBox="0 0 900 460"
          fill="none"
          style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 900, height: '100%' }}
        >
          {/* Background ghost path */}
          <path
            d="M 30 340 C 120 160, 280 440, 450 220 C 620 0, 780 380, 870 200"
            stroke="rgba(201,168,76,0.06)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Animated drawing path */}
          <motion.path
            d="M 30 340 C 120 160, 280 440, 450 220 C 620 0, 780 380, 870 200"
            stroke="var(--gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            style={{ pathLength, opacity }}
          />
          {/* Second thinner path */}
          <path
            d="M 10 400 C 100 220, 260 480, 450 280 C 640 80, 800 440, 890 260"
            stroke="rgba(201,168,76,0.04)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          <motion.path
            d="M 10 400 C 100 220, 260 480, 450 280 C 640 80, 800 440, 890 260"
            stroke="var(--gold)"
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
            style={{ pathLength, opacity }}
          />
          {/* Glowing dot that travels along the main path */}
          <motion.circle
            cx="0" cy="0" r="4"
            fill="var(--gold)"
            filter="url(#glow)"
            style={{
              offsetPath: "path('M 30 340 C 120 160, 280 440, 450 220 C 620 0, 780 380, 870 200')",
              offsetDistance: dotProgress,
              opacity,
            }}
          />
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

// ── Section heading helper ────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <Reveal style={{ marginBottom: 48, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span className="gold-line" />
        <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {eyebrow}
        </span>
        <span className="gold-line" style={{ transform: 'scaleX(-1)' }} />
      </div>
      <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.65 }}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LandingPage({ setCurrentPage }) {
  const steps = [
    { num: "01", title: "Choose Your Role", desc: "Select your target position, difficulty, and question type — from software engineering to data science.", icon: Target },
    { num: "02", title: "Answer Aloud", desc: "Speak your response naturally. Your browser's microphone captures everything in real time.", icon: Mic },
    { num: "03", title: "AI Analysis", desc: "Whisper transcribes, librosa extracts acoustics, and our ML model evaluates hesitation patterns.", icon: Activity },
    { num: "04", title: "Get Feedback", desc: "Receive a detailed breakdown of pace, pauses, filler words, and answer relevance — instantly.", icon: FileText },
  ];

  const features = [
    { title: "Speaking Pace & Rhythm", desc: "Track words per minute. Know if you're rushing through answers or losing momentum mid-response.", icon: Clock, badge: "WPM Analysis" },
    { title: "Hesitation & Pauses", desc: "Identify silence clusters and hesitation patterns that signal uncertainty to interviewers.", icon: Activity, badge: "Acoustics" },
    { title: "Filler Word Detection", desc: "Surface every 'um', 'like', and 'you know' so you can train them out of your speech.", icon: Zap, badge: "Clarity Score" },
    { title: "Semantic Relevance", desc: "Sentence-transformer scoring measures how directly your answer addresses the question asked.", icon: Sparkles, badge: "NLP Relevance" },
  ];

  const stats = [
    { value: "5", label: "Speech Metrics", sub: "analyzed per answer" },
    { value: "Whisper", label: "Transcription", sub: "OpenAI model" },
    { value: "RF Model", label: "Hesitation AI", sub: "trained classifier" },
    { value: "Free", label: "No Signup", sub: "start instantly" },
  ];

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 24px 80px' }}>
        <HeroSvgPath />
        <AnimatedOrb style={{ width: 600, height: 400, top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
        <AnimatedOrb style={{ width: 300, height: 300, bottom: 0, right: '10%', background: 'radial-gradient(ellipse, rgba(74,143,212,0.05) 0%, transparent 70%)' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="tag-gold"
            style={{ marginBottom: 28, display: 'inline-flex' }}
          >
            <Sparkles size={11} />
            AI-Powered Interview Coaching
          </motion.div>

          <motion.h1
            className="font-display"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 900,
              lineHeight: 1.1, color: 'var(--text-primary)',
              marginBottom: 24, letterSpacing: '-0.02em',
            }}
          >
            Practice how you{' '}
            <em style={{ fontStyle: 'italic' }} className="text-gold-gradient">communicate,</em>
            <br />not just what you know.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 40px', fontWeight: 300 }}
          >
            Real-time speech analysis that measures your pace, pauses, hesitation, filler words,
            and answer relevance — so every practice session actually improves your delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.button
              className="btn-gold"
              onClick={() => setCurrentPage('setup')}
              style={{ fontSize: 15, padding: '14px 32px' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Begin Interview Practice
              <ArrowRight size={16} />
            </motion.button>
            <a href="#how-it-works" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 15 }}>
              See How It Works
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)',
              borderRadius: 16, overflow: 'hidden',
              maxWidth: 680, margin: '72px auto 0',
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                style={{
                  padding: '20px 16px',
                  borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                  background: 'var(--surface)', textAlign: 'left',
                }}
              >
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold-light)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeading eyebrow="The Process" title="Four steps to sharper answers" />
        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {steps.map(s => <StepCard key={s.num} {...s} />)}
        </StaggerGrid>
      </section>

      {/* ── Interview Playbook ────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeading
          eyebrow="Interview Playbook"
          title="Techniques that actually work"
          subtitle="Evidence-based communication strategies used by top candidates. Apply these in your practice sessions."
        />
        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          <TipCard icon={Star} iconColor="var(--gold)" title="Use the STAR Method" tag="Answer Structure">
            Structure every behavioral answer: <strong style={{ color: 'var(--text-primary)' }}>Situation</strong> → <strong style={{ color: 'var(--text-primary)' }}>Task</strong> → <strong style={{ color: 'var(--text-primary)' }}>Action</strong> → <strong style={{ color: 'var(--text-primary)' }}>Result</strong>. Keep Situation brief (10–15 sec), spend most time on Action, and always quantify the Result. Mockly tracks whether your answer stays on topic.
          </TipCard>
          <TipCard icon={Brain} iconColor="var(--accent-teal)" title="Pause Before You Speak" tag="Managing Nerves">
            A deliberate 2-second pause after a question signals <strong style={{ color: 'var(--text-primary)' }}>confidence, not hesitation</strong>. Nervous rambling scores far worse than a composed start. Mockly's hesitation model distinguishes purposeful pauses from scattered filler patterns.
          </TipCard>
          <TipCard icon={Volume2} iconColor="var(--accent-blue)" title="Target 120–150 WPM" tag="Clarity & Pace">
            The optimal speaking pace is <strong style={{ color: 'var(--text-primary)' }}>120–150 words per minute</strong> — clear enough to follow, energetic enough to hold attention. Below 110 WPM sounds uncertain; above 160 sounds rushed. Mockly flags your exact WPM after every answer.
          </TipCard>
        </StaggerGrid>

        {/* Quick-practice CTA */}
        <Reveal delay={0.1} style={{ marginTop: 32 }}>
          <div style={{
            background: 'linear-gradient(120deg, rgba(201,168,76,0.06) 0%, rgba(61,184,160,0.05) 100%)',
            border: '1px solid rgba(201,168,76,0.18)', borderRadius: 16, padding: '24px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: 13, fontFamily: 'DM Mono, monospace', color: 'var(--gold)', marginBottom: 5, fontWeight: 600, letterSpacing: '0.04em' }}>
                TRY A QUESTION RIGHT NOW
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Put these techniques into practice. Select a role, answer aloud, and see your metrics immediately.
              </p>
            </div>
            <motion.button
              className="btn-gold"
              onClick={() => setCurrentPage('setup')}
              style={{ flexShrink: 0 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Practising <ArrowRight size={15} />
            </motion.button>
          </div>
        </Reveal>
      </section>

      {/* ── What gets measured ───────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeading eyebrow="Analysis Engine" title="What gets measured" />
        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {features.map(f => <FeatureCard key={f.title} {...f} />)}
        </StaggerGrid>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <Reveal>
          <motion.div
            style={{
              position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--surface) 0%, rgba(201,168,76,0.05) 100%)',
              border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: '56px 48px',
              textAlign: 'center',
            }}
            whileHover={{ boxShadow: '0 0 60px rgba(201,168,76,0.06)', transition: { duration: 0.4 } }}
          >
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%)', pointerEvents: 'none',
            }} />
            <div className="tag-gold" style={{ marginBottom: 24, display: 'inline-flex' }}>No Account Required</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Ready for your first session?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.65 }}>
              Select your target role, press record, and get actionable feedback on how you actually speak in interviews.
            </p>
            <motion.button
              className="btn-gold"
              onClick={() => setCurrentPage('setup')}
              style={{ fontSize: 15, padding: '15px 36px' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Your Mock Interview <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </Reveal>
      </section>

    </div>
  );
}
