'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Wine } from 'lucide-react';
import { searchTheCocktailDB, getRandomCocktails } from '@/lib/api/recipe-api';
import RecipeGrid from '@/components/RecipeGrid';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ThemeToggle from '@/components/ThemeToggle';

export default function CocktailsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIngredients, setSearchIngredients] = useState<string[]>([]);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Load random cocktails on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingInitial(true);

    const loadCocktails = async () => {
      try {
        const randomCocktails = await getRandomCocktails();
        if (isMounted && randomCocktails && Array.isArray(randomCocktails) && randomCocktails.length > 0) {
          setCocktails(randomCocktails);
        }
        if (isMounted) setIsLoadingInitial(false);
      } catch (error) {
        if (isMounted) {
          setIsLoadingInitial(false);
          if (process.env.NODE_ENV === 'development') {
            console.error('Error loading cocktails:', error);
          }
        }
      }
    };

    loadCocktails();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search query
  const { data: searchResults = [], isLoading, isError } = useQuery({
    queryKey: ['cocktails-search', searchQuery],
    queryFn: () => (searchQuery.trim() ? searchTheCocktailDB(searchQuery.trim()) : Promise.resolve([])),
    enabled: searchQuery.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });

  const handleSearch = (query: string, ingredients: string[]) => {
    setSearchQuery(query);
    // Note: ingredients not used for cocktail search, but kept for SearchBar compatibility
    if (ingredients.length > 0) {
      setSearchQuery(ingredients.join(' '));
    }
  };

  const displayCocktails = searchQuery.trim() || searchIngredients.length > 0 ? searchResults : cocktails;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - matches homepage style */}
      <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-transparent backdrop-blur-lg dark:from-black/60 dark:via-black/50 rounded-b-2xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-accent drop-shadow-2xl flex items-center gap-2">
              <Wine className="w-6 h-6 md:w-8 md:h-8" />
              Cocktails
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero-like section with search */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0 -top-20 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-purple-800/40 to-black/80 z-10" />
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            }}
          />
        </div>

        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 text-center pt-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            Discover Amazing Cocktails
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto drop-shadow-lg font-light">
            Search thousands of cocktail recipes with smart discovery
          </p>

          <div className="mt-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Try: margarita, mojito, old fashioned"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text mb-2">
            {searchQuery ? 'Search Results' : 'Featured Cocktails'}
          </h2>
          <p className="text-text-secondary">
            {searchQuery
              ? `Found ${displayCocktails.length} cocktails`
              : 'Explore delicious cocktail recipes from around the world'}
          </p>
        </div>

        {/* Loading State */}
        {(isLoading || isLoadingInitial) && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-text-secondary">
              {isLoading ? 'Searching for cocktails...' : 'Loading cocktails...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-16">
            <p className="text-red-500">Error loading cocktails. Please try again.</p>
          </div>
        )}

        {/* Cocktail Grid */}
        {!isLoading && !isLoadingInitial && (
          <RecipeGrid recipes={displayCocktails} showMatchPercentage={false} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
