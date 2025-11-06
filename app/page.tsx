'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import RecipeGrid from '@/components/RecipeGrid';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { Recipe, RecipeSearchParams, FilterState } from '@/types/recipe';
import { getPopularRecipes, getRegionalSpotlight } from '@/lib/api/recipe-api';
import { useSmartSearch } from '@/lib/hooks/useSmartSearch';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIngredients, setSearchIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    cuisine: '',
    cookTime: null,
    diet: '',
    videoOnly: false,
    type: undefined, // undefined = all, 'recipe' = recipes only, 'cocktail' = cocktails only
  });
  const [spotlightRecipes, setSpotlightRecipes] = useState<Recipe[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Load recipes on mount - show regional recipes immediately, then enhance with API recipes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingInitial(true);

    // Load regional recipes from APIs
    const loadRecipes = async () => {
      try {
        const regionalRecipes = await getRegionalSpotlight();
        
        if (isMounted) {
          if (regionalRecipes && Array.isArray(regionalRecipes) && regionalRecipes.length > 0) {
            setSpotlightRecipes(regionalRecipes);
          }
          setIsLoadingInitial(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoadingInitial(false);
          if (process.env.NODE_ENV === 'development') {
            console.error('Error loading regional recipes:', error);
          }
        }
      }
    };

    // Load immediately
    loadRecipes();

    // Then enhance with API recipes in the background
    const enhanceWithAPIRecipes = async () => {
      try {
        const apiRecipes = await getPopularRecipes();
        if (isMounted && apiRecipes && Array.isArray(apiRecipes) && apiRecipes.length > 0) {
          setSpotlightRecipes(apiRecipes);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error enhancing with API recipes:', error);
        }
        // Keep showing regional recipes
      }
    };
    
    // Delay API enhancement slightly to ensure regional recipes show first
    const timeoutId = setTimeout(enhanceWithAPIRecipes, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Search query
  const smartParams: RecipeSearchParams = {
    query: searchQuery || undefined,
    ingredients: searchIngredients.length > 0 ? searchIngredients : undefined,
    cuisine: filters.cuisine || undefined,
    cookTime: filters.cookTime || undefined,
    diet: filters.diet || undefined,
    videoOnly: filters.videoOnly || undefined,
    type: filters.type,
    includeCocktails: filters.type !== 'recipe',
  };
  const { data: searchResults = [], isLoading, isError } = useSmartSearch(smartParams, []);

  const handleSearch = (query: string, ingredients: string[]) => {
    setSearchQuery(query);
    setSearchIngredients(ingredients);
  };

  const displayRecipes = searchQuery || searchIngredients.length > 0 ? searchResults : spotlightRecipes;

  // Apply client-side filtering for videoOnly
  const filteredRecipes = filters.videoOnly
    ? displayRecipes.filter(r => r.videoUrl)
    : displayRecipes;

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Recipe Debug ===');
      console.log('Spotlight recipes:', spotlightRecipes.length);
      console.log('Search results:', searchResults.length);
      console.log('Display recipes:', displayRecipes.length);
      console.log('Filtered recipes:', filteredRecipes.length);
    }
  }, [spotlightRecipes, searchResults, displayRecipes, filteredRecipes]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - positioned over hero image */}
      <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-transparent backdrop-blur-lg dark:from-black/60 dark:via-black/50 rounded-b-2xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-accent drop-shadow-2xl">Recipe Finder</h1>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-4 text-white/90">
              <Link
                href="/cocktails"
                className="hover:text-white hover:underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                Cocktails
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section - extends behind navbar */}
      <Hero onSearch={handleSearch} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters */}
        {(searchQuery || searchIngredients.length > 0) && (
          <div className="mb-8">
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>
        )}

        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text mb-2">
            {searchQuery || searchIngredients.length > 0 ? 'Search Results' : 'Featured Recipes'}
          </h2>
          <p className="text-text-secondary">
            {searchQuery || searchIngredients.length > 0
              ? `Found ${filteredRecipes.length} recipes`
              : 'Discover delicious recipes from around the world'}
          </p>
        </div>

        {/* Loading State - for search or initial load */}
        {(isLoading || isLoadingInitial) && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-text-secondary">
              {isLoading ? 'Searching for recipes...' : 'Loading recipes...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-16">
            <p className="text-red-500">Error loading recipes. Please try again.</p>
          </div>
        )}

        {/* Recipe Grid - always show, even if empty */}
        {!isLoading && !isLoadingInitial && (
          <RecipeGrid 
            recipes={filteredRecipes.length > 0 ? filteredRecipes : spotlightRecipes} 
            showMatchPercentage={true} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

