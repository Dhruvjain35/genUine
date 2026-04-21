'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const STEPS = [
 {
 num: '01',
 eyebrow: 'step one',
 title: 'teach it your voice.',
 desc:
 "paste 3 messages you've written before. DMs, texts, anything where you sounded like yourself. genUine reads for cadence, punctuation, the way you actually open a sentence.",
 accent: 'your voice',
 },
 {
 num: '02',
 eyebrow: 'step two',
 title: 'drop a profile.',
 desc:
 'paste a linkedin link, or their headline, about, role. even a messy mobile paste works. genUine maps what matters to them, and what you might share.',
 accent: 'their world',
 },
 {
 num: '03',
 eyebrow: 'step three',
 title: 'send something real.',
 desc:
 'two drafts, both in your voice. pick the one that feels right. copy, paste, send. no tone-policed intern. no template. just you, faster.',
 accent: 'sent.',
 },
];

function StepVisual({ index, progress }: { index: number; progress: MotionValue<number> }) {
 // Each step owns a 1/3 slice of the 0..1 range
 const slice = 1 / STEPS.length;
 const start = index * slice;
 const peak = start + slice * 0.5;
 const end = start + slice;

 const opacity = useTransform(progress, [start, peak - 0.05, peak + 0.05, end], [0, 1, 1, 0]);
 const scale = useTransform(progress, [start, peak, end], [0.92, 1, 1.04]);
 const y = useTransform(progress, [start, peak, end], [30, 0, -20]);
 const blur = useTransform(progress, [start, peak - 0.05, peak + 0.05, end], [6, 0, 0, 6]);
 const filter = useTransform(blur, (b) => `blur(${b}px)`);

 return (
 <motion.div
 style={{
 position: 'absolute',
 inset: 0,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 opacity,
 scale,
 y,
 filter,
 pointerEvents: 'none',
 }}
 >
 {index === 0 && <VoiceCard />}
 {index === 1 && <ProfileCard />}
 {index === 2 && <DraftCard />}
 </motion.div>
 );
}

function VoiceCard() {
 return (
 <div
 style={{
 width: 'min(420px, 88%)',
 background: 'var(--paper-contrast)',
 border: '1px solid var(--ink-whisper)',
 borderRadius: 24,
 padding: 28,
 boxShadow: '0 40px 100px rgba(26,23,20,0.10)',
 }}
 >
 <div
 className="mono"
 style={{
 fontSize: 10,
 color: 'var(--ink-light)',
 letterSpacing: '0.14em',
 textTransform: 'uppercase',
 marginBottom: 20,
 }}
 >
 your past messages
 </div>
 {[
 'lowk agree with this, been thinking about it for weeks',
 'yo can you send me the link when you get a sec',
 'that part about boring rituals winning hit hard',
 ].map((m, i) => (
 <div
 key={i}
 style={{
 background: 'var(--paper-warm)',
 borderRadius: 14,
 padding: '12px 14px',
 marginBottom: 10,
 fontSize: 13.5,
 color: 'var(--ink-soft)',
 lineHeight: 1.55,
 borderLeft: i === 2 ? '2px solid var(--terra)' : '2px solid transparent',
 }}
 >
 {m}
 </div>
 ))}
 <div
 style={{
 marginTop: 18,
 paddingTop: 16,
 borderTop: '1px solid var(--ink-whisper)',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 }}
 >
 <span className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
 voice pattern
 </span>
 <span className="serif-italic" style={{ fontSize: 16, color: 'var(--terra)' }}>
 casual, lowercase
 </span>
 </div>
 </div>
 );
}

