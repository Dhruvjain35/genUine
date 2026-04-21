'use client';

import CopyButton from './CopyButton';

interface ChatBubbleProps {
 role: 'user' | 'assistant';
 content: string;
 isStreaming?: boolean;
}

// Parse bold markers: **text**
function renderBold(text: string): (string | JSX.Element)[] {
 const parts = text.split(/(\*\*[^*]+\*\*)/g);
 return parts.map((part, i) => {
 if (part.startsWith('**') && part.endsWith('**')) {
 return (
 <strong key={i} style={{ fontWeight: 600, color: '#1F1F1F' }}>
 {part.slice(2, -2)}
 </strong>
 );
 }
 return part;
 });
}

// Render a text segment with line breaks and bold
function TextSegment({ text }: { text: string }) {
 const lines = text.split('\n');
 return (
 <>
 {lines.map((line, i) => (
 <span key={i}>
 {renderBold(line)}
 {i < lines.length - 1 && <br />}
 </span>
 ))}
 </>
 );
}

// Detect the label for a code block from preceding text
function extractLabel(precedingText: string): string | null {
 // Look for patterns like "**common ground:**" or "**genuine curiosity:**"
 const match = precedingText.match(/\*\*([^*]+):\*\*\s*$/);
 return match ? match[1].toLowerCase() : null;
}

// Angle tag colors
function getAngleStyle(label: string | null) {
 if (!label) return null;
 const isCommon = label.includes('common');
 return {
 backgroundColor: isCommon ? 'rgba(240, 168, 36, 0.12)' : 'rgba(30, 190, 130, 0.1)',
 color: isCommon ? '#B8820A' : '#1A8C5A',
 };
}

// LinkedIn message card
function LinkedInCard({ text, label }: { text: string; label: string | null }) {
 const angleStyle = getAngleStyle(label);

 return (
 <div
 className="linkedin-card my-2 rounded-xl overflow-hidden"
 style={{
 backgroundColor: '#FFFFFF',
 border: '1px solid #DCDCDC',
 boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
 }}
 >
 {/* Card header with label + copy */}
 <div
 className="flex items-center justify-between px-4 py-2.5"
 style={{ borderBottom: '1px solid #DCDCDC', backgroundColor: '#FAFAFA' }}
 >
 {label && angleStyle ? (
 <span
 className="text-xs font-semibold px-2 py-0.5 rounded-full"
 style={angleStyle}
 >
 {label}
 </span>
 ) : (
 <span className="text-xs font-semibold" style={{ color: '#F0A824' }}>
 linkedin message
 </span>
 )}
 <CopyButton text={text} />
 </div>
 {/* Message content */}
 <div
 className="px-4 py-3 text-sm leading-relaxed"
 style={{
 color: '#1F1F1F',
 fontFamily: "'DM Sans', sans-serif",
 whiteSpace: 'pre-wrap',
 }}
 >
 {text}
 </div>
 </div>
 );
}

// Parse content into text + code segments
function parseContent(content: string) {
 const segments: Array<
 | { type: 'text'; text: string }
 | { type: 'code'; text: string; label: string | null }
 > = [];

 // Split by triple backticks
 const parts = content.split('```');

 for (let i = 0; i < parts.length; i++) {
 if (i % 2 === 0) {
 // Text segment
 if (parts[i]) {
 segments.push({ type: 'text', text: parts[i] });
 }
 } else {
 // Code block, extract label from previous text segment
 const prevText = parts[i - 1] || '';
 const label = extractLabel(prevText);
 const codeText = parts[i].trim();
 if (codeText) {
 segments.push({ type: 'code', text: codeText, label });
 }
 }
 }

 return segments;
}

export default function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
 const isUser = role === 'user';

 // Strip the voice ready signal from display
 const cleanContent = content.replace('%%VOICE_READY%%', '').trimEnd();

 if (isUser) {
 return (
 <div className="flex justify-end px-4 py-1 msg-right">
 <div
 className="max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 text-sm leading-relaxed"
 style={{
 backgroundColor: '#F0A824',
 color: '#FFFFFF',
 borderRadius: '18px 18px 4px 18px',
 fontFamily: "'DM Sans', sans-serif",
 whiteSpace: 'pre-wrap',
 wordBreak: 'break-word',
 }}
 >
 {cleanContent}
 </div>
 </div>
 );
 }

 // Assistant message
 const segments = parseContent(cleanContent);

 return (
 <div className="flex items-start gap-2 px-4 py-1 msg-left">
 <div
 className="flex-1 max-w-xs sm:max-w-md lg:max-w-2xl px-4 py-3 text-sm leading-relaxed"
 style={{
 backgroundColor: '#F5F5F5',
 borderRadius: '4px 18px 18px 18px',
 fontFamily: "'DM Sans', sans-serif",
 color: '#1F1F1F',
 wordBreak: 'break-word',
 }}
 >
 {segments.map((seg, i) => {
 if (seg.type === 'text') {
 // Strip trailing label if the next segment is a code block
 // (we don't want the label duplicated in both text and card header)
 let displayText = seg.text;
 if (
 i < segments.length - 1 &&
 segments[i + 1].type === 'code'
 ) {
 // Remove the trailing label line from text since it's shown in card header
 displayText = displayText.replace(/\n?\*\*[^*]+:\*\*\s*$/, '');
 }
 if (!displayText.trim()) return null;
 return (
 <span key={i}>
 <TextSegment text={displayText} />
 </span>
 );
 } else {
 return (
 <LinkedInCard key={i} text={seg.text} label={seg.label} />
 );
 }
 })}
 {isStreaming && (
 <span
 style={{
 display: 'inline-block',
 width: '2px',
 height: '14px',
 backgroundColor: '#F0A824',
 marginLeft: '2px',
 verticalAlign: 'middle',
 animation: 'pulse 0.8s ease-in-out infinite',
 }}
 />
 )}
 </div>
 </div>
 );
}
