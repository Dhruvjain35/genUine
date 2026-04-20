'use client';

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Comparison from './components/Comparison';
import Pricing from './components/Pricing';
import SiteFooter from './components/SiteFooter';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F7] selection:bg-[#C4784A]/30">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Social Proof / Stats Section */}
        <section className="py-20 border-y border-black/5 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-[#C4784A] mb-2">40+</div>
                <p className="text-sm font-bold text-black/40 uppercase tracking-widest">Customer Discovery</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-[#C4784A] mb-2">50+</div>
                <p className="text-sm font-bold text-black/40 uppercase tracking-widest">People Waiting</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-[#C4784A] mb-2">6</div>
                <p className="text-sm font-bold text-black/40 uppercase tracking-widest">Team Members</p>
              </div>
            </div>
          </div>
        </section>

        <Features />
        
        <Comparison />
        
        <Pricing />

        {/* Final CTA */}
        <section className="py-32 bg-black text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#C4784A] rounded-full blur-[200px]" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter font-jakarta mb-8">
                Stop staring at the<br />
                <span className="text-[#C4784A]">blank message box.</span>
              </h2>
              <p className="text-xl text-white/50 font-medium mb-12 max-w-2xl mx-auto">
                Your next real conversation is one message away. Join the waitlist and start sounding like yourself again.
              </p>
              <button className="px-10 py-5 bg-white text-black font-black text-lg rounded-2xl hover:scale-105 transition-transform">
                Join the waitlist — it's free →
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
