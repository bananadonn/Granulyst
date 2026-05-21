import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Granulyst — CVE monitoring for your stack',
  description:
    'AI-powered vulnerability monitoring tailored to your tech stack. We analyze the granular threats you cannot catch.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
