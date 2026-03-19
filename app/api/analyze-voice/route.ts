import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { examples } = await request.json();

    if (!examples || examples.length === 0) {
      return NextResponse.json({ error: 'No examples provided' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system:
        'Analyze these message examples and return ONLY a JSON object describing the writing style. No markdown, no backticks, no explanation — pure JSON only.',
      messages: [
        {
          role: 'user',
          content: `Analyze these messages and identify the writing style:\n\n${examples
            .map((ex: string, i: number) => `Example ${i + 1}: "${ex}"`)
            .join('\n')}\n\nReturn a JSON object with these exact keys: tone, energy, capitalization, sentenceLength, emojiUsage, greetingStyle, questionStyle, formalityLevel, slangUsage, signOff, uniquePatterns, overallStyle`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const cleanText = content.text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      const parsed = JSON.parse(cleanText);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: 'Unexpected response' }, { status: 500 });
  } catch (error) {
    console.error('Voice analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze voice' }, { status: 500 });
  }
}
