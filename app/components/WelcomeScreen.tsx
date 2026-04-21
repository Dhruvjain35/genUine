'use client';

interface VoiceProfile {
 overallStyle?: string;
 [key: string]: unknown;
}

interface WelcomeScreenProps {
 voiceProfile: VoiceProfile | null;
 onStart: () => void;
}

export default function WelcomeScreen({ voiceProfile, onStart }: WelcomeScreenProps) {
 return (
 <div
 className="flex-1 flex flex-col items-center justify-center px-6 text-center"
 style={{ backgroundColor: '#FFFFFF' }}
 >
 {/* Logo */}
 <div className="mb-6 fade-up stagger-1">
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

 {/* Tagline */}
 <p
 className="text-xl font-semibold mb-3 fade-up stagger-2"
 style={{ color: '#1F1F1F', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
 >
 your message. not ai's.
 </p>

 {/* Description */}
 <p
 className="text-base mb-10 max-w-sm fade-up stagger-3"
 style={{ color: '#888', lineHeight: '1.7' }}
 >
 {voiceProfile
 ? 'your voice is saved. paste a linkedin profile and let\'s write something real.'
 : 'i learn how you actually talk, then write linkedin messages that sound like you, not like a template.'}
 </p>

 {/* CTA Button */}
 <button
 onClick={onStart}
 className="fade-up stagger-4 px-8 py-3.5 font-bold text-base rounded-2xl"
 style={{
 backgroundColor: '#F0A824',
 color: '#FFFFFF',
 fontFamily: "'Plus Jakarta Sans', sans-serif",
 letterSpacing: '-0.01em',
 boxShadow: '0 4px 20px rgba(240, 168, 36, 0.35)',
 transition: 'transform 0.15s ease, box-shadow 0.2s ease',
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.transform = 'translateY(-2px)';
 e.currentTarget.style.boxShadow = '0 8px 28px rgba(240, 168, 36, 0.45)';
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.transform = 'translateY(0)';
 e.currentTarget.style.boxShadow = '0 4px 20px rgba(240, 168, 36, 0.35)';
 }}
 onMouseDown={(e) => {
 e.currentTarget.style.transform = 'scale(0.97)';
 }}
 onMouseUp={(e) => {
 e.currentTarget.style.transform = 'translateY(-2px)';
 }}
 >
 {voiceProfile ? 'let\'s write →' : 'let\'s get started →'}
 </button>

 {voiceProfile && (
 <p className="mt-4 text-xs fade-up" style={{ color: '#DCDCDC', animationDelay: '320ms' }}>
 voice saved from last time
 </p>
 )}
 </div>
 );
}
