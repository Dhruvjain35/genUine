'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import WaitlistForm from '../components/WaitlistForm';
import WaitlistCounter from '../components/WaitlistCounter';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedHeading from '../components/AnimatedHeading';
import Magnetic from '../components/Magnetic';
import ScrollProgress from '../components/ScrollProgress';

const QUOTES = [
  { quote: 'kinda shocked that it turned out that well', name: 'early user' },
  { quote: 'the replies felt quite natural', name: 'early user' },
  { quote: 'it lowk copied my tone', name: 'early user' },
];

const FAQS = [
  {
    q: 'what exactly is genUine?',
    a: "genUine is an AI that learns how you write — your vocabulary, your tone, whether you use exclamation marks — then helps you write LinkedIn messages that actually sound like you. not generic AI. you.",
  },
  {
    q: 'how does it learn my voice?',
    a: "you paste a few messages you've already sent (texts, DMs, anything), or react to a quick scenario. genUine reads how you write and builds a voice profile. takes under 2 minutes.",
  },
  {
    q: 'is it free?',
    a: "yes — 3 messages a day, free forever. unlimited messages with Pro at $12/month. early waitlist members get a special launch discount.",
  },
  {
    q: "what if i'm new to linkedin and haven't sent messages?",
    a: "no problem. you can skip the voice setup and just pick a tone (casual, professional, friendly, direct). genUine will still write something way better than staring at a blank box.",
  },
  {
    q: 'when will i get access?',
    a: "we're onboarding waitlist members in batches. you'll get an email with early access before we open to everyone. the earlier you join, the sooner you're in.",
  },
];

const PERKS = [
  {
    no: '01',
    title: 'skip the line',
    desc: 'waitlist members get access before everyone else.',
  },
  {
    no: '02',
    title: 'launch discount',
    desc: 'early joiners get a special deal on Pro — locked in at signup.',
  },
  {
    no: '03',
    title: 'shape the product',
    desc: "we'll actually reach out and ask what you need. your feedback matters.",
  },
];

