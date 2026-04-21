'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ScrollProgress from '../components/ScrollProgress';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedHeading from '../components/AnimatedHeading';

interface VoiceProfile {
 tone?: string;
 energy?: string;
 style?: string;
 overallStyle?: string;
 pattern?: string;
 skipped?: boolean;
 [key: string]: string | string[] | boolean | undefined;
}

interface HistoryEntry {
 id: number;
 date: string;
 rawProfile: string;
 recipientType: string | null;
 messageA: string;
 messageB: string;
}

function CopyBtn({ text }: { text: string }) {
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
 padding: '6px 12px',
 borderRadius: 8,
 border: `1px solid ${copied ? 'var(--terra)' : 'var(--ink-whisper)'}`,
 backgroundColor: copied ? 'var(--terra-tint)' : 'transparent',
 color: copied ? 'var(--terra)' : 'var(--ink-mid)',
 fontSize: 11,
 fontWeight: 500,
 fontFamily: 'var(--font-jakarta)',
 letterSpacing: '0.02em',
 cursor: 'pointer',
 transition: 'background-color 220ms ease, color 220ms ease, border-color 220ms ease',
 }}
 >
 {copied ? '✓ copied' : 'copy'}
 </button>
 );
}

function formatDate(iso: string) {
 const d = new Date(iso);
 return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getProfilePreview(rawProfile: string) {
 const firstLine = rawProfile.split('\n')[0]?.trim();
 return firstLine?.length > 60 ? firstLine.slice(0, 57) + '…' : firstLine || 'unknown person';
}

export default function DashboardPage() {
 const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
 const [history, setHistory] = useState<HistoryEntry[]>([]);
 const [messagesUsed, setMessagesUsed] = useState(0);
 const [isPro, setIsPro] = useState(false);
 const [isAdmin, setIsAdmin] = useState(false);
 const [search, setSearch] = useState('');
 const [expandedId, setExpandedId] = useState<number | null>(null);

 useEffect(() => {
 try {
 const vp = localStorage.getItem('genuine_voice_profile');
 if (vp) setVoiceProfile(JSON.parse(vp));

 const hist = localStorage.getItem('genuine_message_history');
 if (hist) setHistory(JSON.parse(hist));

 const count = localStorage.getItem('genuine_messages_today');
 const date = localStorage.getItem('genuine_last_reset_date');
 const today = new Date().toDateString();
 if (date === today && count) setMessagesUsed(parseInt(count, 10));

 if (localStorage.getItem('genuine_is_pro') === 'true') setIsPro(true);
 if (localStorage.getItem('genuine_admin') === 'true') setIsAdmin(true);
 } catch {
 /* silent */
 }
 }, []);

 const handleClearVoice = () => {
 if (!confirm("reset your voice profile? you'll need to set it up again.")) return;
 localStorage.removeItem('genuine_voice_profile');
 setVoiceProfile(null);
 };

 const filteredHistory = history.filter(
 (h) =>
 search.trim() === '' || h.rawProfile.toLowerCase().includes(search.toLowerCase())
 );

 const FREE_LIMIT = 3;
 const messagesRemaining = isPro || isAdmin ? null : Math.max(0, FREE_LIMIT - messagesUsed);

 const stats = [
 {
 label: 'messages today',
 value: isAdmin || isPro ? '∞' : `${messagesUsed} / ${FREE_LIMIT}`,
 sub: isAdmin ? 'admin mode' : isPro ? 'unlimited · pro' : `${messagesRemaining} left`,
 },
 {
 label: 'all time',
 value: String(history.length),
 sub: 'messages generated',
 },
 {
 label: 'voice profile',
 value: voiceProfile ? 'set' : '',
 sub: voiceProfile ? 'saved' : 'not set',
 },
 {
 label: 'plan',
 value: isAdmin ? 'admin' : isPro ? 'pro' : 'free',
 sub: isAdmin ? 'unlimited access' : isPro ? 'unlimited messages' : '3 messages/day',
 },
 ];

 return (
 <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)' }}>
 <ScrollProgress />
 <SiteHeader activePage="dashboard" />

 {/* Header */}
 <section style={{ padding: '140px 24px 40px', position: 'relative', overflow: 'hidden' }}>
 <div
 aria-hidden
 style={{
 position: 'absolute',
 inset: 0,
 background:
 'radial-gradient(900px 400px at 10% 0%, rgba(196,120,74,0.08), transparent 60%)',
 pointerEvents: 'none',
 }}
 />
 <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
 <ScrollReveal>
 <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 14 }}>
 , dashboard
 </p>
 </ScrollReveal>
 <AnimatedHeading
 as="h1"
 text="your genUine, at a glance."
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 'clamp(36px, 6vw, 72px)',
 fontWeight: 700,
 letterSpacing: '-0.035em',
 lineHeight: 1.0,
 color: 'var(--ink)',
 marginBottom: 16,
 }}
 />
 <ScrollReveal delay={140}>
 <p
 className="serif-italic"
 style={{
 fontSize: 'clamp(18px, 2vw, 22px)',
 color: 'var(--ink-mid)',
 lineHeight: 1.4,
 }}
 >
 everything in one place.
 </p>
 </ScrollReveal>
 </div>
 </section>

 {/* Stats grid */}
 <section style={{ padding: '40px 24px 56px' }}>
 <div style={{ maxWidth: 1100, margin: '0 auto' }}>
 <div
 style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
 borderTop: '1px solid var(--ink-whisper)',
 borderLeft: '1px solid var(--ink-whisper)',
 }}
 >
 {stats.map((s, i) => (
 <ScrollReveal key={s.label} delay={i * 60}>
 <div
 style={{
 padding: '32px 28px',
 borderRight: '1px solid var(--ink-whisper)',
 borderBottom: '1px solid var(--ink-whisper)',
 height: '100%',
 display: 'flex',
 flexDirection: 'column',
 justifyContent: 'space-between',
 gap: 24,
 minHeight: 180,
 }}
 >
 <span
 className="mono"
 style={{
 fontSize: 11,
 color: 'var(--ink-light)',
 letterSpacing: '0.1em',
 textTransform: 'uppercase',
 }}
 >
 {s.label}
 </span>
 <div>
 <p
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 44,
 fontWeight: 700,
 color: 'var(--ink)',
 letterSpacing: '-0.03em',
 lineHeight: 1,
 marginBottom: 8,
 }}
 >
 {s.value}
 </p>
 <p
 className="serif-italic"
 style={{
 fontSize: 14,
 color: 'var(--ink-mid)',
 }}
 >
 {s.sub}
 </p>
 </div>
 </div>
 </ScrollReveal>
 ))}
 </div>
 </div>
 </section>

 {/* Voice profile */}
 <section style={{ padding: '40px 24px' }}>
 <div style={{ maxWidth: 1100, margin: '0 auto' }}>
 <ScrollReveal>
 <div
 style={{
 display: 'flex',
 alignItems: 'baseline',
 justifyContent: 'space-between',
 marginBottom: 20,
 }}
 >
 <p className="eyebrow" style={{ color: 'var(--terra)' }}>
 , your voice profile
 </p>
 </div>
 <div className="warm-card" style={{ padding: 32 }}>
 {voiceProfile ? (
 <>
 <div
 style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
 gap: 16,
 marginBottom: 24,
 }}
 >
 {[
 { label: 'tone', value: voiceProfile.tone },
 { label: 'energy', value: voiceProfile.energy },
 { label: 'style', value: voiceProfile.style || voiceProfile.overallStyle },
 { label: 'pattern', value: voiceProfile.pattern },
 ]
 .filter((r) => r.value)
 .map((row) => (
 <div
 key={row.label}
 style={{
 padding: 16,
 backgroundColor: 'var(--paper)',
 borderRadius: 12,
 border: '1px solid var(--ink-whisper)',
 }}
 >
 <p
 className="mono"
 style={{
 fontSize: 10,
 color: 'var(--terra)',
 letterSpacing: '0.1em',
 textTransform: 'uppercase',
 marginBottom: 6,
 }}
 >
 {row.label}
 </p>
 <p
 style={{
 fontSize: 14,
 color: 'var(--ink)',
 fontFamily: 'var(--font-dm)',
 lineHeight: 1.5,
 }}
 >
 {String(row.value)}
 </p>
 </div>
 ))}
 </div>
 <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
 <Link href="/app" style={{ textDecoration: 'none' }}>
 <button
 className="btn-primary"
 style={{ padding: '10px 22px', borderRadius: 999, fontSize: 13 }}
 >
 use it →
 </button>
 </Link>
 <button
 onClick={handleClearVoice}
 className="btn-ghost"
 style={{ padding: '10px 20px', borderRadius: 999, fontSize: 13 }}
 >
 reset voice
 </button>
 </div>
 </>
 ) : (
 <div style={{ textAlign: 'center', padding: '24px 0' }}>
 <p
 className="serif-italic"
 style={{ fontSize: 18, color: 'var(--ink-mid)', marginBottom: 20 }}
 >
 no voice profile yet. set one up to get started.
 </p>
 <Link href="/app" style={{ textDecoration: 'none' }}>
 <button
 className="btn-primary"
 style={{ padding: '12px 28px', borderRadius: 999, fontSize: 14 }}
 >
 set up my voice →
 </button>
 </Link>
 </div>
 )}
 </div>
 </ScrollReveal>
 </div>
 </section>

 {/* Message history */}
 <section style={{ padding: '40px 24px' }}>
 <div style={{ maxWidth: 1100, margin: '0 auto' }}>
 <ScrollReveal>
 <div
 style={{
 display: 'flex',
 alignItems: 'baseline',
 justifyContent: 'space-between',
 marginBottom: 20,
 }}
 >
 <p className="eyebrow" style={{ color: 'var(--terra)' }}>
 , message history
 </p>
 <span className="mono" style={{ fontSize: 11, color: 'var(--ink-light)' }}>
 {history.length} total
 </span>
 </div>

 {history.length > 0 && (
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="search by name or profile…"
 style={{
 width: '100%',
 padding: '14px 18px',
 borderRadius: 12,
 border: '1px solid var(--ink-whisper)',
 backgroundColor: 'var(--paper-warm)',
 fontFamily: 'var(--font-dm)',
 fontSize: 14,
 color: 'var(--ink)',
 outline: 'none',
 marginBottom: 16,
 boxSizing: 'border-box',
 transition: 'border-color 180ms ease',
 }}
 onFocus={(e) => {
 e.target.style.borderColor = 'var(--ink)';
 }}
 onBlur={(e) => {
 e.target.style.borderColor = 'var(--ink-whisper)';
 }}
 />
 )}

 {filteredHistory.length === 0 ? (
 <div
 className="warm-card"
 style={{ textAlign: 'center', padding: 48 }}
 >
 <p
 className="serif-italic"
 style={{ fontSize: 18, color: 'var(--ink-mid)', marginBottom: 20 }}
 >
 {history.length === 0 ? 'no messages generated yet.' : 'no results found.'}
 </p>
 {history.length === 0 && (
 <Link href="/app" style={{ textDecoration: 'none' }}>
 <button
 className="btn-primary"
 style={{ padding: '12px 28px', borderRadius: 999, fontSize: 14 }}
 >
 write your first message →
 </button>
 </Link>
 )}
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 {filteredHistory.map((entry) => {
 const open = expandedId === entry.id;
 return (
 <div
 key={entry.id}
 className="warm-card"
 style={{ padding: 20, overflow: 'hidden' }}
 >
 <button
 onClick={() => setExpandedId(open ? null : entry.id)}
 style={{
 width: '100%',
 display: 'flex',
 alignItems: 'flex-start',
 justifyContent: 'space-between',
 gap: 12,
 background: 'none',
 border: 'none',
 cursor: 'pointer',
 textAlign: 'left',
 padding: 0,
 }}
 >
 <div style={{ minWidth: 0 }}>
 <p
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontWeight: 500,
 fontSize: 16,
 color: 'var(--ink)',
 marginBottom: 6,
 overflow: 'hidden',
 textOverflow: 'ellipsis',
 whiteSpace: 'nowrap',
 letterSpacing: '-0.01em',
 }}
 >
 {getProfilePreview(entry.rawProfile)}
 </p>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
 <span
 className="mono"
 style={{ fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.04em' }}
 >
 {formatDate(entry.date)}
 </span>
 {entry.recipientType && (
 <span
 className="mono"
 style={{
 fontSize: 10,
 color: 'var(--terra)',
 border: '1px solid rgba(196,120,74,0.3)',
 backgroundColor: 'var(--terra-tint)',
 padding: '2px 8px',
 borderRadius: 999,
 letterSpacing: '0.08em',
 textTransform: 'uppercase',
 }}
 >
 {entry.recipientType}
 </span>
 )}
 </div>
 </div>
 <span
 aria-hidden
 style={{
 flexShrink: 0,
 width: 26,
 height: 26,
 borderRadius: '50%',
 border: '1px solid var(--ink-whisper)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: 16,
 lineHeight: 1,
 color: 'var(--ink-mid)',
 transition: 'transform 280ms var(--ease-out), background-color 220ms ease, color 220ms ease',
 transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
 backgroundColor: open ? 'var(--ink)' : 'transparent',
 }}
 >
 <span style={{ color: open ? 'var(--paper)' : 'inherit' }}>+</span>
 </span>
 </button>

 <AnimatePresence initial={false}>
 {open && (
 <motion.div
 key="content"
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
 style={{ overflow: 'hidden' }}
 >
 <div
 style={{
 marginTop: 20,
 paddingTop: 20,
 borderTop: '1px solid var(--ink-whisper)',
 }}
 >
 {entry.messageA && (
 <div style={{ marginBottom: 16 }}>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 marginBottom: 10,
 }}
 >
 <span
 className="eyebrow"
 style={{ color: 'var(--terra)', fontSize: 10 }}
 >
 , common ground
 </span>
 <CopyBtn text={entry.messageA} />
 </div>
 <p
 style={{
 fontSize: 14,
 color: 'var(--ink)',
 lineHeight: 1.7,
 fontFamily: 'var(--font-dm)',
 backgroundColor: 'var(--paper)',
 padding: 16,
 borderRadius: 12,
 border: '1px solid var(--ink-whisper)',
 }}
 >
 {entry.messageA}
 </p>
 </div>
 )}
 {entry.messageB && (
 <div>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 marginBottom: 10,
 }}
 >
 <span
 className="eyebrow"
 style={{ color: 'var(--ink-mid)', fontSize: 10 }}
 >
 , genuine curiosity
 </span>
 <CopyBtn text={entry.messageB} />
 </div>
 <p
 style={{
 fontSize: 14,
 color: 'var(--ink)',
 lineHeight: 1.7,
 fontFamily: 'var(--font-dm)',
 backgroundColor: 'var(--paper)',
 padding: 16,
 borderRadius: 12,
 border: '1px solid var(--ink-whisper)',
 }}
 >
 {entry.messageB}
 </p>
 </div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </div>
 )}
 </ScrollReveal>
 </div>
 </section>

 {/* Account */}
 <section style={{ padding: '40px 24px 120px' }}>
 <div style={{ maxWidth: 1100, margin: '0 auto' }}>
 <ScrollReveal>
 <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 20 }}>
 , account
 </p>
 <div className="warm-card" style={{ padding: 28 }}>
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 flexWrap: 'wrap',
 gap: 16,
 }}
 >
 <div>
 <p
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontWeight: 600,
 fontSize: 18,
 color: 'var(--ink)',
 letterSpacing: '-0.015em',
 marginBottom: 6,
 }}
 >
 {isAdmin ? 'admin' : isPro ? 'pro plan' : 'free plan'}
 </p>
 <p
 className="serif-italic"
 style={{ fontSize: 15, color: 'var(--ink-mid)' }}
 >
 {isAdmin
 ? 'unlimited access across all features'
 : isPro
 ? 'unlimited messages, all features unlocked'
 : '3 messages per day, voice saving included'}
 </p>
 </div>
 {!isPro && !isAdmin && (
 <Link href="/pricing" style={{ textDecoration: 'none' }}>
 <button
 className="btn-primary"
 style={{ padding: '12px 24px', borderRadius: 999, fontSize: 13 }}
 >
 go pro →
 </button>
 </Link>
 )}
 </div>
 </div>
 </ScrollReveal>
 </div>
 </section>

 <SiteFooter />
 </div>
 );
}
