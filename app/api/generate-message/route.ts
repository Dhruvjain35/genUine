import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const systemPrompt = `You are genUine's voice-matching engine. Your ONLY purpose is to generate LinkedIn messages that are INDISTINGUISHABLE from messages the user would write themselves.

CRITICAL RULE: You must COMPLETELY ABANDON your default Claude writing style. Do not write like Claude. Do not write like an AI assistant. Do not write in a "helpful" tone. You are CLONING the user's exact voice.

## Voice Analysis — Study EVERY example for ALL of these:

CAPITALIZATION: All lowercase? Proper case? Random? Mixed?
SENTENCE LENGTH: Short punchy fragments? Long flowing? Mixed?
PUNCTUATION: Lots of "!"? Minimal? Double "??"? None at all?
EMOJI USAGE: Which ones, where, how often, or never?
GREETING STYLE: "hey", "hi", "yo", "omg", "heyyy", nothing?
SIGN-OFF STYLE: How they end messages — abrupt, trailing, question?
SLANG: "u" vs "you", "cuz", "ngl", "tbh", "lol", "lowk"?
FORMALITY: Super casual? Slightly professional? Somewhere between?
QUESTION STYLE: Direct? Rhetorical? Trailing "..."?
FILLER WORDS: "honestly", "like", "literally", "basically", "kinda"?
ENERGY: Enthusiastic? Chill? Curious? Direct? Warm?
UNIQUE PATTERNS: Any phrases, habits, or structures only THIS person uses?

YOU MUST MATCH ALL OF THESE. If they write in all lowercase, you write in all lowercase. If they use "!!" you use "!!". If they never use emojis, NEVER use emojis. If they write in proper case with full sentences, match that exactly.

## Profile Analysis — Extract from whatever is pasted:
- Name and current role
- Company and what they're working on right now
- Background that creates natural common ground
- Something genuinely interesting or unique about them
- A conversation starter that doesn't feel researched
- Recent activity or achievements if mentioned

## Recipient Context Adjustment (keep the user's voice, just adjust the approach):
- founder/entrepreneur: peer energy, building mindset, talk shop
- student/peer: casual, relatable, shared experience angle
- professional/executive: user's voice but slightly more considered
- professor/mentor: genuine curiosity about their work and research
- other: default casual and curious

## STRICT MESSAGE RULES:
1. Sound EXACTLY like the user. Re-read every example before writing.
2. Maximum 4 sentences. Shorter is almost always better.
3. NEVER use these phrases (or any variation):
   "I hope this message finds you well"
   "I came across your profile"
   "I'd love to pick your brain"
   "I noticed that you"
   "Your background is impressive"
   "I'm reaching out because"
   "I'd love to connect"
   "I wanted to reach out"
4. NEVER use em dashes (—) or en dashes (–). Use commas or periods instead.
5. NEVER use bullet points or hyphens in the message text.
6. NEVER pitch anything. This is the START of a conversation.
7. NEVER use corporate language unless the user's examples are formal.
8. Lead with common ground OR genuine curiosity — whichever fits more naturally.
9. Don't make it obvious you researched them. Weave details in naturally.
10. End with something that genuinely invites a response. Not "let me know if you'd like to connect."
11. If the output could have been written by any AI chatbot, REWRITE IT until only this specific user could have written it.
12. Apply the requested tone if one is specified (casual/formal/curious) while keeping the user's voice.

## Output Format

Return ONLY valid JSON. No markdown. No backticks. No explanation before or after:
{
  "voiceProfile": {
    "tone": "1-2 words describing their tone",
    "energy": "1-2 words describing their energy level",
    "style": "one sentence describing their specific writing style",
    "pattern": "one specific pattern you noticed — e.g. always uses lowercase, ends with questions, uses 'lol' naturally"
  },
  "messageA": {
    "text": "the message — common ground angle, in the user's exact voice",
    "angle": "one sentence: why this angle works for this specific person",
    "commonGround": "the shared element you found"
  },
  "messageB": {
    "text": "the message — genuine curiosity angle, in the user's exact voice",
    "angle": "one sentence: why this angle works for this specific person",
    "curiosityPoint": "what sparked genuine curiosity about them"
  }
}`;

function stripEmDashes(text: string): string {
  return text
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*–\s*/g, ', ')
    .replace(/\s*-{2,}\s*/g, ', ');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userExamples, targetProfile, userName, recipientType, tone, additionalContext } = body;

    // Validation
    const validExamples = (userExamples || []).filter((ex: string) => ex?.trim().length > 10);
    if (validExamples.length < 1) {
      return NextResponse.json({ error: 'Please provide at least one message example so genUine can learn your voice.' }, { status: 400 });
    }

    const profileText = [
      targetProfile?.name ? `Name: ${targetProfile.name}` : '',
      targetProfile?.headline ? `Headline: ${targetProfile.headline}` : '',
      targetProfile?.about ? `About: ${targetProfile.about}` : '',
      targetProfile?.activity ? `Recent activity: ${targetProfile.activity}` : '',
      targetProfile?.other ? `Other context: ${targetProfile.other}` : '',
      typeof targetProfile === 'string' ? targetProfile : '',
    ].filter(Boolean).join('\n');

    if (!profileText.trim()) {
      return NextResponse.json({ error: 'Please fill in at least the name and headline of the person you want to message.' }, { status: 400 });
    }

    const userMessage = `Here are ${userName ? userName + "'s" : 'the user\'s'} own messages (their voice to clone — study these carefully):

${validExamples.map((ex: string, i: number) => `Example ${i + 1}:\n${ex.trim()}`).join('\n\n')}

---

Target person's LinkedIn profile:
${profileText}

${recipientType ? `Who they are: ${recipientType}` : ''}
${tone ? `Requested tone: ${tone}` : ''}
${additionalContext ? `Additional context from the user: ${additionalContext}` : ''}

---

Generate two LinkedIn opening messages that sound EXACTLY like ${userName || 'the user'} would write. Return ONLY valid JSON.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON — handle markdown wrapping
    let parsed: any;
    try {
      const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || responseText.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
      parsed = JSON.parse(jsonStr.trim());
    } catch {
      return NextResponse.json({ error: 'Something went wrong generating the messages. Try again?' }, { status: 500 });
    }

    // Validate
    if (!parsed.messageA?.text || !parsed.messageB?.text) {
      return NextResponse.json({ error: 'Something went wrong generating the messages. Try again?' }, { status: 500 });
    }

    // Post-process: strip em dashes
    parsed.messageA.text = stripEmDashes(parsed.messageA.text);
    parsed.messageB.text = stripEmDashes(parsed.messageB.text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('generate-message error:', error);
    return NextResponse.json({ error: 'Something went wrong. Try again?' }, { status: 500 });
  }
}
