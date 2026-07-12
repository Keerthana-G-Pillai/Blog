import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://inkverse.dev'),
  title: {
    default: 'InkVerse — Discover & Share Amazing Stories',
    template: '%s | InkVerse',
  },
  description:
    'InkVerse is a modern blog platform for discovering thoughtful articles, reading insightful stories, and publishing your own ideas to the world.',
  keywords: ['blog', 'articles', 'writing', 'stories', 'technology', 'design'],
  authors: [{ name: 'InkVerse' }],
  creator: 'InkVerse',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://inkverse.dev',
    siteName: 'InkVerse',
    title: 'InkVerse — Discover & Share Amazing Stories',
    description: 'A modern blog platform for discovering thoughtful articles and sharing your ideas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InkVerse — Discover & Share Amazing Stories',
    description: 'A modern blog platform for discovering thoughtful articles and sharing your ideas.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
