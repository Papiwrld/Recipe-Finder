import { Recipe } from '@/types/recipe';

const PANTRY_KEY = 'recipe-finder-pantry';

export function getPantry(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(PANTRY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function setPantry(ingredients: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PANTRY_KEY, JSON.stringify(ingredients));
}

export function addToPantry(ingredient: string): void {
  const pantry = getPantry();
  if (!pantry.includes(ingredient.toLowerCase())) {
    pantry.push(ingredient.toLowerCase());
    setPantry(pantry);
  }
}

export function removeFromPantry(ingredient: string): void {
  const pantry = getPantry();
  const filtered = pantry.filter(i => i !== ingredient.toLowerCase());
  setPantry(filtered);
}

// Calculate match percentage for a recipe based on pantry
export function calculateMatchPercentage(recipe: Recipe, pantry: string[] = getPantry()): number {
  if (pantry.length === 0 || recipe.ingredients.length === 0) return 0;

  const pantryLower = pantry.map(i => i.toLowerCase());
  const recipeIngredientsLower = recipe.ingredients.map(i => i.toLowerCase());

  let matches = 0;
  recipeIngredientsLower.forEach(ingredient => {
    // Check if any pantry item is contained in the ingredient or vice versa
    const hasMatch = pantryLower.some(pantryItem =>
      ingredient.includes(pantryItem) || pantryItem.includes(ingredient)
    );
    if (hasMatch) matches++;
  });

  return Math.round((matches / recipe.ingredients.length) * 100);
}

