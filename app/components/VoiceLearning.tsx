'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCENARIOS = [
 {
 context: 'a text from your friend',
 sender: 'Jamie',
 message: "omg i just got the job!! starting next month, honestly couldn't have done it without your help",
 prompt: 'how do you reply?',
 type: 'text' as const,
 },
 {
 context: 'a linkedin message',
 sender: 'Alex Chen',
 senderRole: '2nd · Product Manager',
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
 const [allAnswers, setAllAnswers] = useState<string[]>(Array(SCENARIOS.length).fill(''));
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

 const handleBack = () => {
 if (step === 0 || phase !== 'question') return;
 setInput(allAnswers[step - 1]);
 setStep((s) => s - 1);
 };

 const handleSubmit = () => {
 const trimmed = input.trim();
 if (!trimmed || phase !== 'question') return;

 const updated = [...allAnswers];
 updated[step] = trimmed;
 setAllAnswers(updated);

 setUserBubble(trimmed);
 setInput('');
 setPhase('submitted');

 setTimeout(() => {
 if (step < SCENARIOS.length - 1) {
 setInput(updated[step + 1] || '');
 setStep((s) => s + 1);
 setUserBubble('');
 setPhase('question');
 } else {
 setPhase('analyzing');
 onComplete(updated.filter(Boolean));
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

 const previewTiles = [
 { num: '01', label: 'text message' },
 { num: '02', label: 'linkedin dm' },
 { num: '03', label: 'post comment' },
 ];

 return (
 <div
 style={{
 flex: 1,
 backgroundColor: 'var(--paper)',
 padding: '32px 20px',
 overflow: 'hidden',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 }}
 >
 {phase === 'intro' && (
 <motion.div
 initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
 style={{ width: '100%', maxWidth: 400 }}
 >
 <div
 className="mono"
 style={{
 fontSize: 11,
 textAlign: 'center',
 letterSpacing: '0.12em',
 textTransform: 'uppercase',
 color: 'var(--terra)',
 marginBottom: 18,
 }}
 >
 quick setup
 </div>

 <h1
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 'clamp(24px, 5vw, 30px)',
 fontWeight: 600,
 textAlign: 'center',
 color: 'var(--ink)',
 lineHeight: 1.15,
 letterSpacing: '-0.02em',
 marginBottom: 14,
 }}
 >
 let&apos;s learn how you <span className="serif-italic" style={{ color: 'var(--terra)' }}>actually</span> talk
 </h1>

 <p
 style={{
 fontSize: 15,
 textAlign: 'center',
 color: 'var(--ink-mid)',
 lineHeight: 1.6,
 marginBottom: 32,
 }}
 >
 three quick scenarios. just respond how you naturally would.
 no right answer, the messier the better.
 </p>

 <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
 {previewTiles.map((item, i) => (
 <div
 key={i}
 style={{
 flex: 1,
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 gap: 8,
 padding: '18px 10px',
 borderRadius: 14,
 backgroundColor: 'var(--paper-warm)',
 border: '1px solid var(--ink-whisper)',
 }}
 >
 <span
 className="mono"
 style={{ fontSize: 11, color: 'var(--terra)', letterSpacing: '0.06em' }}
 >
 {item.num}
 </span>
 <span style={{ fontSize: 11, color: 'var(--ink-mid)', textAlign: 'center' }}>
 {item.label}
 </span>
 </div>
 ))}
 </div>

 <button
 onClick={handleStart}
 className="btn-primary"
 style={{ width: '100%', padding: '14px 20px', fontSize: 14 }}
 >
 let&apos;s do it →
 </button>

 <p
 className="mono"
 style={{
 fontSize: 10,
 textAlign: 'center',
 marginTop: 14,
 color: 'var(--ink-light)',
 letterSpacing: '0.08em',
 textTransform: 'uppercase',
 }}
 >
 takes about 60 seconds
 </p>
 </motion.div>
 )}

 {(phase === 'question' || phase === 'submitted') && (
 <motion.div
 key={step}
 initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
 style={{ width: '100%', maxWidth: 420 }}
 >
 <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
 {SCENARIOS.map((_, i) => (
 <div
 key={i}
 style={{
 flex: i === step ? 2 : 1,
 height: 2,
 borderRadius: 2,
 backgroundColor: i <= step ? 'var(--terra)' : 'var(--ink-whisper)',
 opacity: i < step ? 0.4 : 1,
 transition: 'flex 0.4s ease, background-color 0.3s ease',
 }}
 />
 ))}
 </div>

 <div
 className="mono"
 style={{
 fontSize: 11,
 letterSpacing: '0.12em',
 textTransform: 'uppercase',
 color: 'var(--terra)',
 marginBottom: 14,
 }}
 >
 {scenario.context}
 </div>

 <div style={{ marginBottom: 14 }}>
 {scenario.type === 'text' && (
 <div style={{ maxWidth: '86%' }}>
 <div
 style={{
 fontSize: 14,
 padding: '12px 16px',
 borderRadius: 18,
 borderTopLeftRadius: 4,
 backgroundColor: 'var(--paper-warm)',
 color: 'var(--ink)',
 lineHeight: 1.55,
 border: '1px solid var(--ink-whisper)',
 }}
 >
 {scenario.message}
 </div>
 <div className="mono" style={{ fontSize: 10, marginTop: 6, marginLeft: 4, color: 'var(--ink-light)', letterSpacing: '0.06em' }}>
 {scenario.sender} · now
 </div>
 </div>
 )}

 {scenario.type === 'linkedin' && (
 <div
 style={{
 borderRadius: 14,
 padding: 16,
 backgroundColor: 'var(--paper)',
 border: '1px solid var(--ink-whisper)',
 borderLeft: '3px solid var(--terra)',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
 <div
 style={{
 width: 36,
 height: 36,
 borderRadius: '50%',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 13,
 fontWeight: 600,
 color: 'var(--paper)',
 backgroundColor: 'var(--ink)',
 flexShrink: 0,
 }}
 >
 {scenario.sender[0]}
 </div>
 <div>
 <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{scenario.sender}</div>
 <div className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>
 {scenario.senderRole}
 </div>
 </div>
 </div>
 <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
 {scenario.message}
 </p>
 </div>
 )}

 {scenario.type === 'post' && (
 <div
 style={{
 borderRadius: 14,
 padding: 16,
 backgroundColor: 'var(--paper)',
 border: '1px solid var(--ink-whisper)',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
 <div
 style={{
 width: 36,
 height: 36,
 borderRadius: '50%',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 13,
 fontWeight: 600,
 color: 'var(--paper)',
 backgroundColor: 'var(--terra)',
 flexShrink: 0,
 }}
 >
 {scenario.sender[0]}
 </div>
 <div>
 <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{scenario.sender}</div>
 <div className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>
 {scenario.senderRole}
 </div>
 </div>
 </div>
 <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
 {scenario.message}
 </p>
 <div
 className="mono"
 style={{ fontSize: 10, marginTop: 12, paddingTop: 10, color: 'var(--ink-light)', borderTop: '1px solid var(--ink-whisper)', letterSpacing: '0.06em' }}
 >
 linkedin · just now · 47 reactions
 </div>
 </div>
 )}
 </div>

 <AnimatePresence>
 {phase === 'submitted' && userBubble && (
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 6 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
 style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}
 >
 <div
 style={{
 fontSize: 14,
 padding: '12px 16px',
 borderRadius: 18,
 borderTopRightRadius: 4,
 backgroundColor: 'var(--ink)',
 color: 'var(--paper)',
 maxWidth: '82%',
 lineHeight: 1.55,
 }}
 >
 {userBubble}
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {phase === 'question' && (
 <div>
 <p
 className="serif-italic"
 style={{
 fontSize: 16,
 marginBottom: 12,
 color: 'var(--ink-soft)',
 }}
 >
 {scenario.prompt}
 </p>

 <div
 style={{
 display: 'flex',
 alignItems: 'flex-end',
 gap: 8,
 borderRadius: 14,
 padding: '10px 14px',
 backgroundColor: 'var(--paper)',
 border: '1px solid var(--ink-whisper)',
 transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
 }}
 onFocusCapture={(e) => {
 const el = e.currentTarget as HTMLDivElement;
 el.style.borderColor = 'var(--ink-soft)';
 el.style.boxShadow = '0 0 0 3px rgba(26,23,20,0.05)';
 }}
 onBlurCapture={(e) => {
 const el = e.currentTarget as HTMLDivElement;
 el.style.borderColor = 'var(--ink-whisper)';
 el.style.boxShadow = 'none';
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
 style={{
 flex: 1,
 resize: 'none',
 backgroundColor: 'transparent',
 border: 'none',
 outline: 'none',
 fontSize: 14,
 fontFamily: 'var(--font-dm-sans)',
 color: 'var(--ink)',
 minHeight: 24,
 maxHeight: 80,
 paddingTop: 4,
 lineHeight: 1.5,
 }}
 />

 <button
 onClick={handleSubmit}
 disabled={!input.trim()}
 style={{
 flexShrink: 0,
 width: 36,
 height: 36,
 borderRadius: '50%',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 border: 'none',
 backgroundColor: input.trim() ? 'var(--ink)' : 'var(--ink-whisper)',
 color: input.trim() ? 'var(--paper)' : 'var(--ink-light)',
 cursor: input.trim() ? 'pointer' : 'default',
 transition: 'background-color 0.2s ease, transform 160ms ease',
 }}
 onMouseDown={(e) => { if (input.trim()) e.currentTarget.style.transform = 'scale(0.94)'; }}
 onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
 onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
 >
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <line x1="22" y1="2" x2="11" y2="13" />
 <polygon points="22 2 15 22 11 13 2 9 22 2" />
 </svg>
 </button>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
 {step > 0 ? (
 <button
 onClick={handleBack}
 className="mono"
 style={{
 fontSize: 11,
 background: 'none',
 border: 'none',
 cursor: 'pointer',
 color: 'var(--ink-light)',
 letterSpacing: '0.06em',
 transition: 'color 0.15s ease',
 }}
 onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-soft)')}
 onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-light)')}
 >
 ← back
 </button>
 ) : <div />}
 <p
 className="mono"
 style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
 >
 enter to send · be yourself
 </p>
 </div>
 </div>
 )}
 </motion.div>
 )}

 {phase === 'analyzing' && (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
 style={{ textAlign: 'center' }}
 >
 <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
 {[0, 1, 2].map((i) => (
 <motion.span
 key={i}
 animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
 transition={{ duration: 1.05, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
 style={{
 width: 7,
 height: 7,
 borderRadius: '50%',
 backgroundColor: 'var(--terra)',
 display: 'inline-block',
 }}
 />
 ))}
 </div>
 <p
 className="serif-italic"
 style={{ fontSize: 18, color: 'var(--ink-soft)', marginBottom: 6 }}
 >
 reading your vibe...
 </p>
 <p
 className="mono"
 style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
 >
 this takes a second
 </p>
 </motion.div>
 )}
 </div>
 );
}
