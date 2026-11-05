'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ForkKnife, Heart, Wine } from '@phosphor-icons/react';
import { Recipe } from '@/types/recipe';
import { FAVORITES_CHANGED_EVENT, isFavorite, toggleFavorite } from '@/lib/utils/favorites';
import { useState, useEffect, memo, useCallback } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  showMatchPercentage?: boolean;
  matchPercentage?: number;
  index?: number;
}

function getMeta(recipe: Recipe): string {
  if (recipe.type === 'cocktail' || recipe.type === 'drink') {
    return recipe.alcoholic === false ? 'Alcohol-free' : recipe.category || 'Cocktail';
  }
  return [recipe.cuisine || recipe.area, recipe.cookTime ? `${recipe.cookTime} min` : '']
    .filter(Boolean)
    .join(', ');
}

function RecipeCard({
  recipe,
  showMatchPercentage = false,
  matchPercentage,
  index = 0,
}: RecipeCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isDrink = recipe.type === 'cocktail' || recipe.type === 'drink';

  useEffect(() => {
    const syncFavorite = () => setIsFav(isFavorite(recipe.id));
    syncFavorite();
    window.addEventListener('storage', syncFavorite);
    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);
    return () => {
      window.removeEventListener('storage', syncFavorite);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);
    };
  }, [recipe.id]);

  const handleFavoriteToggle = useCallback(() => {
    setIsFav(toggleFavorite(recipe));
  }, [recipe]);

  const displayMatch = showMatchPercentage && matchPercentage !== undefined;
  const meta = getMeta(recipe);
  const FallbackIcon = isDrink ? Wine : ForkKnife;

  return (
    <article
      className="group relative animate-rise text-center"
      style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-soft transition-shadow duration-300 group-hover:shadow-lifted">
        {recipe.image && !imageFailed ? (
          <Image
            src={recipe.image}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-secondary/50">
            <FallbackIcon className="h-8 w-8" aria-hidden="true" />
          </div>
        )}

        <button
          type="button"
          onClick={handleFavoriteToggle}
          aria-pressed={isFav}
          aria-label={`${isFav ? 'Remove' : 'Save'} ${recipe.title} ${isFav ? 'from' : 'to'} favorites`}
          className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-text shadow-soft backdrop-blur-sm transition duration-200 hover:bg-surface active:scale-90"
        >
          <Heart className={`h-5 w-5 transition-colors ${isFav ? 'text-accent' : ''}`} weight={isFav ? 'fill' : 'regular'} />
        </button>
      </div>

      <div className="px-1 pt-3">
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight text-text sm:text-lg">
          <Link
            href={`/recipe/${recipe.id}`}
            className="transition-colors duration-200 after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
          >
            {recipe.title}
          </Link>
        </h3>

        {meta && <p className="mt-1 text-sm text-text-secondary">{meta}</p>}

        {displayMatch && (
          <p className="mt-0.5 text-sm font-medium tabular-nums text-accent">{matchPercentage}% match</p>
        )}
      </div>
    </article>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(RecipeCard);
