import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ArrowUp, ArrowRight } from 'lucide-react';

// ── Magnetic button ───────────────────────────────────────────────────────────
function MagneticButton({ children, onClick, variant = 'ghost', style = {} }) {
  const ref = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  }, []);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    xTo.current?.(dx * 0.32);
    yTo.current?.(dy * 0.32);
  }, []);

  const onMouseLeave = useCallback(() => {
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 9,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
    borderRadius: 100, padding: '14px 30px',
    cursor: 'pointer', border: 'none',
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
    letterSpacing: '0.01em',
    ...style,
  };

  const styles = variant === 'gold'
    ? { ...base, background: 'var(--gold)', color: '#0a0804', boxShadow: '0 4px 24px rgba(201,168,76,0.25)' }
    : { ...base, background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <button ref={ref} style={styles} onClick={onClick} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {children}
    </button>
  );
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'Master Your Delivery',
  'Reduce Filler Words',
  'Build Confidence',
  'Track Your Progress',
  'Ace Technical Interviews',
  'Improve Speaking Pace',
  'Beat Hesitation Patterns',
  'Get Instant Feedback',
];

function MarqueeStrip() {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, { x: '-50%', duration: 28, ease: 'none', repeat: -1 });
    });
    return () => ctx.revert();
  }, []);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '13px 0',
      background: 'rgba(201,168,76,0.02)',
    }}>
      <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              paddingRight: 36,
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: i % 4 === 0 ? 'rgba(201,168,76,0.7)' : 'rgba(255,255,255,0.2)',
            }}
          >
            <span style={{
              width: 3, height: 3, borderRadius: '50%',
              background: i % 4 === 0 ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.15)',
              flexShrink: 0, display: 'inline-block',
            }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────
const NO_FOOTER_PAGES = ['interview', 'feedback', 'report'];

export default function Footer({ setCurrentPage, currentPage }) {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    // intentionally empty — removed parallax that caused content to hide on short pages
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (NO_FOOTER_PAGES.includes(currentPage)) return null;

  return (
    <footer
      ref={wrapperRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#08080a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Subtle dot-grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Ambient radial glow — top center */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 400,
        background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div ref={innerRef} style={{ position: 'relative', zIndex: 1 }}>

        {/* Marquee */}
        <MarqueeStrip />

        {/* ── Main body ── */}
        <div style={{ padding: '80px 48px 0', maxWidth: 1100, margin: '0 auto' }}>

          {/* Thin gold divider */}
          <div style={{
            width: 48, height: '1px', margin: '0 auto 40px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
          }} />

          {/* Content — centered CTA */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

            {/* Top eyebrow row */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 30, height: 30, borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.25)',
                background: 'rgba(201,168,76,0.06)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <line x1="9" y1="21" x2="15" y2="21" />
                </svg>
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                letterSpacing: '0.25em', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase',
              }}>
                AI Interview Coach
              </span>
              <span style={{ width: 24, height: '1px', background: 'rgba(201,168,76,0.25)' }} />
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(30px, 5vw, 54px)',
              fontWeight: 800, color: 'var(--text-primary)',
              lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em',
            }}>
              Ready to ace your{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>next interview?</em>
            </h2>

            {/* Subtext */}
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              color: 'rgba(255,255,255,0.4)', maxWidth: 380, margin: '0 auto 40px',
              lineHeight: 1.7, fontWeight: 300,
            }}>
              Practice with real questions, get instant speech analysis, and track your improvement over time.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <MagneticButton variant="gold" onClick={() => setCurrentPage('setup')}>
                Start Practising
                <ArrowRight size={14} />
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={() => setCurrentPage('progress')}>
                View Progress
              </MagneticButton>
            </div>

          </div>
        </div>

        {/* ── MOCKLY watermark row — below content, partially clipped ── */}
        <div style={{ position: 'relative', overflow: 'hidden', marginTop: 32, height: 'clamp(80px, 12vw, 140px)' }}>
          {/* Fade-up mask so watermark fades into the footer background */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
            background: 'linear-gradient(to bottom, #08080a, transparent)',
            zIndex: 2, pointerEvents: 'none',
          }} />
          <style>{`
            @keyframes mockly-shimmer {
              0%   { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
          `}</style>
          <div
            ref={wordmarkRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-15%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 'clamp(80px, 16vw, 190px)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              background: 'linear-gradient(90deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.38) 30%, rgba(255,223,100,0.62) 50%, rgba(201,168,76,0.38) 70%, rgba(201,168,76,0.08) 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(201,168,76,0.2)',
              animation: 'mockly-shimmer 5s linear infinite',
            }}
          >
            MOCKLY
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          {/* Left — wordmark + copyright */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 16, fontWeight: 700, fontStyle: 'italic',
              color: 'var(--gold)', letterSpacing: '0.04em',
            }}>
              Mockly
            </span>
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.06em',
            }}>
              © 2026 — Built for students &amp; fresh graduates
            </span>
          </div>

          {/* Right — back to top */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={scrollToTop}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.25)',
                transition: 'border-color 0.2s, color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)';
                e.currentTarget.style.color = 'var(--gold)';
                e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              title="Back to top"
            >
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
