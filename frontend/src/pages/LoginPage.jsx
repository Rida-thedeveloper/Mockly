import React, { useState } from 'react';
import { GrainGradient } from '@paper-design/shaders-react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Icons ──────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EB4335" />
    </svg>
  );
}

/* ── Reusable field (label floats up on focus/fill) ─────────── */
function FieldBox({ label, value, onChange, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <label style={{
      display: 'flex',
      height: 56,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      borderRadius: 10,
      border: `1px solid ${focused ? 'rgba(201,168,76,0.45)' : 'rgba(255,255,255,0.1)'}`,
      background: 'rgba(255,255,255,0.03)',
      padding: '0 20px',
      position: 'relative',
      cursor: 'text',
      transition: 'border-color 0.18s',
    }}>
      <input
        type={type}
        value={value}
        aria-label={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={e => onChange(e.target.value)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          padding: active ? '22px 20px 8px' : '0 20px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: 15,
          fontFamily: "'DM Sans', sans-serif",
          boxSizing: 'border-box',
        }}
      />
      <span style={{
        position: 'absolute',
        left: 20,
        top: active ? 9 : '50%',
        transform: active ? 'none' : 'translateY(-50%)',
        fontSize: active ? 10 : 15,
        color: focused ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
        fontFamily: "'DM Mono', monospace",
        textTransform: active ? 'uppercase' : 'none',
        letterSpacing: active ? '0.08em' : 'normal',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.16s ease',
        pointerEvents: 'none',
      }}>
        {label}
      </span>
      {!active && (
        <span style={{
          position: 'absolute',
          right: 20,
          fontSize: 15,
          color: 'rgba(255,255,255,0.85)',
          fontFamily: "'DM Sans', sans-serif",
          pointerEvents: 'none',
        }}>
          {label}
        </span>
      )}
    </label>
  );
}

