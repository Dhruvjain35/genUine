'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SiteHeaderProps {
  activePage?: 'home' | 'app' | 'pricing' | 'about' | 'waitlist' | 'dashboard';
}

export default function SiteHeader({ activePage }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Admin panel state
  const [adminInputVisible, setAdminInputVisible] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adminInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check admin status on mount
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('genuine_admin') === 'true');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (adminInputVisible && adminInputRef.current) {
      adminInputRef.current.focus();
    }
  }, [adminInputVisible]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    logoClickCount.current += 1;

    if (logoClickCount.current === 1) {
      // Start 3-second window
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0;
      }, 3000);
    }

    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
      setAdminInputVisible(true);
      setAdminCode('');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET_CODE || 'genuineadmin2026';
    if (adminCode === secret) {
      localStorage.setItem('genuine_admin', 'true');
      setIsAdmin(true);
      setAdminInputVisible(false);
      setAdminCode('');
      // Dispatch event so /app page can react
      window.dispatchEvent(new Event('genuine_admin_granted'));
    } else {
      // Wrong code — disappear silently
      setAdminInputVisible(false);
      setAdminCode('');
    }
  };

  const handleAdminKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setAdminInputVisible(false);
      setAdminCode('');
    }
  };

  const navLinks = [
    { href: '/', label: 'home', page: 'home' },
    { href: '/pricing', label: 'pricing', page: 'pricing' },
    { href: '/about', label: 'about', page: 'about' },
    { href: '/dashboard', label: 'dashboard', page: 'dashboard' },
    { href: '/waitlist', label: 'waitlist', page: 'waitlist' },
  ];

  return (
    <header
      className={`site-nav fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo — 5-click admin trigger */}
        <span
          onClick={handleLogoClick}
          style={{ textDecoration: 'none', cursor: 'pointer', userSelect: 'none' }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '22px',
              color: '#2D2D2D',
              letterSpacing: '-0.02em',
            }}
          >
            gen<span style={{ color: '#C4784A' }}>U</span>ine
          </span>
          {isAdmin && (
            <span
              title="admin mode"
              style={{
                marginLeft: '4px',
                fontSize: '13px',
                color: '#C4784A',
                opacity: 0.6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ∞
            </span>
          )}
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label, page }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: activePage === page ? 600 : 400,
                color: activePage === page ? '#C4784A' : '#6B5E52',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { if (activePage !== page) e.currentTarget.style.color = '#2D2D2D'; }}
              onMouseLeave={(e) => { if (activePage !== page) e.currentTarget.style.color = '#6B5E52'; }}
            >
              {label}
            </Link>
          ))}
          <Link href="/waitlist">
            <button
              className="btn-primary px-5 py-2 rounded-xl text-sm"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              join waitlist
            </button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          <span style={{ display: 'block', width: 22, height: 2, backgroundColor: '#2D2D2D', borderRadius: 1, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, backgroundColor: '#2D2D2D', borderRadius: 1, transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 2, backgroundColor: '#2D2D2D', borderRadius: 1, transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Admin secret input */}
      {adminInputVisible && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'fadeUp 0.2s ease',
          }}
        >
          <form onSubmit={handleAdminSubmit}>
            <input
              ref={adminInputRef}
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyDown={handleAdminKeyDown}
              onBlur={() => { setAdminInputVisible(false); setAdminCode(''); }}
              placeholder="···"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(196, 120, 74, 0.3)',
                backgroundColor: '#FAF9F7',
                color: '#2D2D2D',
                outline: 'none',
                width: '140px',
                boxShadow: '0 4px 16px rgba(196, 120, 74, 0.12)',
              }}
            />
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: '#FAF9F7',
            borderTop: '1px solid rgba(196, 120, 74, 0.1)',
            padding: '20px 24px 24px',
          }}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
                color: '#2D2D2D',
                textDecoration: 'none',
                padding: '10px 0',
                borderBottom: '1px solid rgba(196, 120, 74, 0.08)',
              }}
            >
              {label}
            </Link>
          ))}
          <Link href="/waitlist" onClick={() => setMenuOpen(false)}>
            <button
              className="btn-primary w-full py-3 rounded-xl text-sm mt-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              join waitlist →
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
