import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
 apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are reading someone's writing samples to understand how they communicate. Your job is to narrate what you discover, like a friend describing what they noticed, talking directly to the user.

Write in lowercase. Keep it conversational and perceptive. Be specific about what you actually see in THEIR messages, quote their exact words or patterns when you spot them. Don't be generic.

Structure your response in two parts:

PART 1, Write a 5-8 line narration, starting with "reading your messages..." then describing what you discover. Each observation on its own line. End with a short punchy conclusion like "that's your voice. let's use it." or "got it. this is going to be good."

Examples of the kind of specific observations to make:
- "you don't waste words. short sentences. done."
- "you use 'honestly' a lot, self-aware energy."
- "no caps. no performance. just you."
- "you end messages with questions, you're curious about people."
- "lowercase everywhere. intentional."
- "you're warm but not try-hard."

PART 2, On a new line, output exactly: [PROFILE_JSON]
Then output a JSON object with these exact keys (no markdown, no backticks):
{
 "tone": "1-2 words",
 "energy": "1-2 words",
 "capitalization": "description",
 "sentenceLength": "description",
 "emojiUsage": "description",
 "greetingStyle": "description",
 "formalityLevel": "description",
 "slangUsage": "description",
 "overallStyle": "one sentence summary"
}`;

export async function POST(request: Request) {
 try {
 const { examples } = await request.json();

 if (!examples || examples.length === 0) {
 return new Response(JSON.stringify({ error: 'No examples provided' }), { status: 400 });
 }

 const userMessage = `Here are their writing samples:\n\n${examples
 .map((ex: string, i: number) => `Sample ${i + 1}:\n"${ex}"`)
 .join('\n\n')}`;

 const stream = client.messages.stream({
 model: 'claude-haiku-4-5-20251001',
 max_tokens: 800,
 system: SYSTEM_PROMPT,
 messages: [{ role: 'user', content: userMessage }],
 });

 const readable = new ReadableStream({
 async start(controller) {
 try {
 for await (const chunk of stream) {
 if (
 chunk.type === 'content_block_delta' &&
 chunk.delta.type === 'text_delta'
 ) {
 const data = JSON.stringify({ text: chunk.delta.text });
 controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
 }
 }
 controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
 } catch {
 const errData = JSON.stringify({ error: 'Stream failed' });
 controller.enqueue(new TextEncoder().encode(`data: ${errData}\n\n`));
 } finally {
 controller.close();
 }
 },
 });

 return new Response(readable, {
 headers: {
 'Content-Type': 'text/event-stream',
 'Cache-Control': 'no-cache',
 Connection: 'keep-alive',
 },
 });
 } catch (error) {
 console.error('Voice stream error:', error);
 return new Response(JSON.stringify({ error: 'Failed to analyze voice' }), { status: 500 });
 }
}
