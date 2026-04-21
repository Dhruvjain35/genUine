'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#C4784A', '#F2A922', '#FAF9F7', '#E8C99A', '#D4956B'];

interface Particle {
 x: number;
 y: number;
 vx: number;
 vy: number;
 color: string;
 size: number;
 angle: number;
 spin: number;
 opacity: number;
}

export default function Confetti() {
 const canvasRef = useRef<HTMLCanvasElement>(null);

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;

 const particles: Particle[] = Array.from({ length: 80 }, () => ({
 x: Math.random() * canvas.width,
 y: -20,
 vx: (Math.random() - 0.5) * 4,
 vy: Math.random() * 3 + 2,
 color: COLORS[Math.floor(Math.random() * COLORS.length)],
 size: Math.random() * 8 + 4,
 angle: Math.random() * Math.PI * 2,
 spin: (Math.random() - 0.5) * 0.2,
 opacity: 1,
 }));

 let frame = 0;
 const maxFrames = 90;

 function draw() {
 if (!ctx || !canvas) return;
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 frame++;

 for (const p of particles) {
 p.x += p.vx;
 p.y += p.vy;
 p.vy += 0.08;
 p.angle += p.spin;
 p.opacity = Math.max(0, 1 - frame / maxFrames);

 ctx.save();
 ctx.translate(p.x, p.y);
 ctx.rotate(p.angle);
 ctx.globalAlpha = p.opacity;
 ctx.fillStyle = p.color;
 ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
 ctx.restore();
 }

 if (frame < maxFrames) requestAnimationFrame(draw);
 }

 draw();
 }, []);

 return (
 <canvas
 ref={canvasRef}
 style={{
 position: 'fixed',
 top: 0,
 left: 0,
 pointerEvents: 'none',
 zIndex: 9999,
 }}
 />
 );
}
