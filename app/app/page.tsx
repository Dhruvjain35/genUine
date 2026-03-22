'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────

interface VoiceProfile {
  tone: string;
  energy: string;
  style: string;
  pattern: string;
  examples?: string[];
}

interface MessageResult {
  voiceProfile: { tone: string; energy: string; style: string; pattern: string };
  messageA: { text: string; angle: string; commonGround: string };
  messageB: { text: string; angle: string; curiosityPoint: string };
}

interface ProfileForm {
  name: string;
  headline: string;
  about: string;
  activity: string;
  other: string;
}

const RECIPIENT_TYPES = [
  { value: 'founder', label: 'founder / entrepreneur' },
  { value: 'student', label: 'student / peer' },
  { value: 'professional', label: 'professional / executive' },
  { value: 'professor', label: 'professor / mentor' },
  { value: 'other', label: 'other' },
];

const TONES = ['casual', 'formal', 'curious'];

const LOADING_MESSAGES = [
  'reading their profile...',
  'finding common ground...',
  'matching your voice...',
  'crafting something genuine...',
];

const FREE_LIMIT = 3;

// ── Loading Indicator ───────────────────────────────────

function LoadingSpinner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % LOADING_MESSAGES.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
      </div>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '15px', fontWeight: 600, color: '#6B5E52',
          transition: 'opacity 0.3s ease',
        }}
      >
        {LOADING_MESSAGES[idx]}
      </p>
    </div>
  );
}

// ── Copy Button ─────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-btn"
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 16px', borderRadius: '10px',
        border: copied ? '1px solid #C4784A' : '1px solid #E8DDD5',
        backgroundColor: copied ? 'rgba(196, 120, 74, 0.08)' : 'transparent',
        color: copied ? '#C4784A' : '#A08C7C',
        fontSize: '13px', fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          copied!
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          copy
        </>
      )}
    </button>
  );
}

// ── Result Cards ────────────────────────────────────────

