'use client';

export default function TypingIndicator() {
 return (
 <div className="flex items-start gap-2 px-4 py-1">
 <div
 className="flex items-center gap-1 px-4 py-3 rounded-2xl"
 style={{
 backgroundColor: '#F5F5F5',
 borderRadius: '18px 18px 18px 4px',
 }}
 >
 <span className="loading-dot" />
 <span className="loading-dot" />
 <span className="loading-dot" />
 </div>
 </div>
 );
}
