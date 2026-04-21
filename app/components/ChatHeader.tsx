'use client';

interface VoiceProfile {
 overallStyle?: string;
 [key: string]: unknown;
}

interface ChatHeaderProps {
 voiceProfile: VoiceProfile | null;
 onClearChat: () => void;
 onShowVoice: () => void;
}

export default function ChatHeader({ voiceProfile, onClearChat, onShowVoice }: ChatHeaderProps) {
 return (
 <header
 className="flex items-center justify-between px-4 py-3 flex-shrink-0"
 style={{
 backgroundColor: '#1F1F1F',
 borderBottom: '1px solid rgba(255,255,255,0.06)',
 minHeight: '56px',
 }}
 >
 {/* Logo */}
 <div className="flex items-center gap-2">
 <h1
 className="text-xl font-bold"
 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#FFFFFF', letterSpacing: '-0.01em' }}
 >
 gen<span style={{ color: '#F0A824' }}>U</span>ine
 </h1>
 </div>

 {/* Right actions */}
 <div className="flex items-center gap-2">
 {/* Voice status button */}
 <button
 onClick={onShowVoice}
 className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
 style={{
 backgroundColor: 'rgba(255,255,255,0.06)',
 color: voiceProfile ? '#F0A824' : 'rgba(255,255,255,0.4)',
 border: '1px solid rgba(255,255,255,0.08)',
 }}
 title="View or edit your voice profile"
 >
 <span
 style={{
 width: '6px',
 height: '6px',
 borderRadius: '50%',
 backgroundColor: voiceProfile ? '#F0A824' : 'rgba(255,255,255,0.25)',
 flexShrink: 0,
 }}
 className={voiceProfile ? 'voice-dot-active' : ''}
 />
 {voiceProfile ? 'your voice' : 'no voice yet'}
 </button>

 {/* Clear chat button */}
 <button
 onClick={onClearChat}
 className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
 style={{
 backgroundColor: 'rgba(255,255,255,0.06)',
 color: 'rgba(255,255,255,0.4)',
 border: '1px solid rgba(255,255,255,0.08)',
 }}
 title="Clear chat"
 >
 clear chat
 </button>
 </div>
 </header>
 );
}
