'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchTheCocktailDB, getRandomCocktails } from '@/lib/api/recipe-api';
import Hero from '@/components/Hero';
import RecipeGrid, { RecipeGridSkeleton } from '@/components/RecipeGrid';
import { Recipe } from '@/types/recipe';

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=560&q=80`;

const heroImages = [
  'photo-1551538827-9c037cb4f32a',
  'photo-1536935338788-846bb9981813',
  'photo-1514362545857-3bc16c4c7d1b',
  'photo-1470337458703-46ad1756a187',
  'photo-1513558161293-cdaf765ed2fd',
].map(unsplash);

export default function CocktailsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cocktails, setCocktails] = useState<Recipe[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Load random cocktails on mount
  useEffect(() => {
    let isMounted = true;

    const loadCocktails = async () => {
      try {
        const randomCocktails = await getRandomCocktails(12);
        if (isMounted && randomCocktails.length > 0) {
          const unique = randomCocktails.filter(
            (drink, index, all) => all.findIndex((other) => other.id === drink.id) === index
          );
          setCocktails(unique);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading cocktails:', error);
        }
      } finally {
        if (isMounted) setIsLoadingInitial(false);
      }
    };

    loadCocktails();

    return () => {
      isMounted = false;
    };
  }, []);

  const trimmedQuery = searchQuery.trim();
  const hasActiveSearch = trimmedQuery.length > 0;

  const { data: searchResults = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['cocktails-search', trimmedQuery],
    queryFn: () => searchTheCocktailDB(trimmedQuery),
    enabled: hasActiveSearch,
    staleTime: 1000 * 60 * 2,
  });

  // Cocktails are searched by name, so ingredient chips are joined into the query
  const handleSearch = useCallback((query: string, ingredients: string[]) => {
    setSearchQuery(ingredients.length > 0 ? ingredients.join(' ') : query);
  }, []);

  const displayCocktails = hasActiveSearch ? searchResults : cocktails;
  const loading = hasActiveSearch ? isLoading : isLoadingInitial;

  return (
    <>
      <Hero
        title="Find a cocktail"
        subtitle="Search cocktail recipes by name."
        placeholder="Try: margarita, mojito, old fashioned"
        quickPicks={['margarita', 'mojito', 'negroni', 'daiquiri']}
        images={heroImages}
        onSearch={handleSearch}
      />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 scroll-mt-6 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center" aria-live="polite">
          <h2 className="section-title">
            {hasActiveSearch ? `Results for "${trimmedQuery}"` : 'Featured cocktails'}
          </h2>
          {hasActiveSearch && !loading && !isError && (
            <p className="mt-1 text-sm tabular-nums text-text-secondary">
              {displayCocktails.length} {displayCocktails.length === 1 ? 'cocktail' : 'cocktails'}
            </p>
          )}
        </div>

        {loading ? (
          <RecipeGridSkeleton />
        ) : isError && hasActiveSearch ? (
          <div role="alert" className="px-6 py-16 text-center">
            <h3 className="font-display text-xl font-semibold text-text">We couldn&apos;t reach the cocktail service</h3>
            <p className="mx-auto mb-6 mt-2 max-w-md text-text-secondary">
              Check your connection and try again.
            </p>
            <button type="button" onClick={() => refetch()} className="btn-primary">
              Try again
            </button>
          </div>
        ) : (
          <RecipeGrid
            recipes={displayCocktails}
            emptyTitle={hasActiveSearch ? 'No cocktails found' : "We couldn't load any cocktails"}
            emptyMessage={
              hasActiveSearch
                ? 'Check the spelling, or try a classic like "margarita" or "mojito".'
                : 'The cocktail service may be unavailable. Refresh the page to try again.'
            }
          />
        )}
      </main>
    </>
  );
}
