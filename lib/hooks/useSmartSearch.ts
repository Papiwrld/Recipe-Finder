"use client";

import { useQuery } from '@tanstack/react-query';
import type { Recipe, RecipeSearchParams } from '@/types/recipe';
import { smartSearch } from '@/lib/search/smart-search';

export function useSmartSearch(params: RecipeSearchParams, userPantry: string[] = []) {
  // Only enable search if we have a query or ingredients
  const hasQuery = Boolean(params.query && params.query.trim().length > 0);
  const hasIngredients = Boolean(params.ingredients && params.ingredients.length > 0);
  const shouldSearch = hasQuery || hasIngredients;

  return useQuery<Recipe[]>({
    queryKey: ['smart-search', params, userPantry],
    queryFn: () => smartSearch(params, userPantry),
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: shouldSearch,
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  });
}


