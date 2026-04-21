'use client';

import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  style?: React.CSSProperties;
  mode?: 'word' | 'line';
}

// Word-by-word reveal. Each word rises from below its own mask
// with a stagger. The result reads as one line but animates as many.
export default function AnimatedHeading({
  text,
  delay = 0,
  as = 'h1',
  className = '',
  style = {},
  mode = 'word',
}: AnimatedHeadingProps) {
  const MotionTag = motion[as] as typeof motion.h1;

  if (mode === 'line') {
    return (
      <MotionTag
        className={className}
        style={style}
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.06, delayChildren: delay }}
      >
        <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <motion.span
            variants={{
              hidden: { y: '110%' },
              show: { y: 0 },
            }}
            transition={{ duration: 1.05, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'inline-block' }}
          >
            {text}
          </motion.span>
        </span>
      </MotionTag>
    );
  }

  const words = text.split(' ');

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            marginRight: i < words.length - 1 ? '0.28em' : 0,
          }}
        >
          <motion.span
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.95, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
