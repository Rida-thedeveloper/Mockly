import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Mic } from 'lucide-react';

export default function LoginPage({ setCurrentPage, setUser }) {
  const [name, setName] = useState('Rida Fatima');
  const [email, setEmail] = useState('rida@example.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name: name || 'Rida Fatima', email });
    setCurrentPage('dashboard');
  };

  const inputBase = {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="card p-10 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gold glow top-right */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.3)' }}>
              <Mic className="w-7 h-7" style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                Welcome back
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
                Sign in to track your interview practice
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {[
              { label: 'Full Name', icon: UserIcon, type: 'text', value: name, setter: setName, placeholder: 'Rida Fatima' },
              { label: 'Email Address', icon: Mail, type: 'email', value: email, setter: setEmail, placeholder: 'rida@example.com' },
              { label: 'Password', icon: Lock, type: 'password', value: password, setter: setPassword, placeholder: '••••••••' },
            ].map(({ label, icon: Icon, type, value, setter, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                  {label}
                </label>
                <div className="relative">
                  <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={type}
                    value={value}
                    onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    style={inputBase}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
            ))}

            {/* Demo notice */}
            <div className="rounded-xl p-3 flex items-start gap-2.5 text-xs"
              style={{ background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--gold)', fontFamily: "'DM Sans', sans-serif" }}>
              <span className="mt-0.5">✦</span>
              <span>Demo mode — clicking Sign In will immediately open your Dashboard.</span>
            </div>

            <button
              type="submit"
              className="btn-gold w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
