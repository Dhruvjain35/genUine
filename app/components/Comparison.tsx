'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function Comparison() {
  return (
    <section className="py-32 bg-[#FAF9F7]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter font-jakarta mb-6">
            Not another AI writing tool
          </h2>
          <p className="text-xl text-black/50 font-medium max-w-2xl mx-auto">
            Other tools write messages that sound human. genUine writes messages that sound like <strong>YOU</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Generic AI */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-white border border-black/5 shadow-xl shadow-black/[0.02]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <X size={20} />
              </div>
              <span className="font-bold text-lg">Generic AI</span>
            </div>
            <div className="space-y-4 text-black/40 italic">
              <p className="p-4 bg-gray-50 rounded-xl">"I hope this message finds you well."</p>
              <p className="p-4 bg-gray-50 rounded-xl">"I came across your profile and was truly impressed by your experience."</p>
              <p className="p-4 bg-gray-50 rounded-xl">"I'd love to explore potential synergies between our work."</p>
            </div>
          </motion.div>

          {/* genUine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-white border-2 border-[#C4784A] shadow-2xl shadow-[#C4784A]/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 bg-[#C4784A] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                Your Voice
              </div>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <Check size={20} />
              </div>
              <span className="font-bold text-lg text-[#C4784A]">genUine</span>
            </div>
            <div className="space-y-4 text-black/80 font-medium">
              <p className="p-6 bg-[#C4784A]/5 rounded-2xl border border-[#C4784A]/10 leading-relaxed">
                "yo i saw your post about building in public, that really hit. been doing the same thing with my project and honestly the accountability side is what keeps me going. how long have you been at it?"
              </p>
              <p className="text-sm text-black/40 text-center pt-4">
                Sounds like a human wrote it. Because, in a way, one did.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