function ResultCards({ result, onTryAgain }: { result: MessageResult; onTryAgain: () => void }) {
  const [expandedA, setExpandedA] = useState(false);
  const [expandedB, setExpandedB] = useState(false);

  return (
    <div className="fade-scale">
      {/* Voice profile chip */}
      <div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'rgba(196, 120, 74, 0.08)',
          border: '1px solid rgba(196, 120, 74, 0.15)',
          borderRadius: '100px', padding: '6px 14px',
          marginBottom: '24px',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4784A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
        </svg>
        <span style={{ fontSize: '12px', color: '#6B5E52', fontFamily: "'DM Sans', sans-serif" }}>
          your voice: <strong style={{ color: '#C4784A' }}>{result.voiceProfile.tone}</strong>
          {result.voiceProfile.energy ? ` · ${result.voiceProfile.energy}` : ''}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Card A */}
        <div
          className="result-card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(196, 120, 74, 0.2)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(196, 120, 74, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span
              style={{
                backgroundColor: 'rgba(196, 120, 74, 0.1)',
                color: '#C4784A',
                fontSize: '11px', fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: '100px',
              }}
            >
              common ground
            </span>
          </div>
          <p style={{ fontSize: '15px', color: '#2D2D2D', lineHeight: 1.7, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
            {result.messageA.text}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <CopyBtn text={result.messageA.text} />
            <button
              onClick={() => setExpandedA(!expandedA)}
              style={{
                fontSize: '12px', color: '#A08C7C', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              why this works {expandedA ? '↑' : '↓'}
            </button>
          </div>
          {expandedA && (
            <div
              className="fade-up"
              style={{
                marginTop: '12px', padding: '12px', borderRadius: '10px',
                backgroundColor: 'rgba(196, 120, 74, 0.05)',
                fontSize: '13px', color: '#6B5E52', lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#C4784A', display: 'block', marginBottom: '4px' }}>angle:</strong>
              {result.messageA.angle}
              {result.messageA.commonGround && (
                <span style={{ display: 'block', marginTop: '6px', color: '#A08C7C' }}>
                  common ground: {result.messageA.commonGround}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card B */}
        <div
          className="result-card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(242, 169, 34, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(242, 169, 34, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span
              style={{
                backgroundColor: 'rgba(242, 169, 34, 0.12)',
                color: '#B8860B',
                fontSize: '11px', fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: '100px',
              }}
            >
              genuine curiosity
            </span>
          </div>
          <p style={{ fontSize: '15px', color: '#2D2D2D', lineHeight: 1.7, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
            {result.messageB.text}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <CopyBtn text={result.messageB.text} />
            <button
              onClick={() => setExpandedB(!expandedB)}
              style={{
                fontSize: '12px', color: '#A08C7C', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              why this works {expandedB ? '↑' : '↓'}
            </button>
          </div>
          {expandedB && (
            <div
              className="fade-up"
              style={{
                marginTop: '12px', padding: '12px', borderRadius: '10px',
                backgroundColor: 'rgba(242, 169, 34, 0.06)',
                fontSize: '13px', color: '#6B5E52', lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#B8860B', display: 'block', marginBottom: '4px' }}>angle:</strong>
              {result.messageB.angle}
              {result.messageB.curiosityPoint && (
                <span style={{ display: 'block', marginTop: '6px', color: '#A08C7C' }}>
                  curiosity: {result.messageB.curiosityPoint}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={onTryAgain}
          className="btn-ghost"
          style={{ padding: '10px 24px', borderRadius: '12px', fontSize: '14px' }}
        >
          ← try again
        </button>
        <p style={{ fontSize: '13px', color: '#A08C7C', alignSelf: 'center' }}>
          not quite? go back and adjust the profile or tone.
        </p>
      </div>
    </div>
  );
}

// ── Main App Page ───────────────────────────────────────

export default function AppPage() {
  const [phase, setPhase] = useState<'loading' | 'voice-setup' | 'generator' | 'results' | 'limit'>('loading');
  const [voiceStep, setVoiceStep] = useState(1);
  const [voiceExamples, setVoiceExamples] = useState<string[]>(['', '', '']);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [userName, setUserName] = useState('');
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isPro, setIsPro] = useState(false);

  // Generator form
  const [profile, setProfile] = useState<ProfileForm>({ name: '', headline: '', about: '', activity: '', other: '' });
  const [recipientType, setRecipientType] = useState('');
  const [tone, setTone] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  // Results
  const [result, setResult] = useState<MessageResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messagesRemaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - messagesUsed);

  // ── Load persisted state ──
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('genuine_voice_profile');
      const savedName = localStorage.getItem('genuine_user_name');
      const savedCount = localStorage.getItem('genuine_messages_today');
      const savedDate = localStorage.getItem('genuine_last_reset_date');
      const savedPro = localStorage.getItem('genuine_is_pro');

      const today = new Date().toDateString();
      if (savedDate !== today) {
        localStorage.setItem('genuine_last_reset_date', today);
        localStorage.setItem('genuine_messages_today', '0');
        setMessagesUsed(0);
      } else if (savedCount) {
        setMessagesUsed(parseInt(savedCount, 10));
      }

      if (savedPro === 'true') setIsPro(true);
      if (savedName) setUserName(savedName);

      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        setVoiceProfile(p);
        setPhase('generator');
      } else {
        setPhase('voice-setup');
      }

      // Check success redirect from Stripe
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        localStorage.setItem('genuine_is_pro', 'true');
        setIsPro(true);
        window.history.replaceState({}, '', '/app');
      }
    } catch {
      setPhase('voice-setup');
    }
  }, []);

  // ── Voice setup handlers ──

  const handleVoiceNext = () => {
    if (voiceStep < 3) {
      setVoiceStep((s) => s + 1);
      setTimeout(() => textareaRef.current?.focus(), 100);
    } else {
      handleSaveVoice();
    }
  };

  const handleVoiceBack = () => {
    if (voiceStep > 1) setVoiceStep((s) => s - 1);
  };

  const handleSaveVoice = async () => {
    const valid = voiceExamples.filter((e) => e.trim().length > 5);
    if (valid.length === 0) return;

    setPhase('loading');
    try {
      const res = await fetch('/api/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examples: valid }),
      });
      if (res.ok) {
        const profile = await res.json();
        const full = { ...profile, examples: valid };
        setVoiceProfile(full);
        localStorage.setItem('genuine_voice_profile', JSON.stringify(full));
      }
    } catch { /* use examples without analysis */ }
    setPhase('generator');
  };

  const handleClearVoice = () => {
    setVoiceProfile(null);
    setVoiceExamples(['', '', '']);
    setVoiceStep(1);
    localStorage.removeItem('genuine_voice_profile');
    setPhase('voice-setup');
  };

  // ── Message generation ──

  const handleGenerate = useCallback(async () => {
    if (!profile.name.trim() && !profile.headline.trim()) {
      setError('fill in at least the name and headline.');
      return;
    }
    if (messagesRemaining <= 0) { setPhase('limit'); return; }

    setError('');
    setIsGenerating(true);

    try {
      const examples = voiceProfile?.examples || voiceExamples.filter(e => e.trim());
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userExamples: examples,
          targetProfile: profile,
          userName: userName || undefined,
          recipientType: recipientType || undefined,
          tone: tone || undefined,
          additionalContext: additionalContext || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'something went wrong. try again?'); return; }

      setResult(data);
      const newCount = messagesUsed + 1;
      setMessagesUsed(newCount);
      localStorage.setItem('genuine_messages_today', newCount.toString());
      setPhase('results');
    } catch {
      setError('something went wrong. try again?');
    } finally {
      setIsGenerating(false);
    }
  }, [profile, voiceProfile, voiceExamples, userName, recipientType, tone, additionalContext, messagesUsed, messagesRemaining]);

  const handleTryAgain = () => {
    setResult(null);
    setError('');
    setPhase('generator');
  };

  // ── Field helpers ──

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid #E8DDD5',
    borderRadius: '12px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px', color: '#2D2D2D',
    outline: 'none', resize: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: '#6B5E52', marginBottom: '6px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  // ── Render: Loading ──

  if (phase === 'loading') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // ── Render: Limit ──

  if (phase === 'limit') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '420px' }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '36px', letterSpacing: '-0.03em', color: '#2D2D2D', marginBottom: '8px' }}>
            gen<span style={{ color: '#C4784A' }}>U</span>ine
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(196, 120, 74, 0.1)', border: '1.5px solid rgba(196, 120, 74, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px auto' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4784A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 700, color: '#2D2D2D', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            that&apos;s your lot for today
          </h2>
          <p style={{ fontSize: '15px', color: '#6B5E52', lineHeight: 1.7, marginBottom: '8px' }}>
            you&apos;ve used your {FREE_LIMIT} free messages. come back tomorrow or go pro for unlimited.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
            <Link href="/pricing">
              <button className="btn-primary" style={{ padding: '12px 28px', borderRadius: '12px', fontSize: '15px' }}>
                go pro — unlimited →
              </button>
            </Link>
            <button
              onClick={() => setPhase('generator')}
              className="btn-ghost"
              style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '15px' }}
            >
              come back tomorrow
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#A08C7C', marginTop: '20px' }}>your voice profile is saved. pick up where you left off tomorrow.</p>
        </div>
      </div>
    );
  }

  // ── Render: Voice Setup ──

  if (phase === 'voice-setup') {
    const VOICE_PROMPTS = [
      { title: 'paste a message you\'ve sent on linkedin', hint: 'anything casual works. even a quick "congrats!" is great.' },
      { title: 'paste another one', hint: 'variety helps. try a different kind of message if you can.' },
      { title: 'one more and you\'re done', hint: 'pick one where you felt like yourself, not where you were trying to impress.' },
    ];
    const current = VOICE_PROMPTS[voiceStep - 1];
    const hasInput = voiceExamples[voiceStep - 1]?.trim().length > 0;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F7', display: 'flex', flexDirection: 'column' }}>
        {/* Mini header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(196, 120, 74, 0.08)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '20px', color: '#2D2D2D', letterSpacing: '-0.02em' }}>
              gen<span style={{ color: '#C4784A' }}>U</span>ine
            </span>
          </Link>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            {/* Progress */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '40px' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ flex: n === voiceStep ? 2 : 1, height: 4, borderRadius: 2, backgroundColor: n <= voiceStep ? '#C4784A' : '#E8DDD5', opacity: n < voiceStep ? 0.5 : 1, transition: 'flex 0.4s ease, background-color 0.3s ease' }} />
              ))}
            </div>

            <p style={{ fontSize: '11px', fontWeight: 700, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              step {voiceStep} of 3
            </p>

            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '24px', color: '#2D2D2D', letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1.3 }}>
              {voiceStep === 1 ? 'first, let\'s learn how you talk' : current.title}
            </h1>

            <p style={{ fontSize: '14px', color: '#A08C7C', marginBottom: '24px', lineHeight: 1.6 }}>
              {current.hint}
            </p>

            {/* Show previous answers */}
            {voiceExamples.slice(0, voiceStep - 1).filter(e => e.trim()).map((ex, i) => (
              <div key={i} style={{ marginBottom: '12px', padding: '10px 14px', backgroundColor: 'rgba(196, 120, 74, 0.06)', border: '1px solid rgba(196, 120, 74, 0.12)', borderRadius: '10px', fontSize: '13px', color: '#6B5E52', lineHeight: 1.5 }}>
                <span style={{ fontSize: '10px', color: '#A08C7C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '3px' }}>example {i + 1}</span>
                {ex.length > 120 ? ex.slice(0, 120) + '...' : ex}
              </div>
            ))}

            <textarea
              key={voiceStep}
              ref={textareaRef}
              value={voiceExamples[voiceStep - 1]}
              onChange={(e) => {
                const updated = [...voiceExamples];
                updated[voiceStep - 1] = e.target.value;
                setVoiceExamples(updated);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleVoiceNext(); }}
              placeholder={`paste a linkedin message you've sent before...\n\nanything from "hey congrats!" to a full outreach message works.`}
              rows={5}
              autoFocus
              style={{
                ...fieldStyle,
                resize: 'vertical', minHeight: '120px', marginBottom: '16px',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
            />

            {/* Name field on step 1 */}
            {voiceStep === 1 && (
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => { setUserName(e.target.value); localStorage.setItem('genuine_user_name', e.target.value); }}
                  placeholder="your first name (optional)"
                  style={{ ...fieldStyle, resize: undefined }}
                  onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {voiceStep > 1 ? (
                <button
                  onClick={handleVoiceBack}
                  style={{ fontSize: '13px', color: '#A08C7C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#6B5E52'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A08C7C'}
                >
                  ← back
                </button>
              ) : <div />}

              <button
                onClick={handleVoiceNext}
                disabled={!hasInput}
                className="btn-primary"
                style={{
                  padding: '12px 28px', borderRadius: '12px', fontSize: '14px',
                  opacity: hasInput ? 1 : 0.4, cursor: hasInput ? 'pointer' : 'not-allowed',
                }}
              >
                {voiceStep === 3 ? 'save my voice ✓' : 'next →'}
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#C4784A', textAlign: 'center', marginTop: '20px' }}>
              ⌘ + enter to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Generator + Results ──

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(196, 120, 74, 0.08)', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '20px', color: '#2D2D2D', letterSpacing: '-0.02em' }}>
            gen<span style={{ color: '#C4784A' }}>U</span>ine
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isPro && (
            <span style={{ fontSize: '12px', color: messagesRemaining <= 1 ? '#C4784A' : '#A08C7C', fontFamily: "'DM Sans', sans-serif" }}>
              {messagesRemaining} message{messagesRemaining !== 1 ? 's' : ''} left today
            </span>
          )}
          {isPro && (
            <span style={{ fontSize: '12px', color: '#C4784A', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              pro ✓
            </span>
          )}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(196, 120, 74, 0.08)', border: '1px solid rgba(196, 120, 74, 0.15)', borderRadius: '100px', padding: '5px 12px', cursor: 'pointer' }}
            onClick={handleClearVoice}
            title="reset voice"
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#C4784A', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: '#C4784A', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              your voice saved ✓
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Results phase */}
        {phase === 'results' && result && (
          <ResultCards result={result} onTryAgain={handleTryAgain} />
        )}

        {/* Generator phase */}
        {phase === 'generator' && (
          <div className="fade-scale">
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 700, color: '#2D2D2D', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              who do you want to message?
            </h2>
            <p style={{ fontSize: '14px', color: '#A08C7C', marginBottom: '32px', lineHeight: 1.6 }}>
              paste their linkedin info below. grab their name, headline, and about — even a messy copy works.
            </p>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid rgba(196, 120, 74, 0.12)', boxShadow: '0 4px 24px rgba(196, 120, 74, 0.06)', marginBottom: '20px' }}>
              {/* Name + Headline row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>name *</label>
                  <input
                    type="text" value={profile.name}
                    onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                    placeholder="Sarah Chen"
                    style={{ ...fieldStyle, resize: undefined }}
                    onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>headline *</label>
                  <input
                    type="text" value={profile.headline}
                    onChange={(e) => setProfile(p => ({ ...p, headline: e.target.value }))}
                    placeholder="Product Manager @ Stripe | Ex-Google"
                    style={{ ...fieldStyle, resize: undefined }}
                    onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* About */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>about section <span style={{ color: '#A08C7C', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>optional but really helpful</span></label>
                <textarea
                  value={profile.about}
                  onChange={(e) => setProfile(p => ({ ...p, about: e.target.value }))}
                  placeholder="paste their about section here... even fragments work"
                  rows={3}
                  style={{ ...fieldStyle, resize: 'vertical' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Recent activity */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>recent posts or activity <span style={{ color: '#A08C7C', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>optional</span></label>
                <textarea
                  value={profile.activity}
                  onChange={(e) => setProfile(p => ({ ...p, activity: e.target.value }))}
                  placeholder="any recent posts, comments, or notable projects..."
                  rows={2}
                  style={{ ...fieldStyle, resize: 'vertical' }}
                  onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Extra context */}
              <div>
                <label style={labelStyle}>anything else? <span style={{ color: '#A08C7C', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>optional</span></label>
                <input
                  type="text" value={profile.other}
                  onChange={(e) => setProfile(p => ({ ...p, other: e.target.value }))}
                  placeholder="we go to the same school, mutual connection, saw their talk at..."
                  style={{ ...fieldStyle, resize: undefined }}
                  onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Options row */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 24px', border: '1px solid rgba(196, 120, 74, 0.1)', boxShadow: '0 2px 12px rgba(196, 120, 74, 0.04)', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>

                {/* Recipient type */}
                <div>
                  <label style={labelStyle}>who are you reaching out to?</label>
                  <select
                    value={recipientType}
                    onChange={(e) => setRecipientType(e.target.value)}
                    style={{
                      ...fieldStyle, resize: undefined,
                      cursor: 'pointer', appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A08C7C' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                      paddingRight: '32px',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">pick one...</option>
                    {RECIPIENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Tone */}
                <div>
                  <label style={labelStyle}>tone</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '2px' }}>
                    {TONES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(tone === t ? '' : t)}
                        style={{
                          padding: '7px 16px', borderRadius: '100px', fontSize: '13px',
                          fontFamily: "'DM Sans', sans-serif",
                          backgroundColor: tone === t ? '#C4784A' : 'transparent',
                          color: tone === t ? '#FFFFFF' : '#6B5E52',
                          border: `1.5px solid ${tone === t ? '#C4784A' : '#E8DDD5'}`,
                          cursor: 'pointer', transition: 'all 0.15s ease',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional context */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(196, 120, 74, 0.08)' }}>
                <label style={labelStyle}>extra context <span style={{ color: '#A08C7C', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>optional — anything else genUine should know</span></label>
                <input
                  type="text" value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="e.g. I want to ask about internship opportunities, or we met at a conference last month"
                  style={{ ...fieldStyle, resize: undefined }}
                  onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#C4784A', marginBottom: '16px', padding: '10px 14px', backgroundColor: 'rgba(196, 120, 74, 0.08)', borderRadius: '10px' }}>
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!profile.name.trim() && !profile.headline.trim())}
              className="btn-primary"
              style={{
                width: '100%', padding: '16px', borderRadius: '14px', fontSize: '16px',
                opacity: isGenerating || (!profile.name.trim() && !profile.headline.trim()) ? 0.5 : 1,
                cursor: isGenerating || (!profile.name.trim() && !profile.headline.trim()) ? 'not-allowed' : 'pointer',
              }}
            >
              {isGenerating ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span className="loading-dot" style={{ width: 5, height: 5 }} />
                  <span className="loading-dot" style={{ width: 5, height: 5 }} />
                  <span className="loading-dot" style={{ width: 5, height: 5 }} />
                </span>
              ) : 'write my message →'}
            </button>

            <p style={{ fontSize: '12px', color: '#A08C7C', textAlign: 'center', marginTop: '12px' }}>
              {isPro ? 'unlimited messages · pro' : `${messagesRemaining} of ${FREE_LIMIT} free messages left today`}
              {!isPro && messagesRemaining <= 1 && (
                <Link href="/pricing" style={{ color: '#C4784A', textDecoration: 'none', marginLeft: '6px', fontWeight: 600 }}>
                  go pro →
                </Link>
              )}
            </p>
          </div>
        )}

        {/* Generating overlay */}
        {isGenerating && phase === 'generator' && <LoadingSpinner />}
      </div>
    </div>
  );
}
