'use client';

import React from 'react';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-[#FAF9F7] border-t border-black/5 py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter font-jakarta mb-6 block">
              gen<span className="text-[#C4784A]">U</span>ine
            </Link>
            <p className="text-black/40 font-medium max-w-xs leading-relaxed">
              The U in every conversation. Helping you maintain authenticity in the age of AI.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black/30 mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/app" className="text-sm font-bold text-black/60 hover:text-[#C4784A] transition-colors">Try genUine</Link></li>
              <li><Link href="/pricing" className="text-sm font-bold text-black/60 hover:text-[#C4784A] transition-colors">Pricing</Link></li>
              <li><Link href="/waitlist" className="text-sm font-bold text-black/60 hover:text-[#C4784A] transition-colors">Waitlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black/30 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm font-bold text-black/60 hover:text-[#C4784A] transition-colors">About</Link></li>
              <li><Link href="/" className="text-sm font-bold text-black/60 hover:text-[#C4784A] transition-colors">Home</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-black/30 uppercase tracking-widest">
            © 2026 genUine. Built with ❤️ by Shaan.
          </p>
          <div className="flex gap-8">
            <p className="text-xs font-bold text-[#C4784A] uppercase tracking-widest">
              The U in every conversation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
