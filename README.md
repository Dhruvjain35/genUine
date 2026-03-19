# genUine — your message. not AI's.

Generate personalized LinkedIn messages that sound exactly like you.

## What genUine Does

Paste 3-5 messages you've written → genUine learns your writing style → paste a LinkedIn profile → genUine generates personalized message openers that sound EXACTLY like the user, not like AI.

## Quick Start

### 1. Clone and install
```bash
git clone <repo-url>
cd genuine-mvp
npm install
```

### 2. Set up your API key
Copy `.env.local.example` to `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your API key at [console.anthropic.com](https://console.anthropic.com)

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Your Voice**: Paste 3-5 real messages you've written (DMs, emails, texts)
2. **Their Profile**: Paste the LinkedIn profile you want to reach
3. **Generate**: genUine analyzes your style and generates two message options

Each message is personalized to your voice and the target profile — no generic templates, no corporate language.

## Features

- **Rate Limited**: 5 messages per session (tracked in React state)
- **Two Options**: Common ground angle + genuine curiosity angle
- **Style Analysis**: genUine shows you what it noticed about your writing
- **Copy to Clipboard**: One-click copy for each message
- **Mobile Responsive**: Works perfectly on all devices

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-6)
- TypeScript

## Brand

- **Cream**: #FAF9F7
- **Terracotta**: #C4784A
- **Amber**: #F2A922
- **Dark**: #2D2D2D

Fonts: Plus Jakarta Sans (headings), DM Sans (body)

---

see u later — shaan
