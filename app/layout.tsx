import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Providers from './providers';

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Recipe Finder - Discover Dishes You'll Love",
    template: '%s | Recipe Finder',
  },
  description: 'Discover thousands of recipes and cocktails from around the world. Search by ingredients, cuisine, or name. Powered by TheMealDB and TheCocktailDB - completely free, no API keys required!',
  keywords: ['recipes', 'cocktails', 'cooking', 'meal planning', 'recipe search', 'food recipes', 'drink recipes', 'TheMealDB', 'TheCocktailDB'],
  authors: [{ name: 'Awagah Eugene Kwesi', url: 'https://github.com/Papiwrld' }],
  creator: 'Awagah Eugene Kwesi',
  publisher: 'Awagah Eugene Kwesi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://recipe-finder.vercel.app',
    title: "Recipe Finder - Discover Dishes You'll Love",
    description: 'Discover thousands of recipes and cocktails from around the world. Search by ingredients, cuisine, or name.',
    siteName: 'Recipe Finder',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Recipe Finder - Discover Dishes You'll Love",
    description: 'Discover thousands of recipes and cocktails from around the world.',
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
    statusBarStyle: 'black-translucent',
    title: 'Recipe Finder',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ff7a1a',
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
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

