'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from './Confetti';

interface WaitlistSuccessProps {
  name: string;
}

export default function WaitlistSuccess({ name }: WaitlistSuccessProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `just joined the waitlist for genUine — an AI that writes LinkedIn messages in your actual voice. worth checking out: https://genuine.so/waitlist`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const greeting = name.trim() ? `you're in, ${name.split(' ')[0]}.` : "you're in.";

  return (
    <>
      <Confetti />
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px 16px',
        }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'var(--terra-tint)',
            border: '1px solid rgba(196,120,74,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--terra)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.polyline
              points="20 6 9 17 4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
            />
          </svg>
        </motion.div>

        <h2
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontSize: 'clamp(30px, 4.5vw, 44px)',
            fontWeight: 600,
            color: 'var(--ink)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 14,
          }}
        >
          {greeting}
        </h2>

        <p
          className="serif-italic"
          style={{
            fontSize: 18,
            color: 'var(--ink-mid)',
            lineHeight: 1.5,
            maxWidth: 380,
            marginBottom: 36,
          }}
        >
          we&apos;ll let you know the moment genUine is ready for you. you&apos;re early — that
          matters.
        </p>

        <div
          style={{
            backgroundColor: 'var(--paper-warm)',
            border: '1px solid var(--ink-whisper)',
            borderRadius: 16,
            padding: '20px 24px',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <p
            className="mono"
            style={{
              fontSize: 11,
              color: 'var(--ink-light)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            know someone stuck on linkedin?
          </p>
          <button
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 20px',
              backgroundColor: copied ? 'var(--terra)' : 'var(--paper)',
              border: `1px solid ${copied ? 'var(--terra)' : 'var(--ink-whisper)'}`,
              borderRadius: 10,
              fontFamily: 'var(--font-jakarta)',
              fontSize: 13,
              color: copied ? 'var(--paper)' : 'var(--ink)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 220ms ease, color 220ms ease, border-color 220ms ease, transform 160ms var(--ease-out)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                share the link
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}
