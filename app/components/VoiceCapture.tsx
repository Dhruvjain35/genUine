'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceProfile {
  tone?: string;
  energy?: string;
  capitalization?: string;
  sentenceLength?: string;
  emojiUsage?: string;
  greetingStyle?: string;
  formalityLevel?: string;
  slangUsage?: string;
  overallStyle?: string;
  examples?: string[];
  skipped?: boolean;
}

interface VoiceCaptureProps {
  userName: string;
  onNameChange: (name: string) => void;
  onComplete: (profile: VoiceProfile, examples: string[]) => void;
  onSkip: (tone: string) => void;
}

type CaptureTab = 'paste' | 'react' | 'skip';
type CapturePhase = 'capture' | 'streaming' | 'done';

const SKIP_TONES = [
  { value: 'casual', label: 'casual', desc: 'friendly, relaxed, lowercase vibes' },
  { value: 'professional', label: 'professional', desc: 'clear, confident, respectful' },
  { value: 'friendly', label: 'friendly', desc: 'warm, personable, genuine' },
  { value: 'direct', label: 'direct', desc: 'short, punchy, no fluff' },
];

const SOURCE_CHIPS = [
  { icon: '💼', label: 'your linkedin posts or comments', best: true },
  { icon: '💬', label: 'a text or dm you sent' },
  { icon: '📧', label: 'an email you sent' },
  { icon: '🔗', label: 'your linkedin about section' },
];

