import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ScrollReveal from '../components/ScrollReveal';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <SiteHeader activePage="about" />

      <div style={{ paddingTop: '100px', paddingBottom: '80px', padding: '100px 24px 80px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>

          {/* Header */}
          <ScrollReveal>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              about genUine
            </p>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: '#2D2D2D', marginBottom: '24px', lineHeight: 1.15,
              }}
            >
              built because cold messages are the worst.
            </h1>
          </ScrollReveal>

          {/* Story */}
          <ScrollReveal delay={80}>
            <div style={{ fontSize: '16px', color: '#6B5E52', lineHeight: 1.8, marginBottom: '40px' }}>
              <p style={{ marginBottom: '16px' }}>
                every week i&apos;d sit down to message someone on linkedin and just stare at the blank box. i knew what i wanted to say but every attempt came out either too corporate, too try-hard, or obviously AI-generated.
              </p>
              <p style={{ marginBottom: '16px' }}>
                the tools that existed would write you a "professional" message. which is a nice way of saying: a message that sounds exactly like everyone else&apos;s message.
              </p>
              <p style={{ marginBottom: '16px' }}>
                genUine started as a simple idea: what if an AI actually learned <em>how you specifically talk</em>, not just how to sound human in general? your lowercase. your punctuation habits. the specific way you start a sentence or end a thought.
              </p>
              <p>
                that&apos;s what we&apos;re building. messages that sound like you on your best day, not a template that sounds like nobody.
              </p>
            </div>
          </ScrollReveal>

          {/* The name */}
          <ScrollReveal delay={120}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(196, 120, 74, 0.15)',
                borderRadius: '20px',
                padding: '28px',
                marginBottom: '48px',
                boxShadow: '0 4px 20px rgba(196, 120, 74, 0.06)',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#C4784A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                about the name
              </p>
              <p style={{ fontSize: '15px', color: '#2D2D2D', lineHeight: 1.7 }}>
                genUine was named by Noah Oh. the <strong style={{ color: '#C4784A' }}>U</strong> in every conversation is what makes it real. it&apos;s not just genuine as in authentic — it&apos;s gen<strong>U</strong>ine as in <em>you</em> are the point.
              </p>
            </div>
          </ScrollReveal>

          {/* Team */}
          <ScrollReveal delay={160}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
              the team
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
              {[
                { name: 'Shaan', role: 'Founder', desc: 'building things that feel human. obsessed with the gap between what people mean and what they send.' },
                { name: 'Noah Oh', role: 'Head of Design', desc: 'the reason genUine looks the way it does. also the reason the U is capitalized.' },
              ].map(person => (
                <div
                  key={person.name}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(196, 120, 74, 0.1)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: '50%',
                      backgroundColor: 'rgba(196, 120, 74, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#C4784A' }}>
                      {person.name[0]}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '16px', color: '#2D2D2D', marginBottom: '2px' }}>
                      {person.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#C4784A', fontWeight: 600, marginBottom: '8px' }}>{person.role}</p>
                    <p style={{ fontSize: '14px', color: '#6B5E52', lineHeight: 1.6 }}>{person.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal delay={200} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: '#6B5E52', marginBottom: '24px', lineHeight: 1.6 }}>
              want to try it?
            </p>
            <Link href="/app">
              <button
                className="btn-primary"
                style={{ padding: '14px 36px', borderRadius: '14px', fontSize: '16px' }}
              >
                try genUine — it&apos;s free →
              </button>
            </Link>
          </ScrollReveal>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
