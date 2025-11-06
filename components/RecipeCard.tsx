'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Play, Heart, Wine } from 'lucide-react';
import { OriginBadge, DifficultyBadge, VideoBadge } from '@/components/Badges';
import { Recipe } from '@/types/recipe';
import { isFavorite, toggleFavorite } from '@/lib/utils/favorites';
import { useState, useEffect, memo, useCallback } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  showMatchPercentage?: boolean;
  matchPercentage?: number;
}

function RecipeCard({ recipe, showMatchPercentage = false, matchPercentage }: RecipeCardProps) {
  const [isFav, setIsFav] = useState(isFavorite(recipe.id));

  // Sync favorite state with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsFav(isFavorite(recipe.id));
    };
    window.addEventListener('storage', handleStorageChange);
    // Also check on mount/update
    setIsFav(isFavorite(recipe.id));
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [recipe.id]);

  const handleFavoriteToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(toggleFavorite(recipe));
  }, [recipe]);

  const displayMatch = showMatchPercentage && matchPercentage !== undefined;

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="block group"
      aria-label={`View recipe: ${recipe.title}`}
    >
      <div className="relative bg-surface rounded-lg overflow-hidden border border-muted hover:border-accent transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative w-full h-48 bg-muted">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="lazy"
              quality={85}
              onError={(e) => {
                // Fallback to placeholder on error
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary">
              No Image
            </div>
          )}
          
          {/* Type Badge */}
          {recipe.type === 'cocktail' && (
            <div className="absolute top-2 left-2 bg-purple-600/90 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Wine className="w-3 h-3" />
              Cocktail
            </div>
          )}
          
          {/* Video Icon */}
          {recipe.videoUrl && (
            <div className="absolute top-2 right-2 bg-black/60 rounded-full p-2">
              <Play className="w-4 h-4 text-white" fill="white" />
            </div>
          )}

          {/* Match Percentage Ring */}
          {displayMatch && (
            <div className="absolute top-2 left-2">
              <div className="relative w-12 h-12">
                <svg className="transform -rotate-90 w-12 h-12">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${matchPercentage * 1.256} 125.6`}
                    className="text-accent"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-accent">
                  {matchPercentage}%
                </span>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 active:bg-black/90 rounded-full p-2.5 sm:p-2 transition-colors touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            type="button"
          >
            <Heart
              className={`w-5 h-5 sm:w-4 sm:h-4 ${isFav ? 'fill-accent text-accent' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-base sm:text-lg text-text mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {recipe.title}
          </h3>
          
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-text-secondary flex-wrap">
            {recipe.cookTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.cookTime} min</span>
              </div>
            )}
            {recipe.type === 'cocktail' && recipe.glass && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                {recipe.glass}
              </span>
            )}
            {recipe.cuisine && (
              <span className="px-2 py-1 bg-muted rounded text-xs">
                {recipe.cuisine}
              </span>
            )}
          </div>

            {/* Smart badges (non-intrusive) */}
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <OriginBadge origin={recipe.origin} />
              <DifficultyBadge difficulty={recipe.difficulty} />
              <VideoBadge hasVideo={!!recipe.videoUrl} />
            </div>

          {(recipe.area || (recipe.type === 'cocktail' && recipe.alcoholic !== undefined)) && (
            <div className="mt-2 flex items-center gap-2">
              {recipe.area && (
                <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                  {recipe.area}
                </span>
              )}
              {recipe.type === 'cocktail' && (
                <span className={`text-xs px-2 py-1 rounded ${
                  recipe.alcoholic 
                    ? 'bg-red-500/20 text-red-300' 
                    : 'bg-green-500/20 text-green-300'
                }`}>
                  {recipe.alcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(RecipeCard);

