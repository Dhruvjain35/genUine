'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
 [key: string]: string | string[] | boolean | undefined;
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
 { label: 'your linkedin posts or comments', best: true },
 { label: 'a text or dm you sent' },
 { label: 'an email you sent' },
 { label: 'your linkedin about section' },
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

 useEffect(() => {
 if (streamBoxRef.current) streamBoxRef.current.scrollTop = streamBoxRef.current.scrollHeight;
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

 if (!res.ok || !res.body) throw new Error('Stream failed');

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
 const displayText = fullText.split('[PROFILE_JSON]')[0];
 setStreamText(displayText);
 }
 } catch { /* skip */ }
 }
 }
 }

 const parts = fullText.split('[PROFILE_JSON]');
 let profile: VoiceProfile = {};
 if (parts[1]) {
 try {
 const clean = parts[1].replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
 profile = JSON.parse(clean);
 } catch { /* fallback */ }
 }

 profile.examples = exs;
 setDoneProfile(profile);
 setPhase('done');
 } catch {
 setDoneProfile({ examples: exs });
 setPhase('done');
 }
 };

 const handleProceed = () => {
 if (doneProfile) onComplete(doneProfile, examples);
 };

 const fieldStyle: React.CSSProperties = {
 width: '100%',
 padding: '14px 16px',
 borderRadius: 12,
 border: '1px solid var(--ink-whisper)',
 backgroundColor: 'var(--paper)',
 fontFamily: 'var(--font-dm)',
 fontSize: 14,
 color: 'var(--ink)',
 outline: 'none',
 transition: 'border-color 180ms ease, box-shadow 180ms ease',
 boxSizing: 'border-box',
 };

 const focusOn = (el: HTMLInputElement | HTMLTextAreaElement) => {
 el.style.borderColor = 'var(--ink)';
 el.style.boxShadow = '0 0 0 3px rgba(26,23,20,0.05)';
 };
 const focusOff = (el: HTMLInputElement | HTMLTextAreaElement) => {
 el.style.borderColor = 'var(--ink-whisper)';
 el.style.boxShadow = 'none';
 };

 // STREAMING
 if (phase === 'streaming') {
 return (
 <motion.div
 initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
 style={{ width: '100%', maxWidth: 560 }}
 >
 <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 20 }}>
 , reading your voice
 </p>
 <div
 ref={streamBoxRef}
 className="warm-card"
 style={{
 padding: 28,
 minHeight: 200,
 maxHeight: 340,
 overflowY: 'auto',
 fontFamily: 'var(--font-dm)',
 fontSize: 16,
 color: 'var(--ink)',
 lineHeight: 1.75,
 whiteSpace: 'pre-wrap',
 }}
 >
 {streamText || (
 <span className="serif-italic" style={{ color: 'var(--ink-mid)' }}>
 reading your messages…
 </span>
 )}
 <span className="caret" />
 </div>
 </motion.div>
 );
 }

 // DONE
 if (phase === 'done' && doneProfile) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
 style={{ width: '100%', maxWidth: 560 }}
 >
 <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 20 }}>
 , voice captured
 </p>

 <div
 className="warm-card"
 style={{
 padding: 28,
 fontFamily: 'var(--font-dm)',
 fontSize: 16,
 color: 'var(--ink)',
 lineHeight: 1.75,
 whiteSpace: 'pre-wrap',
 marginBottom: 24,
 }}
 >
 {streamText}
 </div>

 {doneProfile.overallStyle && (
 <div
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: 10,
 padding: '8px 16px',
 borderRadius: 999,
 border: '1px solid var(--ink-whisper)',
 backgroundColor: 'var(--paper-warm)',
 marginBottom: 28,
 }}
 >
 <span
 style={{
 width: 6,
 height: 6,
 borderRadius: '50%',
 backgroundColor: 'var(--terra)',
 display: 'inline-block',
 }}
 />
 <span
 className="serif-italic"
 style={{ fontSize: 14, color: 'var(--ink-mid)' }}
 >
 {doneProfile.overallStyle}
 </span>
 </div>
 )}

 <button
 onClick={handleProceed}
 className="btn-primary"
 style={{ width: '100%', padding: 16, borderRadius: 999, fontSize: 15, fontFamily: 'var(--font-jakarta)' }}
 >
 let&apos;s generate your first message →
 </button>
 </motion.div>
 );
 }

 // CAPTURE
 return (
 <motion.div
 initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
 style={{ width: '100%', maxWidth: 560 }}
 >
 <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 14 }}>
 , voice setup
 </p>
 <h1
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontWeight: 600,
 fontSize: 'clamp(28px, 4.5vw, 44px)',
 color: 'var(--ink)',
 letterSpacing: '-0.03em',
 marginBottom: 12,
 lineHeight: 1.05,
 }}
 >
 let&apos;s find your <span className="serif-italic">voice</span>.
 </h1>
 <p className="serif-italic" style={{ fontSize: 17, color: 'var(--ink-mid)', marginBottom: 32, lineHeight: 1.5 }}>
 the less you think about it, the better the result.
 </p>

 {/* Tabs */}
 <div
 style={{
 display: 'flex',
 padding: 4,
 borderRadius: 999,
 border: '1px solid var(--ink-whisper)',
 backgroundColor: 'var(--paper-warm)',
 marginBottom: 28,
 }}
 >
 {([
 { key: 'paste', label: 'paste something' },
 { key: 'react', label: 'quick reaction' },
 { key: 'skip', label: 'pick a vibe' },
 ] as const).map(({ key, label }) => {
 const active = tab === key;
 return (
 <button
 key={key}
 onClick={() => setTab(key)}
 style={{
 flex: 1,
 padding: '9px 6px',
 borderRadius: 999,
 fontSize: 13,
 fontFamily: 'var(--font-jakarta)',
 fontWeight: 500,
 backgroundColor: active ? 'var(--ink)' : 'transparent',
 color: active ? 'var(--paper)' : 'var(--ink-mid)',
 border: 'none',
 cursor: 'pointer',
 transition: 'background-color 220ms ease, color 220ms ease',
 letterSpacing: '-0.01em',
 }}
 >
 {label}
 </button>
 );
 })}
 </div>

 {/* PASTE */}
 {tab === 'paste' && (
 <div>
 <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 16, lineHeight: 1.6 }}>
 copy a text, dm, linkedin post, email, literally anything you&apos;ve sent. we&apos;ll figure out your style from that.
 </p>

 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
 {SOURCE_CHIPS.map(({ label, best }) => (
 <div
 key={label}
 className="mono"
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: 8,
 padding: '5px 12px',
 borderRadius: 999,
 fontSize: 10,
 letterSpacing: '0.06em',
 textTransform: 'uppercase',
 backgroundColor: best ? 'var(--terra-tint)' : 'var(--paper-warm)',
 color: best ? 'var(--terra)' : 'var(--ink-light)',
 border: `1px solid ${best ? 'rgba(196,120,74,0.3)' : 'var(--ink-whisper)'}`,
 }}
 >
 {label}
 {best && <span style={{ fontWeight: 600 }}>· best</span>}
 </div>
 ))}
 </div>

 <textarea
 value={pastedText}
 onChange={(e) => setPastedText(e.target.value)}
 placeholder={"paste anything you've sent here…\n\neven a quick 'congrats!' works."}
 rows={6}
 style={{ ...fieldStyle, resize: 'vertical', minHeight: 150, marginBottom: 16 }}
 onFocus={(e) => focusOn(e.currentTarget)}
 onBlur={(e) => focusOff(e.currentTarget)}
 />

 <input
 type="text"
 value={userName}
 onChange={(e) => onNameChange(e.target.value)}
 placeholder="your first name (optional)"
 style={{ ...fieldStyle, marginBottom: 16 }}
 onFocus={(e) => focusOn(e.currentTarget)}
 onBlur={(e) => focusOff(e.currentTarget)}
 />

 <button
 onClick={handleAnalyze}
 disabled={!canSubmit}
 className="btn-primary"
 style={{
 width: '100%',
 padding: 16,
 borderRadius: 999,
 fontSize: 15,
 fontFamily: 'var(--font-jakarta)',
 opacity: canSubmit ? 1 : 0.4,
 cursor: canSubmit ? 'pointer' : 'not-allowed',
 }}
 >
 get my voice →
 </button>
 </div>
 )}

 {/* REACT */}
 {tab === 'react' && (
 <div>
 <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 20, lineHeight: 1.6 }}>
 just type what comes out. no wrong answer, 3 words or 3 paragraphs, we&apos;ll work with it.
 </p>

 <div
 className="warm-card"
 style={{ padding: 18, marginBottom: 20 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
 <div
 style={{
 width: 34,
 height: 34,
 borderRadius: '50%',
 backgroundColor: 'var(--paper-warm)',
 border: '1px solid var(--ink-whisper)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 13,
 fontWeight: 600,
 color: 'var(--ink-mid)',
 fontFamily: 'var(--font-jakarta)',
 flexShrink: 0,
 }}
 >
 J
 </div>
 <div>
 <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 1, fontFamily: 'var(--font-jakarta)' }}>
 Jamie
 </p>
 <p className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>
 just now
 </p>
 </div>
 </div>
 <p
 style={{
 fontSize: 14,
 color: 'var(--ink)',
 lineHeight: 1.6,
 fontFamily: 'var(--font-dm)',
 }}
 >
 omg i just got the job!! starting next month, honestly couldn&apos;t have done it without your help
 </p>
 </div>

 <p className="serif-italic" style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 10 }}>
 how do you reply? ↓
 </p>

 <textarea
 value={reactionText}
 onChange={(e) => setReactionText(e.target.value)}
 placeholder="type your reply…"
 rows={4}
 style={{ ...fieldStyle, resize: 'vertical', minHeight: 110, marginBottom: 16 }}
 onFocus={(e) => focusOn(e.currentTarget)}
 onBlur={(e) => focusOff(e.currentTarget)}
 />

 <input
 type="text"
 value={userName}
 onChange={(e) => onNameChange(e.target.value)}
 placeholder="your first name (optional)"
 style={{ ...fieldStyle, marginBottom: 16 }}
 onFocus={(e) => focusOn(e.currentTarget)}
 onBlur={(e) => focusOff(e.currentTarget)}
 />

 <button
 onClick={handleAnalyze}
 disabled={!canSubmit}
 className="btn-primary"
 style={{
 width: '100%',
 padding: 16,
 borderRadius: 999,
 fontSize: 15,
 fontFamily: 'var(--font-jakarta)',
 opacity: canSubmit ? 1 : 0.4,
 cursor: canSubmit ? 'pointer' : 'not-allowed',
 }}
 >
 get my voice →
 </button>
 </div>
 )}

 {/* SKIP */}
 {tab === 'skip' && (
 <div>
 <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 20, lineHeight: 1.6 }}>
 new to linkedin? no worries, just pick your vibe and we&apos;ll handle the rest. you can always refine later.
 </p>

 <input
 type="text"
 value={userName}
 onChange={(e) => onNameChange(e.target.value)}
 placeholder="your first name (optional)"
 style={{ ...fieldStyle, marginBottom: 20 }}
 onFocus={(e) => focusOn(e.currentTarget)}
 onBlur={(e) => focusOff(e.currentTarget)}
 />

 <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
 {SKIP_TONES.map(({ value, label, desc }) => {
 const active = skipTone === value;
 return (
 <button
 key={value}
 onClick={() => setSkipTone(value)}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 padding: '16px 20px',
 borderRadius: 14,
 border: `1px solid ${active ? 'var(--ink)' : 'var(--ink-whisper)'}`,
 backgroundColor: active ? 'var(--ink)' : 'var(--paper)',
 color: active ? 'var(--paper)' : 'var(--ink)',
 cursor: 'pointer',
 transition: 'background-color 220ms ease, color 220ms ease, border-color 220ms ease, transform 180ms var(--ease-out)',
 textAlign: 'left',
 width: '100%',
 }}
 onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.99)'; }}
 onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
 onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
 >
 <div>
 <p
 style={{
 fontSize: 15,
 fontWeight: 500,
 fontFamily: 'var(--font-jakarta)',
 marginBottom: 4,
 letterSpacing: '-0.01em',
 }}
 >
 {label}
 </p>
 <p
 className="serif-italic"
 style={{
 fontSize: 13,
 color: active ? 'rgba(250,248,244,0.7)' : 'var(--ink-mid)',
 }}
 >
 {desc}
 </p>
 </div>
 <div
 style={{
 width: 20,
 height: 20,
 borderRadius: '50%',
 border: `1.5px solid ${active ? 'var(--paper)' : 'var(--ink-whisper)'}`,
 backgroundColor: active ? 'var(--paper)' : 'transparent',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 flexShrink: 0,
 }}
 >
 {active && (
 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 )}
 </div>
 </button>
 );
 })}
 </div>

 <button
 onClick={() => skipTone && onSkip(skipTone)}
 disabled={!skipTone}
 className="btn-primary"
 style={{
 width: '100%',
 padding: 16,
 borderRadius: 999,
 fontSize: 15,
 fontFamily: 'var(--font-jakarta)',
 opacity: skipTone ? 1 : 0.4,
 cursor: skipTone ? 'pointer' : 'not-allowed',
 }}
 >
 start generating →
 </button>
 </div>
 )}
 </motion.div>
 );
}
