import { Recipe } from '@/types/recipe';

const FAVORITES_KEY = 'recipe-finder-favorites';

export function getFavorites(): Recipe[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(recipe: Recipe): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  if (!favorites.find(r => r.id === recipe.id)) {
    favorites.push(recipe);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(recipeId: string): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  const filtered = favorites.filter(r => r.id !== recipeId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isFavorite(recipeId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(r => r.id === recipeId);
}

export function toggleFavorite(recipe: Recipe): boolean {
  if (isFavorite(recipe.id)) {
    removeFavorite(recipe.id);
    return false;
  } else {
    addFavorite(recipe);
    return true;
  }
}

