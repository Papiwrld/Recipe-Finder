'use client';

import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';

interface HeroProps {
  onSearch: (query: string, ingredients: string[]) => void;
}

// Array of vibrant food and cocktail images - optimized with proper dimensions and quality
// All images are 1920x1080 resolution with 85% quality for optimal performance
// Using Unsplash's CDN with optimized parameters for fast loading
// Mix of food recipes and cocktails to represent the full app experience
const heroImages = [
  // Food Images
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1506368671932-7cc2589e6d5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1504113888839-1c8da502d254?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  // Cocktail Images - vibrant and diverse cocktail photography
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=85',
];

export default function Hero({ onSearch }: HeroProps) {
  // Randomly select an image on each render/refresh
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Select random image on mount
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    const imageUrl = heroImages[randomIndex];
    
    // Preload image for better performance and smooth transition
    const img = new Image();
    img.onload = () => {
      setSelectedImage(imageUrl);
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Fallback to first image if loading fails
      setSelectedImage(heroImages[0]);
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden -mt-20 pt-20">
      {/* Background Image - extends behind navbar */}
      <div className="absolute inset-0 -top-20 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80 z-10" />
        {selectedImage && (
          <div
            className={`w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${selectedImage}')`,
            }}
            role="img"
            aria-label="Food and cocktail background"
          />
        )}
        {/* Fallback gradient while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-purple-900/30 to-blue-900/30" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 md:mb-8 drop-shadow-2xl leading-tight px-2 tracking-tight">
            Discover recipes & cocktails you&apos;ll love
          </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-accent mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto drop-shadow-lg font-light px-4 leading-relaxed">
              Explore thousands of recipes and cocktails from around the world with advanced search and smart results
            </p>

        {/* Floating Search */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
