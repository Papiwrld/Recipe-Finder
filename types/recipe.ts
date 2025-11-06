export type RecipeType = 'recipe' | 'cocktail' | 'drink';

export interface Recipe {
  id: string;
  title: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: number; // in minutes
  servings?: number;
  cuisine?: string;
  area?: string;
  videoUrl?: string; // YouTube URL
  type?: RecipeType; // 'recipe' | 'cocktail' | 'drink'
  source?: string; // API source
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  matchPercentage?: number; // How many ingredients match user's pantry
  // Cocktail-specific fields
  alcoholic?: boolean;
  glass?: string;
  category?: string;
  // Additional metadata
  sourceUrl?: string;
  tags?: string[];
  // Enrichment fields (non-breaking)
  origin?: 'Ghana' | 'Nigeria' | 'Africa' | 'Global';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  videoTimestamps?: { label: string; time: number }[];
}

export interface RecipeSearchParams {
  query?: string;
  ingredients?: string[];
  cuisine?: string;
  cookTime?: number;
  diet?: string;
  videoOnly?: boolean;
  type?: RecipeType; // Filter by recipe type
  includeCocktails?: boolean; // Include cocktails in search
}

export interface FilterState {
  cuisine: string;
  cookTime: number | null;
  diet: string;
  videoOnly: boolean;
  type?: RecipeType; // Filter by recipe type
}

