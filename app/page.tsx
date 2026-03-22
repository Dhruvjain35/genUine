'use client';

import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollReveal from './components/ScrollReveal';

const QUOTES = [
  { quote: 'kinda shocked that it turned out that well', name: 'Dimas' },
  { quote: 'the replies felt quite natural', name: 'Ruthvika' },
  { quote: 'it lowk copied my tone', name: 'Suhani' },
];

const STEPS = [
  {
    num: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'teach genUine your voice',
    desc: 'paste 3 messages you\'ve sent before. linkedin messages, texts, anything where you sounded like yourself.',
  },
  {
    num: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
    title: 'paste a linkedin profile',
    desc: 'grab their name, headline, about section — whatever\'s available. even a messy mobile paste works.',
  },
  {
    num: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'get your message',
    desc: 'two options, both in your voice. copy the one that feels right. that\'s it.',
  },
];

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#FAF9F7', color: '#2D2D2D', minHeight: '100vh' }}>
      <SiteHeader activePage="home" />

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '100px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Warm background glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(242, 169, 34, 0.09) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(196, 120, 74, 0.07) 0%, transparent 60%)',
        }} />

        <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto' }}>
          {/* Badge */}
          <div
            className="fade-up stagger-1"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'rgba(196, 120, 74, 0.1)',
              border: '1px solid rgba(196, 120, 74, 0.2)',
              borderRadius: '100px', padding: '5px 14px',
              marginBottom: '28px',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#C4784A', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.02em' }}>
              beta — tested by 40+ people
            </span>
          </div>

          {/* Wordmark */}
          <div
            className="fade-up stagger-2"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(52px, 10vw, 88px)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: '#2D2D2D',
              marginBottom: '24px',
            }}
          >
            gen<span style={{ color: '#C4784A' }}>U</span>ine
          </div>

          {/* Headline */}
          <h1
            className="fade-up stagger-3"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(28px, 5vw, 42px)',
              letterSpacing: '-0.02em',
              color: '#2D2D2D',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            your message. not AI's.
          </h1>

          {/* Subheadline */}
          <p
            className="fade-up stagger-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(16px, 2.5vw, 19px)',
              color: '#6B5E52',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '520px',
              margin: '0 auto 40px',
            }}
          >
            genUine learns how you write, then helps you start LinkedIn conversations that actually sound like you.
          </p>

          {/* CTAs */}
          <div
            className="fade-up"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '280ms' }}
          >
            <Link href="/app">
              <button
                className="btn-primary"
                style={{ padding: '14px 32px', borderRadius: '14px', fontSize: '16px' }}
              >
                try genUine →
              </button>
            </Link>
            <a href="#how-it-works">
              <button
                className="btn-ghost"
                style={{ padding: '14px 28px', borderRadius: '14px', fontSize: '16px' }}
              >
                see how it works
              </button>
            </a>
          </div>

          {/* Floating quote preview */}
          <div
            className="fade-up float-anim"
            style={{
              marginTop: '64px',
              display: 'inline-block',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(196, 120, 74, 0.15)',
              borderRadius: '18px',
              padding: '18px 24px',
              boxShadow: '0 8px 32px rgba(196, 120, 74, 0.1)',
              maxWidth: '380px',
              animationDelay: '400ms',
              animationDuration: '5s',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(196, 120, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '16px' }}>👋</span>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#6B5E52', lineHeight: 1.5, marginBottom: '4px' }}>
                  "it lowk copied my tone — I was genuinely surprised"
                </p>
                <p style={{ fontSize: '11px', color: '#A08C7C', fontWeight: 600 }}>Suhani · beta tester</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{ padding: 'clamp(60px, 10vw, 100px) 24px', backgroundColor: '#FFFFFF' }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                how it works
              </p>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#2D2D2D',
                  marginBottom: '14px',
                }}
              >
                three steps to a real message
              </h2>
              <p style={{ fontSize: '16px', color: '#6B5E52', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
                under 2 minutes from start to sent.
              </p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 120}>
                <div
                  className="warm-card"
                  style={{ borderRadius: '20px', padding: '32px 28px', height: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: 52, height: 52, borderRadius: '14px',
                        backgroundColor: 'rgba(196, 120, 74, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#C4784A', flexShrink: 0,
                      }}
                    >
                      {step.icon}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800, fontSize: '13px',
                        color: 'rgba(196, 120, 74, 0.4)', letterSpacing: '0.04em',
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '18px', fontWeight: 700,
                      color: '#2D2D2D', marginBottom: '10px', letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B5E52', lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px', backgroundColor: '#FAF9F7' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ScrollReveal style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              what people said
            </p>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 700, letterSpacing: '-0.02em',
                color: '#2D2D2D', marginBottom: '8px',
              }}
            >
              real reactions from real people
            </h2>
            <p style={{ fontSize: '14px', color: '#A08C7C' }}>tested by 40+ people during our beta</p>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {QUOTES.map((q, i) => (
              <ScrollReveal key={q.name} delay={i * 100}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(196, 120, 74, 0.12)',
                    borderRadius: '18px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(196, 120, 74, 0.06)',
                  }}
                >
                  <p style={{ fontSize: '18px', color: '#C4784A', marginBottom: '12px', lineHeight: 1 }}>❝</p>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '16px', fontWeight: 600,
                      color: '#2D2D2D', lineHeight: 1.5, marginBottom: '16px',
                    }}
                  >
                    {q.quote}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(196, 120, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#C4784A' }}>{q.name[0]}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#A08C7C', fontWeight: 500 }}>{q.name} · beta tester</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <ScrollReveal style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
              not another AI writing tool
            </p>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: '#2D2D2D', lineHeight: 1.2, marginBottom: '24px',
              }}
            >
              other tools write messages that sound{' '}
              <span style={{ color: '#A08C7C', fontStyle: 'italic' }}>human.</span>
              <br />
              genUine writes messages that sound like{' '}
              <span style={{ color: '#C4784A' }}>YOU.</span>
            </h2>
            <p style={{ fontSize: '17px', color: '#6B5E52', lineHeight: 1.7, marginBottom: '32px' }}>
              your vocabulary. your tone. your energy. the way you start sentences, the questions you ask, whether you use exclamation marks or not.
            </p>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(196, 120, 74, 0.08)',
                border: '1px solid rgba(196, 120, 74, 0.15)',
                borderRadius: '14px',
                padding: '16px 24px',
              }}
            >
              <p style={{ fontSize: '15px', color: '#6B5E52', lineHeight: 1.6 }}>
                think of it this way — other tools give you a generic human voice.<br />
                <strong style={{ color: '#2D2D2D' }}>genUine gives you YOUR voice.</strong>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px', backgroundColor: '#FAF9F7' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <ScrollReveal>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              pricing
            </p>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 700, letterSpacing: '-0.02em',
                color: '#2D2D2D', marginBottom: '16px',
              }}
            >
              start free. go pro when you\'re ready.
            </h2>
            <p style={{ fontSize: '16px', color: '#6B5E52', marginBottom: '40px', lineHeight: 1.6 }}>
              3 messages a day, free forever. unlimited with Pro.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {/* Free */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(196, 120, 74, 0.15)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  textAlign: 'left',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#A08C7C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>free</p>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#2D2D2D', marginBottom: '4px' }}>$0</p>
                <p style={{ fontSize: '13px', color: '#A08C7C', marginBottom: '20px' }}>forever</p>
                {['3 messages per day', 'voice saving', 'profile analysis'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#C4784A', fontSize: '14px' }}>✓</span>
                    <span style={{ fontSize: '14px', color: '#6B5E52' }}>{f}</span>
                  </div>
                ))}
                <Link href="/app">
                  <button className="btn-ghost w-full py-3 rounded-xl text-sm mt-4" style={{ width: '100%', marginTop: '20px' }}>
                    get started
                  </button>
                </Link>
              </div>

              {/* Pro */}
              <div
                style={{
                  backgroundColor: '#C4784A',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  textAlign: 'left',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(196, 120, 74, 0.3)',
                }}
              >
                <div
                  style={{
                    position: 'absolute', top: '-10px', right: '20px',
                    backgroundColor: '#F2A922',
                    borderRadius: '100px', padding: '3px 12px',
                    fontSize: '11px', fontWeight: 700, color: '#2D2D2D',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  most popular
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>pro</p>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>$12<span style={{ fontSize: '16px', fontWeight: 400 }}>/mo</span></p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>or $99/year — save 31%</p>
                {['unlimited messages', 'advanced voice matching', 'priority support', 'personality profiles'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#F2A922', fontSize: '14px' }}>✓</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{f}</span>
                  </div>
                ))}
                <Link href="/pricing">
                  <button
                    style={{
                      width: '100%', marginTop: '20px', padding: '12px',
                      backgroundColor: '#FFFFFF', color: '#C4784A',
                      border: 'none', borderRadius: '12px',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    go pro →
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{
          padding: 'clamp(80px, 12vw, 120px) 24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #FAF9F7 0%, #F3EDE7 100%)',
        }}
      >
        <ScrollReveal>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800, letterSpacing: '-0.03em',
              color: '#2D2D2D', lineHeight: 1.2, marginBottom: '20px',
            }}
          >
            stop staring at the
            <br />
            <span style={{ color: '#C4784A' }}>blank message box.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#6B5E52', marginBottom: '40px', lineHeight: 1.6 }}>
            your next real conversation is one message away.
          </p>
          <Link href="/app">
            <button
              className="btn-primary"
              style={{ padding: '16px 40px', borderRadius: '16px', fontSize: '17px' }}
            >
              try genUine — it&apos;s free →
            </button>
          </Link>
          <p
            style={{
              marginTop: '32px', fontSize: '16px', color: '#A08C7C',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontStyle: 'italic',
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