/* ── Checkbox with label ────────────────────────────────────── */
function CheckboxLine({ children, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
      <span style={{ position: 'relative', marginTop: 2, flexShrink: 0, width: 14, height: 14 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{
            width: 14, height: 14,
            appearance: 'none', WebkitAppearance: 'none',
            border: `1px solid ${checked ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 3,
            background: checked ? 'var(--gold)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        />
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: '2px', pointerEvents: 'none' }}>
            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#0a0a0c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </span>
    </label>
  );
}

/* ── Social button ──────────────────────────────────────────── */
function SocialButton({ icon, label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 10,
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.12)'}`,
        background: hovered ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.85)',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.18s',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ── Main export ────────────────────────────────────────────── */
export default function LoginPage({ setCurrentPage, setUser }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'

  // Sign-up state
  const [suFirst, setSuFirst] = useState('');
  const [suLast, setSuLast] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [noUpdates, setNoUpdates] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Sign-in state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');

  function handleSignUp(e) {
    e.preventDefault();
    if (!agreeTerms) return;
    setUser({ name: `${suFirst} ${suLast}`.trim() || 'User', email: suEmail || 'user@mockly.dev' });
    setCurrentPage('dashboard');
  }

  function handleSignIn(e) {
    e.preventDefault();
    setUser({ name: siEmail.split('@')[0] || 'User', email: siEmail || 'user@mockly.dev' });
    setCurrentPage('dashboard');
  }

  return (
    <section style={{
      minHeight: '100vh',
      background: '#050505',
      padding: 12,
      color: '#fff',
      fontFamily: "'DM Sans', sans-serif",
      WebkitFontSmoothing: 'antialiased',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'grid',
        minHeight: 'calc(100vh - 24px)',
        gap: 20,
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      }}>

        {/* ── Left: Form panel ──────────────────────────────── */}
        <div style={{
          display: 'flex',
          minHeight: 720,
          alignItems: 'flex-start',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#0a0a0a',
          padding: 'clamp(28px, 5vw, 56px) clamp(24px, 4vw, 48px)',
        }}>
          <div style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + '-head'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <h1 style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                  color: '#fff',
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: 8,
                  whiteSpace: 'nowrap',
                }}>
                  {mode === 'signup' ? 'Create an account' : 'Welcome back'}
                </h1>
                <p style={{
                  fontSize: 'clamp(15px, 2vw, 20px)',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 36,
                  lineHeight: 1.4,
                }}>
                  {mode === 'signup'
                    ? 'Practice smarter, interview better'
                    : 'Continue your interview practice'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Google only */}
            <div style={{ marginBottom: 32 }}>
              <SocialButton
                icon={<GoogleIcon />}
                label={mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
              />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.25)', fontFamily: 'inherit' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {mode === 'signup' ? (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignUp}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <FieldBox label="First Name" value={suFirst} onChange={setSuFirst} />
                    <FieldBox label="Last Name" value={suLast} onChange={setSuLast} />
                  </div>
                  <FieldBox label="Email" type="email" value={suEmail} onChange={setSuEmail} />
                  <FieldBox label="Password" type="password" value={suPassword} onChange={setSuPassword} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
                    <CheckboxLine checked={noUpdates} onChange={setNoUpdates}>
                      I don't want to receive emails about Mockly feature updates
                    </CheckboxLine>
                    <CheckboxLine checked={agreeTerms} onChange={setAgreeTerms}>
                      By creating an account, you agree to our{' '}
                      <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}>Terms and Services</span>
                      {' '}and{' '}
                      <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}>Privacy Policy</span>
                    </CheckboxLine>
                  </div>

                  <button
                    type="submit"
                    disabled={!agreeTerms}
                    style={{
                      marginTop: 12,
                      height: 50,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      border: '1px solid rgba(201,168,76,0.4)',
                      background: agreeTerms ? 'var(--gold)' : 'rgba(201,168,76,0.15)',
                      color: agreeTerms ? '#0a0a0c' : 'rgba(201,168,76,0.5)',
                      fontSize: 17,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: agreeTerms ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      gap: 8,
                    }}
                  >
                    Create Account <ArrowRight size={16} />
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setMode('signin')} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--gold)', fontWeight: 600, fontSize: 14, fontFamily: 'inherit', padding: 0,
                    }}>
                      Sign in
                    </button>
                  </p>
                </motion.form>

              ) : (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSignIn}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <FieldBox label="Email" type="email" value={siEmail} onChange={setSiEmail} />
                  <FieldBox label="Password" type="password" value={siPassword} onChange={setSiPassword} />

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 13, color: 'var(--gold)', fontFamily: 'inherit', padding: 0,
                    }}>
                      Forgot password?
                    </button>
                  </div>

                  {/* Demo notice */}
                  <div style={{
                    borderRadius: 10, padding: '10px 14px',
                    background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)',
                    fontSize: 12, color: 'var(--gold)', fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    <span>✦</span>
                    <span>Demo mode — clicking Sign In opens your Dashboard.</span>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: 8,
                      height: 50,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                      border: '1px solid rgba(201,168,76,0.4)',
                      background: 'var(--gold)',
                      color: '#0a0a0c',
                      fontSize: 17,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                      gap: 8,
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Sign In <ArrowRight size={16} />
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                    No account?{' '}
                    <button type="button" onClick={() => setMode('signup')} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--gold)', fontWeight: 600, fontSize: 14, fontFamily: 'inherit', padding: 0,
                    }}>
                      Create one free
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right: GrainGradient branding panel ───────────── */}
        <div style={{
          position: 'relative',
          display: 'flex',
          minHeight: 680,
          overflow: 'hidden',
          borderRadius: 12,
          background: '#000',
          padding: 'clamp(28px, 4vw, 48px)',
          color: '#fff',
        }}>
          <GrainGradient
            speed={0.8}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.55}
            noise={0.22}
            shape="corners"
            frame={2854}
            colors={['#c9a84c', '#b87333', '#c9a84c', '#3db8a0']}
            colorBack="#00000000"
            style={{ position: 'absolute', inset: 0 }}
          />

          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}>
            <h2 style={{
              maxWidth: 560,
              paddingTop: 'clamp(0px, 3vw, 48px)',
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 500,
              letterSpacing: '-0.05em',
              color: '#fff',
              lineHeight: 0.98,
              fontFamily: "'Playfair Display', serif",
            }}>
              Practice smart,<br />interview better.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'clamp(0px, 3vw, 80px)' }}>
              {[
                { stat: '94%', label: 'users improve WPM within 2 weeks' },
                { stat: '3×', label: 'fewer filler words after 10 sessions' },
                { stat: '↑82%', label: 'confidence score on first mock interview' },
              ].map(({ stat, label }) => (
                <div key={stat} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  background: 'rgba(0,0,0,0.25)',
                  maxWidth: 360,
                }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24, fontWeight: 700, color: 'var(--gold)',
                    minWidth: 48, flexShrink: 0,
                  }}>{stat}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: "'DM Sans', sans-serif" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