export default function VoiceCapture({ userName, onNameChange, onComplete, onSkip }: VoiceCaptureProps) {
  const [tab, setTab] = useState<CaptureTab>('paste');
  const [phase, setPhase] = useState<CapturePhase>('capture');
  const [pastedText, setPastedText] = useState('');
  const [reactionText, setReactionText] = useState('');
  const [skipTone, setSkipTone] = useState('');
  const [streamText, setStreamText] = useState('');
  const [doneProfile, setDoneProfile] = useState<VoiceProfile | null>(null);
  const [examples, setExamples] = useState<string[]>([]);
  const streamBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll stream box
  useEffect(() => {
    if (streamBoxRef.current) {
      streamBoxRef.current.scrollTop = streamBoxRef.current.scrollHeight;
    }
  }, [streamText]);

  const activeText = tab === 'paste' ? pastedText : reactionText;
  const canSubmit = activeText.trim().length > 5;

  const handleAnalyze = async () => {
    const text = tab === 'paste' ? pastedText.trim() : reactionText.trim();
    const exs = [text];
    setExamples(exs);
    setPhase('streaming');
    setStreamText('');

    try {
      const res = await fetch('/api/analyze-voice-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examples: exs }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Stream failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                // Only show the narration part (before [PROFILE_JSON])
                const displayText = fullText.split('[PROFILE_JSON]')[0];
                setStreamText(displayText);
              }
            } catch { /* skip malformed chunks */ }
          }
        }
      }

      // Extract JSON from after [PROFILE_JSON]
      const parts = fullText.split('[PROFILE_JSON]');
      let profile: VoiceProfile = {};
      if (parts[1]) {
        try {
          const clean = parts[1].replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          profile = JSON.parse(clean);
        } catch { /* fallback to empty profile */ }
      }

      profile.examples = exs;
      setDoneProfile(profile);
      setPhase('done');
    } catch {
      // On error, still proceed with examples-only profile
      setDoneProfile({ examples: exs });
      setPhase('done');
    }
  };

  const handleProceed = () => {
    if (doneProfile) {
      onComplete(doneProfile, examples);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E8DDD5',
    backgroundColor: '#FFFFFF',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#2D2D2D',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  };

  // ── STREAMING PHASE ──
  if (phase === 'streaming') {
    return (
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          reading your voice
        </p>
        <div
          ref={streamBoxRef}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(196, 120, 74, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            minHeight: '180px',
            maxHeight: '320px',
            overflowY: 'auto',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            color: '#2D2D2D',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            boxShadow: '0 4px 24px rgba(196, 120, 74, 0.08)',
          }}
        >
          {streamText || (
            <span style={{ color: '#C4784A', opacity: 0.6 }}>
              reading your messages...
            </span>
          )}
          {/* Blinking cursor */}
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '16px',
              backgroundColor: '#C4784A',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 1s step-end infinite',
            }}
          />
        </div>
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </div>
    );
  }

  // ── DONE PHASE ──
  if (phase === 'done' && doneProfile) {
    return (
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          voice captured
        </p>

        {/* Narration replay */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid rgba(196, 120, 74, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            color: '#2D2D2D',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            boxShadow: '0 4px 24px rgba(196, 120, 74, 0.08)',
            marginBottom: '20px',
          }}
        >
          {streamText}
        </div>

        {/* Profile chip */}
        {doneProfile.overallStyle && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(196, 120, 74, 0.1)',
              border: '1px solid rgba(196, 120, 74, 0.2)',
              borderRadius: '100px',
              padding: '8px 16px',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '14px', color: '#C4784A' }}>✦</span>
            <span style={{ fontSize: '13px', color: '#6B5E52', fontFamily: "'DM Sans', sans-serif" }}>
              {doneProfile.overallStyle}
            </span>
          </div>
        )}

        <button
          onClick={handleProceed}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', borderRadius: '13px', fontSize: '15px' }}
        >
          let&apos;s generate your first message →
        </button>
      </div>
    );
  }

  // ── CAPTURE PHASE ──
  return (
    <div style={{ width: '100%', maxWidth: '520px' }}>
      {/* Header */}
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(22px, 4vw, 28px)',
          color: '#2D2D2D',
          letterSpacing: '-0.02em',
          marginBottom: '8px',
          lineHeight: 1.2,
        }}
      >
        let&apos;s find your voice
      </h1>
      <p style={{ fontSize: '14px', color: '#A08C7C', marginBottom: '28px', lineHeight: 1.6 }}>
        the less you think about it, the better the result.
      </p>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#F2EBE4',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px',
        }}
      >
        {([
          { key: 'paste', label: 'paste something' },
          { key: 'react', label: 'quick reaction' },
          { key: 'skip', label: 'just pick a vibe' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '9px',
              fontSize: '13px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              backgroundColor: tab === key ? '#FFFFFF' : 'transparent',
              color: tab === key ? '#2D2D2D' : '#A08C7C',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: PASTE ── */}
      {tab === 'paste' && (
        <div>
          <p style={{ fontSize: '14px', color: '#6B5E52', marginBottom: '12px', lineHeight: 1.6 }}>
            copy a text, dm, linkedin post, email — literally anything you&apos;ve sent. we&apos;ll figure out your style from that.
          </p>

          {/* Source chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {SOURCE_CHIPS.map(({ icon, label, best }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  backgroundColor: best ? 'rgba(196, 120, 74, 0.1)' : '#F5F0EB',
                  color: best ? '#C4784A' : '#A08C7C',
                  border: best ? '1px solid rgba(196, 120, 74, 0.25)' : '1px solid transparent',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: best ? 600 : 400,
                }}
              >
                <span>{icon}</span>
                <span>{label}</span>
                {best && <span style={{ fontSize: '10px', fontWeight: 700 }}>← best</span>}
              </div>
            ))}
          </div>

          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder={"paste anything you've sent here...\n\neven a quick 'congrats!' works."}
            rows={6}
            style={{
              ...fieldStyle,
              resize: 'vertical',
              minHeight: '140px',
              marginBottom: '16px',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
          />

          {/* Name field */}
          <input
            type="text"
            value={userName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="your first name (optional)"
            style={{ ...fieldStyle, marginBottom: '16px' }}
            onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
          />

          <button
            onClick={handleAnalyze}
            disabled={!canSubmit}
            className="btn-primary"
            style={{
              width: '100%', padding: '14px', borderRadius: '13px', fontSize: '15px',
              opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            get my voice →
          </button>
        </div>
      )}

      {/* ── TAB: REACT ── */}
      {tab === 'react' && (
        <div>
          <p style={{ fontSize: '14px', color: '#6B5E52', marginBottom: '16px', lineHeight: 1.6 }}>
            just type what comes out. no wrong answer — 3 words or 3 paragraphs, we&apos;ll work with it.
          </p>

          {/* Scenario */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8DDD5',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  backgroundColor: '#E9E9EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: '#555',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  flexShrink: 0,
                }}
              >
                J
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#2D2D2D', marginBottom: '1px' }}>Jamie</p>
                <p style={{ fontSize: '11px', color: '#AAAAAA' }}>just now</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.6, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
              omg i just got the job!! starting next month 🎉 honestly couldn&apos;t have done it without your help
            </p>
          </div>

          <p style={{ fontSize: '12px', color: '#A08C7C', marginBottom: '10px', fontStyle: 'italic' }}>
            how do you reply? ↓
          </p>

          <textarea
            value={reactionText}
            onChange={(e) => setReactionText(e.target.value)}
            placeholder="type your reply..."
            rows={4}
            style={{
              ...fieldStyle,
              resize: 'vertical',
              minHeight: '100px',
              marginBottom: '16px',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
          />

          {/* Name field */}
          <input
            type="text"
            value={userName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="your first name (optional)"
            style={{ ...fieldStyle, marginBottom: '16px' }}
            onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
          />

          <button
            onClick={handleAnalyze}
            disabled={!canSubmit}
            className="btn-primary"
            style={{
              width: '100%', padding: '14px', borderRadius: '13px', fontSize: '15px',
              opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            get my voice →
          </button>
        </div>
      )}

      {/* ── TAB: SKIP ── */}
      {tab === 'skip' && (
        <div>
          <p style={{ fontSize: '14px', color: '#6B5E52', marginBottom: '16px', lineHeight: 1.6 }}>
            new to linkedin? no worries — just pick your vibe and we&apos;ll handle the rest. you can always refine later.
          </p>

          {/* Name field */}
          <input
            type="text"
            value={userName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="your first name (optional)"
            style={{ ...fieldStyle, marginBottom: '16px' }}
            onFocus={(e) => { e.target.style.borderColor = '#C4784A'; e.target.style.boxShadow = '0 0 0 3px rgba(196, 120, 74, 0.12)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; e.target.style.boxShadow = 'none'; }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {SKIP_TONES.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setSkipTone(value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '13px',
                  border: skipTone === value ? '2px solid #C4784A' : '1.5px solid #E8DDD5',
                  backgroundColor: skipTone === value ? 'rgba(196, 120, 74, 0.06)' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '2px' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: '12px', color: '#A08C7C', fontFamily: "'DM Sans', sans-serif" }}>
                    {desc}
                  </p>
                </div>
                <div
                  style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: skipTone === value ? '2px solid #C4784A' : '2px solid #E0D8D0',
                    backgroundColor: skipTone === value ? '#C4784A' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {skipTone === value && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => skipTone && onSkip(skipTone)}
            disabled={!skipTone}
            className="btn-primary"
            style={{
              width: '100%', padding: '14px', borderRadius: '13px', fontSize: '15px',
              opacity: skipTone ? 1 : 0.4, cursor: skipTone ? 'pointer' : 'not-allowed',
            }}
          >
            start generating →
          </button>
        </div>
      )}
    </div>
  );
}
