'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Hero from '@/components/Hero';
import RecipeGrid from '@/components/RecipeGrid';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { Recipe, RecipeSearchParams } from '@/types/recipe';
import { getPopularRecipes, getRegionalSpotlight } from '@/lib/api/recipe-api';
import { useSmartSearch } from '@/lib/hooks/useSmartSearch';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIngredients, setSearchIngredients] = useState<string[]>([]);
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

  const handleSearch = (query: string, ingredients: string[]) => {
    // Normalize query - trim whitespace
    const normalizedQuery = query.trim();
    setSearchQuery(normalizedQuery);
    setSearchIngredients(ingredients);
  };

  // Determine which recipes to display
  const hasActiveSearch = (searchQuery && searchQuery.trim().length > 0) || searchIngredients.length > 0;
  
  const smartParams: RecipeSearchParams = {
    query: searchQuery || undefined,
    ingredients: searchIngredients.length > 0 ? searchIngredients : undefined,
    includeCocktails: true,
  };
  const { data: searchResults = [], isLoading, isError } = useSmartSearch(smartParams, []);

  const displayRecipes = hasActiveSearch ? searchResults : spotlightRecipes;

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Recipe Debug ===');
      console.log('Spotlight recipes:', spotlightRecipes.length);
      console.log('Search results:', searchResults.length);
      console.log('Display recipes:', displayRecipes.length);
    }
  }, [spotlightRecipes, searchResults, displayRecipes]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - positioned over hero image */}
      <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-transparent backdrop-blur-lg dark:from-black/60 dark:via-black/50 rounded-b-2xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent drop-shadow-2xl tracking-tight">Recipe Finder</h1>
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 relative">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow delay-2000" />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div 
              className="absolute inset-0 animate-gridMove"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--color-accent) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--color-accent) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }} 
            />
          </div>
          
          {/* Floating Particles */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-accent/20 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-float delay-500" />
          <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-orange-500/20 rounded-full animate-float delay-1000" />
          <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-accent/15 rounded-full animate-float delay-1500" />
          <div className="absolute bottom-20 right-10 w-1.5 h-1.5 bg-purple-500/15 rounded-full animate-float delay-2000" />
        </div>

        {/* Section Title */}
        <div className="mb-8 sm:mb-10 md:mb-12 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-3 sm:mb-4 tracking-tight">
            {hasActiveSearch ? 'Search Results' : 'Featured Recipes'}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary/80">
            {hasActiveSearch
              ? `Found ${displayRecipes.length} ${displayRecipes.length === 1 ? 'recipe' : 'recipes'}`
              : 'Discover delicious recipes from around the world'}
          </p>
        </div>

        {/* Loading State - for search or initial load */}
        {(isLoading || isLoadingInitial) && (
          <div className="text-center py-16 sm:py-20 md:py-24 relative z-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-accent/30 border-t-accent"></div>
            <p className="mt-6 text-base sm:text-lg text-text-secondary/80 font-medium">
              {isLoading ? 'Searching for recipes...' : 'Loading recipes...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && !isLoadingInitial && (
          <div className="text-center py-16 sm:py-20 md:py-24 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/10 mb-6">
              <span className="text-2xl sm:text-3xl">⚠️</span>
            </div>
            <p className="text-red-500 text-base sm:text-lg mb-6 font-medium">Error loading recipes. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 active:bg-accent/80 transition-all shadow-lg hover:shadow-xl touch-manipulation min-h-[48px] font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Recipe Grid - always show, even if empty */}
        {!isLoading && !isLoadingInitial && (
          <div className="relative z-10">
            <RecipeGrid 
              recipes={displayRecipes} 
              showMatchPercentage={true} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

