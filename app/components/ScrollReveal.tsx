'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  y?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  style = {},
  y = 28,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '0px 0px -80px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y, filter: 'blur(4px)' }
      }
      transition={{
        duration: 0.9,
        ease: [0.23, 1, 0.32, 1],
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
