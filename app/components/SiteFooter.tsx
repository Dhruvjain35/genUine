'use client';

import Link from 'next/link';

const PRODUCT = [
  { href: '/app', label: 'try genUine' },
  { href: '/pricing', label: 'pricing' },
  { href: '/dashboard', label: 'dashboard' },
];

const COMPANY = [
  { href: '/about', label: 'about' },
  { href: '/waitlist', label: 'waitlist' },
  { href: '/', label: 'home' },
];

export default function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--paper-warm)',
        borderTop: '1px solid var(--ink-whisper)',
        padding: '72px 24px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Oversized wordmark — design-forward, motionsites-style */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-28%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-jakarta)',
          fontSize: 'clamp(120px, 28vw, 360px)',
          fontWeight: 800,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(26,23,20,0.08)',
          letterSpacing: '-0.04em',
          lineHeight: 0.8,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        gen<span style={{ WebkitTextStroke: '1px rgba(196,120,74,0.28)' }}>U</span>ine
      </div>

      <div style={{ position: 'relative', maxWidth: '1180px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '48px',
            marginBottom: '80px',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 700,
                fontSize: '22px',
                color: 'var(--ink)',
                letterSpacing: '-0.025em',
                marginBottom: 12,
              }}
            >
              gen<span style={{ color: 'var(--terra)' }}>U</span>ine
            </div>
            <p
              className="serif-italic"
              style={{
                fontSize: 18,
                color: 'var(--ink-mid)',
                maxWidth: 240,
                lineHeight: 1.4,
              }}
            >
              the U in every conversation.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="eyebrow" style={{ color: 'var(--ink-light)', marginBottom: 18 }}>
              product
            </p>
            {PRODUCT.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'block',
                  fontSize: 15,
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  marginBottom: 10,
                  transition: 'color 220ms ease, transform 220ms var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--terra)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--ink-soft)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p className="eyebrow" style={{ color: 'var(--ink-light)', marginBottom: 18 }}>
              company
            </p>
            {COMPANY.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'block',
                  fontSize: 15,
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  marginBottom: 10,
                  transition: 'color 220ms ease, transform 220ms var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--terra)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--ink-soft)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Pointer */}
          <div>
            <p className="eyebrow" style={{ color: 'var(--ink-light)', marginBottom: 18 }}>
              currently
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 12 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: 'var(--terra)',
                  marginRight: 10,
                  verticalAlign: 'middle',
                }}
                className="pulse-dot"
              />
              onboarding waitlist
            </p>
            <Link
              href="/waitlist"
              className="nav-link"
              style={{ fontSize: 14, fontFamily: 'var(--font-jakarta)', fontWeight: 500 }}
            >
              reserve your spot →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            paddingTop: 24,
            borderTop: '1px solid var(--ink-whisper)',
          }}
        >
          <p
            className="mono"
            style={{ fontSize: 12, color: 'var(--ink-light)', letterSpacing: '0.02em' }}
          >
            © {new Date().getFullYear()} genUine · built by shaan
          </p>
          <p
            className="serif-italic"
            style={{ fontSize: 15, color: 'var(--ink-soft)' }}
          >
            see u later — shaan
          </p>
        </div>
      </div>
    </footer>
  );
}