function ProfileCard() {
 return (
 <div
 style={{
 width: 'min(420px, 88%)',
 background: 'var(--paper-contrast)',
 border: '1px solid var(--ink-whisper)',
 borderRadius: 24,
 padding: 28,
 boxShadow: '0 40px 100px rgba(26,23,20,0.10)',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
 <div
 style={{
 width: 44,
 height: 44,
 borderRadius: '50%',
 background: 'linear-gradient(135deg, var(--terra), var(--terra-deep))',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 color: 'var(--paper)',
 fontFamily: 'var(--font-jakarta)',
 fontWeight: 700,
 fontSize: 16,
 }}
 >
 S
 </div>
 <div>
 <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-jakarta)' }}>
 Sarah Chen
 </div>
 <div className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.06em' }}>
 Product Manager · Stripe
 </div>
 </div>
 </div>
 <div
 style={{
 background: 'var(--paper-warm)',
 borderRadius: 14,
 padding: 16,
 fontSize: 13,
 color: 'var(--ink-mid)',
 lineHeight: 1.6,
 marginBottom: 14,
 }}
 >
 writes about shipping small. recently posted about quiet founders and boring rituals. 3 years at stripe, previously at a design-led startup.
 </div>
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 {['builds in public', 'quiet operator', 'writes weekly'].map((tag) => (
 <span
 key={tag}
 className="mono"
 style={{
 fontSize: 10,
 letterSpacing: '0.08em',
 padding: '5px 10px',
 borderRadius: 999,
 border: '1px solid var(--ink-whisper)',
 color: 'var(--ink-mid)',
 textTransform: 'uppercase',
 }}
 >
 {tag}
 </span>
 ))}
 </div>
 </div>
 );
}

function DraftCard() {
 return (
 <div
 style={{
 width: 'min(420px, 88%)',
 background: 'var(--ink)',
 color: 'var(--paper)',
 border: '1px solid rgba(250,248,244,0.08)',
 borderRadius: 24,
 padding: 28,
 boxShadow: '0 40px 100px rgba(26,23,20,0.35)',
 position: 'relative',
 overflow: 'hidden',
 }}
 >
 <div
 aria-hidden="true"
 style={{
 position: 'absolute',
 top: -80,
 right: -60,
 width: 240,
 height: 240,
 background: 'radial-gradient(circle, rgba(196, 120, 74, 0.45) 0%, transparent 65%)',
 filter: 'blur(40px)',
 }}
 />
 <div
 className="mono"
 style={{
 position: 'relative',
 fontSize: 10,
 color: 'var(--terra)',
 letterSpacing: '0.14em',
 textTransform: 'uppercase',
 marginBottom: 20,
 }}
 >
 your draft, in your voice
 </div>
 <p style={{ position: 'relative', fontSize: 14.5, lineHeight: 1.7, color: 'var(--paper)', marginBottom: 18 }}>
 stumbled on your post about quiet founders. the part about boring rituals winning was the line i needed today. are you still writing weekly?
 </p>
 <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(250,248,244,0.1)' }}>
 <span className="mono" style={{ fontSize: 10, color: 'rgba(250,248,244,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
 draft 01 of 02
 </span>
 <span className="serif-italic" style={{ fontSize: 16, color: 'var(--terra)' }}>
 ready to send
 </span>
 </div>
 </div>
 );
}

export default function ScrollSteps() {
 const ref = useRef<HTMLDivElement>(null);
 const { scrollYProgress } = useScroll({
 target: ref,
 offset: ['start start', 'end end'],
 });

 return (
 <section
 ref={ref}
 style={{
 position: 'relative',
 height: `${STEPS.length * 100}vh`,
 background: 'var(--paper-warm)',
 }}
 >
 <div
 style={{
 position: 'sticky',
 top: 0,
 height: '100vh',
 display: 'flex',
 alignItems: 'center',
 overflow: 'hidden',
 }}
 >
 <div
 style={{
 maxWidth: 1180,
 margin: '0 auto',
 padding: '0 24px',
 width: '100%',
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
 gap: 48,
 alignItems: 'center',
 }}
 >
 {/* Left: visual stage */}
 <div
 style={{
 position: 'relative',
 height: 'min(560px, 70vh)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 }}
 >
 {STEPS.map((_, i) => (
 <StepVisual key={i} index={i} progress={scrollYProgress} />
 ))}
 </div>

 {/* Right: text stage */}
 <div style={{ position: 'relative', minHeight: 420 }}>
 {STEPS.map((step, i) => {
 const slice = 1 / STEPS.length;
 const start = i * slice;
 const peak = start + slice * 0.5;
 const end = start + slice;
 return <StepText key={i} step={step} progress={scrollYProgress} start={start} peak={peak} end={end} />;
 })}

 {/* Progress ticks */}
 <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
 {STEPS.map((s, i) => {
 const slice = 1 / STEPS.length;
 const start = i * slice;
 const end = start + slice;
 return <Tick key={i} progress={scrollYProgress} start={start} end={end} />;
 })}
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}

function StepText({
 step,
 progress,
 start,
 peak,
 end,
}: {
 step: (typeof STEPS)[number];
 progress: MotionValue<number>;
 start: number;
 peak: number;
 end: number;
}) {
 const opacity = useTransform(progress, [start, peak - 0.04, peak + 0.04, end], [0, 1, 1, 0]);
 const y = useTransform(progress, [start, peak, end], [28, 0, -28]);
 const blur = useTransform(progress, [start, peak - 0.04, peak + 0.04, end], [8, 0, 0, 8]);
 const filter = useTransform(blur, (b) => `blur(${b}px)`);

 return (
 <motion.div
 style={{
 position: 'absolute',
 inset: 0,
 opacity,
 y,
 filter,
 maxWidth: 500,
 }}
 >
 <div
 className="mono"
 style={{
 fontSize: 11,
 color: 'var(--terra)',
 letterSpacing: '0.16em',
 textTransform: 'uppercase',
 marginBottom: 20,
 }}
 >
 {step.eyebrow}
 </div>
 <div
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 'clamp(14px, 1.4vw, 18px)',
 color: 'var(--ink-light)',
 marginBottom: 12,
 fontWeight: 400,
 letterSpacing: '-0.01em',
 }}
 >
 {step.num}
 </div>
 <h3
 style={{
 fontFamily: 'var(--font-jakarta)',
 fontSize: 'clamp(40px, 5.4vw, 72px)',
 fontWeight: 700,
 letterSpacing: '-0.035em',
 lineHeight: 1.02,
 color: 'var(--ink)',
 marginBottom: 24,
 paddingBottom: '0.12em',
 }}
 >
 {step.title}
 </h3>
 <p
 style={{
 fontSize: 17,
 color: 'var(--ink-mid)',
 lineHeight: 1.7,
 maxWidth: 440,
 marginBottom: 22,
 }}
 >
 {step.desc}
 </p>
 <span
 className="serif-italic"
 style={{ fontSize: 22, color: 'var(--terra)' }}
 >
 {step.accent}
 </span>
 </motion.div>
 );
}

function Tick({ progress, start, end }: { progress: MotionValue<number>; start: number; end: number }) {
 const h = useTransform(progress, [start, end], [18, 48]);
 const opacity = useTransform(progress, [start - 0.1, start, end, end + 0.1], [0.25, 1, 1, 0.25]);
 return (
 <motion.span
 style={{
 display: 'block',
 width: 2,
 height: h,
 borderRadius: 2,
 backgroundColor: 'var(--terra)',
 opacity,
 }}
 />
 );
}
