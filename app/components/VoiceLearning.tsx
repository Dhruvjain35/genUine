'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

const SCENARIOS = [
  {
    context: 'a text from your friend',
    sender: 'Jamie',
    message: "omg i just got the job!! starting next month 🎉 honestly couldn't have done it without your help",
    prompt: 'how do you reply?',
    type: 'text' as const,
  },
  {
    context: 'a linkedin message',
    sender: 'Alex Chen',
    senderRole: '2nd • Product Manager',
    message: "Hey! I came across your profile and thought it'd be great to connect. Would love to learn more about what you do!",
    prompt: 'what do you write back?',
    type: 'linkedin' as const,
  },
  {
    context: 'a post in your feed',
    sender: 'Sarah Kim',
    senderRole: 'Founder @ BuilderCo',
    message: "After 3 years building at a startup, I'm taking the leap to start something of my own. Terrifying and thrilling at the same time.",
    prompt: 'you want to leave a comment. what do you say?',
    type: 'post' as const,
  },
] as const;

interface VoiceLearningProps {
  onComplete: (examples: string[]) => void;
}

export default function VoiceLearning({ onComplete }: VoiceLearningProps) {
  const [phase, setPhase] = useState<'intro' | 'question' | 'submitted' | 'analyzing'>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [userBubble, setUserBubble] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (phase === 'question') {
      const t = setTimeout(() => inputRef.current?.focus(), 500);
      return () => clearTimeout(t);
    }
  }, [phase, step]);

  const handleStart = () => setPhase('question');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || phase !== 'question') return;

    setUserBubble(trimmed);
    setInput('');
    setPhase('submitted');

    const newAnswers = [...answers, trimmed];

    setTimeout(() => {
      setAnswers(newAnswers);
      if (step < SCENARIOS.length - 1) {
        setStep((s) => s + 1);
        setUserBubble('');
        setPhase('question');
      } else {
        setPhase('analyzing');
        onComplete(newAnswers);
      }
    }, 750);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const scenario = SCENARIOS[step];

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ flex: 1, backgroundColor: '#FAFAFA', padding: '24px 20px', overflow: 'hidden' }}
    >

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="fade-scale w-full max-w-sm">
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-5 text-center"
            style={{ color: '#F0A824' }}
          >
            quick setup
          </div>

          <h1
            className="text-2xl font-bold text-center mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1F1F1F', lineHeight: 1.3 }}
          >
            let's learn how you actually talk
          </h1>

          <p className="text-sm text-center mb-10" style={{ color: '#999', lineHeight: 1.7 }}>
            three quick scenarios. just respond how you naturally would.
            no right answer — the messier the better.
          </p>

          {/* Scenario preview tiles */}
          <div className="flex gap-3 mb-10">
            {([
              { icon: '💬', label: 'text message' },
              { icon: '🔗', label: 'linkedin dm' },
              { icon: '📝', label: 'post comment' },
            ] as const).map((item, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span className="text-xs" style={{ color: '#AAAAAA' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl text-sm font-semibold"
            style={{
              backgroundColor: '#F0A824',
              color: '#FFFFFF',
              boxShadow: '0 6px 24px rgba(240, 168, 36, 0.35)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            let's do it →
          </button>

          <p className="text-xs text-center mt-3" style={{ color: '#CCCCCC' }}>
            takes about 60 seconds
          </p>
        </div>
      )}

      {/* ── QUESTION / SUBMITTED ── */}
      {(phase === 'question' || phase === 'submitted') && (
        <div key={step} className="question-enter w-full max-w-sm">

          {/* Progress bar */}
          <div className="flex gap-1.5 mb-8">
            {SCENARIOS.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: i === step ? 2 : 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: i < step ? '#F0A824' : i === step ? '#F0A824' : '#E0E0E0',
                  opacity: i < step ? 0.4 : 1,
                  transition: 'flex 0.4s ease, background-color 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Context label */}
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-3 stagger-1 fade-up"
            style={{ color: '#F0A824' }}
          >
            {scenario.context}
          </div>

          {/* Incoming bubble */}
          <div className="mb-3 stagger-2 fade-up">

            {scenario.type === 'text' && (
              <div style={{ maxWidth: '82%' }}>
                <div
                  className="text-sm px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{
                    backgroundColor: '#E9E9EB',
                    color: '#1F1F1F',
                    lineHeight: 1.55,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  {scenario.message}
                </div>
                <div className="text-xs mt-1 ml-1" style={{ color: '#BBBBBB' }}>
                  {scenario.sender} · now
                </div>
              </div>
            )}

            {scenario.type === 'linkedin' && (
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E0E0E0',
                  borderLeft: '4px solid #0A66C2',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: '#0A66C2' }}
                  >
                    {scenario.sender[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#1F1F1F' }}>
                      {scenario.sender}
                    </div>
                    <div className="text-xs" style={{ color: '#999' }}>{scenario.senderRole}</div>
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#333', lineHeight: 1.55 }}>
                  {scenario.message}
                </p>
              </div>
            )}

            {scenario.type === 'post' && (
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E0E0E0',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    {scenario.sender[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#1F1F1F' }}>
                      {scenario.sender}
                    </div>
                    <div className="text-xs" style={{ color: '#999' }}>{scenario.senderRole}</div>
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#333', lineHeight: 1.6 }}>
                  {scenario.message}
                </p>
                <div
                  className="text-xs mt-3 pt-2.5"
                  style={{ color: '#CCCCCC', borderTop: '1px solid #F5F5F5' }}
                >
                  LinkedIn · just now · 47 reactions
                </div>
              </div>
            )}
          </div>

          {/* User's answer bubble (shown after submit) */}
          {phase === 'submitted' && userBubble && (
            <div className="flex justify-end mb-4 pop-in">
              <div
                className="text-sm px-4 py-3 rounded-2xl rounded-tr-sm"
                style={{
                  backgroundColor: '#F0A824',
                  color: '#FFFFFF',
                  maxWidth: '82%',
                  lineHeight: 1.55,
                }}
              >
                {userBubble}
              </div>
            </div>
          )}

          {/* Input (only during question phase) */}
          {phase === 'question' && (
            <div className="stagger-3 fade-up">
              <p className="text-sm font-medium mb-3" style={{ color: '#555' }}>
                {scenario.prompt}
              </p>

              <div
                className="flex items-end gap-2 rounded-2xl px-4 py-2.5"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #DCDCDC',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocusCapture={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#F0A824';
                  el.style.boxShadow = '0 0 0 3px rgba(240, 168, 36, 0.12)';
                }}
                onBlurCapture={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#DCDCDC';
                  el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    const el = e.target;
                    el.style.height = 'auto';
                    el.style.height = Math.min(el.scrollHeight, 80) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="type your reply..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent border-none outline-none text-sm"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#1F1F1F',
                    minHeight: '24px',
                    maxHeight: '80px',
                    paddingTop: '4px',
                    lineHeight: 1.5,
                  }}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center send-btn"
                  style={{
                    backgroundColor: input.trim() ? '#F0A824' : '#E0E0E0',
                    color: '#FFFFFF',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-center mt-2" style={{ color: '#CCCCCC' }}>
                enter to send · be yourself, not professional
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── ANALYZING ── */}
      {phase === 'analyzing' && (
        <div className="fade-scale text-center">
          <div className="flex justify-center gap-2 mb-5">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#444' }}>
            reading your vibe...
          </p>
          <p className="text-xs" style={{ color: '#BBBBBB' }}>
            this takes a second
          </p>
        </div>
      )}
    </div>
  );
}
