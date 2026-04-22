'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Orbiting ring config
const RINGS = [
  { rx: 110, ry: 36, duration: 12, delay: 0, opacity: 0.18 },
  { rx: 90, ry: 28, duration: 9, delay: -3, opacity: 0.12 },
  { rx: 130, ry: 44, duration: 16, delay: -6, opacity: 0.1 },
];

// Floating particle words — actual voice traits
const TRAITS = [
  { text: 'lowercase', angle: 15, r: 148, duration: 22, delay: 0 },
  { text: 'curious', angle: 75, r: 162, duration: 19, delay: -4 },
  { text: 'no full stops', angle: 140, r: 155, duration: 25, delay: -8 },
  { text: 'short opener', angle: 210, r: 160, duration: 20, delay: -12 },
  { text: 'warm', angle: 270, r: 150, duration: 17, delay: -2 },
  { text: 'direct', angle: 330, r: 156, duration: 23, delay: -16 },
];

interface SplineSceneProps {
  style?: React.CSSProperties;
  className?: string;
  scene?: string; // kept for API compat, unused
}

export default function SplineScene({ style, className }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 18 });

  const rotateY = useTransform(springX, [-1, 1], [-18, 18]);
  const rotateX = useTransform(springY, [-1, 1], [12, -12]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      rawX.set(((e.clientX - left) / width - 0.5) * 2);
      rawY.set(((e.clientY - top) / height - 0.5) * 2);
    };
    const reset = () => { rawX.set(0); rawY.set(0); };
    el.addEventListener('mousemove', handle);
    el.addEventListener('mouseleave', reset);
    return () => { el.removeEventListener('mousemove', handle); el.removeEventListener('mouseleave', reset); };
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <motion.div
        style={{
          position: 'relative',
          width: 320,
          height: 320,
          rotateY,
          rotateX,
          transformStyle: 'preserve-3d',
          perspective: 800,
        }}
      >
        {/* Core orb */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1, 0.98, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: '60px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(224, 160, 58, 0.55) 0%, rgba(196, 120, 74, 0.45) 35%, rgba(26, 23, 20, 0.12) 70%, transparent 100%)',
            boxShadow: '0 0 80px rgba(196, 120, 74, 0.35), inset 0 0 40px rgba(224, 160, 58, 0.2)',
            backdropFilter: 'blur(2px)',
          }}
        />

        {/* Inner glow */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: '90px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(250, 248, 244, 0.9) 0%, rgba(224, 160, 58, 0.6) 40%, transparent 70%)',
          }}
        />

        {/* SVG rings */}
        <svg
          width="320"
          height="320"
          viewBox="-160 -160 320 320"
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden="true"
        >
          {RINGS.map((ring, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="0"
              rx={ring.rx}
              ry={ring.ry}
              fill="none"
              stroke="var(--terra)"
              strokeWidth="0.8"
              strokeDasharray="4 6"
              opacity={ring.opacity}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur={`${ring.duration}s`}
                begin={`${ring.delay}s`}
                repeatCount="indefinite"
              />
            </ellipse>
          ))}

          {/* Orbiting dots */}
          {[0, 120, 240].map((startAngle, i) => (
            <circle key={`dot-${i}`} r="3.5" fill="var(--terra)" opacity="0.7">
              <animateMotion
                dur={`${10 + i * 3}s`}
                repeatCount="indefinite"
                begin={`${-i * 3}s`}
              >
                <mpath href={`#orbit-${i}`} />
              </animateMotion>
            </circle>
          ))}

          {[0, 120, 240].map((_, i) => (
            <ellipse
              key={`path-${i}`}
              id={`orbit-${i}`}
              cx="0"
              cy="0"
              rx={RINGS[i % RINGS.length].rx}
              ry={RINGS[i % RINGS.length].ry}
              fill="none"
              style={{ display: 'none' }}
            />
          ))}
        </svg>

        {/* Floating trait labels */}
        {TRAITS.map((trait, i) => {
          const rad = (trait.angle * Math.PI) / 180;
          const x = Math.cos(rad) * trait.r * 0.42;
          const y = Math.sin(rad) * trait.r * 0.42;
          return (
            <motion.span
              key={i}
              animate={{
                opacity: [0.35, 0.85, 0.35],
                y: [y, y - 6, y],
              }}
              transition={{
                duration: trait.duration * 0.4,
                delay: trait.delay * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                fontFamily: 'var(--font-enrique), Outfit, sans-serif',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--terra)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {trait.text}
            </motion.span>
          );
        })}

        {/* Waveform bars at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 3,
            alignItems: 'flex-end',
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              animate={{
                height: ['4px', `${8 + Math.sin(i * 0.8) * 14 + 8}px`, '4px'],
                opacity: [0.3, 0.9, 0.3],
              }}
              transition={{
                duration: 1.6 + Math.sin(i * 0.5) * 0.6,
                delay: i * 0.08,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                display: 'block',
                width: 3,
                borderRadius: 2,
                backgroundColor: 'var(--terra)',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
