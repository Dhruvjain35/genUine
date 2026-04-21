'use client';

import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedHeading from '../components/AnimatedHeading';
import Magnetic from '../components/Magnetic';
import ScrollProgress from '../components/ScrollProgress';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      <ScrollProgress />
      <SiteHeader activePage="about" />

      {/* Hero */}
      <section style={{ padding: '140px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(1000px 420px at 80% 0%, rgba(196,120,74,0.08), transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative' }}>
          <ScrollReveal>
            <p className="eyebrow" style={{ color: 'var(--terra)', marginBottom: 16 }}>
              — about gen<span style={{ fontWeight: 800 }}>U</span>ine
            </p>
          </ScrollReveal>

          <AnimatedHeading
            as="h1"
            text="built because cold messages are the worst."
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(44px, 7vw, 84px)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 0.98,
              color: 'var(--ink)',
              marginBottom: 28,
            }}
          />

          <ScrollReveal delay={180}>
            <p
              className="serif-italic"
              style={{
                fontSize: 'clamp(22px, 2.4vw, 30px)',
                color: 'var(--ink-mid)',
                lineHeight: 1.35,
                maxWidth: 680,
              }}
            >
              a story about blank boxes, try-hard openers, and the quiet belief that you already
              know how to say it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <ScrollReveal delay={80}>
            <div
              style={{
                fontFamily: 'var(--font-dm)',
                fontSize: 19,
                color: 'var(--ink-soft)',
                lineHeight: 1.75,
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
              }}
            >
              <p>
                every week i&apos;d sit down to message someone on linkedin and just stare at the
                blank box. i knew what i wanted to say but every attempt came out either too
                corporate, too try-hard, or obviously AI-generated.
              </p>
              <p>
                the tools that existed would write you a{' '}
                <span className="serif-italic" style={{ color: 'var(--ink)' }}>
                  &ldquo;professional&rdquo;
                </span>{' '}
                message. which is a nice way of saying: a message that sounds exactly like everyone
                else&apos;s message.
              </p>
              <p>
                genUine started as a simple idea: what if an AI actually learned{' '}
                <em className="serif-italic" style={{ color: 'var(--ink)' }}>
                  how you specifically talk
                </em>
                , not just how to sound human in general? your lowercase. your punctuation habits.
                the specific way you start a sentence or end a thought.
              </p>
              <p>
                that&apos;s what we&apos;re building. messages that sound like you on your best
                day, not a template that sounds like nobody.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The name — oversized editorial pullquote */}
      <section style={{ padding: '80px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal>
            <div
              style={{
                borderTop: '1px solid var(--ink-whisper)',
                borderBottom: '1px solid var(--ink-whisper)',
                padding: '56px 0',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: 24,
              }}
            >
              <p className="eyebrow" style={{ color: 'var(--ink-light)' }}>
                about the name
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(32px, 4.5vw, 56px)',
                  letterSpacing: '-0.015em',
                  color: 'var(--ink)',
                  lineHeight: 1.15,
                  fontWeight: 400,
                }}
              >
                &ldquo;genUine was named by Noah Oh. the{' '}
                <span style={{ color: 'var(--terra)', fontStyle: 'normal', fontWeight: 600 }}>
                  U
                </span>{' '}
                in every conversation is what makes it real.&rdquo;
              </p>
              <p style={{ fontSize: 16, color: 'var(--ink-mid)', lineHeight: 1.6, maxWidth: 640 }}>
                it&apos;s not just genuine as in authentic — it&apos;s gen
                <strong style={{ color: 'var(--terra)' }}>U</strong>ine as in{' '}
                <em className="serif-italic" style={{ color: 'var(--ink)' }}>
                  you
                </em>{' '}
                are the point.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal>
            <p className="eyebrow" style={{ color: 'var(--ink-light)', marginBottom: 20 }}>
              — the team
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(32px, 4.2vw, 56px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                lineHeight: 1.05,
                marginBottom: 48,
                maxWidth: 720,
              }}
            >
              two people, one obsession: the gap between{' '}
              <span className="serif-italic">what you mean</span> and{' '}
              <span className="serif-italic">what you send</span>.
            </h2>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 24,
            }}
          >
            {[
              {
                name: 'Shaan',
                role: 'Founder',
                desc: 'building things that feel human. obsessed with the gap between what people mean and what they send.',
                no: '01',
              },
              {
                name: 'Noah Oh',
                role: 'Head of Design',
                desc: 'the reason genUine looks the way it does. also the reason the U is capitalized.',
                no: '02',
              },
            ].map((person, i) => (
              <ScrollReveal key={person.name} delay={120 + i * 80}>
                <div
                  className="warm-card"
                  style={{
                    padding: 32,
                    minHeight: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
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
                      style={{
                        fontSize: 12,
                        color: 'var(--ink-light)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {person.no}
                    </span>
                    <span
                      className="eyebrow"
                      style={{ color: 'var(--terra)', fontSize: 11 }}
                    >
                      {person.role}
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 700,
                        fontSize: 32,
                        letterSpacing: '-0.025em',
                        color: 'var(--ink)',
                        marginBottom: 12,
                      }}
                    >
                      {person.name}
                    </p>
                    <p
                      style={{
                        fontSize: 15,
                        color: 'var(--ink-mid)',
                        lineHeight: 1.6,
                        maxWidth: 360,
                      }}
                    >
                      {person.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 24px 140px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <ScrollReveal>
            <p
              className="serif-italic"
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: 'var(--ink)',
                lineHeight: 1.2,
                marginBottom: 36,
              }}
            >
              want to try it?
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <Magnetic strength={0.28}>
              <Link href="/app" style={{ textDecoration: 'none' }}>
                <span
                  className="btn-primary"
                  style={{
                    padding: '18px 34px',
                    borderRadius: 999,
                    fontSize: 16,
                    fontFamily: 'var(--font-jakarta)',
                  }}
                >
                  try gen<span style={{ color: 'var(--terra)' }}>U</span>ine — it&apos;s free
                  <span aria-hidden style={{ marginLeft: 8 }}>→</span>
                </span>
              </Link>
            </Magnetic>
          </ScrollReveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
