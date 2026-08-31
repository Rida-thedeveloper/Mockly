import React, { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, ArrowUp, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    xTo.current?.(dx * 0.35);
    yTo.current?.(dy * 0.35);
  }, []);

  const onMouseLeave = useCallback(() => {
    xTo.current?.(0);
    yTo.current?.(0);
  }, []);

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14,
    borderRadius: 100, padding: '13px 28px',
    cursor: 'pointer', border: 'none', transition: 'background 0.2s, color 0.2s',
    ...style,
  };

  const styles = variant === 'gold'
    ? { ...base, background: 'var(--gold)', color: '#0a0804' }
    : { ...base, background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)' };

  return (
    <button
      ref={ref}
      style={styles}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
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
      gsap.to(el, {
        x: '-50%',
        duration: 22,
        ease: 'none',
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
      <div
        ref={trackRef}
        style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 16,
              paddingRight: 40, fontSize: 12,
              fontFamily: 'DM Mono, monospace',
              fontWeight: 500, letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: i % 5 === 0 ? 'var(--gold)' : 'var(--text-muted)',
            }}
          >
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)', flexShrink: 0, display: 'inline-block' }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────
export default function Footer({ setCurrentPage }) {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const ctx = gsap.context(() => {
      gsap.set(inner, { yPercent: -50 });

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(inner, { yPercent: gsap.utils.interpolate(-50, 0, self.progress) });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { label: 'Home', page: 'landing' },
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Practice', page: 'setup' },
    { label: 'History', page: 'history' },
    { label: 'Progress', page: 'progress' },
  ];

  return (
    <footer
      ref={wrapperRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--obsidian)',
        minHeight: '520px',
      }}
    >
      <div
        ref={innerRef}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Marquee */}
        <MarqueeStrip />

        {/* Giant background wordmark */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(80px, 18vw, 200px)',
          fontFamily: 'Playfair Display, serif',
          fontWeight: 900, fontStyle: 'italic',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.08)',
          letterSpacing: '-0.04em',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}>
          MOCKLY
        </div>

        {/* Center CTA content */}
        <div style={{
          position: 'relative', zIndex: 2,
          padding: '64px 24px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 100, padding: '6px 16px',
            marginBottom: 24,
          }}>
            <Mic size={12} color="var(--gold)" />
            <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Interview Coach
            </span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}
          >
            Ready to ace your<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>next interview?</em>
          </h2>

          <p style={{
            fontSize: 15, color: 'var(--text-secondary)', maxWidth: 420,
            margin: '0 auto 36px', lineHeight: 1.65, fontWeight: 300,
          }}>
            Practice with real questions, get instant speech analysis, and track your improvement over time.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton variant="gold" onClick={() => setCurrentPage('setup')}>
              Start Practising Now
              <ArrowRight size={15} />
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => setCurrentPage('progress')}>
              View Your Progress
            </MagneticButton>
          </div>
        </div>

        {/* Nav links row */}
        <div style={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 20px',
          padding: '16px 24px',
        }}>
          {navLinks.map(l => (
            <button
              key={l.page}
              onClick={() => setCurrentPage(l.page)}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                color: 'var(--text-muted)', cursor: 'pointer',
                padding: '4px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Mic size={13} color="var(--gold)" />
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--text-muted)' }}>
              © 2026 Mockly — Built for students &amp; fresh graduates
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="tag-gold" style={{ fontSize: 10 }}>ML Pipeline Active</span>
            <button
              onClick={scrollToTop}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-muted)',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              title="Back to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
