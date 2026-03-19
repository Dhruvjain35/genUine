'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-btn flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${className}`}
      style={{
        borderColor: copied ? '#F0A824' : '#DCDCDC',
        color: copied ? '#F0A824' : '#888',
        backgroundColor: copied ? 'rgba(240, 168, 36, 0.06)' : 'transparent',
      }}
      title="Copy message"
    >
      {copied ? (
        <>
          <span className="check-in" style={{ display: 'inline-block' }}>✓</span>
          <span>copied!</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span>copy</span>
        </>
      )}
    </button>
  );
}
