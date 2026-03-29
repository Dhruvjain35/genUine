'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

interface VoiceProfile {
  tone?: string;
  energy?: string;
  style?: string;
  overallStyle?: string;
  pattern?: string;
  skipped?: boolean;
  [key: string]: string | string[] | boolean | undefined;
}

interface HistoryEntry {
  id: number;
  date: string;
  rawProfile: string;
  recipientType: string | null;
  messageA: string;
  messageB: string;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '6px 12px', borderRadius: '8px',
        border: copied ? '1px solid #C4784A' : '1px solid #E8DDD5',
        backgroundColor: copied ? 'rgba(196, 120, 74, 0.08)' : 'transparent',
        color: copied ? '#C4784A' : '#A08C7C',
        fontSize: '12px', fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getProfilePreview(rawProfile: string) {
  const firstLine = rawProfile.split('\n')[0]?.trim();
  return firstLine?.length > 60 ? firstLine.slice(0, 57) + '...' : firstLine || 'unknown person';
}

export default function DashboardPage() {
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const vp = localStorage.getItem('genuine_voice_profile');
      if (vp) setVoiceProfile(JSON.parse(vp));

      const hist = localStorage.getItem('genuine_message_history');
      if (hist) setHistory(JSON.parse(hist));

      const count = localStorage.getItem('genuine_messages_today');
      const date = localStorage.getItem('genuine_last_reset_date');
      const today = new Date().toDateString();
      if (date === today && count) setMessagesUsed(parseInt(count, 10));

      if (localStorage.getItem('genuine_is_pro') === 'true') setIsPro(true);
      if (localStorage.getItem('genuine_admin') === 'true') setIsAdmin(true);
    } catch { /* silent */ }
  }, []);

  const handleClearVoice = () => {
    if (!confirm('Reset your voice profile? You\'ll need to set it up again.')) return;
    localStorage.removeItem('genuine_voice_profile');
    setVoiceProfile(null);
  };

  const filteredHistory = history.filter((h) =>
    search.trim() === '' ||
    h.rawProfile.toLowerCase().includes(search.toLowerCase())
  );

  const FREE_LIMIT = 3;
  const messagesRemaining = (isPro || isAdmin) ? null : Math.max(0, FREE_LIMIT - messagesUsed);

  const sectionHead: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '13px', fontWeight: 700,
    color: '#C4784A', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginBottom: '16px',
  };

  const card: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(196, 120, 74, 0.12)',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 2px 16px rgba(196, 120, 74, 0.06)',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F7' }}>
      <SiteHeader activePage="home" />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 38px)', color: '#2D2D2D', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            your gen<span style={{ color: '#C4784A' }}>U</span>ine dashboard
          </h1>
          <p style={{ fontSize: '15px', color: '#A08C7C', fontFamily: "'DM Sans', sans-serif" }}>
            everything in one place.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            {
              label: 'messages today',
              value: isAdmin ? '∞' : isPro ? '∞' : `${messagesUsed} / ${FREE_LIMIT}`,
              sub: isAdmin ? 'admin mode' : isPro ? 'unlimited · pro' : `${messagesRemaining} left`,
            },
            {
              label: 'all time',
              value: history.length,
              sub: 'messages generated',
            },
            {
              label: 'voice profile',
              value: voiceProfile ? '✓' : '—',
              sub: voiceProfile ? 'saved' : 'not set',
            },
            {
              label: 'plan',
              value: isAdmin ? 'admin' : isPro ? 'pro' : 'free',
              sub: isAdmin ? 'unlimited access' : isPro ? 'unlimited messages' : '3 messages / day',
            },
          ].map((s) => (
            <div key={s.label} style={{ ...card, textAlign: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#A08C7C', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '8px' }}>
                {s.label}
              </p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '24px', color: '#2D2D2D', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {s.value}
              </p>
              <p style={{ fontSize: '12px', color: '#A08C7C', fontFamily: "'DM Sans', sans-serif" }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Voice profile */}
        <div style={{ marginBottom: '40px' }}>
          <p style={sectionHead}>your voice profile</p>
          <div style={card}>
            {voiceProfile ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { label: 'tone', value: voiceProfile.tone },
                    { label: 'energy', value: voiceProfile.energy },
                    { label: 'style', value: voiceProfile.style || voiceProfile.overallStyle },
                    { label: 'pattern', value: voiceProfile.pattern },
                  ].filter(r => r.value).map((row) => (
                    <div key={row.label} style={{ padding: '12px', backgroundColor: 'rgba(196, 120, 74, 0.04)', borderRadius: '10px' }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#C4784A', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '4px' }}>
                        {row.label}
                      </p>
                      <p style={{ fontSize: '13px', color: '#2D2D2D', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                        {String(row.value)}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href="/app">
                    <button
                      className="btn-primary"
                      style={{ padding: '9px 20px', borderRadius: '10px', fontSize: '13px' }}
                    >
                      use it →
                    </button>
                  </Link>
                  <button
                    onClick={handleClearVoice}
                    className="btn-ghost"
                    style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px' }}
                  >
                    reset voice
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: '14px', color: '#A08C7C', marginBottom: '16px', fontFamily: "'DM Sans', sans-serif" }}>
                  no voice profile yet. set one up to get started.
                </p>
                <Link href="/app">
                  <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '11px', fontSize: '14px' }}>
                    set up my voice →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Message history */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p style={sectionHead}>message history</p>
            <span style={{ fontSize: '12px', color: '#A08C7C', fontFamily: "'DM Sans', sans-serif" }}>
              {history.length} total
            </span>
          </div>

          {history.length > 0 && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search by name or profile..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #E8DDD5',
                backgroundColor: '#FFFFFF',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: '#2D2D2D',
                outline: 'none',
                marginBottom: '14px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#C4784A'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E8DDD5'; }}
            />
          )}

          {filteredHistory.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', padding: '36px' }}>
              <p style={{ fontSize: '14px', color: '#A08C7C', fontFamily: "'DM Sans', sans-serif", marginBottom: '16px' }}>
                {history.length === 0 ? 'no messages generated yet.' : 'no results found.'}
              </p>
              {history.length === 0 && (
                <Link href="/app">
                  <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '11px', fontSize: '14px' }}>
                    write your first message →
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredHistory.map((entry) => (
                <div key={entry.id} style={card}>
                  <div
                    style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer', gap: '12px' }}
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '14px', color: '#2D2D2D', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getProfilePreview(entry.rawProfile)}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: '#A08C7C', fontFamily: "'DM Sans', sans-serif" }}>
                          {formatDate(entry.date)}
                        </span>
                        {entry.recipientType && (
                          <span style={{ fontSize: '11px', color: '#C4784A', backgroundColor: 'rgba(196, 120, 74, 0.1)', padding: '2px 8px', borderRadius: '100px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                            {entry.recipientType}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#A08C7C', flexShrink: 0, marginTop: '2px' }}>
                      {expandedId === entry.id ? '↑' : '↓'}
                    </span>
                  </div>

                  {expandedId === entry.id && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(196, 120, 74, 0.08)' }}>
                      {entry.messageA && (
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#C4784A', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              common ground
                            </span>
                            <CopyBtn text={entry.messageA} />
                          </div>
                          <p style={{ fontSize: '13px', color: '#2D2D2D', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", backgroundColor: 'rgba(196, 120, 74, 0.04)', padding: '12px', borderRadius: '10px' }}>
                            {entry.messageA}
                          </p>
                        </div>
                      )}
                      {entry.messageB && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#B8860B', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              genuine curiosity
                            </span>
                            <CopyBtn text={entry.messageB} />
                          </div>
                          <p style={{ fontSize: '13px', color: '#2D2D2D', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", backgroundColor: 'rgba(242, 169, 34, 0.05)', padding: '12px', borderRadius: '10px' }}>
                            {entry.messageB}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account */}
        <div>
          <p style={sectionHead}>account</p>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '15px', color: '#2D2D2D', marginBottom: '4px' }}>
                  {isAdmin ? 'admin' : isPro ? 'pro plan' : 'free plan'}
                </p>
                <p style={{ fontSize: '13px', color: '#A08C7C', fontFamily: "'DM Sans', sans-serif" }}>
                  {isAdmin ? 'unlimited access across all features' : isPro ? 'unlimited messages, all features unlocked' : '3 messages per day, voice saving included'}
                </p>
              </div>
              {!isPro && !isAdmin && (
                <Link href="/pricing">
                  <button className="btn-primary" style={{ padding: '10px 22px', borderRadius: '11px', fontSize: '13px' }}>
                    go pro →
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>

      <SiteFooter />
    </div>
  );
}
