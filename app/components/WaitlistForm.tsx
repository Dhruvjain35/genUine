'use client';

import { useState } from 'react';
import WaitlistSuccess from './WaitlistSuccess';

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
    .join('&');
}

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'waitlist', email: email.trim() }),
      });

      if (res.ok) setStatus('success');
      else {
        setErrorMsg('something went wrong. please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('network error. please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') return <WaitlistSuccess name="" />;

  return (
    <form onSubmit={handleSubmit} name="waitlist" style={{ width: '100%' }}>
      <input type="hidden" name="form-name" value="waitlist" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label
          className="eyebrow"
          style={{ color: 'var(--ink-light)', marginBottom: -4 }}
        >
          — your email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          style={{
            width: '100%',
            padding: '16px 18px',
            backgroundColor: 'var(--paper)',
            border: `1px solid ${focused ? 'var(--ink)' : 'var(--ink-whisper)'}`,
            borderRadius: 12,
            fontFamily: 'var(--font-dm)',
            fontSize: 16,
            color: 'var(--ink)',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: focused ? '0 0 0 3px rgba(26,23,20,0.05)' : 'none',
            transition: 'border-color 180ms ease, box-shadow 180ms ease',
          }}
        />

        {status === 'error' && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--terra)',
              fontFamily: 'var(--font-dm)',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="btn-primary"
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            fontSize: 15,
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 600,
            opacity: !email.trim() ? 0.4 : 1,
            cursor: !email.trim() ? 'not-allowed' : 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          {status === 'loading' ? 'joining…' : 'join the waitlist →'}
        </button>

        <p
          className="mono"
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--ink-light)',
            letterSpacing: '0.04em',
            marginTop: 4,
          }}
        >
          no spam, ever · we&apos;ll only email when genUine is ready
        </p>
      </div>
    </form>
  );
}
