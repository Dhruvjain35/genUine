'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    label: 'step one',
    title: 'teach it your voice.',
    desc: "paste 3 messages you've written before. DMs, texts, anything where you sounded like yourself. genUine reads for cadence, punctuation, the way you actually open a sentence.",
    accent: 'your voice',
  },
  {
    num: '02',
    label: 'step two',
    title: 'drop a profile.',
    desc: 'paste a linkedin link, or their headline, about, role. even a messy mobile paste works. genUine maps what matters to them, and what you might share.',
    accent: 'their world',
  },
  {
    num: '03',
    label: 'step three',
    title: 'send something real.',
    desc: 'two drafts, both in your voice. pick the one that feels right. copy, paste, send. no tone-policed intern. no template. just you, faster.',
    accent: 'sent.',
  },
];

// ─── Timing ───────────────────────────────────────────────────────────────────
// Each step owns exactly 1/3 of [0..1]. Crossfade is short and clean.
// Adjacent steps hand off at the boundary via symmetric fades — when step N is
// at 50% opacity exiting, step N+1 is at 50% opacity entering. No long overlap.
const COUNT = STEPS.length;
// Reserve a trailing dwell zone so the final step fully enters well before
// the sticky section releases.
const ACTIVE = 0.9;
const SLICE = ACTIVE / COUNT;
// Fades are SEQUENTIAL, not overlapping. Step N fades out in the last FADE
// portion of its slice; step N+1 fades in in the first FADE portion of its
// slice. Handoff is a single point — only one step visible at a time.
const FADE = SLICE * 0.25;

