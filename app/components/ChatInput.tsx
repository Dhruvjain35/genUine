'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

const TONES = ['casual', 'formal', 'curious'] as const;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  messagesRemaining: number;
  tone?: string;
  onToneChange?: (tone: string) => void;
}

export default function ChatInput({ onSend, disabled, messagesRemaining, tone, onToneChange }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = 4 * 24 + 24; // ~4 lines
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  }, [value]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('voice input not supported in this browser. try chrome or edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => (prev ? prev + ' ' + transcript : transcript));
      textareaRef.current?.focus();
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  return (
    <div
      className="flex-shrink-0 px-4 py-3"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #DCDCDC',
      }}
    >
      {/* Tone selector — shown when onToneChange is wired up */}
      {onToneChange && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs" style={{ color: '#CCCCCC', flexShrink: 0 }}>tone</span>
          <div className="flex gap-1.5 flex-wrap">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => onToneChange(tone === t ? '' : t)}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor: tone === t ? '#F0A824' : 'transparent',
                  color: tone === t ? '#FFFFFF' : '#AAAAAA',
                  border: `1px solid ${tone === t ? '#F0A824' : '#DCDCDC'}`,
                  transition: 'all 0.15s ease',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-2.5"
        style={{
          backgroundColor: '#F5F5F5',
          border: '1.5px solid #DCDCDC',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onFocusCapture={(e) => {
          const container = e.currentTarget as HTMLDivElement;
          container.style.borderColor = '#F0A824';
          container.style.boxShadow = '0 0 0 3px rgba(240, 168, 36, 0.12)';
        }}
        onBlurCapture={(e) => {
          const container = e.currentTarget as HTMLDivElement;
          container.style.borderColor = '#DCDCDC';
          container.style.boxShadow = 'none';
        }}
      >
        {/* Mic button */}
        <button
          onClick={toggleVoice}
          disabled={disabled || messagesRemaining <= 0}
          title={isListening ? 'stop recording' : 'speak your message'}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isListening ? 'rgba(240, 168, 36, 0.15)' : 'transparent',
            color: isListening ? '#F0A824' : '#AAAAAA',
            transition: 'all 0.2s ease',
            border: isListening ? '1.5px solid rgba(240, 168, 36, 0.4)' : '1.5px solid transparent',
          }}
        >
          {isListening ? (
            // Pulsing stop icon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          ) : (
            // Mic icon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? 'listening...'
              : disabled
              ? 'genUine is thinking...'
              : messagesRemaining <= 0
              ? "you've hit the daily limit — come back tomorrow!"
              : 'type a message...'
          }
          disabled={disabled || messagesRemaining <= 0}
          rows={1}
          className="flex-1 resize-none text-sm leading-relaxed bg-transparent border-none outline-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: '#1F1F1F',
            maxHeight: '120px',
            minHeight: '24px',
            paddingTop: '4px',
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled || messagesRemaining <= 0}
          className="send-btn flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            backgroundColor:
              value.trim() && !disabled && messagesRemaining > 0
                ? '#F0A824'
                : '#DCDCDC',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
          title="Send message"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Hint */}
      <p
        className="text-xs text-center mt-2"
        style={{ color: '#BBBBBB' }}
      >
        {isListening ? (
          <span style={{ color: '#F0A824' }}>listening — speak now, tap the mic to stop</span>
        ) : (
          <>
            enter to send · shift+enter for new line
            {messagesRemaining <= 3 && messagesRemaining > 0 && (
              <span style={{ color: '#F0A824' }}>
                {' '}· {messagesRemaining} message{messagesRemaining !== 1 ? 's' : ''} left today
              </span>
            )}
          </>
        )}
      </p>
    </div>
  );
}
