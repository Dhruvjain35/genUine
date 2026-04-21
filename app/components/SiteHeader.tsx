'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface SiteHeaderProps {
  activePage?: 'home' | 'app' | 'pricing' | 'about' | 'waitlist' | 'dashboard';
}

const NAV_LINKS = [
  { href: '/', label: 'home', page: 'home' },
  { href: '/about', label: 'about', page: 'about' },
  { href: '/pricing', label: 'pricing', page: 'pricing' },
  { href: '/dashboard', label: 'dashboard', page: 'dashboard' },
] as const;

export default function SiteHeader({ activePage }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [adminInputVisible, setAdminInputVisible] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adminInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 14);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('genuine_admin') === 'true');
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (adminInputVisible && adminInputRef.current) adminInputRef.current.focus();
  }, [adminInputVisible]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    logoClickCount.current += 1;
    if (logoClickCount.current === 1) {
      logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 3000);
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
      window.dispatchEvent(new Event('genuine_admin_granted'));
    } else {
      setAdminInputVisible(false);
      setAdminCode('');
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className={`site-nav fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo — 5-click admin trigger */}
          <button
            onClick={handleLogoClick}
            aria-label="genUine — home"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              userSelect: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="#1A1714" strokeWidth="1.4" />
              <path d="M6.5 12.5a5.5 5.5 0 0 0 11 0V10a5.5 5.5 0 0 0-11 0" stroke="#C4784A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="12" cy="12" r="1.6" fill="#1A1714" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 700,
                fontSize: '19px',
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}
            >
              gen<span style={{ color: 'var(--terra)' }}>U</span>ine
            </span>
            {isAdmin && (
              <span
                title="admin mode"
                style={{
                  marginLeft: 2,
                  fontSize: 12,
                  color: 'var(--terra)',
                  opacity: 0.7,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ∞
              </span>
            )}
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" style={{ gap: 28 }}>
            {NAV_LINKS.map(({ href, label, page }) => (
              <Link
                key={href}
                href={href}
                className="nav-link"
                data-active={activePage === page}
              >
                {label}
              </Link>
            ))}
            <Link href="/waitlist" aria-label="join waitlist">
              <span
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  borderRadius: '999px',
                  fontSize: 13,
                  fontFamily: 'var(--font-jakarta)',
                }}
              >
                join waitlist
                <span aria-hidden="true" style={{ marginLeft: 2 }}>→</span>
              </span>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="menu"
            style={{ gap: 5, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ display: 'block', width: 22, height: 1.6, backgroundColor: 'var(--ink)', borderRadius: 1, transition: 'transform 0.22s var(--ease-out), opacity 0.22s ease', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.6, backgroundColor: 'var(--ink)', borderRadius: 1, transition: 'opacity 0.22s ease', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 1.6, backgroundColor: 'var(--ink)', borderRadius: 1, transition: 'transform 0.22s var(--ease-out)', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* Admin secret input */}
        <AnimatePresence>
          {adminInputVisible && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: 'absolute',
                top: '64px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <form onSubmit={handleAdminSubmit}>
                <input
                  ref={adminInputRef}
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape') { setAdminInputVisible(false); setAdminCode(''); } }}
                  onBlur={() => { setAdminInputVisible(false); setAdminCode(''); }}
                  placeholder="···"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    padding: '8px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--ink-whisper)',
                    backgroundColor: 'var(--paper-contrast)',
                    color: 'var(--ink)',
                    outline: 'none',
                    width: 160,
                    boxShadow: '0 10px 32px rgba(26,23,20,0.12)',
                  }}
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden"
            style={{
              position: 'fixed',
              inset: '64px 0 0 0',
              backgroundColor: 'var(--paper)',
              zIndex: 40,
              padding: '40px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {NAV_LINKS.map(({ href, label, page }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 34,
                    fontWeight: 600,
                    letterSpacing: '-0.025em',
                    color: activePage === page ? 'var(--ink)' : 'var(--ink-mid)',
                    textDecoration: 'none',
                    padding: '12px 0',
                  }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{ marginTop: 24 }}
            >
              <Link href="/waitlist" onClick={() => setMenuOpen(false)}>
                <button
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: 14,
                    fontSize: 15,
                  }}
                >
                  join waitlist →
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
