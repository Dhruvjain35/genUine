import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'genUine — your message. not ai\'s.',
  description: 'genUine learns how you write, then helps you start LinkedIn conversations that actually sound like you — not like AI.',
  openGraph: {
    title: 'genUine — your message. not ai\'s.',
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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
