import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recipe Finder',
    short_name: 'Recipe Finder',
    description: 'Discover dishes you\'ll love - Explore authentic recipes from around the world',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f0f',
    theme_color: '#ff7a1a',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

