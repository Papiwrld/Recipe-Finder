'use client';

import { useState, useEffect, useCallback } from 'react';
import Hero from '@/components/Hero';
import RecipeGrid, { RecipeGridSkeleton } from '@/components/RecipeGrid';
import { Recipe, RecipeSearchParams } from '@/types/recipe';
import { getPopularRecipes, getRegionalSpotlight } from '@/lib/api/recipe-api';
import { useSmartSearch } from '@/lib/hooks/useSmartSearch';

type Kind = 'all' | 'meals' | 'drinks';

const kindLabels: { value: Kind; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'meals', label: 'Meals' },
  { value: 'drinks', label: 'Drinks' },
];

const isDrink = (recipe: Recipe) => recipe.type === 'cocktail' || recipe.type === 'drink';

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=560&q=80`;

const heroImages = [
  'photo-1565299624946-b28f40a0ae38',
  'photo-1546069901-ba9599a7e63c',
  'photo-1504674900247-0877df9cc836',
  'photo-1567620905732-2d1ec7ab7445',
  'photo-1512621776951-a57141f2eefd',
].map(unsplash);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIngredients, setSearchIngredients] = useState<string[]>([]);
  const [spotlightRecipes, setSpotlightRecipes] = useState<Recipe[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [kind, setKind] = useState<Kind>('all');

  // Show regional recipes first, then add more to the end of the list so cards
  // already on screen don't move while someone is browsing.
  useEffect(() => {
    let isMounted = true;

    const loadRecipes = async () => {
      try {
        const regionalRecipes = await getRegionalSpotlight();
        if (isMounted && regionalRecipes.length > 0) {
          // The API groups results by region, so mix them for a varied first screen
          setSpotlightRecipes([...regionalRecipes].sort(() => Math.random() - 0.5));
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading regional recipes:', error);
        }
      } finally {
        if (isMounted) setIsLoadingInitial(false);
      }

      try {
        const moreRecipes = await getPopularRecipes();
        if (isMounted && moreRecipes.length > 0) {
          setSpotlightRecipes((current) => {
            const seenIds = new Set(current.map((recipe) => recipe.id));
            const additions = moreRecipes.filter((recipe) => !seenIds.has(recipe.id));
            return [...current, ...additions].slice(0, 32);
          });
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading more recipes:', error);
        }
      }
    };

    loadRecipes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = useCallback((query: string, ingredients: string[]) => {
    setSearchQuery(query.trim());
    setSearchIngredients(ingredients);
    setKind('all');
  }, []);

  const hasActiveSearch = searchQuery.length > 0 || searchIngredients.length > 0;

  const smartParams: RecipeSearchParams = {
    query: searchQuery || undefined,
    ingredients: searchIngredients.length > 0 ? searchIngredients : undefined,
    includeCocktails: true,
  };
  const { data: searchResults = [], isLoading, isError, refetch } = useSmartSearch(smartParams, []);

  const baseRecipes = hasActiveSearch ? searchResults : spotlightRecipes;
  const hasBothKinds = baseRecipes.some(isDrink) && baseRecipes.some((recipe) => !isDrink(recipe));
  const displayRecipes = baseRecipes.filter((recipe) => {
    if (kind === 'meals') return !isDrink(recipe);
    if (kind === 'drinks') return isDrink(recipe);
    return true;
  });

  const loading = hasActiveSearch ? isLoading : isLoadingInitial;
  const searchLabel = searchIngredients.length > 0 ? searchIngredients.join(', ') : searchQuery;

  return (
    <>
      <Hero
        title="Find your next meal"
        subtitle="Search recipes and cocktails by name or ingredient."
        quickPicks={['chicken', 'pasta', 'curry', 'dessert']}
        images={heroImages}
        onSearch={handleSearch}
      />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 scroll-mt-6 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div aria-live="polite">
            <h2 className="section-title">
              {hasActiveSearch ? `Results for "${searchLabel}"` : 'Featured recipes'}
            </h2>
            {hasActiveSearch && !loading && !isError && (
              <p className="mt-1 text-sm tabular-nums text-text-secondary">
                {displayRecipes.length} {displayRecipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
            )}
          </div>

          {hasBothKinds && !loading && (
            <div role="group" aria-label="Filter by type" className="mt-4 flex justify-center gap-2">
              {kindLabels.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={kind === value}
                  onClick={() => setKind(value)}
                  className={`chip ${kind === value ? 'chip-active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <RecipeGridSkeleton />
        ) : isError && hasActiveSearch ? (
          <div role="alert" className="px-6 py-16 text-center">
            <h3 className="font-display text-xl font-semibold text-text">We couldn&apos;t reach the recipe service</h3>
            <p className="mx-auto mb-6 mt-2 max-w-md text-text-secondary">
              Check your connection and try again.
            </p>
            <button type="button" onClick={() => refetch()} className="btn-primary">
              Try again
            </button>
          </div>
        ) : (
          <RecipeGrid
            recipes={displayRecipes}
            showMatchPercentage
            emptyTitle={hasActiveSearch ? 'No recipes found' : "We couldn't load any recipes"}
            emptyMessage={
              hasActiveSearch
                ? 'Check the spelling, or try a broader word like "chicken" or "pasta".'
                : 'The recipe service may be unavailable. Refresh the page to try again.'
            }
          />
        )}
      </main>
    </>
  );
}
