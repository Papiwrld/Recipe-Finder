'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Users, Play, Heart, ChefHat, Wine, Beaker } from 'lucide-react';
import { OriginBadge, DifficultyBadge, VideoBadge } from '@/components/Badges';
import { getRecipeById } from '@/lib/api/recipe-api';
import { toggleFavorite, isFavorite } from '@/lib/utils/favorites';
import { useState, useEffect } from 'react';
import VideoModal from '@/components/VideoModal';
import CookMode from '@/components/CookMode';

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  const [showVideo, setShowVideo] = useState(false);
  const [showCookMode, setShowCookMode] = useState(false);
  const [isFav, setIsFav] = useState(false);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"></div>
          <p className="text-text-secondary">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Recipe not found</p>
          <Link href="/" className="text-accent hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    setIsFav(toggleFavorite(recipe));
  };

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
    recipeInstructions: recipe.instructions.map((step, index) => ({
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
      <div className="min-h-screen bg-bg">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-muted">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to recipes
            </Link>
          </div>
        </header>

        {/* Hero Image */}
        {recipe.image && (
          <div className="relative w-full h-96 bg-muted">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-text mb-2">{recipe.title}</h1>
                {recipe.type === 'cocktail' ? (
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      <Wine className="w-4 h-4" />
                      Cocktail
                    </span>
                    <VideoBadge hasVideo={!!recipe.videoUrl} />
                    {recipe.category && (
                      <span className="px-3 py-1 bg-muted rounded-full text-sm text-text-secondary">
                        {recipe.category}
                      </span>
                    )}
                    {recipe.glass && (
                      <span className="px-3 py-1 bg-muted rounded-full text-sm text-text-secondary">
                        {recipe.glass}
                      </span>
                    )}
                    {recipe.alcoholic !== undefined && (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        recipe.alcoholic 
                          ? 'bg-red-500/20 text-red-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {recipe.alcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    {recipe.cuisine && (
                      <p className="text-text-secondary">{recipe.cuisine} Cuisine</p>
                    )}
                    {recipe.area && (
                      <span className="inline-block mt-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                        {recipe.area}
                      </span>
                    )}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <OriginBadge origin={recipe.origin} />
                      <DifficultyBadge difficulty={recipe.difficulty} />
                      <VideoBadge hasVideo={!!recipe.videoUrl} />
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleFavoriteToggle}
                className="p-3 bg-surface hover:bg-muted rounded-lg transition-colors"
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-6 h-6 ${isFav ? 'fill-accent text-accent' : 'text-text-secondary'}`} />
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              {recipe.cookTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookTime} minutes</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              {recipe.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Video
                </button>
              )}
              <button
                onClick={() => setShowCookMode(true)}
                className="px-6 py-3 bg-surface border border-muted text-text rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
              >
                <ChefHat className="w-5 h-5" />
                Cook Mode
              </button>
            </div>
          </div>

          {/* Ingredients */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-text-secondary">{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-text mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-text-secondary leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Nutrition (if available) */}
          {recipe.nutrition && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                <Beaker className="w-6 h-6 text-accent" />
                Nutrition Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recipe.nutrition.calories && (
                  <div className="p-4 bg-surface rounded-lg border border-muted">
                    <p className="text-sm text-text-secondary">Calories</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(recipe.nutrition.calories)}</p>
                  </div>
                )}
                {recipe.nutrition.protein && (
                  <div className="p-4 bg-surface rounded-lg border border-muted">
                    <p className="text-sm text-text-secondary">Protein</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(recipe.nutrition.protein)}g</p>
                  </div>
                )}
                {recipe.nutrition.carbs && (
                  <div className="p-4 bg-surface rounded-lg border border-muted">
                    <p className="text-sm text-text-secondary">Carbs</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(recipe.nutrition.carbs)}g</p>
                  </div>
                )}
                {recipe.nutrition.fat && (
                  <div className="p-4 bg-surface rounded-lg border border-muted">
                    <p className="text-sm text-text-secondary">Fat</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(recipe.nutrition.fat)}g</p>
                  </div>
                )}
                {recipe.nutrition.fiber && (
                  <div className="p-4 bg-surface rounded-lg border border-muted">
                    <p className="text-sm text-text-secondary">Fiber</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(recipe.nutrition.fiber)}g</p>
                  </div>
                )}
                {recipe.nutrition.sugar && (
                  <div className="p-4 bg-surface rounded-lg border border-muted">
                    <p className="text-sm text-text-secondary">Sugar</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(recipe.nutrition.sugar)}g</p>
                  </div>
                )}
                {recipe.nutrition.sodium && (
                  <div className="p-4 bg-surface rounded-lg border border-muted">
                    <p className="text-sm text-text-secondary">Sodium</p>
                    <p className="text-2xl font-bold text-accent">{Math.round(recipe.nutrition.sodium)}mg</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

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

