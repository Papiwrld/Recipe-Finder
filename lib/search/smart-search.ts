import type { Recipe, RecipeSearchParams } from '@/types/recipe';
import { searchRecipes as baseSearch } from '@/lib/api/recipe-api';
import { computeMatchScore, estimateDifficulty } from '@/lib/utils/ingredients';
import { inferOrigin } from '@/lib/utils/origin';
import { attachVideoMetadata } from '@/lib/utils/video';

function isLikelyIngredientQuery(q?: string): boolean {
  if (!q) return false;
  if (q.includes(',')) return true;
  const tokens = q.split(/\s+/);
  return tokens.length >= 3 && tokens.every(t => t.length <= 12);
}

function detectIntent(params: RecipeSearchParams): { asIngredients: string[] | null } {
  if (params.ingredients && params.ingredients.length > 0) return { asIngredients: params.ingredients };
  if (isLikelyIngredientQuery(params.query)) {
    const list = params.query!.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 1) return { asIngredients: list };
  }
  return { asIngredients: null };
}

export async function smartSearch(params: RecipeSearchParams, userPantry: string[] = []): Promise<Recipe[]> {
  const intent = detectIntent(params);
  const searchParams: RecipeSearchParams = { ...params };
  if (intent.asIngredients) {
    searchParams.ingredients = intent.asIngredients;
  }

  // 1) Base multi-API search (already parallelized in baseSearch)
  const results = await baseSearch(searchParams);

  // 2) Enrich results with origin, difficulty, video metadata
  const enriched: Recipe[] = results.map(r => {
    const origin = inferOrigin(r.title, r.area);
    const difficulty = estimateDifficulty(r.ingredients, r.instructions);
    const withVideo = attachVideoMetadata(r);
    return { ...withVideo, origin, difficulty };
  });

  // 3) Compute pantry match ranking if pantry is provided
  const ranked = enriched.map(r => {
    const { score } = computeMatchScore(userPantry, r.ingredients);
    return { ...r, matchPercentage: score };
  });

  // 6) Rank by: video > match > popularity heuristic (cookTime shorter preferred)
  ranked.sort((a, b) => {
    const av = a.videoUrl ? 1 : 0;
    const bv = b.videoUrl ? 1 : 0;
    if (bv !== av) return bv - av;
    const am = a.matchPercentage || 0;
    const bm = b.matchPercentage || 0;
    if (bm !== am) return bm - am;
    const at = a.cookTime || 9999;
    const bt = b.cookTime || 9999;
    return at - bt;
  });

  return ranked;
}