function useStepOpacity(index: number, progress: MotionValue<number>) {
  const start = index * SLICE;
  const end = (index + 1) * SLICE;
  const isFirst = index === 0;
  const isLast = index === COUNT - 1;

  // Build strictly-increasing keyframes. Duplicate inputs break useTransform.
  let input: number[];
  let output: number[];

  if (isFirst && isLast) {
    input = [0, 1];
    output = [1, 1];
  } else if (isFirst) {
    // starts visible, fades out at end of slice
    input = [end - FADE, end, 1];
    output = [1, 0, 0];
  } else if (isLast) {
    // invisible, fades in at start of slice, then holds
    input = [0, start, start + FADE];
    output = [0, 0, 1];
  } else {
    // middle: invisible → fade in → hold → fade out → invisible
    input = [start - 0.0001, start, start + FADE, end - FADE, end, end + 0.0001];
    output = [0, 0, 1, 1, 0, 0];
  }

  return useTransform(progress, input, output);
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ScrollSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        // Each step gets ~133vh of scroll distance (section height - viewport).
        // Bigger = each step lingers longer, easier to read at human scroll speed.
        // Each step gets ~150vh of scroll; extra tail (~100vh) lets the final
        // step fully settle and linger before the sticky releases.
        height: `${COUNT * 150 + 100}vh`,
        background: 'var(--paper-warm)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '0 24px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {/* Left: card stage */}
          <div
            style={{
              position: 'relative',
              height: 'min(560px, 70vh)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {STEPS.map((_, i) => (
              <StepVisual key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>

          {/* Right: text stage */}
          <div style={{ position: 'relative', minHeight: 440 }}>
            {STEPS.map((step, i) => (
              <StepText key={i} step={step} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Left stage: one card per step ───────────────────────────────────────────
function StepVisual({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const opacity = useStepOpacity(index, progress);
  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        willChange: 'opacity',
      }}
    >
      {index === 0 && <VoiceCard />}
      {index === 1 && <ProfileCard />}
      {index === 2 && <DraftCard />}
    </motion.div>
  );
}

// ─── Right stage: one block of text per step ─────────────────────────────────
function StepText({
  step,
  index,
  progress,
}: {
  step: (typeof STEPS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useStepOpacity(index, progress);
  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        willChange: 'opacity',
        maxWidth: 500,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: 'var(--terra)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        {step.label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-jakarta)',
          fontSize: 'clamp(14px, 1.4vw, 18px)',
          color: 'var(--ink-light)',
          marginBottom: 12,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      >
        {step.num}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-jakarta)',
          fontSize: 'clamp(40px, 5.4vw, 72px)',
          fontWeight: 700,
          letterSpacing: '-0.035em',
          lineHeight: 1.02,
          color: 'var(--ink)',
          marginBottom: 24,
          paddingBottom: '0.12em',
        }}
      >
        {step.title}
      </h3>
      <p
        style={{
          fontSize: 17,
          color: 'var(--ink-mid)',
          lineHeight: 1.7,
          maxWidth: 440,
          marginBottom: 22,
        }}
      >
        {step.desc}
      </p>
      <span className="serif-italic" style={{ fontSize: 22, color: 'var(--terra)' }}>
        {step.accent}
      </span>
    </motion.div>
  );
}

// ─── Card designs ─────────────────────────────────────────────────────────────
function VoiceCard() {
  return (
    <div
      style={{
        width: 'min(420px, 88%)',
        background: 'var(--paper-contrast)',
        border: '1px solid var(--ink-whisper)',
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 40px 100px rgba(26,23,20,0.10)',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: 'var(--ink-light)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        your past messages
      </div>
      {[
        'lowk agree with this, been thinking about it for weeks',
        'yo can you send me the link when you get a sec',
        'that part about boring rituals winning hit hard',
      ].map((m, i) => (
        <div
          key={i}
          style={{
            background: 'var(--paper-warm)',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 10,
            fontSize: 13.5,
            color: 'var(--ink-soft)',
            lineHeight: 1.55,
            borderLeft: i === 2 ? '2px solid var(--terra)' : '2px solid transparent',
          }}
        >
          {m}
        </div>
      ))}
      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: '1px solid var(--ink-whisper)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          voice pattern
        </span>
        <span className="serif-italic" style={{ fontSize: 16, color: 'var(--terra)' }}>
          casual, lowercase
        </span>
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div
      style={{
        width: 'min(420px, 88%)',
        background: 'var(--paper-contrast)',
        border: '1px solid var(--ink-whisper)',
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 40px 100px rgba(26,23,20,0.10)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--terra), var(--terra-deep))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--paper)',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          S
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-jakarta)' }}>
            Sarah Chen
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-light)', letterSpacing: '0.06em' }}>
            Product Manager · Stripe
          </div>
        </div>
      </div>
      <div
        style={{
          background: 'var(--paper-warm)',
          borderRadius: 14,
          padding: 16,
          fontSize: 13,
          color: 'var(--ink-mid)',
          lineHeight: 1.6,
          marginBottom: 14,
        }}
      >
        writes about shipping small. recently posted about quiet founders and boring rituals. 3 years at stripe, previously at a design-led startup.
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['builds in public', 'quiet operator', 'writes weekly'].map((tag) => (
          <span
            key={tag}
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.08em',
              padding: '5px 10px',
              borderRadius: 999,
              border: '1px solid var(--ink-whisper)',
              color: 'var(--ink-mid)',
              textTransform: 'uppercase',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function DraftCard() {
  return (
    <div
      style={{
        width: 'min(420px, 88%)',
        background: 'var(--ink)',
        color: 'var(--paper)',
        border: '1px solid rgba(250,248,244,0.08)',
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 40px 100px rgba(26,23,20,0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -80,
          right: -60,
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(196, 120, 74, 0.45) 0%, transparent 65%)',
        }}
      />
      <div
        className="mono"
        style={{
          position: 'relative',
          fontSize: 10,
          color: 'var(--terra)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        your draft, in your voice
      </div>
      <p style={{ position: 'relative', fontSize: 14.5, lineHeight: 1.7, color: 'var(--paper)', marginBottom: 18 }}>
        stumbled on your post about quiet founders. the part about boring rituals winning was the line i needed today. are you still writing weekly?
      </p>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(250,248,244,0.1)' }}>
        <span className="mono" style={{ fontSize: 10, color: 'rgba(250,248,244,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          draft 01 of 02
        </span>
        <span className="serif-italic" style={{ fontSize: 16, color: 'var(--terra)' }}>
          ready to send
        </span>
      </div>
    </div>
  );
}
