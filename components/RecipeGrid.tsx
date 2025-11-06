'use client';

import { Recipe } from '@/types/recipe';
import RecipeCard from './RecipeCard';
import { calculateMatchPercentage } from '@/lib/utils/pantry';
import { useState, useEffect } from 'react';

interface RecipeGridProps {
  recipes: Recipe[];
  showMatchPercentage?: boolean;
}

export default function RecipeGrid({ recipes, showMatchPercentage = false }: RecipeGridProps) {
  const [pantryEnabled, setPantryEnabled] = useState(false);

  useEffect(() => {
    // Check if user has enabled pantry matching
    const pantry = localStorage.getItem('recipe-finder-pantry');
    setPantryEnabled(!!pantry && JSON.parse(pantry).length > 0);
  }, []);

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary text-lg mb-4">
          No recipes found — try adjusting your search or browse our featured recipes above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {recipes.map((recipe) => {
        const matchPercentage = showMatchPercentage && pantryEnabled
          ? calculateMatchPercentage(recipe)
          : undefined;
        
        return (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            showMatchPercentage={showMatchPercentage && pantryEnabled}
            matchPercentage={matchPercentage}
          />
        );
      })}
    </div>
  );
}

