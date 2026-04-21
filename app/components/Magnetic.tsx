'use client';

import { useRef, useState, MouseEvent } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticProps {
 children: React.ReactNode;
 strength?: number;
 className?: string;
 style?: React.CSSProperties;
}

// Subtle cursor-following magnet for CTAs. Spring-based so it feels alive.
export default function Magnetic({
 children,
 strength = 0.22,
 className = '',
 style = {},
}: MagneticProps) {
 const ref = useRef<HTMLDivElement>(null);
 const [hovered, setHovered] = useState(false);

 const x = useSpring(0, { stiffness: 180, damping: 16, mass: 0.4 });
 const y = useSpring(0, { stiffness: 180, damping: 16, mass: 0.4 });

 const handleMove = (e: MouseEvent<HTMLDivElement>) => {
 const el = ref.current;
 if (!el) return;
 const rect = el.getBoundingClientRect();
 const relX = e.clientX - (rect.left + rect.width / 2);
 const relY = e.clientY - (rect.top + rect.height / 2);
 x.set(relX * strength);
 y.set(relY * strength);
 };

 const handleLeave = () => {
 x.set(0);
 y.set(0);
 setHovered(false);
 };

 return (
 <motion.div
 ref={ref}
 className={className}
 onMouseEnter={() => setHovered(true)}
 onMouseMove={handleMove}
 onMouseLeave={handleLeave}
 style={{ ...style, x, y, display: 'inline-block' }}
 data-hovered={hovered}
 >
 {children}
 </motion.div>
 );
}
