'use client';

import { useEffect, useState } from 'react';

export default function WaitlistCounter() {
 const [count, setCount] = useState<number | null>(null);

 useEffect(() => {
 fetch('/api/waitlist')
 .then((r) => r.json())
 .then((data) => {
 if (typeof data.count === 'number') {
 setCount(Math.floor(data.count / 10) * 10);
 }
 })
 .catch(() => {});
 }, []);

 if (count === null || count < 5) return null;

 return (
 <div
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: 10,
 padding: '6px 14px',
 borderRadius: 999,
 border: '1px solid var(--ink-whisper)',
 backgroundColor: 'var(--paper-warm)',
 }}
 >
 <span
 className="pulse-dot"
 style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--terra)', display: 'inline-block', flexShrink: 0 }}
 />
 <span
 className="mono"
 style={{
 fontSize: 11,
 color: 'var(--ink-mid)',
 letterSpacing: '0.06em',
 textTransform: 'uppercase',
 }}
 >
 join <strong style={{ color: 'var(--terra)', fontWeight: 600 }}>{count}+</strong> already waiting
 </span>
 </div>
 );
}
