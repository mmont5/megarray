import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Megarray - Your Social Media Management Platform',
  description: 'Manage all your social media accounts from a single dashboard. Schedule posts, analyze performance, and grow your audience with our AI-powered tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-900 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
