'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from '@phosphor-icons/react';
import { FAVORITES_CHANGED_EVENT, getFavorites } from '@/lib/utils/favorites';
import RecipeGrid from '@/components/RecipeGrid';
import { Recipe } from '@/types/recipe';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncFavorites = () => setFavorites(getFavorites());
    syncFavorites();
    setIsReady(true);

    window.addEventListener('storage', syncFavorites);
    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavorites);

    return () => {
      window.removeEventListener('storage', syncFavorites);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavorites);
    };
  }, []);

  return (
    <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <h1 className="page-title">Favorites</h1>
      {isReady && favorites.length > 0 && (
        <p className="mt-3 text-center tabular-nums text-text-secondary">
          {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved on this device
        </p>
      )}

      <div className="mt-8 sm:mt-10">
        {isReady && favorites.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Heart className="mx-auto mb-4 h-8 w-8 text-text-secondary" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-text">No favorites yet</h2>
            <p className="mx-auto mb-6 mt-2 max-w-md text-text-secondary">
              Save recipes to find them here later.
            </p>
            <Link href="/" className="btn-primary">
              Browse recipes
            </Link>
          </div>
        )}
        {favorites.length > 0 && <RecipeGrid recipes={favorites} />}
      </div>
    </main>
  );
}
