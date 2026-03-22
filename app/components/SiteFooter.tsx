'use client';

import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: '#FAF9F7',
        borderTop: '1px solid rgba(196, 120, 74, 0.1)',
        padding: '48px 24px 32px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: '24px',
                color: '#2D2D2D',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              gen<span style={{ color: '#C4784A' }}>U</span>ine
            </div>
            <p style={{ fontSize: '13px', color: '#A08C7C', maxWidth: '200px', lineHeight: 1.6 }}>
              the U in every conversation.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#A08C7C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>product</p>
              {[
                { href: '/app', label: 'try genUine' },
                { href: '/pricing', label: 'pricing' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: '14px', color: '#6B5E52', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.15s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = '#C4784A'}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = '#6B5E52'}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#A08C7C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>company</p>
              {[
                { href: '/about', label: 'about' },
                { href: '/', label: 'home' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: '14px', color: '#6B5E52', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.15s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = '#C4784A'}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = '#6B5E52'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(196, 120, 74, 0.08)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#A08C7C' }}>
            built with ❤️ by shaan
          </p>
          <p style={{ fontSize: '13px', color: '#C4784A', fontWeight: 500 }}>
            genUine — the U in every conversation
          </p>
        </div>
      </div>
    </footer>
  );
}
