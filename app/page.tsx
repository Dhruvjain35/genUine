'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollReveal from './components/ScrollReveal';
import ScrollProgress from './components/ScrollProgress';
import AnimatedHeading from './components/AnimatedHeading';
import Magnetic from './components/Magnetic';
import Marquee from './components/Marquee';

// ─────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────
// Rotating message demo — plays through premium sample drafts
// ─────────────────────────────────────────────────────────
const DEMO_MESSAGES = [
  'yo i saw your post about building in public, that really hit. been doing the same with my project and honestly the accountability side is what keeps me going. how long have you been at it?',
  'noticed you shifted from consulting into product last year — was curious what finally pushed the jump? been stuck in that exact in-between for a while.',
  'stumbled on your essay about quiet founders. the part about boring rituals winning was the line i needed today. are you still writing weekly?',
];

function LiveDemoCard() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const message = DEMO_MESSAGES[idx];
    let i = 0;
    setTyped('');
    const step = () => {
      if (i <= message.length) {
        setTyped(message.slice(0, i));
        i += 1;
        timer = setTimeout(step, 18 + Math.random() * 28);
      } else {
        timer = setTimeout(() => setIdx((v) => (v + 1) % DEMO_MESSAGES.length), 3200);
      }
    };
    let timer: ReturnType<typeof setTimeout>;
    timer = setTimeout(step, 420);
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--paper-contrast)',
        border: '1px solid var(--ink-whisper)',
        borderRadius: 22,
        padding: 28,
        boxShadow: '0 1px 2px rgba(26,23,20,0.04), 0 30px 80px rgba(26,23,20,0.08)',
        maxWidth: 520,
        margin: '0 auto',
      }}
    >
      {/* Window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#E8DDD5' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#E8DDD5' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#E8DDD5' }} />
        <span
          className="mono"
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            color: 'var(--ink-light)',
            letterSpacing: '0.06em',
          }}
        >
          genUine / compose
        </span>
      </div>

      {/* Recipient */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8DDD5, #C4784A22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 14, color: 'var(--ink-soft)' }}>
            s
          </span>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-jakarta)' }}>
            Sarah Chen
          </p>
          <p style={{ fontSize: 11, color: 'var(--ink-light)' }}>Product Manager · Stripe</p>
        </div>
      </div>

      {/* Live typing message */}
      <div
        style={{
          background: 'var(--paper-warm)',
          borderRadius: 16,
          padding: 18,
          minHeight: 140,
        }}
      >
        <p
          style={{
            fontSize: 14.5,
            color: 'var(--ink)',
            lineHeight: 1.65,
            fontFamily: 'var(--font-dm)',
            minHeight: 100,
          }}
        >
          {typed}
          <span className="caret" aria-hidden="true" />
        </p>
      </div>

      {/* Voice chip */}
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--terra)',
            }}
            className="pulse-dot"
          />
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mid)', letterSpacing: '0.04em' }}>
            your voice · casual
          </span>
        </div>
        <span
          className="mono"
          style={{ fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.04em' }}
        >
          {(idx + 1).toString().padStart(2, '0')} / {DEMO_MESSAGES.length.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Stats (reused shape)
// ─────────────────────────────────────────────────────────
function StatsSection() {
  const [waitlistCount, setWaitlistCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/waitlist')
      .then((r) => r.json())
      .then((d) => { if (d.count) setWaitlistCount(d.count); })
      .catch(() => {});
  }, []);

  const stats = [
    { value: 40, suffix: '+', label: 'discovery conversations' },
    { value: waitlistCount || 50, suffix: '+', label: 'people on the waitlist' },
    { value: 6, suffix: '', label: 'team members and growing' },
  ];

  return (
    <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div
                style={{
                  borderTop: '1px solid var(--ink-whisper)',
                  paddingTop: 28,
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontWeight: 700,
                    fontSize: 'clamp(56px, 8vw, 96px)',
                    letterSpacing: '-0.045em',
                    color: 'var(--ink)',
                    lineHeight: 0.95,
                    marginBottom: 14,
                  }}
                >
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--ink-mid)', maxWidth: 220 }}>
                  {s.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Step card with icon
// ─────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: 'teach it your voice',
    desc: "paste 3 messages you've written before. DMs, texts — anything where you sounded like yourself.",
    svg: (
      <path
        d="M3 12h6l2-6 4 12 2-6h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    num: '02',
    title: 'drop a profile',
    desc: "paste a linkedin link or their headline, about, role. a messy mobile paste works too.",
    svg: (
      <>
        <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M4 20.5c0-3.6 3.6-6 8-6s8 2.4 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  {
    num: '03',
    title: 'send something real',
    desc: 'two drafts, both in your voice. pick the one that feels right. copy, paste, send.',
    svg: (
      <path
        d="M4 12h12m0 0-5-5m5 5-5 5M19 4v16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────
// Quote set
// ─────────────────────────────────────────────────────────
const QUOTES = [
  { quote: 'kinda shocked that it turned out that well', name: 'early user' },
  { quote: 'the replies felt quite natural', name: 'early user' },
  { quote: 'it lowk copied my tone', name: 'early user' },
];

// ─────────────────────────────────────────────────────────
// Hero parallax + custom cursor trail
// ─────────────────────────────────────────────────────────
function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const sx = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const sy = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const x1 = useTransform(sx, [0, 1], ['-10%', '10%']);
  const y1 = useTransform(sy, [0, 1], ['-10%', '10%']);
  const x2 = useTransform(sx, [0, 1], ['10%', '-10%']);
  const y2 = useTransform(sy, [0, 1], ['10%', '-10%']);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX.set(e.clientX / w);
      mouseY.set(e.clientY / h);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: 680,
          height: 680,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(224, 160, 58, 0.35) 0%, transparent 65%)',
          filter: 'blur(90px)',
          top: '-200px',
          left: '50%',
          x: x1,
          y: y1,
          translateX: '-50%',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(196, 120, 74, 0.25) 0%, transparent 60%)',
          filter: 'blur(100px)',
          bottom: '-140px',
          right: '-6%',
          x: x2,
          y: y2,
        }}
      />
      {/* subtle grid */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.14 }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(26,23,20,0.14)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroLift = useTransform(scrollY, [0, 600], [0, -60]);
  const heroFade = useTransform(scrollY, [0, 520], [1, 0.35]);

  return (
    <div style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      <ScrollProgress />
      <SiteHeader activePage="home" />

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          padding: '120px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HeroBackdrop />

        <motion.div
          style={{ position: 'relative', maxWidth: 1080, width: '100%', y: heroLift, opacity: heroFade }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 14px 6px 10px',
                borderRadius: 999,
                border: '1px solid var(--ink-whisper)',
                background: 'rgba(250, 248, 244, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="pulse-dot"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--terra)',
                }}
              />
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                now in private beta
              </span>
            </div>
          </motion.div>

          {/* Display headline */}
          <AnimatedHeading
            text="your message."
            as="h1"
            delay={0.4}
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 'clamp(56px, 11vw, 148px)',
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              color: 'var(--ink)',
              textAlign: 'center',
            }}
          />
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: [0.23, 1, 0.32, 1] }}
              className="serif-italic"
              style={{
                display: 'inline-block',
                fontSize: 'clamp(56px, 11vw, 148px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: 'var(--terra)',
              }}
            >
              not AI&apos;s.
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: [0.23, 1, 0.32, 1] }}
            style={{
              fontFamily: 'var(--font-dm)',
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--ink-mid)',
              lineHeight: 1.65,
              marginTop: 36,
              maxWidth: 520,
              marginInline: 'auto',
              textAlign: 'center',
            }}
          >
            genUine learns how <em className="serif-italic">you</em> write — then drafts LinkedIn
            messages that sound like you on your best day. not a template. not a tone-policed intern.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
            style={{
              marginTop: 44,
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Link href="/waitlist">
              <Magnetic strength={0.18}>
                <button
                  className="btn-primary"
                  style={{ padding: '15px 28px', borderRadius: 999, fontSize: 15 }}
                >
                  join the waitlist
                  <span aria-hidden="true" style={{ marginLeft: 2 }}>→</span>
                </button>
              </Magnetic>
            </Link>
            <Link href="/app">
              <Magnetic strength={0.12}>
                <button
                  className="btn-ghost"
                  style={{ padding: '15px 26px', borderRadius: 999, fontSize: 15 }}
                >
                  try it free
                </button>
              </Magnetic>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.2em' }}>
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ width: 1, height: 32, background: 'var(--ink-whisper)' }}
          />
        </motion.div>
      </section>

      {/* ── Marquee — tagline riff ── */}
      <section
        style={{
          padding: '36px 0',
          borderBlock: '1px solid var(--ink-whisper)',
          background: 'var(--paper-warm)',
        }}
      >
        <Marquee speed={46}>
          {[
            'your voice',
            '·',
            'not a template',
            '·',
            'genuine curiosity',
            '·',
            'lowercase energy',
            '·',
            'send-ready drafts',
            '·',
            'real conversations',
            '·',
          ].map((t, i) => (
            <span
              key={i}
              style={{
                fontFamily: t === '·' ? 'var(--font-serif)' : 'var(--font-jakarta)',
                fontSize: t === '·' ? 38 : 28,
                fontWeight: t === '·' ? 400 : 500,
                letterSpacing: '-0.02em',
                color: t === '·' ? 'var(--terra)' : 'var(--ink)',
                whiteSpace: 'nowrap',
              }}
            >
              {t}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── LIVE DEMO ── */}
      <section id="how-it-works" style={{ padding: 'clamp(80px, 12vw, 140px) 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 48,
              alignItems: 'center',
            }}
          >
            <ScrollReveal>
              <div>
                <p className="eyebrow" style={{ marginBottom: 20 }}>watch it write</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 'clamp(36px, 5vw, 64px)',
                    fontWeight: 700,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.05,
                    color: 'var(--ink)',
                    marginBottom: 24,
                  }}
                >
                  a draft that sounds<br />
                  <span className="serif-italic" style={{ color: 'var(--terra)' }}>
                    uncannily like you.
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: 17,
                    color: 'var(--ink-mid)',
                    lineHeight: 1.65,
                    maxWidth: 460,
                    marginBottom: 28,
                  }}
                >
                  Same vocabulary. Same punctuation quirks. The way you actually open a message — not how a
                  generic AI would. Two drafts. Two angles. Always in your voice.
                </p>
                <div className="divider" style={{ marginBottom: 28 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
                  {[
                    { k: 'tone', v: 'casual' },
                    { k: 'energy', v: 'warm' },
                    { k: 'pattern', v: 'lowercase opener' },
                  ].map((p) => (
                    <div key={p.k}>
                      <p className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: 6 }}>
                        {p.k}
                      </p>
                      <p style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'var(--font-jakarta)', fontWeight: 500 }}>
                        {p.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <LiveDemoCard />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px', background: 'var(--paper-warm)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ marginBottom: 64, maxWidth: 640 }}>
              <p className="eyebrow" style={{ marginBottom: 18 }}>three steps</p>
              <h2
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.05,
                  color: 'var(--ink)',
                }}
              >
                from blank box to <span className="serif-italic" style={{ color: 'var(--terra)' }}>sent</span>{' '}
                — under two minutes.
              </h2>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 120}>
                <div
                  className="warm-card"
                  style={{
                    borderRadius: 20,
                    padding: '36px 28px',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: 'var(--ink-light)',
                      letterSpacing: '0.16em',
                    }}
                  >
                    {step.num} —
                  </span>

                  <div style={{ marginTop: 28, marginBottom: 28, color: 'var(--terra)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
                      {step.svg}
                    </svg>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-jakarta)',
                      fontSize: 22,
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: 10,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: 'var(--ink-mid)', lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR ── */}
      <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ maxWidth: 720, marginBottom: 48 }}>
              <p className="eyebrow" style={{ marginBottom: 18 }}>
                not another ai writing tool
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: 'clamp(34px, 5vw, 60px)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.05,
                  color: 'var(--ink)',
                }}
              >
                other tools write messages that sound{' '}
                <span className="serif-italic" style={{ color: 'var(--ink-mid)' }}>human.</span>{' '}
                genUine writes messages that sound like{' '}
                <span className="serif-italic" style={{ color: 'var(--terra)' }}>you.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
              alignItems: 'stretch',
            }}
          >
            <ScrollReveal>
              <div
                style={{
                  backgroundColor: 'var(--paper-contrast)',
                  border: '1px dashed rgba(26, 23, 20, 0.2)',
                  borderRadius: 20,
                  padding: 32,
                  height: '100%',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <span className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
                    generic ai
                  </span>
                </div>
                {[
                  'I hope this message finds you well.',
                  'I came across your profile and was truly impressed by your experience.',
                  'I would love to explore potential synergies between our work.',
                  'I would love to pick your brain about your journey.',
                ].map((msg) => (
                  <div
                    key={msg}
                    style={{
                      padding: '12px 14px',
                      marginBottom: 10,
                      background: 'transparent',
                      border: '1px solid var(--ink-whisper)',
                      borderRadius: 10,
                      fontSize: 13.5,
                      color: 'var(--ink-light)',
                      fontStyle: 'italic',
                      textDecoration: 'line-through',
                      textDecorationColor: 'rgba(26, 23, 20, 0.25)',
                      lineHeight: 1.5,
                    }}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div
                style={{
                  backgroundColor: 'var(--ink)',
                  color: 'var(--paper)',
                  borderRadius: 20,
                  padding: 32,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: -60,
                    top: -60,
                    width: 260,
                    height: 260,
                    background:
                      'radial-gradient(circle, rgba(196, 120, 74, 0.35) 0%, transparent 60%)',
                    filter: 'blur(40px)',
                  }}
                />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      color: 'var(--terra)',
                      textTransform: 'uppercase',
                    }}
                  >
                    in your voice
                  </span>
                </div>
                <div
                  style={{
                    position: 'relative',
                    padding: 22,
                    borderRadius: 14,
                    background: 'rgba(250, 248, 244, 0.08)',
                    border: '1px solid rgba(250, 248, 244, 0.1)',
                    marginBottom: 18,
                  }}
                >
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--paper)' }}>
                    yo i saw your post about building in public, that really hit. been doing the same
                    thing with my project and honestly the accountability side is what keeps me going.
                    how long have you been at it?
                  </p>
                </div>
                <p
                  className="serif-italic"
                  style={{ position: 'relative', fontSize: 15, color: 'rgba(250,248,244,0.72)', lineHeight: 1.6 }}
                >
                  sounds like a human wrote it. because — in a way — one did.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal style={{ marginTop: 48 }}>
            <p
              className="serif-italic"
              style={{
                fontSize: 22,
                color: 'var(--ink-mid)',
                lineHeight: 1.5,
                maxWidth: 620,
                textAlign: 'center',
                margin: '0 auto',
              }}
            >
              your public voice is your posts. genUine is your private voice — your DMs.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── VOICES (marquee testimonials) ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 40px' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 14 }}>early voices</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 'clamp(28px, 4vw, 44px)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                  }}
                >
                  what they actually said.
                </h2>
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-mid)', maxWidth: 320 }}>
                verbatim reactions from our first 40 user calls.
              </p>
            </div>
          </ScrollReveal>
        </div>
        <Marquee speed={52}>
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 18,
                padding: '18px 28px',
                borderRadius: 999,
                border: '1px solid var(--ink-whisper)',
                background: 'var(--paper-contrast)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="serif-italic"
                style={{ fontSize: 22, color: 'var(--ink)', lineHeight: 1.2 }}
              >
                &ldquo;{q.quote}&rdquo;
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.08em' }}>
                — {q.name}
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ── PRICING TEASER ── */}
      <section style={{ padding: 'clamp(80px, 12vw, 140px) 24px', background: 'var(--paper-warm)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 56px' }}>
              <p className="eyebrow" style={{ marginBottom: 18 }}>pricing</p>
              <h2
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: 'clamp(34px, 5vw, 58px)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.05,
                  color: 'var(--ink)',
                  marginBottom: 16,
                }}
              >
                start free. upgrade when it clicks.
              </h2>
              <p style={{ fontSize: 17, color: 'var(--ink-mid)', lineHeight: 1.65 }}>
                3 drafts a day, free forever. unlimited with Pro — and a launch discount for the waitlist.
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              maxWidth: 780,
              margin: '0 auto',
            }}
          >
            <ScrollReveal>
              <div
                style={{
                  background: 'var(--paper-contrast)',
                  border: '1px solid var(--ink-whisper)',
                  borderRadius: 22,
                  padding: 32,
                }}
              >
                <p className="eyebrow" style={{ color: 'var(--ink-light)', marginBottom: 14 }}>free</p>
                <p
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 56,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  $0
                </p>
                <p style={{ fontSize: 13, color: 'var(--ink-light)', marginBottom: 28 }}>
                  forever, no card needed
                </p>
                {['3 drafts per day', 'voice saving', 'profile analysis'].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--terra)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{f}</span>
                  </div>
                ))}
                <Link href="/waitlist">
                  <button className="btn-ghost" style={{ width: '100%', padding: 13, borderRadius: 12, fontSize: 14, marginTop: 22 }}>
                    join waitlist
                  </button>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div
                style={{
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  borderRadius: 22,
                  padding: 32,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 'auto -80px -80px auto',
                    width: 260,
                    height: 260,
                    background: 'radial-gradient(circle, rgba(196, 120, 74, 0.35) 0%, transparent 60%)',
                    filter: 'blur(40px)',
                  }}
                />
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.12em',
                        color: 'var(--terra)',
                        textTransform: 'uppercase',
                      }}
                    >
                      pro
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.1em',
                        padding: '4px 10px',
                        borderRadius: 999,
                        border: '1px solid rgba(196, 120, 74, 0.3)',
                        color: 'var(--terra)',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      most chosen
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-jakarta)',
                      fontSize: 56,
                      fontWeight: 700,
                      color: 'var(--paper)',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    $12<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(250,248,244,0.6)' }}>/mo</span>
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(250,248,244,0.6)', marginBottom: 28 }}>
                    or $99/year — save 31%
                  </p>
                  {['unlimited drafts', 'advanced voice matching', 'profiles by recipient type', 'priority support'].map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--terra)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontSize: 14, color: 'rgba(250,248,244,0.9)' }}>{f}</span>
                    </div>
                  ))}
                  <Link href="/pricing">
                    <button
                      className="btn-accent btn-primary"
                      style={{ width: '100%', padding: 13, borderRadius: 12, fontSize: 14, marginTop: 22 }}
                    >
                      go pro →
                    </button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsSection />

      {/* ── FINAL CTA ── */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(100px, 14vw, 180px) 24px',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(224, 160, 58, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <ScrollReveal>
          <h2
            style={{
              position: 'relative',
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(44px, 7vw, 108px)',
              fontWeight: 700,
              letterSpacing: '-0.045em',
              lineHeight: 0.95,
              color: 'var(--ink)',
              marginBottom: 28,
            }}
          >
            stop staring<br />
            at the <span className="serif-italic" style={{ color: 'var(--terra)' }}>blank box.</span>
          </h2>
          <p style={{ position: 'relative', fontSize: 18, color: 'var(--ink-mid)', marginBottom: 40 }}>
            your next real conversation is one message away.
          </p>
          <Link href="/waitlist">
            <Magnetic strength={0.22}>
              <button
                className="btn-primary"
                style={{ padding: '18px 40px', borderRadius: 999, fontSize: 17 }}
              >
                join the waitlist — it&apos;s free →
              </button>
            </Magnetic>
          </Link>
          <p
            className="serif-italic"
            style={{
              marginTop: 42,
              fontSize: 20,
              color: 'var(--ink-light)',
            }}
          >
            see u later — shaan
          </p>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </div>
  );
}
