'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceCapture from '../components/VoiceCapture';

// ── Types ──────────────────────────────────────────────

interface VoiceProfile {
  tone?: string;
  energy?: string;
  style?: string;
  pattern?: string;
  overallStyle?: string;
  examples?: string[];
  skipped?: boolean;
  [key: string]: string | string[] | boolean | undefined;
}

interface MessageResult {
  voiceProfile: { tone: string; energy: string; style: string; pattern: string };
  messageA: { text: string; angle: string; commonGround: string };
  messageB: { text: string; angle: string; curiosityPoint: string };
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
  'reading their profile…',
  'finding common ground…',
  'matching your voice…',
  'crafting something genuine…',
];

const FREE_LIMIT = 3;

// ── Mini logo (inline, consistent with SiteHeader) ──

function MiniLogo() {
  return (
    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#1A1714" strokeWidth="1.4" />
        <path d="M6.5 12.5a5.5 5.5 0 0 0 11 0V10a5.5 5.5 0 0 0-11 0" stroke="#C4784A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="12" cy="12" r="1.6" fill="#1A1714" />
      </svg>
      <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
        gen<span style={{ color: 'var(--terra)' }}>U</span>ine
      </span>
    </Link>
  );
}

// ── Loading indicator ──

function LoadingIndicator({ small = false }: { small?: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % LOADING_MESSAGES.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: small ? '20px 0' : '60px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: small ? 12 : 20 }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1.05, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
            style={{
              width: small ? 5 : 6,
              height: small ? 5 : 6,
              borderRadius: '50%',
              backgroundColor: 'var(--terra)',
              display: 'inline-block',
            }}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="serif-italic"
          style={{
            fontSize: small ? 13 : 16,
            color: 'var(--ink-mid)',
          }}
        >
          {LOADING_MESSAGES[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ── Copy button ──

function CopyBtn({ text, accent = 'var(--terra)' }: { text: string; accent?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        borderRadius: 10,
        border: `1px solid ${copied ? accent : 'var(--ink-whisper)'}`,
        backgroundColor: copied ? 'var(--terra-tint)' : 'transparent',
        color: copied ? accent : 'var(--ink-mid)',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: 'var(--font-jakarta)',
        cursor: 'pointer',
        transition: 'background-color 220ms ease, color 220ms ease, border-color 220ms ease',
        letterSpacing: '0.02em',
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          copy
        </>
      )}
    </button>
  );
}

// ── Result cards ──

function ResultCards({ result, onTryAgain }: { result: MessageResult; onTryAgain: () => void }) {
  const [expandedA, setExpandedA] = useState(false);
  const [expandedB, setExpandedB] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Voice profile chip */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 14px',
          borderRadius: 999,
          border: '1px solid var(--ink-whisper)',
          backgroundColor: 'var(--paper-warm)',
          marginBottom: 28,
        }}
      >
        <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--terra)', display: 'inline-block' }} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mid)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          your voice · <strong style={{ color: 'var(--terra)', fontWeight: 600 }}>{result.voiceProfile.tone}</strong>
          {result.voiceProfile.energy ? ` · ${result.voiceProfile.energy}` : ''}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
        {/* Card A — common ground */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{
            backgroundColor: 'var(--paper)',
            border: '1px solid var(--ink-whisper)',
            borderRadius: 20,
            padding: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <span className="eyebrow" style={{ color: 'var(--terra)', fontSize: 10 }}>
              — common ground
            </span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.7, marginBottom: 24, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-dm)' }}>
            {result.messageA.text}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <CopyBtn text={result.messageA.text} />
            <button
              onClick={() => setExpandedA(!expandedA)}
              className="mono"
              style={{
                fontSize: 11,
                color: 'var(--ink-light)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              why this works {expandedA ? '−' : '+'}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {expandedA && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 10,
                    backgroundColor: 'var(--paper-warm)',
                    fontSize: 13,
                    color: 'var(--ink-soft)',
                    lineHeight: 1.6,
                    border: '1px solid var(--ink-whisper)',
                  }}
                >
                  <strong style={{ color: 'var(--terra)', display: 'block', marginBottom: 4, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-jakarta)' }}>
                    angle
                  </strong>
                  {result.messageA.angle}
                  {result.messageA.commonGround && (
                    <span style={{ display: 'block', marginTop: 8, color: 'var(--ink-light)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                      common ground: {result.messageA.commonGround}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Card B — genuine curiosity (dark ink accent) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{
            backgroundColor: 'var(--ink)',
            color: 'var(--paper)',
            border: '1px solid rgba(196,120,74,0.3)',
            borderRadius: 20,
            padding: 28,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(196,120,74,0.22) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, position: 'relative' }}>
            <span className="eyebrow" style={{ color: 'var(--terra)', fontSize: 10 }}>
              — genuine curiosity
            </span>
          </div>
          <p
            style={{
              fontSize: 15,
              color: 'var(--paper)',
              lineHeight: 1.7,
              marginBottom: 24,
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-dm)',
              position: 'relative',
            }}
          >
            {result.messageB.text}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
            <button
              onClick={() => { navigator.clipboard.writeText(result.messageB.text); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 10,
                border: '1px solid rgba(250,248,244,0.2)',
                backgroundColor: 'transparent',
                color: 'rgba(250,248,244,0.85)',
                fontSize: 12,
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 200ms ease',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(250,248,244,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              copy
            </button>
            <button
              onClick={() => setExpandedB(!expandedB)}
              className="mono"
              style={{
                fontSize: 11,
                color: 'rgba(250,248,244,0.5)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              why this works {expandedB ? '−' : '+'}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {expandedB && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ overflow: 'hidden', position: 'relative' }}
              >
                <div
                  style={{
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 10,
                    backgroundColor: 'rgba(250,248,244,0.06)',
                    fontSize: 13,
                    color: 'rgba(250,248,244,0.85)',
                    lineHeight: 1.6,
                    border: '1px solid rgba(250,248,244,0.12)',
                  }}
                >
                  <strong style={{ color: 'var(--terra)', display: 'block', marginBottom: 4, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-jakarta)' }}>
                    angle
                  </strong>
                  {result.messageB.angle}
                  {result.messageB.curiosityPoint && (
                    <span style={{ display: 'block', marginTop: 8, color: 'rgba(250,248,244,0.6)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                      curiosity: {result.messageB.curiosityPoint}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={onTryAgain}
          className="btn-ghost"
          style={{ padding: '12px 22px', borderRadius: 999, fontSize: 13, fontFamily: 'var(--font-jakarta)' }}
        >
          ← try again
        </button>
        <p className="serif-italic" style={{ fontSize: 14, color: 'var(--ink-mid)' }}>
          not quite? go back and adjust the profile or tone.
        </p>
      </div>
    </motion.div>
  );
}

// ── Main app page ──

export default function AppPage() {
  const [phase, setPhase] = useState<'loading' | 'voice-setup' | 'voice-confirm' | 'generator' | 'results' | 'limit'>('loading');
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [pendingVoiceProfile, setPendingVoiceProfile] = useState<VoiceProfile | null>(null);
  const [userName, setUserName] = useState('');
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Generator form
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchedPreview, setFetchedPreview] = useState<{ name: string; headline: string; about: string; location: string; profilePicUrl: string | null } | null>(null);
  const [rawProfile, setRawProfile] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [tone, setTone] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  // Results
  const [result, setResult] = useState<MessageResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const messagesRemaining = isPro || isAdmin ? Infinity : Math.max(0, FREE_LIMIT - messagesUsed);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('genuine_voice_profile');
      const savedName = localStorage.getItem('genuine_user_name');
      const savedCount = localStorage.getItem('genuine_messages_today');
      const savedDate = localStorage.getItem('genuine_last_reset_date');
      const savedPro = localStorage.getItem('genuine_is_pro');
      const savedAdmin = localStorage.getItem('genuine_admin');

      const today = new Date().toDateString();
      if (savedDate !== today) {
        localStorage.setItem('genuine_last_reset_date', today);
        localStorage.setItem('genuine_messages_today', '0');
        setMessagesUsed(0);
      } else if (savedCount) {
        setMessagesUsed(parseInt(savedCount, 10));
      }

      if (savedPro === 'true') setIsPro(true);
      if (savedAdmin === 'true') setIsAdmin(true);
      if (savedName) setUserName(savedName);

      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        setVoiceProfile(p);
        setPhase('generator');
      } else {
        setPhase('voice-setup');
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        localStorage.setItem('genuine_is_pro', 'true');
        setIsPro(true);
        window.history.replaceState({}, '', '/app');
      }
    } catch {
      setPhase('voice-setup');
    }

    const handleAdminGrant = () => setIsAdmin(true);
    window.addEventListener('genuine_admin_granted', handleAdminGrant);
    return () => window.removeEventListener('genuine_admin_granted', handleAdminGrant);
  }, []);

  const handleVoiceCaptureComplete = (profile: VoiceProfile, examples: string[]) => {
    const full = { ...profile, examples };
    setPendingVoiceProfile(full);
    setPhase('voice-confirm');
  };

  const handleVoiceConfirm = () => {
    if (!pendingVoiceProfile) return;
    setVoiceProfile(pendingVoiceProfile);
    localStorage.setItem('genuine_voice_profile', JSON.stringify(pendingVoiceProfile));
    setPendingVoiceProfile(null);
    setPhase('generator');
  };

  const handleVoiceAdjust = () => setPhase('voice-setup');

  const handleSkipVoice = (skipTone: string) => {
    const minimalProfile: VoiceProfile = { tone: skipTone, overallStyle: `${skipTone} tone`, skipped: true } as VoiceProfile;
    setVoiceProfile(minimalProfile);
    setTone(skipTone);
    localStorage.setItem('genuine_voice_profile', JSON.stringify(minimalProfile));
    setPhase('generator');
  };

  const handleClearVoice = () => {
    setVoiceProfile(null);
    localStorage.removeItem('genuine_voice_profile');
    setPhase('voice-setup');
  };

  const handleGenerate = useCallback(async () => {
    if (!rawProfile.trim()) {
      setError('paste their linkedin profile first.');
      return;
    }
    if (messagesRemaining <= 0) {
      setPhase('limit');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const examples = voiceProfile?.examples || [];
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userExamples: examples,
          targetProfile: rawProfile,
          userName: userName || undefined,
          recipientType: recipientType || undefined,
          tone: tone || undefined,
          additionalContext: additionalContext || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'something went wrong. try again?');
        return;
      }

      setResult(data);
      const newCount = messagesUsed + 1;
      setMessagesUsed(newCount);
      localStorage.setItem('genuine_messages_today', newCount.toString());

      try {
        const history = JSON.parse(localStorage.getItem('genuine_message_history') || '[]');
        history.unshift({
          id: Date.now(),
          date: new Date().toISOString(),
          rawProfile: rawProfile.trim(),
          recipientType: recipientType || null,
          messageA: data.messageA?.text || '',
          messageB: data.messageB?.text || '',
        });
        localStorage.setItem('genuine_message_history', JSON.stringify(history.slice(0, 50)));
      } catch { /* silent */ }

      setPhase('results');
    } catch {
      setError('something went wrong. try again?');
    } finally {
      setIsGenerating(false);
    }
  }, [rawProfile, voiceProfile, userName, recipientType, tone, additionalContext, messagesUsed, messagesRemaining]);

  const handleTryAgain = () => {
    setResult(null);
    setError('');
    setPhase('generator');
  };

  const handleFetchProfile = async () => {
    if (!linkedinUrl.trim()) return;
    setIsFetching(true);
    setFetchError('');
    setFetchedPreview(null);
    try {
      const res = await fetch('/api/fetch-linkedin-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkedinUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) setFetchError(data.error || 'failed to fetch profile.');
      else {
        setRawProfile(data.rawProfile);
        setFetchedPreview(data.preview);
      }
    } catch {
      setFetchError('something went wrong. check the url and try again.');
    } finally {
      setIsFetching(false);
    }
  };

  // Field styles
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--ink-whisper)',
    borderRadius: 12,
    fontFamily: 'var(--font-dm)',
    fontSize: 14,
    color: 'var(--ink)',
    outline: 'none',
    resize: 'none',
    transition: 'border-color 180ms ease, box-shadow 180ms ease',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--ink-light)',
    marginBottom: 10,
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  };

  // ── Loading ──
  if (phase === 'loading') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingIndicator />
      </div>
    );
  }

  // ── Limit ──
  if (phase === 'limit') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--ink-whisper)' }}>
          <MiniLogo />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{ maxWidth: 460 }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: '1px solid var(--ink-whisper)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 28px',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--terra)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                color: 'var(--ink)',
                marginBottom: 14,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              that&apos;s your lot for today.
            </h2>
            <p className="serif-italic" style={{ fontSize: 18, color: 'var(--ink-mid)', lineHeight: 1.5, marginBottom: 32 }}>
              you&apos;ve used your {FREE_LIMIT} free messages. come back tomorrow or go pro for unlimited.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
              <Link href="/pricing" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '14px 28px', borderRadius: 999, fontSize: 14, fontFamily: 'var(--font-jakarta)' }}>
                  go pro — unlimited →
                </button>
              </Link>
              <button
                onClick={() => setPhase('generator')}
                className="btn-ghost"
                style={{ padding: '14px 24px', borderRadius: 999, fontSize: 14, fontFamily: 'var(--font-jakarta)' }}
              >
                come back tomorrow
              </button>
            </div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>
              your voice profile is saved · pick up tomorrow
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Voice setup ──
  if (phase === 'voice-setup') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--ink-whisper)' }}>
          <MiniLogo />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <VoiceCapture
            userName={userName}
            onNameChange={(name) => { setUserName(name); localStorage.setItem('genuine_user_name', name); }}
            onComplete={handleVoiceCaptureComplete}
            onSkip={handleSkipVoice}
          />
        </div>
      </div>
    );
  }

  // ── Voice confirm ──
  if (phase === 'voice-confirm' && pendingVoiceProfile) {
    const vp = pendingVoiceProfile;
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--ink-whisper)' }}>
          <MiniLogo />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{ width: '100%', maxWidth: 560 }}
          >
            <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 16 }}>
              — voice analysis complete
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 600,
                color: 'var(--ink)',
                letterSpacing: '-0.03em',
                marginBottom: 12,
                lineHeight: 1.1,
              }}
            >
              here&apos;s what genUine learned about your voice.
            </h2>
            <p className="serif-italic" style={{ fontSize: 17, color: 'var(--ink-mid)', marginBottom: 32, lineHeight: 1.5 }}>
              does this sound right? if not, you can go back and adjust.
            </p>

            <div className="warm-card" style={{ padding: 4, marginBottom: 28 }}>
              {[
                { label: 'tone', value: vp.tone },
                { label: 'energy', value: vp.energy },
                { label: 'style', value: vp.style || vp.overallStyle },
                { label: 'pattern', value: vp.pattern },
              ]
                .filter((row) => row.value)
                .map((row, i, arr) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 20,
                      padding: '18px 24px',
                      borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--ink-whisper)',
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: 'var(--terra)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        minWidth: 70,
                        paddingTop: 3,
                      }}
                    >
                      {row.label}
                    </span>
                    <span style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'var(--font-dm)', lineHeight: 1.5 }}>
                      {String(row.value)}
                    </span>
                  </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleVoiceConfirm}
                className="btn-primary"
                style={{ flex: 1, minWidth: 200, padding: 16, borderRadius: 999, fontSize: 15, fontFamily: 'var(--font-jakarta)' }}
              >
                yes, let&apos;s go →
              </button>
              <button
                onClick={handleVoiceAdjust}
                className="btn-ghost"
                style={{ padding: '16px 22px', borderRadius: 999, fontSize: 15, fontFamily: 'var(--font-jakarta)' }}
              >
                let me adjust
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Generator + Results ──
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)' }}>
      {/* Top bar */}
      <div
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--ink-whisper)',
          backgroundColor: 'var(--paper)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'saturate(140%) blur(8px)',
        }}
      >
        <MiniLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {isAdmin && (
            <span
              title="admin mode — unlimited"
              className="mono"
              style={{ fontSize: 14, color: 'var(--terra)', opacity: 0.7 }}
            >
              ∞
            </span>
          )}
          {!isPro && !isAdmin && (
            <span
              className="mono"
              style={{
                fontSize: 11,
                color: messagesRemaining <= 1 ? 'var(--terra)' : 'var(--ink-light)',
                letterSpacing: '0.04em',
              }}
            >
              {messagesRemaining} message{messagesRemaining !== 1 ? 's' : ''} left today
            </span>
          )}
          {isPro && !isAdmin && (
            <span
              className="mono"
              style={{ fontSize: 11, color: 'var(--terra)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              pro ✓
            </span>
          )}
          <button
            onClick={handleClearVoice}
            title="reset voice"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              border: '1px solid var(--ink-whisper)',
              backgroundColor: 'var(--paper-warm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--ink-mid)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'border-color 220ms ease',
            }}
          >
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--terra)', display: 'inline-block' }} />
            voice saved
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px 120px' }}>
        {/* Results phase */}
        {phase === 'results' && result && <ResultCards result={result} onTryAgain={handleTryAgain} />}

        {/* Generator phase */}
        {phase === 'generator' && (
          <motion.div
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 16 }}>
              — compose
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(32px, 4.5vw, 48px)',
                fontWeight: 600,
                color: 'var(--ink)',
                letterSpacing: '-0.03em',
                marginBottom: 10,
                lineHeight: 1.05,
              }}
            >
              who do you want to message?
            </h2>
            <p className="serif-italic" style={{ fontSize: 18, color: 'var(--ink-mid)', marginBottom: 40, lineHeight: 1.5 }}>
              drop their linkedin link and we&apos;ll do the rest.
            </p>

            {/* URL fetch card */}
            <div className="warm-card" style={{ padding: 28, marginBottom: 20 }}>
              <label style={labelStyle}>— linkedin profile url</label>
              <div style={{ display: 'flex', gap: 10, marginBottom: fetchError ? 10 : 0, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => {
                    setLinkedinUrl(e.target.value);
                    setFetchedPreview(null);
                    setFetchError('');
                    setRawProfile('');
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleFetchProfile(); }}
                  placeholder="linkedin.com/in/username"
                  style={{ ...fieldStyle, flex: 1, minWidth: 220 }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--ink)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,23,20,0.05)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--ink-whisper)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  onClick={handleFetchProfile}
                  disabled={isFetching || !linkedinUrl.trim()}
                  className="btn-primary"
                  style={{
                    padding: '0 22px',
                    borderRadius: 12,
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    opacity: isFetching || !linkedinUrl.trim() ? 0.4 : 1,
                    cursor: isFetching || !linkedinUrl.trim() ? 'not-allowed' : 'pointer',
                    minHeight: 48,
                    fontFamily: 'var(--font-jakarta)',
                  }}
                >
                  {isFetching ? (
                    <LoadingIndicator small />
                  ) : (
                    'fetch →'
                  )}
                </button>
              </div>

              {fetchError && (
                <p style={{ fontSize: 13, color: 'var(--terra)', marginTop: 10, fontFamily: 'var(--font-dm)' }}>
                  {fetchError}
                </p>
              )}

              {fetchedPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    marginTop: 16,
                    padding: 18,
                    borderRadius: 14,
                    backgroundColor: 'var(--paper)',
                    border: '1px solid var(--ink-whisper)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: fetchedPreview.about ? 12 : 0 }}>
                    {fetchedPreview.profilePicUrl ? (
                      <img
                        src={fetchedPreview.profilePicUrl}
                        alt={fetchedPreview.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--ink-whisper)' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor: 'var(--terra-tint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: 'var(--terra)' }}>
                          {fetchedPreview.name?.[0] || '?'}
                        </span>
                      </div>
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: 3, letterSpacing: '-0.01em' }}>
                        {fetchedPreview.name}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.4 }}>
                        {fetchedPreview.headline}
                      </p>
                      {fetchedPreview.location && (
                        <p className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', marginTop: 4, letterSpacing: '0.04em' }}>
                          {fetchedPreview.location}
                        </p>
                      )}
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: 'var(--terra)',
                        border: '1px solid rgba(196,120,74,0.3)',
                        backgroundColor: 'var(--terra-tint)',
                        padding: '4px 10px',
                        borderRadius: 999,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        flexShrink: 0,
                      }}
                    >
                      got it
                    </span>
                  </div>
                  {fetchedPreview.about && (
                    <p style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.6, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--ink-whisper)' }}>
                      {fetchedPreview.about}
                    </p>
                  )}
                </motion.div>
              )}

              {(fetchError || (!fetchedPreview && !isFetching)) && (
                <div style={{ marginTop: fetchError ? 16 : 20, paddingTop: 16, borderTop: '1px solid var(--ink-whisper)' }}>
                  <p className="serif-italic" style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 10 }}>
                    {fetchError ? 'or paste their info manually:' : 'no url? paste their info instead:'}
                  </p>
                  <textarea
                    value={rawProfile}
                    onChange={(e) => setRawProfile(e.target.value)}
                    placeholder={"Sarah Chen\nProduct Manager @ Stripe\n\nAbout: I've spent the last 5 years building..."}
                    rows={5}
                    style={{ ...fieldStyle, resize: 'vertical', minHeight: 110, fontFamily: 'var(--font-dm)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--ink)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,23,20,0.05)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--ink-whisper)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* Options card */}
            <div className="warm-card" style={{ padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                <div>
                  <label style={labelStyle}>— who are you reaching out to?</label>
                  <select
                    value={recipientType}
                    onChange={(e) => setRecipientType(e.target.value)}
                    style={{
                      ...fieldStyle,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A08C7C' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: 36,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--ink)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,23,20,0.05)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--ink-whisper)'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">pick one…</option>
                    {RECIPIENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>— tone</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4 }}>
                    {TONES.map((t) => {
                      const active = tone === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setTone(active ? '' : t)}
                          style={{
                            padding: '9px 18px',
                            borderRadius: 999,
                            fontSize: 13,
                            fontFamily: 'var(--font-jakarta)',
                            backgroundColor: active ? 'var(--ink)' : 'transparent',
                            color: active ? 'var(--paper)' : 'var(--ink-mid)',
                            border: `1px solid ${active ? 'var(--ink)' : 'var(--ink-whisper)'}`,
                            cursor: 'pointer',
                            transition: 'background-color 220ms ease, color 220ms ease, border-color 220ms ease, transform 160ms var(--ease-out)',
                            letterSpacing: '-0.01em',
                          }}
                          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--ink-whisper)' }}>
                <label style={labelStyle}>
                  — extra context{' '}
                  <span
                    style={{
                      color: 'var(--ink-light)',
                      textTransform: 'none',
                      letterSpacing: 0,
                      fontWeight: 400,
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: 12,
                    }}
                  >
                    optional — anything else genUine should know
                  </span>
                </label>
                <input
                  type="text"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="e.g. I want to ask about internship opportunities"
                  style={fieldStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--ink)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,23,20,0.05)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--ink-whisper)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {error && (
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--terra)',
                  marginBottom: 16,
                  padding: '12px 16px',
                  backgroundColor: 'var(--terra-tint)',
                  border: '1px solid rgba(196,120,74,0.2)',
                  borderRadius: 12,
                  fontFamily: 'var(--font-dm)',
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !rawProfile.trim()}
              className="btn-primary"
              style={{
                width: '100%',
                padding: 18,
                borderRadius: 999,
                fontSize: 15,
                fontFamily: 'var(--font-jakarta)',
                opacity: isGenerating || !rawProfile.trim() ? 0.4 : 1,
                cursor: isGenerating || !rawProfile.trim() ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.01em',
              }}
            >
              {isGenerating ? (
                <LoadingIndicator small />
              ) : (
                <>write my message <span style={{ marginLeft: 4 }}>→</span></>
              )}
            </button>

            <p className="mono" style={{ fontSize: 11, color: 'var(--ink-light)', textAlign: 'center', marginTop: 16, letterSpacing: '0.04em' }}>
              {isAdmin
                ? '∞ messages · admin'
                : isPro
                ? 'unlimited · pro'
                : `${messagesRemaining} of ${FREE_LIMIT} free messages left today`}
              {!isPro && !isAdmin && messagesRemaining <= 1 && (
                <Link
                  href="/pricing"
                  style={{
                    color: 'var(--terra)',
                    textDecoration: 'none',
                    marginLeft: 8,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  go pro →
                </Link>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
