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
    // Normalize query - trim whitespace
    const normalizedQuery = query.trim();
    setSearchQuery(normalizedQuery);
    setSearchIngredients(ingredients);
  };

  // Determine which recipes to display
  const hasActiveSearch = (searchQuery && searchQuery.trim().length > 0) || searchIngredients.length > 0;
  const displayRecipes = hasActiveSearch ? searchResults : spotlightRecipes;

  // Apply client-side filtering
  const filteredRecipes = displayRecipes.filter(recipe => {
    // Video filter
    if (filters.videoOnly && !recipe.videoUrl) return false;
    
    // Cook time filter
    if (filters.cookTime && recipe.cookTime && recipe.cookTime > filters.cookTime) return false;
    
    // Cuisine filter
    if (filters.cuisine && recipe.cuisine && !recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())) return false;
    
    return true;
  });

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
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Filters */}
        {(hasActiveSearch || filteredRecipes.length > 0) && (
          <div className="mb-6 sm:mb-8">
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>
        )}

        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            {hasActiveSearch ? 'Search Results' : 'Featured Recipes'}
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            {hasActiveSearch
              ? `Found ${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recipe' : 'recipes'}`
              : 'Discover delicious recipes from around the world'}
          </p>
        </div>

        {/* Loading State - for search or initial load */}
        {(isLoading || isLoadingInitial) && (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-sm sm:text-base text-text-secondary">
              {isLoading ? 'Searching for recipes...' : 'Loading recipes...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && !isLoadingInitial && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-red-500 text-sm sm:text-base mb-4">Error loading recipes. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors touch-manipulation min-h-[44px]"
            >
              Retry
            </button>
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

