'use client';

import { Recipe } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import { calculateMatchPercentage } from '@/lib/utils/pantry';
import { useState, useEffect } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

interface RecipeGridProps {
  recipes: Recipe[];
  showMatchPercentage?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function RecipeGrid({
  recipes,
  showMatchPercentage = false,
  emptyTitle = 'No recipes found',
  emptyMessage = 'Check the spelling, or try a broader word like "chicken" or "pasta".',
}: RecipeGridProps) {
  const [pantryEnabled, setPantryEnabled] = useState(false);

  useEffect(() => {
    // Check if user has enabled pantry matching
    try {
      const pantry = localStorage.getItem('recipe-finder-pantry');
      setPantryEnabled(!!pantry && JSON.parse(pantry).length > 0);
    } catch {
      setPantryEnabled(false);
    }
  }, []);

  if (recipes.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <MagnifyingGlass className="mx-auto mb-4 h-8 w-8 text-text-secondary" aria-hidden="true" />
        <h3 className="font-display text-xl font-semibold text-text">{emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe, index) => {
        const matchPercentage = showMatchPercentage && pantryEnabled
          ? calculateMatchPercentage(recipe)
          : undefined;

        return (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={index}
            showMatchPercentage={showMatchPercentage && pantryEnabled}
            matchPercentage={matchPercentage}
          />
        );
      })}
    </div>
  );
}

export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="recipe-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex animate-pulse flex-col items-center">
          <div className="aspect-square w-full rounded-2xl bg-muted" />
          <div className="mt-3 h-5 w-4/5 rounded-full bg-muted" />
          <div className="mt-2 h-3.5 w-1/2 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}
