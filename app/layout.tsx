import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'genUine — your message. not ai\'s.',
  description: 'Generate personalized LinkedIn messages in your own voice using AI that learns your writing style.',
  openGraph: {
    title: 'genUine',
    description: 'your message. not ai\'s.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#FFFFFF', color: '#1F1F1F', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
