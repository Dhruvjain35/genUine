'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../utils';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-3" : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="text-2xl font-bold tracking-tighter font-jakarta">
          gen<span className="text-[#C4784A]">U</span>ine
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm font-medium text-black/60 hover:text-black transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/waitlist">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-black/90 transition-all shadow-lg shadow-black/10"
          >
            Join Waitlist
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  );
}
