'use client';

import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
 scene: string;
 style?: React.CSSProperties;
 className?: string;
}

export default function SplineScene({ scene, style, className }: SplineSceneProps) {
 return (
 <div
 className={className}
 style={{
 position: 'relative',
 width: '100%',
 height: '100%',
 ...style,
 }}
 >
 <Suspense
 fallback={
 <div
 aria-hidden="true"
 style={{
 position: 'absolute',
 inset: 0,
 background:
 'radial-gradient(circle at 50% 40%, rgba(196, 120, 74, 0.22) 0%, rgba(224, 160, 58, 0.08) 40%, transparent 70%)',
 filter: 'blur(28px)',
 }}
 />
 }
 >
 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
 <Spline scene={scene} style={{ width: '100%', height: '100%' }} />
 </Suspense>
 </div>
 );
}
