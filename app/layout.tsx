import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
});

const dm = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-dm',
  display: 'swap',
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "genUine — your message. not ai's.",
  description:
    'genUine learns how you write, then helps you start LinkedIn conversations that actually sound like you — not like AI.',
  openGraph: {
    title: "genUine — your message. not ai's.",
    description: 'LinkedIn messages that sound like you. Not like AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'genUine',
    description: 'LinkedIn messages that sound like you. Not like AI.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${dm.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
