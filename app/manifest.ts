import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recipe Finder',
    short_name: 'Recipe Finder',
    description: 'Search recipes and cocktails by name or ingredient',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#c93f14',
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

