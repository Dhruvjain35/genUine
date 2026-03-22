'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SiteHeaderProps {
  activePage?: 'home' | 'app' | 'pricing' | 'about';
}

export default function SiteHeader({ activePage }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'home', page: 'home' },
    { href: '/pricing', label: 'pricing', page: 'pricing' },
    { href: '/about', label: 'about', page: 'about' },
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
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
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
        </Link>

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
          <Link href="/app">
            <button
              className="btn-primary px-5 py-2 rounded-xl text-sm"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              try genUine
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
          <Link href="/app" onClick={() => setMenuOpen(false)}>
            <button
              className="btn-primary w-full py-3 rounded-xl text-sm mt-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              try genUine →
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
