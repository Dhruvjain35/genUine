import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateMessageRequest {
  userExamples: string[];
  targetProfile: string;
  userName: string;
}

interface MessageResponse {
  messageA: {
    text: string;
    angle: string;
  };
  messageB: {
    text: string;
    angle: string;
  };
  styleNotes: string;
}

const systemPrompt = `You are genUine's message generation engine. Your job is to write a LinkedIn opening message that sounds EXACTLY like the user — not like AI, not like a template, not like a "professional."

## How to analyze the user's style

Look at the examples they provided and identify:
- Do they use lowercase or proper capitalization?
- How long are their sentences? Short and punchy or longer and flowing?
- Do they use emojis? Which ones?
- Do they use exclamation marks? How often?
- What's their greeting style? (hey, hi, yo, what's up, etc.)
- Do they ask questions or make statements?
- Are they casual or slightly formal?
- Do they use slang or abbreviations?
- What's their sign-off style?
- What's the overall energy? (enthusiastic, chill, curious, direct)

## How to analyze the target profile

Look at the target person's profile and identify:
- What they're currently working on
- Their background and experience
- Any shared interests, schools, locations, or connections with the user
- Something genuinely interesting or unique about them
- Something the user could authentically be curious about

## Message rules

1. Sound EXACTLY like the user's examples. Match their tone, vocabulary, sentence length, capitalization, and energy.
2. Keep it under 5 sentences
3. NEVER use "I hope this message finds you well" or any variation
4. NEVER pitch anything in the first message
5. NEVER use corporate language
6. Lead with either common ground OR genuine curiosity — pick whichever feels more natural
7. Make it something the user would actually send — if it sounds like AI wrote it, rewrite it
8. Don't mention that you analyzed their profile — make it feel natural
9. End in a way that invites a response (usually a question)

## Output format

Return ONLY a JSON object with this structure (no markdown, no backticks, no explanation):
{
  "messageA": {
    "text": "the message using common ground angle",
    "angle": "brief note on why this angle works"
  },
  "messageB": {
    "text": "the message using genuine curiosity angle",
    "angle": "brief note on why this angle works"
  },
  "styleNotes": "1-2 sentences about what you noticed in the user's writing style"
}`;

export async function POST(request: NextRequest) {
  try {
    const body: GenerateMessageRequest = await request.json();

    // Validation
    if (!body.userExamples || body.userExamples.length < 2) {
      return NextResponse.json(
        { error: 'Please provide at least 2 examples of messages you\'ve written.' },
        { status: 400 }
      );
    }

    if (!body.targetProfile || body.targetProfile.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please paste the target LinkedIn profile.' },
        { status: 400 }
      );
    }

    if (!body.userName || body.userName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide your first name.' },
        { status: 400 }
      );
    }

    // Filter out empty examples
    const validExamples = body.userExamples.filter((ex) => ex.trim().length > 0);

    if (validExamples.length < 2) {
      return NextResponse.json(
        { error: 'Please provide at least 2 examples of messages you\'ve written.' },
        { status: 400 }
      );
    }

    // Build the user message
    const userMessage = `
Here are the messages the user ${body.userName} has written (their voice to analyze):

${validExamples.map((ex, i) => `Example ${i + 1}:\n${ex}`).join('\n\n')}

---

Here's the target LinkedIn profile they want to reach:

${body.targetProfile}

---

Now generate two different LinkedIn opening messages that sound EXACTLY like ${body.userName} would write, analyzing their style from the examples above. Return ONLY valid JSON (no markdown, no explanation).`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      system: systemPrompt,
    });

    // Extract text response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    let parsedResponse: MessageResponse;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || responseText.match(/({[\s\S]*})/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      parsedResponse = JSON.parse(jsonString);
    } catch (_error) {
      return NextResponse.json(
        { error: 'hmm, something went wrong generating the messages — try again?' },
        { status: 500 }
      );
    }

    // Validate response structure
    if (
      !parsedResponse.messageA?.text ||
      !parsedResponse.messageB?.text ||
      !parsedResponse.styleNotes
    ) {
      return NextResponse.json(
        { error: 'hmm, something went wrong generating the messages — try again?' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'hmm, something went wrong — try again?' },
      { status: 500 }
    );
  }
}
