// Basic normalization for ingredient strings
export function normalizeIngredientName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Common synonyms for better matching
const SYNONYMS: Record<string, string[]> = {
  tomato: ['tomatoes', 'roma tomato', 'cherry tomato'],
  onion: ['onions', 'red onion', 'white onion', 'yellow onion'],
  pepper: ['chili', 'chilli', 'bell pepper', 'peppers'],
  oil: ['olive oil', 'vegetable oil', 'canola oil'],
  garlic: ['garlic clove', 'garlic cloves'],
};

export function expandSynonyms(term: string): string[] {
  const key = normalizeIngredientName(term);
  const expansions = SYNONYMS[key] || [];
  return [key, ...expansions.map(normalizeIngredientName)];
}

// Very small similarity scorer for ingredient matching
export function similarity(a: string, b: string): number {
  const na = normalizeIngredientName(a);
  const nb = normalizeIngredientName(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  // Jaccard over tokens
  const ta = new Set(na.split(' '));
  const tb = new Set(nb.split(' '));
  const inter = [...ta].filter(t => tb.has(t)).length;
  const union = new Set([...ta, ...tb]).size;
  return union === 0 ? 0 : inter / union;
}

export function estimateDifficulty(ingredients: string[], steps: string[]): 'Easy' | 'Medium' | 'Hard' {
  const count = ingredients.length + steps.length;
  if (count <= 10) return 'Easy';
  if (count <= 20) return 'Medium';
  return 'Hard';
}

export function computeMatchScore(userPantry: string[], recipeIngredients: string[]): { score: number; matched: number; missing: number } {
  if (!userPantry || userPantry.length === 0) return { score: 0, matched: 0, missing: recipeIngredients.length };
  const pantryExpanded = new Set(userPantry.flatMap(expandSynonyms).map(normalizeIngredientName));
  let matched = 0;
  for (const ing of recipeIngredients) {
    const n = normalizeIngredientName(ing);
    // token match or synonym match
    const tokens = n.split(' ');
    const isMatch = tokens.some(t => pantryExpanded.has(t));
    if (isMatch) matched += 1;
  }
  const missing = Math.max(0, recipeIngredients.length - matched);
  const score = Math.round((matched / Math.max(1, recipeIngredients.length)) * 100);
  return { score, matched, missing };
}

