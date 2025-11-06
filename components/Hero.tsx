'use client';

import SearchBar from './SearchBar';
import { RecipeSearchParams } from '@/types/recipe';

interface HeroProps {
  onSearch: (query: string, ingredients: string[]) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden -mt-20 pt-20">
      {/* Background Image - extends behind navbar */}
      <div className="absolute inset-0 -top-20 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80 z-10" />
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center pt-8 pb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl leading-tight px-2">
            Discover recipes & cocktails you&apos;ll love
          </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 max-w-2xl mx-auto drop-shadow-lg font-light px-4">
              Explore thousands of recipes and cocktails from around the world with advanced search and smart results
            </p>

        {/* Floating Search */}
        <div className="mt-8">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}

