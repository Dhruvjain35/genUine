'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ScrollReveal from '../components/ScrollReveal';

const FREE_FEATURES = [
  '3 messages per day',
  'voice saving — set it once',
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

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        setError(data.error);
      }
    } catch {
      setError('something went wrong. try again?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <SiteHeader activePage="pricing" />

      <div style={{ paddingTop: '100px', paddingBottom: '80px', padding: '100px 24px 80px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          {/* Header */}
          <ScrollReveal style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#C4784A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              pricing
            </p>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 800, letterSpacing: '-0.03em',
                color: '#2D2D2D', marginBottom: '16px',
              }}
            >
              start free. go pro when you&apos;re ready.
            </h1>
            <p style={{ fontSize: '17px', color: '#6B5E52', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
              3 free messages a day, forever. unlimited when you&apos;re serious about it.
            </p>
          </ScrollReveal>

          {/* Billing toggle */}
          <ScrollReveal style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex', backgroundColor: '#FFFFFF',
                borderRadius: '100px', padding: '4px',
                border: '1px solid rgba(196, 120, 74, 0.15)',
                boxShadow: '0 2px 12px rgba(196, 120, 74, 0.06)',
              }}
            >
              {(['monthly', 'yearly'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  style={{
                    padding: '8px 20px', borderRadius: '100px', fontSize: '14px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                    backgroundColor: billing === b ? '#C4784A' : 'transparent',
                    color: billing === b ? '#FFFFFF' : '#6B5E52',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {b === 'yearly' ? 'yearly (save 31%)' : 'monthly'}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>

            {/* Free */}
            <ScrollReveal delay={0}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(196, 120, 74, 0.15)',
                  borderRadius: '24px',
                  padding: '36px 32px',
                  height: '100%',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#A08C7C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>free</p>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '48px', fontWeight: 800, color: '#2D2D2D', letterSpacing: '-0.03em' }}>$0</span>
                </div>
                <p style={{ fontSize: '14px', color: '#A08C7C', marginBottom: '28px' }}>forever, no card needed</p>

                <div style={{ marginBottom: '32px' }}>
                  {FREE_FEATURES.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'rgba(196, 120, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4784A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '14px', color: '#6B5E52' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/app">
                  <button
                    className="btn-ghost"
                    style={{ width: '100%', padding: '13px', borderRadius: '13px', fontSize: '15px' }}
                  >
                    get started — it&apos;s free
                  </button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Pro */}
            <ScrollReveal delay={120}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #C4784A 0%, #A5623A 100%)',
                  borderRadius: '24px',
                  padding: '36px 32px',
                  height: '100%',
                  position: 'relative',
                  boxShadow: '0 12px 40px rgba(196, 120, 74, 0.3)',
                }}
              >
                {/* Badge */}
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#F2A922', borderRadius: '100px', padding: '4px 14px', fontSize: '11px', fontWeight: 800, color: '#2D2D2D', fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}>
                  most popular
                </div>

                <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>pro</p>

                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '48px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                    {billing === 'yearly' ? '$8' : '$12'}
                  </span>
                  <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', paddingBottom: '10px' }}>/mo</span>
                </div>

                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '28px' }}>
                  {billing === 'yearly' ? 'billed $99/year — save 31%' : 'billed monthly'}
                </p>

                <div style={{ marginBottom: '32px' }}>
                  {PRO_FEATURES.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'rgba(242, 169, 34, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F2A922" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleCheckout(billing)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px', borderRadius: '13px',
                    backgroundColor: '#FFFFFF', color: '#C4784A',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: '15px',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {loading ? 'redirecting...' : 'go pro — unlimited messages →'}
                </button>

                {error && (
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: '10px' }}>
                    {error}
                  </p>
                )}

                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '12px' }}>
                  cancel anytime. no questions asked.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* FAQ */}
          <ScrollReveal style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#A08C7C', lineHeight: 1.7 }}>
              questions? reach out on{' '}
              <a href="https://linkedin.com" style={{ color: '#C4784A', textDecoration: 'none', fontWeight: 600 }}>linkedin</a>
              {' '}or just try the free version first.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
