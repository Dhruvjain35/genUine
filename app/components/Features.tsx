'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Teach genUine your voice',
    desc: "Paste 3 messages you've sent before. LinkedIn messages, texts, anything where you sounded like yourself.",
  },
  {
    num: '02',
    title: 'Paste a LinkedIn profile',
    desc: "Grab their name, headline, about section — whatever's available. Even a messy mobile paste works.",
  },
  {
    num: '03',
    title: 'Get your message',
    desc: "Two options, both in your voice. Copy the one that feels right. That's it.",
  },
];

export default function Features() {
  return (
    <section id="how-it-works" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          <div className="md:w-1/3 sticky top-32">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter font-jakarta mb-6">
              Three steps to a<br />
              <span className="text-[#C4784A]">real message</span>
            </h2>
            <p className="text-lg text-black/50 font-medium">
              Under 2 minutes from start to sent. No generic templates, just your actual voice.
            </p>
          </div>

          <div className="md:w-2/3 space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="text-8xl font-black text-black/[0.03] absolute -top-10 -left-10 select-none group-hover:text-[#C4784A]/[0.05] transition-colors">
                  {step.num}
                </div>
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-4 font-jakarta">{step.title}</h3>
                  <p className="text-xl text-black/60 leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
