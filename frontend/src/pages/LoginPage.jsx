import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mic } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EB4335" />
    </svg>
  );
}

function FloatingField({ label, type = 'text', value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '18px 16px 8px',
          background: 'var(--surface-2)',
          border: `1px solid ${focused ? 'rgba(201,168,76,0.5)' : 'var(--border)'}`,
          borderRadius: 12,
          color: 'var(--text-primary)',
          fontSize: 15,
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
      />
      <label style={{
        position: 'absolute',
        left: 16,
        top: active ? 7 : '50%',
        transform: active ? 'none' : 'translateY(-50%)',
        fontSize: active ? 10 : 14,
        color: focused ? 'var(--gold)' : 'var(--text-muted)',
        fontFamily: "'DM Mono', monospace",
        textTransform: active ? 'uppercase' : 'none',
        letterSpacing: active ? '0.08em' : 'normal',
        transition: 'all 0.18s ease',
        pointerEvents: 'none',
        fontWeight: active ? 600 : 400,
      }}>
        {label}
      </label>
    </div>
  );
}

function CheckboxLine({ children, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
      <span style={{ position: 'relative', marginTop: 2, flexShrink: 0, width: 16, height: 16 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{
            width: 16, height: 16,
            appearance: 'none',
            background: checked ? 'var(--gold)' : 'var(--surface-2)',
            border: `1px solid ${checked ? 'var(--gold)' : 'var(--border)'}`,
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        />
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', padding: 2, pointerEvents: 'none' }}>
            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="var(--obsidian)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </span>
    </label>
  );
}

// Animated gradient background for right panel
function GoldGrainPanel() {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      background: '#0a0906',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '48px 44px',
      minHeight: 560,
    }}>
      {/* Animated gradient blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: '65%', height: '65%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.35) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 20, -15, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '5%', right: '-5%',
            width: '60%', height: '60%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(61,184,160,0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <motion.div
          animate={{ x: [0, 15, -10, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{
            position: 'absolute', top: '40%', left: '30%',
            width: '45%', height: '45%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
            filter: 'blur(35px)',
          }}
        />
        {/* Grain overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.6,
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mic size={18} color="var(--gold)" />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18, fontWeight: 700,
            color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>Mockly</span>
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(36px, 4vw, 56px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: 24,
        }}>
          Think fast,<br />speak better.
        </h2>
        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.65,
          maxWidth: 340,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          AI-powered interview coaching that analyzes your speech, measures your clarity, and helps you land the job.
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {[
          { stat: '94%', desc: 'of users improve WPM in 2 weeks' },
          { stat: '3×', desc: 'fewer filler words on average' },
        ].map(({ stat, desc }) => (
          <div key={stat} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28, fontWeight: 700,
              color: 'var(--gold)',
              minWidth: 52,
            }}>{stat}</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>
              {desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage({ setCurrentPage, setUser }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

  // Sign In state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');

  // Sign Up state
  const [suFirstName, setSuFirstName] = useState('');
  const [suLastName, setSuLastName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [noEmails, setNoEmails] = useState(false);

  function handleSignIn(e) {
    e.preventDefault();
    setUser({ name: siEmail.split('@')[0] || 'User', email: siEmail });
    setCurrentPage('dashboard');
  }

  function handleSignUp(e) {
    e.preventDefault();
    if (!agreeTerms) return;
    setUser({ name: `${suFirstName} ${suLastName}`.trim() || 'User', email: suEmail });
    setCurrentPage('dashboard');
  }

  const tabStyle = (active) => ({
    flex: 1,
    padding: '10px 0',
    background: active ? 'var(--gold-dim)' : 'transparent',
    border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
    borderRadius: 10,
    color: active ? 'var(--gold)' : 'var(--text-muted)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div style={{
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 960,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 20,
        alignItems: 'stretch',
      }}>

        {/* ── Left: Auth Form ─────────────────────────────────── */}
        <div className="card" style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--surface-2)', borderRadius: 12, padding: 4, marginBottom: 32 }}>
            <button style={tabStyle(mode === 'signin')} onClick={() => setMode('signin')}>Sign In</button>
            <button style={tabStyle(mode === 'signup')} onClick={() => setMode('signup')}>Create Account</button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSignIn}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              >
                <div>
                  <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28, fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: 6,
                  }}>Welcome back</h1>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
                    Sign in to continue your practice
                  </p>
                </div>

                {/* Google */}
                <button
                  type="button"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    height: 46,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.background = 'var(--surface-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                <FloatingField label="Email" type="email" value={siEmail} onChange={setSiEmail} />
                <FloatingField label="Password" type="password" value={siPassword} onChange={setSiPassword} />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 12, color: 'var(--gold)', fontFamily: "'DM Sans', sans-serif",
                  }}>
                    Forgot password?
                  </button>
                </div>

                {/* Demo notice */}
                <div style={{
                  borderRadius: 10, padding: '10px 14px',
                  background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)',
                  fontSize: 12, color: 'var(--gold)', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', gap: 8,
                }}>
                  <span>✦</span>
                  <span>Demo mode — clicking Sign In opens your Dashboard.</span>
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}
                >
                  Sign In <ArrowRight size={16} />
                </button>

                <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  No account?{' '}
                  <button type="button" onClick={() => setMode('signup')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--gold)', fontWeight: 600, fontSize: 13, padding: 0,
                  }}>
                    Create one free
                  </button>
                </p>
              </motion.form>

            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSignUp}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <div>
                  <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28, fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: 6,
                  }}>Create account</h1>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
                    Start practicing for free today
                  </p>
                </div>

                {/* Google */}
                <button
                  type="button"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    height: 46,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text-primary)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.background = 'var(--surface-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
                >
                  <GoogleIcon />
                  Sign up with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FloatingField label="First Name" value={suFirstName} onChange={setSuFirstName} />
                  <FloatingField label="Last Name" value={suLastName} onChange={setSuLastName} />
                </div>
                <FloatingField label="Email" type="email" value={suEmail} onChange={setSuEmail} />
                <FloatingField label="Password" type="password" value={suPassword} onChange={setSuPassword} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
                  <CheckboxLine checked={noEmails} onChange={setNoEmails}>
                    I don't want to receive emails about Mockly feature updates
                  </CheckboxLine>
                  <CheckboxLine checked={agreeTerms} onChange={setAgreeTerms}>
                    By creating an account, you agree to our{' '}
                    <span style={{ color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
                    {' '}and{' '}
                    <span style={{ color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
                  </CheckboxLine>
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{
                    height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, fontSize: 15, fontWeight: 600,
                    opacity: agreeTerms ? 1 : 0.45,
                    cursor: agreeTerms ? 'pointer' : 'not-allowed',
                  }}
                  disabled={!agreeTerms}
                >
                  Create Account <ArrowRight size={16} />
                </button>

                <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setMode('signin')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--gold)', fontWeight: 600, fontSize: 13, padding: 0,
                  }}>
                    Sign in
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Branding Panel ─────────────────────────────── */}
        <GoldGrainPanel />
      </div>
    </div>
  );
}
