'use client';

interface LimitReachedProps {
 onReset?: () => void; // optional, for testing/dev only
}

export default function LimitReached({ onReset }: LimitReachedProps) {
 return (
 <div
 className="flex-1 flex flex-col items-center justify-center px-6 text-center"
 style={{ backgroundColor: '#FFFFFF' }}
 >
 {/* Logo */}
 <div className="mb-8 fade-up stagger-1">
 <h1
 className="text-5xl font-bold"
 style={{
 fontFamily: "'Plus Jakarta Sans', sans-serif",
 color: '#1F1F1F',
 letterSpacing: '-0.02em',
 }}
 >
 gen<span style={{ color: '#F0A824' }}>U</span>ine
 </h1>
 </div>

 {/* Icon, simple hourglass vibe */}
 <div
 className="mb-6 fade-up stagger-2 flex items-center justify-center rounded-full"
 style={{
 width: 56,
 height: 56,
 backgroundColor: 'rgba(240, 168, 36, 0.1)',
 border: '1.5px solid rgba(240, 168, 36, 0.25)',
 }}
 >
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0A824" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" />
 <polyline points="12 6 12 12 16 14" />
 </svg>
 </div>

 {/* Headline */}
 <p
 className="text-2xl font-bold mb-3 fade-up stagger-3"
 style={{
 color: '#1F1F1F',
 fontFamily: "'Plus Jakarta Sans', sans-serif",
 letterSpacing: '-0.02em',
 }}
 >
 that's your lot for today
 </p>

 {/* Subtext */}
 <p
 className="text-base mb-2 max-w-xs fade-up stagger-4"
 style={{ color: '#888', lineHeight: '1.7' }}
 >
 you've hit the preview limit. this is an early build, the real thing will have no cap.
 </p>

 <p
 className="text-sm mb-10 max-w-xs fade-up"
 style={{ color: '#BBBBBB', lineHeight: '1.6', animationDelay: '280ms' }}
 >
 come back tomorrow and your messages reset. want early access when we launch? reach out.
 </p>

 {/* What's coming teaser */}
 <div
 className="fade-up mb-8 w-full max-w-xs rounded-2xl px-5 py-4 text-left"
 style={{
 backgroundColor: '#FAFAFA',
 border: '1px solid #EBEBEB',
 animationDelay: '340ms',
 }}
 >
 <p
 className="text-xs font-semibold mb-3"
 style={{ color: '#BBBBBB', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
 >
 full version will include
 </p>
 {[
 'unlimited message generation',
 'voice that improves over time',
 'bulk import your linkedin posts',
 'team profiles',
 ].map((item) => (
 <div key={item} className="flex items-center gap-2.5 mb-2 last:mb-0">
 <div
 className="flex-shrink-0 rounded-full"
 style={{ width: 6, height: 6, backgroundColor: '#F0A824' }}
 />
 <p className="text-sm" style={{ color: '#555', fontFamily: "'DM Sans', sans-serif" }}>
 {item}
 </p>
 </div>
 ))}
 </div>

 {/* Come back tomorrow note */}
 <p className="text-xs fade-up" style={{ color: '#DCDCDC', animationDelay: '400ms' }}>
 your voice profile is still saved, pick up where you left off tomorrow
 </p>

 {/* Dev-only reset (only renders if onReset prop passed) */}
 {onReset && (
 <button
 onClick={onReset}
 className="mt-6 text-xs underline fade-up"
 style={{ color: '#DCDCDC', animationDelay: '460ms' }}
 >
 reset limit (testing only)
 </button>
 )}
 </div>
 );
}
