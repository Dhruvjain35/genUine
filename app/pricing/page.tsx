'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedHeading from '../components/AnimatedHeading';
import Magnetic from '../components/Magnetic';
import ScrollProgress from '../components/ScrollProgress';

const FREE_FEATURES = [
 '3 messages per day',
 'voice saving, set it once',
 'profile analysis',
 'common ground + curiosity angles',
 'copy button',
];

const PRO_FEATURES = [
 'unlimited messages',
 'advanced voice matching',
 'personality profiles by recipient type',
 'priority support',
 'early access to new features',
 'everything in free',
];

function Check({ color = 'var(--terra)' }: { color?: string }) {
 return (
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 );
}

export default function PricingPage() {
 const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

 return (
 <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
 <ScrollProgress />
 <SiteHeader activePage="pricing" />

 {/* Hero */}
 <section style={{ padding: '140px 24px 60px', position: 'relative', overflow: 'hidden' }}>
 <div
 aria-hidden
 style={{
 position: 'absolute',
 inset: 0,
 background:
 'radial-gradient(800px 400px at 20% 0%, rgba(196,120,74,0.08), transparent 60%)',
 pointerEvents: 'none',
 }}
 />
 <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
 <ScrollReveal>
 <div
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: 10,
 padding: '6px 14px',
 borderRadius: 999,
 border: '1px solid var(--ink-whisper)',
 backgroundColor: 'var(--paper-warm)',
 marginBottom: 24,
 }}
 >
 <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--terra)', display: 'inline-block' }} />
 <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mid)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
 launching soon · waitlist = early access
 </span>
 </div>
 </ScrollReveal>

 <ScrollReveal delay={60}>
 <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 16 }}>
 , pricing
 </p>
 </ScrollReveal>

 <AnimatedHeading
 as="h1"
 text="start free. go pro when you're ready."
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 'clamp(40px, 6.5vw, 76px)',
 fontWeight: 700,
 letterSpacing: '-0.035em',
 lineHeight: 1.0,
 color: 'var(--ink)',
 marginBottom: 22,
 maxWidth: 900,
 marginInline: 'auto',
 }}
 />

 <ScrollReveal delay={180}>
 <p
 className="serif-italic"
 style={{
 fontSize: 'clamp(20px, 2vw, 26px)',
 color: 'var(--ink-mid)',
 lineHeight: 1.4,
 maxWidth: 560,
 margin: '0 auto 40px',
 }}
 >
 3 free messages a day, forever. unlimited when you&apos;re serious about it.
 </p>
 </ScrollReveal>

 {/* Billing toggle */}
 <ScrollReveal delay={240}>
 <div
 style={{
 display: 'inline-flex',
 padding: 4,
 borderRadius: 999,
 border: '1px solid var(--ink-whisper)',
 backgroundColor: 'var(--paper-warm)',
 position: 'relative',
 }}
 >
 {(['monthly', 'yearly'] as const).map((b) => (
 <button
 key={b}
 onClick={() => setBilling(b)}
 style={{
 padding: '10px 22px',
 borderRadius: 999,
 fontSize: 13,
 fontFamily: 'var(--font-jakarta)',
 fontWeight: 600,
 color: billing === b ? 'var(--paper)' : 'var(--ink-mid)',
 backgroundColor: billing === b ? 'var(--ink)' : 'transparent',
 border: 'none',
 cursor: 'pointer',
 transition: 'color 220ms ease, background-color 220ms ease',
 position: 'relative',
 letterSpacing: '-0.01em',
 }}
 >
 {b === 'yearly' ? 'yearly · save 31%' : 'monthly'}
 </button>
 ))}
 </div>
 </ScrollReveal>
 </div>
 </section>

 {/* Cards */}
 <section style={{ padding: '40px 24px 100px' }}>
 <div
 style={{
 maxWidth: 980,
 margin: '0 auto',
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
 gap: 20,
 }}
 >
 {/* Free */}
 <ScrollReveal>
 <div
 className="warm-card"
 style={{
 padding: '40px 36px',
 height: '100%',
 display: 'flex',
 flexDirection: 'column',
 }}
 >
 <p className="eyebrow" style={{ color: 'var(--ink-light)', marginBottom: 14 }}>
 free
 </p>
 <div style={{ marginBottom: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
 <span
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 64,
 fontWeight: 700,
 color: 'var(--ink)',
 letterSpacing: '-0.035em',
 lineHeight: 1,
 }}
 >
 $0
 </span>
 </div>
 <p className="serif-italic" style={{ fontSize: 15, color: 'var(--ink-light)', marginBottom: 32 }}>
 forever, no card needed
 </p>

 <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
 {FREE_FEATURES.map(f => (
 <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div
 style={{
 width: 20,
 height: 20,
 borderRadius: '50%',
 backgroundColor: 'var(--terra-tint)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 flexShrink: 0,
 }}
 >
 <Check />
 </div>
 <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{f}</span>
 </div>
 ))}
 </div>

 <Link href="/waitlist" style={{ textDecoration: 'none', marginTop: 'auto' }}>
 <button
 className="btn-ghost"
 style={{ width: '100%', padding: 14, borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-jakarta)' }}
 >
 join waitlist, it&apos;s free
 </button>
 </Link>
 </div>
 </ScrollReveal>

 {/* Pro, dark ink card */}
 <ScrollReveal delay={120}>
 <div
 style={{
 position: 'relative',
 backgroundColor: 'var(--ink)',
 color: 'var(--paper)',
 borderRadius: 28,
 padding: '40px 36px',
 height: '100%',
 display: 'flex',
 flexDirection: 'column',
 overflow: 'hidden',
 border: '1px solid rgba(196,120,74,0.3)',
 }}
 >
 {/* Subtle terracotta glow */}
 <div
 aria-hidden
 style={{
 position: 'absolute',
 top: -120,
 right: -120,
 width: 340,
 height: 340,
 borderRadius: '50%',
 background:
 'radial-gradient(circle, rgba(196,120,74,0.28) 0%, transparent 70%)',
 pointerEvents: 'none',
 }}
 />

 {/* Badge */}
 <div
 style={{
 position: 'absolute',
 top: 20,
 right: 20,
 padding: '5px 12px',
 borderRadius: 999,
 border: '1px solid rgba(250,248,244,0.2)',
 fontFamily: 'var(--font-mono)',
 fontSize: 10,
 letterSpacing: '0.12em',
 textTransform: 'uppercase',
 color: 'var(--terra)',
 }}
 >
 most popular
 </div>

 <p className="eyebrow" style={{ color: 'rgba(250,248,244,0.5)', marginBottom: 14, position: 'relative' }}>
 pro
 </p>

 <div style={{ marginBottom: 4, display: 'flex', alignItems: 'baseline', gap: 6, position: 'relative' }}>
 <motion.span
 key={billing}
 initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 64,
 fontWeight: 700,
 color: 'var(--paper)',
 letterSpacing: '-0.035em',
 lineHeight: 1,
 display: 'inline-block',
 }}
 >
 {billing === 'yearly' ? '$8' : '$12'}
 </motion.span>
 <span style={{ fontSize: 15, color: 'rgba(250,248,244,0.55)' }}>/mo</span>
 </div>

 <p
 className="serif-italic"
 style={{ fontSize: 14, color: 'rgba(250,248,244,0.55)', marginBottom: 32, position: 'relative' }}
 >
 {billing === 'yearly' ? 'billed $99/year, save 31%' : 'billed monthly'}
 </p>

 <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
 {PRO_FEATURES.map(f => (
 <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div
 style={{
 width: 20,
 height: 20,
 borderRadius: '50%',
 backgroundColor: 'rgba(196,120,74,0.18)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 flexShrink: 0,
 }}
 >
 <Check color="var(--terra)" />
 </div>
 <span style={{ fontSize: 14, color: 'rgba(250,248,244,0.88)' }}>{f}</span>
 </div>
 ))}
 </div>

 <div style={{ marginTop: 'auto', position: 'relative' }}>
 <Magnetic strength={0.2}>
 <Link href="/waitlist" style={{ textDecoration: 'none' }}>
 <button
 style={{
 width: '100%',
 padding: 14,
 borderRadius: 12,
 backgroundColor: 'var(--paper)',
 color: 'var(--ink)',
 border: 'none',
 cursor: 'pointer',
 fontFamily: 'var(--font-jakarta)',
 fontWeight: 600,
 fontSize: 14,
 letterSpacing: '-0.01em',
 transition: 'transform 180ms var(--ease-out)',
 }}
 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
 onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
 >
 join waitlist, get early access →
 </button>
 </Link>
 </Magnetic>
 <p
 className="mono"
 style={{
 fontSize: 11,
 color: 'rgba(250,248,244,0.45)',
 textAlign: 'center',
 marginTop: 14,
 letterSpacing: '0.04em',
 }}
 >
 early access · launch discount locked in
 </p>
 </div>
 </div>
 </ScrollReveal>
 </div>
 </section>

 {/* Footer note */}
 <section style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
 <ScrollReveal>
 <p className="serif-italic" style={{ fontSize: 18, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
 questions? reach out on{' '}
 <a href="https://linkedin.com" style={{ color: 'var(--terra)', textDecoration: 'none', fontWeight: 600, fontStyle: 'normal', fontFamily: 'var(--font-jakarta)' }}>
 linkedin
 </a>
 {' '}or just try the free version first.
 </p>
 </ScrollReveal>
 </section>

 <SiteFooter />
 </div>
 );
}
