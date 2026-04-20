'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['3 messages per day', 'Voice saving', 'Profile analysis'],
    cta: 'Join Waitlist',
    href: '/waitlist',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    features: ['Unlimited messages', 'Advanced voice matching', 'Priority support', 'Personality profiles'],
    cta: 'Go Pro →',
    href: '/pricing',
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter font-jakarta mb-6">
            Start free. Go pro when you're ready.
          </h2>
          <p className="text-xl text-black/50 font-medium">
            3 messages a day, free forever. Unlimited with Pro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-10 rounded-[32px] border transition-all duration-500",
                plan.featured 
                  ? "bg-black text-white border-black shadow-2xl shadow-black/20 scale-105" 
                  : "bg-[#FAF9F7] text-black border-black/5"
              )}
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className={plan.featured ? "text-white/50" : "text-black/40"}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-medium">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      plan.featured ? "bg-white/10 text-white" : "bg-black/5 text-black"
                    )}>
                      <Check size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all",
                  plan.featured 
                    ? "bg-[#C4784A] text-white hover:bg-[#A5623A]" 
                    : "bg-white text-black border border-black/10 hover:bg-gray-50"
                )}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
