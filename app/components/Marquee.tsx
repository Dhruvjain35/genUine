'use client';

import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
}

// CSS-only marquee, off-main-thread. Children render twice for seamless loop.
export default function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  reverse = false,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`marquee-root ${className}`}
      style={{
        overflow: 'hidden',
        width: '100%',
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap: '48px',
          width: 'max-content',
          animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : 'normal'}`,
        }}
      >
        <div style={{ display: 'flex', gap: '48px' }}>{children}</div>
        <div style={{ display: 'flex', gap: '48px' }} aria-hidden="true">{children}</div>
      </div>
      <style jsx>{`
        .marquee-root:hover .marquee-track {
          ${pauseOnHover ? 'animation-play-state: paused;' : ''}
        }
      `}</style>
    </div>
  );
}
