import type { Recipe } from '@/types/recipe';

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return match ? match[1] : null;
}

export function attachVideoMetadata(recipe: Recipe): Recipe {
  if (!recipe.videoUrl) return recipe;
  const id = extractYouTubeId(recipe.videoUrl);
  if (!id) return recipe;
  // Placeholder for timestamps; could be enhanced later
  const timestamps: Recipe['videoTimestamps'] = [];
  return { ...recipe, videoTimestamps: timestamps };
}


