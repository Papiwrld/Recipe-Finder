'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowSquareOut, Check, ChefHat, Clock, Heart, Play, Users } from '@phosphor-icons/react';
import { OriginBadge, DifficultyBadge } from '@/components/Badges';
import { getRecipeById } from '@/lib/api/recipe-api';
import { toggleFavorite, isFavorite } from '@/lib/utils/favorites';
import { cleanSteps } from '@/lib/utils/steps';
import { useState, useEffect } from 'react';
import VideoModal from '@/components/VideoModal';
import CookMode from '@/components/CookMode';

function RecipeSkeleton() {
  return (
    <main id="main" className="mx-auto w-full max-w-4xl flex-1 animate-pulse px-4 pt-6 sm:px-6" aria-busy="true">
      <span className="sr-only">Loading recipe</span>
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="h-12 w-3/4 rounded-full bg-muted" />
        <div className="h-7 w-1/3 rounded-full bg-muted" />
        <div className="h-11 w-64 rounded-full bg-muted" />
      </div>
      <div className="mt-10 aspect-[16/9] rounded-2xl bg-muted" />
    </main>
  );
}

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  const [showVideo, setShowVideo] = useState(false);
  const [showCookMode, setShowCookMode] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
    enabled: !!recipeId,
  });

  // Check favorite status
  useEffect(() => {
    if (recipe) {
      setIsFav(isFavorite(recipe.id));
    }
  }, [recipe]);

  if (isLoading) {
    return <RecipeSkeleton />;
  }

  if (isError || !recipe) {
    return (
      <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="page-title">Recipe not found</h1>
        <p className="mb-6 mt-3 text-text-secondary">
          This recipe may have been removed, or the link may be wrong.
        </p>
        <Link href="/" className="btn-primary">
          Browse recipes
        </Link>
      </main>
    );
  }

  const handleFavoriteToggle = () => {
    setIsFav(toggleFavorite(recipe));
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const isDrink = recipe.type === 'cocktail' || recipe.type === 'drink';
  const steps = cleanSteps(recipe.instructions);
  const tags = isDrink
    ? ['Cocktail', recipe.category, recipe.glass, recipe.alcoholic === false ? 'Alcohol-free' : undefined]
    : [recipe.cuisine];

  const nutritionFacts = recipe.nutrition
    ? [
        { label: 'Calories', value: recipe.nutrition.calories, unit: '' },
        { label: 'Protein', value: recipe.nutrition.protein, unit: 'g' },
        { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g' },
        { label: 'Fat', value: recipe.nutrition.fat, unit: 'g' },
        { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g' },
        { label: 'Sugar', value: recipe.nutrition.sugar, unit: 'g' },
        { label: 'Sodium', value: recipe.nutrition.sodium, unit: 'mg' },
      ].filter((fact) => fact.value)
    : [];

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.image,
    description: `Learn how to make ${recipe.title}`,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
    recipeYield: recipe.servings?.toString(),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step,
    })),
    video: recipe.videoUrl
      ? {
          '@type': 'VideoObject',
          name: recipe.title,
          description: `Video tutorial for ${recipe.title}`,
          thumbnailUrl: recipe.image,
          uploadDate: new Date().toISOString(),
          contentUrl: recipe.videoUrl,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 sm:px-6">
        <div className="text-center">
          <Link
            href={isDrink ? '/cocktails' : '/'}
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {isDrink ? 'All cocktails' : 'All recipes'}
          </Link>

          <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tighter text-text sm:text-6xl">
            {recipe.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {tags.filter(Boolean).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            {recipe.cookTime && (
              <span className="tag">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {recipe.cookTime} min
              </span>
            )}
            {recipe.servings && (
              <span className="tag">
                <Users className="h-4 w-4" aria-hidden="true" />
                {recipe.servings} servings
              </span>
            )}
            <OriginBadge origin={recipe.origin} />
            <DifficultyBadge difficulty={recipe.difficulty} />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {steps.length > 0 && (
              <button type="button" onClick={() => setShowCookMode(true)} className="btn-primary">
                <ChefHat className="h-5 w-5" aria-hidden="true" />
                Start cooking
              </button>
            )}
            {recipe.videoUrl && (
              <button type="button" onClick={() => setShowVideo(true)} className="btn-secondary">
                <Play className="h-4 w-4" weight="fill" aria-hidden="true" />
                Watch video
              </button>
            )}
            <button type="button" onClick={handleFavoriteToggle} aria-pressed={isFav} className="btn-secondary">
              <Heart className={`h-4 w-4 ${isFav ? 'text-accent' : ''}`} weight={isFav ? 'fill' : 'regular'} aria-hidden="true" />
              {isFav ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {recipe.image && (
          <div className="relative mx-auto mt-10 aspect-[4/3] max-w-4xl overflow-hidden rounded-2xl bg-muted shadow-lifted sm:aspect-[16/9]">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Long-form reading stays left-aligned: centered steps are hard to follow while cooking */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-14">
          <section aria-labelledby="ingredients-heading" className="lg:sticky lg:top-8 lg:self-start">
            <h2 id="ingredients-heading" className="section-title">Ingredients</h2>
            <ul className="mt-4 space-y-1">
              {recipe.ingredients.map((ingredient, index) => {
                const checked = checkedIngredients.has(index);
                return (
                  <li key={index}>
                    <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleIngredient(index)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-150 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                          checked ? 'border-accent bg-accent text-on-accent' : 'border-text-secondary/50'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" weight="bold" />}
                      </span>
                      <span className={`transition-colors duration-150 ${checked ? 'text-text-secondary line-through' : 'text-text'}`}>
                        {ingredient}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="min-w-0">
            <section aria-labelledby="method-heading">
              <h2 id="method-heading" className="section-title">Method</h2>
              {steps.length > 0 ? (
                <ol className="mt-5 max-w-[65ch] space-y-6">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="w-7 flex-shrink-0 font-display text-2xl font-semibold leading-7 tabular-nums text-accent" aria-hidden="true">
                        {index + 1}
                      </span>
                      <p className="leading-7 text-text">{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-text-secondary">
                  We don&apos;t have the steps for this recipe.
                  {recipe.sourceUrl && (
                    <>
                      {' '}
                      <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-accent underline underline-offset-4"
                      >
                        See the original
                        <ArrowSquareOut className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </>
                  )}
                </p>
              )}
            </section>

            {nutritionFacts.length > 0 && (
              <section aria-labelledby="nutrition-heading" className="mt-12">
                <h2 id="nutrition-heading" className="section-title">Nutrition</h2>
                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {nutritionFacts.map((fact) => (
                    <div key={fact.label} className="rounded-2xl bg-muted p-4">
                      <dt className="text-sm text-text-secondary">{fact.label}</dt>
                      <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-text">
                        {Math.round(fact.value as number)}
                        {fact.unit}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Video Modal */}
      {recipe.videoUrl && (
        <VideoModal
          videoUrl={recipe.videoUrl}
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          title={recipe.title}
        />
      )}

      {/* Cook Mode */}
      <CookMode
        recipe={recipe}
        isOpen={showCookMode}
        onClose={() => setShowCookMode(false)}
      />
    </>
  );
}
