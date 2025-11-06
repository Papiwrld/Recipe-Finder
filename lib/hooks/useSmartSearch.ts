"use client";

import { useQuery } from '@tanstack/react-query';
import type { Recipe, RecipeSearchParams } from '@/types/recipe';
import { smartSearch } from '@/lib/search/smart-search';

export function useSmartSearch(params: RecipeSearchParams, userPantry: string[] = []) {
  return useQuery<Recipe[]>({
    queryKey: ['smart-search', params, userPantry],
    queryFn: () => smartSearch(params, userPantry),
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: Boolean(params.query) || (params.ingredients && params.ingredients.length > 0),
  });
}