export default function WaitlistPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh' }}>
      <ScrollProgress />
      <SiteHeader activePage="waitlist" />

      {/* HERO */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(900px 460px at 50% 20%, rgba(196,120,74,0.10), transparent 60%)',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
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
              <span
                className="pulse-dot"
                style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--terra)', display: 'inline-block' }}
              />
              <span
                className="mono"
                style={{ fontSize: 11, color: 'var(--ink-mid)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                early access · limited spots
              </span>
            </div>
          </ScrollReveal>

          <AnimatedHeading
            as="h1"
            text="be first in line."
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(54px, 9vw, 104px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: 'var(--ink)',
              marginBottom: 24,
            }}
          />

          <ScrollReveal delay={200}>
            <p
              className="serif-italic"
              style={{
                fontSize: 'clamp(18px, 2.2vw, 22px)',
                color: 'var(--ink-mid)',
                lineHeight: 1.5,
                maxWidth: 480,
                margin: '0 auto 36px',
              }}
            >
              genUine is launching soon. join the waitlist and get early access — plus a special
              discount for being here early.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={260}>
            <div style={{ marginBottom: 32 }}>
              <WaitlistCounter />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={320}>
            <div
              className="warm-card"
              style={{
                padding: 'clamp(28px, 5vw, 44px)',
                textAlign: 'left',
              }}
            >
              <WaitlistForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: 'clamp(80px, 12vw, 120px) 24px', backgroundColor: 'var(--paper-warm)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal style={{ marginBottom: 56 }}>
            <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 16 }}>
              — what early users said
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                lineHeight: 1.05,
                maxWidth: 680,
              }}
            >
              people were{' '}
              <span className="serif-italic" style={{ color: 'var(--terra)' }}>
                genuinely
              </span>{' '}
              surprised.
            </h2>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {QUOTES.map((q, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div
                  style={{
                    backgroundColor: 'var(--paper)',
                    border: '1px solid var(--ink-whisper)',
                    borderRadius: 20,
                    padding: '32px 28px',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <p
                    className="serif-italic"
                    style={{
                      fontSize: 22,
                      color: 'var(--ink)',
                      lineHeight: 1.4,
                      marginBottom: 24,
                    }}
                  >
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      paddingTop: 20,
                      borderTop: '1px solid var(--ink-whisper)',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: 'var(--terra-tint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        className="mono"
                        style={{ fontSize: 11, fontWeight: 600, color: 'var(--terra)' }}
                      >
                        {q.name[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--ink-light)', letterSpacing: '0.04em' }}>
                      {q.name}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section style={{ padding: 'clamp(80px, 12vw, 120px) 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal style={{ marginBottom: 56 }}>
            <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 16 }}>
              — why join early
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                lineHeight: 1.05,
              }}
            >
              early access comes with <span className="serif-italic">perks</span>.
            </h2>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {PERKS.map((perk, i) => (
              <ScrollReveal key={perk.title} delay={i * 80}>
                <div
                  className="warm-card"
                  style={{
                    padding: 32,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      className="mono"
                      style={{ fontSize: 12, color: 'var(--ink-light)', letterSpacing: '0.1em' }}
                    >
                      {perk.no}
                    </span>
                    <div
                      aria-hidden
                      style={{
                        width: 28,
                        height: 1,
                        backgroundColor: 'var(--terra)',
                        marginTop: 8,
                      }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 600,
                        fontSize: 22,
                        color: 'var(--ink)',
                        letterSpacing: '-0.02em',
                        marginBottom: 8,
                      }}
                    >
                      {perk.title}
                    </p>
                    <p
                      style={{
                        fontSize: 15,
                        color: 'var(--ink-mid)',
                        lineHeight: 1.6,
                      }}
                    >
                      {perk.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(80px, 12vw, 120px) 24px', backgroundColor: 'var(--paper-warm)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <ScrollReveal style={{ marginBottom: 48, textAlign: 'center' }}>
            <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 12 }}>
              — faq
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                lineHeight: 1.05,
              }}
            >
              questions? <span className="serif-italic">answered.</span>
            </h2>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--ink-whisper)' }}>
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--ink-whisper)',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '24px 4px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 500,
                        fontSize: 'clamp(18px, 2.4vw, 22px)',
                        color: 'var(--ink)',
                        letterSpacing: '-0.015em',
                      }}
                    >
                      {faq.q}
                    </span>
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1px solid var(--ink-whisper)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 280ms var(--ease-out), background-color 220ms ease',
                        transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                        backgroundColor: open ? 'var(--ink)' : 'transparent',
                        color: open ? 'var(--paper)' : 'var(--ink-mid)',
                        fontSize: 18,
                        lineHeight: 1,
                      }}
                    >
                      +
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
                        <p
                          style={{
                            fontSize: 16,
                            color: 'var(--ink-mid)',
                            lineHeight: 1.7,
                            padding: '0 4px 24px',
                            maxWidth: 620,
                          }}
                        >
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        style={{
          padding: 'clamp(100px, 14vw, 160px) 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(700px 400px at 50% 50%, rgba(196,120,74,0.08), transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative' }}>
          <ScrollReveal>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(40px, 7vw, 88px)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                color: 'var(--ink)',
                lineHeight: 0.98,
                marginBottom: 24,
              }}
            >
              your voice. your messages.
              <br />
              <span className="serif-italic" style={{ color: 'var(--terra)', fontWeight: 400 }}>
                just not the blank-page panic.
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p
              style={{
                fontSize: 18,
                color: 'var(--ink-mid)',
                marginBottom: 40,
                lineHeight: 1.6,
              }}
            >
              join the waitlist. be there from day one.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Magnetic strength={0.28}>
              <button
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="btn-primary"
                style={{
                  padding: '18px 36px',
                  borderRadius: 999,
                  fontSize: 16,
                  fontFamily: 'var(--font-jakarta)',
                }}
              >
                join the waitlist
                <span aria-hidden style={{ marginLeft: 8 }}>→</span>
              </button>
            </Magnetic>
          </ScrollReveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
