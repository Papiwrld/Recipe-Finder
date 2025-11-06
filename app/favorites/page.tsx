'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { getFavorites } from '@/lib/utils/favorites';
import RecipeGrid from '@/components/RecipeGrid';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import { Recipe } from '@/types/recipe';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    
    // Listen for storage changes
    const handleStorageChange = () => {
      setFavorites(getFavorites());
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (in case of same-window updates)
    const interval = setInterval(() => {
      setFavorites(getFavorites());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
              <Heart className="w-6 h-6 fill-accent text-accent" />
              My Favorites
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text mb-2">No favorites yet</h2>
            <p className="text-text-secondary mb-6">
              Start exploring recipes and save your favorites!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Discover Recipes
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-text mb-2">
                {favorites.length} {favorites.length === 1 ? 'Favorite Recipe' : 'Favorite Recipes'}
              </h2>
              <p className="text-text-secondary">
                Your saved recipes for easy access
              </p>
            </div>
            <RecipeGrid recipes={favorites} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

