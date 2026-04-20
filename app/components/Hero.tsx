'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FAF9F7]">
      {/* Background Spline Element - Minimal and Premium */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Suspense fallback={null}>
          <Spline scene="https://prod.spline.design/6Wq1Q7YRyS2Zv3h8/scene.splinecode" />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-[#C4784A] bg-[#C4784A]/10 rounded-full">
            The Future of Personal Messaging
          </span>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 font-jakarta leading-[0.9]">
            your message.<br />
            <span className="text-black/30">not AI's.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-lg md:text-xl text-black/60 font-medium leading-relaxed mb-12">
            genUine learns how you write, then helps you start LinkedIn conversations that actually sound like you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#C4784A] text-white font-bold rounded-2xl shadow-2xl shadow-[#C4784A]/20 transition-all"
            >
              Join the Waitlist
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl border border-black/5 shadow-xl shadow-black/5 transition-all"
            >
              See how it works
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#FAF9F7] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
