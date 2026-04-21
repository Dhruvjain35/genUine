'use client';

import { useEffect, useState } from 'react';

export interface VoiceProfile {
 tone?: string;
 energy?: string;
 capitalization?: string;
 sentenceLength?: string;
 emojiUsage?: string;
 greetingStyle?: string;
 questionStyle?: string;
 formalityLevel?: string;
 slangUsage?: string;
 signOff?: string;
 uniquePatterns?: string;
 overallStyle?: string;
 examples?: string[];
 [key: string]: string | string[] | undefined;
}

interface VoiceProfileModalProps {
 voiceProfile: VoiceProfile | null;
 voiceExamples: string[];
 onClose: () => void;
 onClearVoice: () => void;
 onBulkAnalyze: (examples: string[]) => void;
}

const PROFILE_LABELS: Record<string, string> = {
 tone: 'tone',
 energy: 'energy',
 capitalization: 'capitalization',
 sentenceLength: 'sentence length',
 emojiUsage: 'emoji usage',
 greetingStyle: 'greeting style',
 formalityLevel: 'formality level',
 overallStyle: 'overall style',
};

export default function VoiceProfileModal({
 voiceProfile,
 voiceExamples,
 onClose,
 onClearVoice,
 onBulkAnalyze,
}: VoiceProfileModalProps) {
 const [showBulkImport, setShowBulkImport] = useState(false);
 const [bulkText, setBulkText] = useState('');
 const [isAnalyzing, setIsAnalyzing] = useState(false);

 // Close on escape
 useEffect(() => {
 const handler = (e: KeyboardEvent) => {
 if (e.key === 'Escape') onClose();
 };
 window.addEventListener('keydown', handler);
 return () => window.removeEventListener('keydown', handler);
 }, [onClose]);

 const handleBulkAnalyze = async () => {
 if (!bulkText.trim()) return;

 // Split by triple dash or double newline, each chunk is one post/message
 const rawExamples = bulkText
 .split(/\n---\n|\n\n\n/)
 .map((s) => s.trim())
 .filter((s) => s.length > 20);

 if (rawExamples.length === 0) return;

 setIsAnalyzing(true);
 await onBulkAnalyze(rawExamples);
 setIsAnalyzing(false);
 setShowBulkImport(false);
 setBulkText('');
 };

 return (
 <div
 className="fixed inset-0 flex items-end sm:items-center justify-center z-50 modal-backdrop"
 style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
 onClick={(e) => {
 if (e.target === e.currentTarget) onClose();
 }}
 >
 <div
 className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
 style={{
 backgroundColor: '#FFFFFF',
 maxHeight: '85vh',
 display: 'flex',
 flexDirection: 'column',
 boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
 }}
 >
 {/* Header */}
 <div
 className="flex items-center justify-between px-5 py-4 flex-shrink-0"
 style={{ borderBottom: '1px solid #DCDCDC' }}
 >
 <h2
 className="text-base font-bold"
 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
 >
 {showBulkImport ? 'bulk import posts' : 'your voice profile'}
 </h2>
 <button
 onClick={onClose}
 className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
 style={{ backgroundColor: '#F5F5F5', color: '#888' }}
 >
 ×
 </button>
 </div>

 {/* Content */}
 <div className="overflow-y-auto flex-1 p-5">
 {showBulkImport ? (
 <div>
 <p className="text-sm mb-1" style={{ color: '#444' }}>
 paste your LinkedIn posts or messages below. separate each one with a blank line + three dashes (<code>---</code>).
 </p>
 <p className="text-xs mb-4" style={{ color: '#999' }}>
 you can paste 10, 50, even 200 posts, more is better. genUine will analyze them all at once.
 </p>
 <textarea
 value={bulkText}
 onChange={(e) => setBulkText(e.target.value)}
 placeholder={`hey loved your post on cold outreach!\n\n---\n\nsaw you're hiring, i'd love to connect and learn more about the team\n\n---\n\npaste as many as you want...`}
 rows={12}
 className="w-full rounded-xl p-3 text-sm resize-none outline-none"
 style={{
 backgroundColor: '#F5F5F5',
 border: '1.5px solid #DCDCDC',
 fontFamily: "'DM Sans', sans-serif",
 color: '#1F1F1F',
 lineHeight: '1.6',
 }}
 onFocus={(e) => {
 e.currentTarget.style.borderColor = '#F0A824';
 }}
 onBlur={(e) => {
 e.currentTarget.style.borderColor = '#DCDCDC';
 }}
 />
 {bulkText.trim() && (
 <p className="text-xs mt-2" style={{ color: '#999' }}>
 {bulkText.split(/\n---\n|\n\n\n/).filter((s) => s.trim().length > 20).length} posts detected
 </p>
 )}
 </div>
 ) : !voiceProfile ? (
 <div className="text-center py-8">
 <p className="text-sm mb-4" style={{ color: '#888' }}>
 no voice profile yet, share some messages with genUine first, or use bulk import to paste lots of posts at once.
 </p>
 </div>
 ) : (
 <>
 {/* Profile traits */}
 <div className="mb-6">
 <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#F0A824', letterSpacing: '0.06em' }}>
 writing style
 </p>
 <div className="flex flex-wrap gap-2">
 {Object.entries(PROFILE_LABELS).map(([key, label]) => {
 const val = voiceProfile[key];
 if (!val || typeof val !== 'string') return null;
 return (
 <div
 key={key}
 className="px-3 py-2 rounded-xl text-xs"
 style={{
 backgroundColor: '#F5F5F5',
 border: '1px solid #DCDCDC',
 }}
 >
 <span style={{ color: '#888' }}>{label}: </span>
 <span style={{ color: '#1F1F1F', fontWeight: 500 }}>{val}</span>
 </div>
 );
 })}
 </div>

 {voiceProfile.uniquePatterns && (
 <div
 className="mt-3 px-3 py-2.5 rounded-xl text-sm"
 style={{
 backgroundColor: 'rgba(240, 168, 36, 0.06)',
 border: '1px solid rgba(240, 168, 36, 0.2)',
 }}
 >
 <span className="text-xs font-semibold" style={{ color: '#F0A824' }}>
 unique patterns:{' '}
 </span>
 <span style={{ color: '#1F1F1F' }}>{voiceProfile.uniquePatterns}</span>
 </div>
 )}
 </div>

 {/* Examples */}
 {voiceExamples.length > 0 && (
 <div className="mb-4">
 <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#888', letterSpacing: '0.06em' }}>
 your examples ({voiceExamples.length})
 </p>
 <div className="flex flex-col gap-2">
 {voiceExamples.map((ex, i) => (
 <div
 key={i}
 className="px-3 py-2.5 rounded-xl text-sm"
 style={{
 backgroundColor: '#F5F5F5',
 border: '1px solid #DCDCDC',
 fontFamily: "'DM Sans', sans-serif",
 color: '#444',
 lineHeight: '1.6',
 }}
 >
 {ex.length > 200 ? ex.slice(0, 200) + '...' : ex}
 </div>
 ))}
 </div>
 </div>
 )}
 </>
 )}
 </div>

 {/* Footer actions */}
 <div
 className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
 style={{ borderTop: '1px solid #DCDCDC' }}
 >
 {showBulkImport ? (
 <>
 <button
 onClick={() => { setShowBulkImport(false); setBulkText(''); }}
 className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
 style={{ backgroundColor: '#F5F5F5', color: '#555', border: '1px solid #DCDCDC' }}
 >
 cancel
 </button>
 <button
 onClick={handleBulkAnalyze}
 disabled={isAnalyzing || !bulkText.trim()}
 className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
 style={{
 backgroundColor: isAnalyzing || !bulkText.trim() ? '#DCDCDC' : '#F0A824',
 color: '#FFFFFF',
 }}
 >
 {isAnalyzing ? 'analyzing...' : 'analyze posts'}
 </button>
 </>
 ) : (
 <>
 <button
 onClick={() => setShowBulkImport(true)}
 className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
 style={{ backgroundColor: '#F5F5F5', color: '#555', border: '1px solid #DCDCDC' }}
 >
 bulk import posts
 </button>
 {voiceProfile && (
 <button
 onClick={onClearVoice}
 className="py-2.5 px-4 rounded-xl text-sm font-semibold"
 style={{ backgroundColor: '#FFF0F0', color: '#E05555', border: '1px solid #FFDDDD' }}
 >
 clear
 </button>
 )}
 <button
 onClick={onClose}
 className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
 style={{ backgroundColor: '#F0A824', color: '#FFFFFF' }}
 >
 done
 </button>
 </>
 )}
 </div>
 </div>
 </div>
 );
}
