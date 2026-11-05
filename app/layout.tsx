import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import Providers from './providers';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const body = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: {
    default: "Recipe Finder - Search recipes and cocktails",
    template: '%s | Recipe Finder',
  },
  description: 'Search recipes and cocktails by name or ingredient, and save your favorites.',
  keywords: ['recipes', 'cocktails', 'cooking', 'meal planning', 'recipe search', 'food recipes', 'drink recipes', 'TheMealDB', 'TheCocktailDB'],
  authors: [{ name: 'Awagah Eugene Kwesi', url: 'https://github.com/Papiwrld' }],
  creator: 'Awagah Eugene Kwesi',
  publisher: 'Awagah Eugene Kwesi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://recipe-finder.vercel.app',
    title: "Recipe Finder - Search recipes and cocktails",
    description: 'Search recipes and cocktails by name or ingredient.',
    siteName: 'Recipe Finder',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Recipe Finder - Search recipes and cocktails",
    description: 'Search recipes and cocktails by name or ingredient.',
    creator: '@papiwrld_',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Recipe Finder',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e10' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = 'light';
                try {
                  theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                } catch (e) {}
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${display.variable} ${body.variable} flex min-h-dvh flex-col font-sans`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>
        <Providers>
          <ThemeProvider>
            <SiteHeader />
            {children}
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
