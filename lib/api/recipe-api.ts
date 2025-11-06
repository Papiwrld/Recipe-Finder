import { Recipe, RecipeSearchParams } from '@/types/recipe';
import { API_CONFIG, API_ENDPOINTS } from '../api-config';

// Transform TheMealDB response to our Recipe format
function transformTheMealDB(meal: any): Recipe {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure || ''} ${ingredient}`.trim());
    }
  }

  const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter((step: string) => step.trim())
    : [];

  return {
    id: `themealdb-${meal.idMeal || Date.now()}`,
    title: meal.strMeal || 'Untitled Recipe',
    image: meal.strMealThumb || undefined,
    ingredients,
    instructions,
    cookTime: undefined, // TheMealDB doesn't provide this
    servings: undefined,
    cuisine: meal.strArea || 'International',
    area: meal.strArea || undefined,
    videoUrl: meal.strYoutube || undefined,
    type: 'recipe',
    source: 'themealdb',
  };
}


// Transform RecipePuppy response
function transformRecipePuppy(recipe: any): Recipe {
  return {
    id: `recipepuppy-${recipe.href?.split('/').pop() || Date.now()}`,
    title: recipe.title || 'Untitled Recipe',
    image: recipe.thumbnail || undefined,
    ingredients: recipe.ingredients?.split(', ').map((ing: string) => ing.trim()) || [],
    instructions: [], // RecipePuppy doesn't provide instructions
    type: 'recipe',
    source: 'recipepuppy',
    sourceUrl: recipe.href,
  };
}

// Transform TheCocktailDB response to our Recipe format
function transformTheCocktailDB(drink: any): Recipe {
  const ingredients: string[] = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure || ''} ${ingredient}`.trim());
    }
  }

  const instructions = drink.strInstructions
    ? drink.strInstructions.split(/\r?\n/).filter((step: string) => step.trim())
    : [];

  return {
    id: `cocktail-${drink.idDrink || Date.now()}`,
    title: drink.strDrink || 'Untitled Drink',
    image: drink.strDrinkThumb || undefined,
    ingredients,
    instructions,
    cookTime: undefined, // Cocktails don't have cook time
    servings: undefined,
    cuisine: drink.strCategory || 'Cocktail',
    area: drink.strArea || undefined,
    videoUrl: drink.strVideo || undefined,
    type: 'cocktail',
    source: 'thecocktaildb',
    alcoholic: drink.strAlcoholic === 'Alcoholic',
    glass: drink.strGlass || undefined,
    category: drink.strCategory || undefined,
  };
}

// Search recipes from TheMealDB
export async function searchTheMealDB(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.themealdb.search}?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.meals && Array.isArray(data.meals)) {
      return data.meals.map(transformTheMealDB);
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error searching TheMealDB:', error);
    }
    return [];
  }
}

// Search cocktails from TheCocktailDB
export async function searchTheCocktailDB(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.thecocktaildb.search}?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.drinks && Array.isArray(data.drinks)) {
      return data.drinks.map(transformTheCocktailDB);
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error searching TheCocktailDB:', error);
    }
    return [];
  }
}

// Get cocktail by ID from TheCocktailDB
export async function getTheCocktailDBRecipe(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_ENDPOINTS.thecocktaildb.lookup}?i=${id}`);
    const data = await response.json();
    if (data.drinks && data.drinks.length > 0) {
      return transformTheCocktailDB(data.drinks[0]);
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching TheCocktailDB recipe:', error);
    }
    return null;
  }
}

// Get random cocktails from TheCocktailDB
export async function getRandomCocktails(count: number = 5): Promise<Recipe[]> {
  try {
    const cocktails: Recipe[] = [];
    for (let i = 0; i < count; i++) {
      const response = await fetch(API_ENDPOINTS.thecocktaildb.random);
      const data = await response.json();
      if (data.drinks && data.drinks.length > 0) {
        cocktails.push(transformTheCocktailDB(data.drinks[0]));
      }
    }
    return cocktails;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching random cocktails:', error);
    }
    return [];
  }
}

// Get recipe by ID from TheMealDB
export async function getTheMealDBRecipe(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_ENDPOINTS.themealdb.lookup}?i=${id}`);
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      return transformTheMealDB(data.meals[0]);
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching TheMealDB recipe:', error);
    }
    return null;
  }
}

// Search recipes from RecipePuppy
// Note: RecipePuppy uses HTTP, which may cause CORS issues in production
// Consider using a proxy or disabling this source in production
export async function searchRecipePuppy(ingredients: string[]): Promise<Recipe[]> {
  try {
    const query = ingredients.join(',');
    // Use a CORS proxy or serverless function for production
    const proxyUrl = '/api/proxy/recipepuppy';
    const response = await fetch(`${proxyUrl}?i=${encodeURIComponent(query)}`);
    if (!response.ok) {
      // Fallback to direct API (may fail due to CORS)
      const directResponse = await fetch(`${API_ENDPOINTS.recipepuppy}?i=${encodeURIComponent(query)}`);
      const data = await directResponse.json();
      if (data.results && Array.isArray(data.results)) {
        return data.results.map(transformRecipePuppy);
      }
      return [];
    }
    const data = await response.json();
    if (data.results && Array.isArray(data.results)) {
      return data.results.map(transformRecipePuppy);
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error searching RecipePuppy:', error);
    }
    return [];
  }
}


// Main search function that combines all sources
export async function searchRecipes(params: RecipeSearchParams): Promise<Recipe[]> {
  const results: Recipe[] = [];
  const includeCocktails = params.includeCocktails !== false; // Default: true

  // Prepare parallel API calls for better performance
  const apiCalls: Promise<Recipe[]>[] = [];

  // Search TheMealDB (supports query and ingredient search)
  if (API_CONFIG.useTheMealDB && (!params.type || params.type === 'recipe')) {
    if (params.query) {
      apiCalls.push(searchTheMealDB(params.query).catch(() => []));
    }
    // Also search by ingredients if provided
    if (params.ingredients?.length && !params.query) {
      for (const ingredient of params.ingredients.slice(0, 3)) {
        apiCalls.push(searchTheMealDB(ingredient).catch(() => []));
      }
    }
    
    // If cuisine filter is set, search for cuisine-specific dishes
    if (params.cuisine) {
      const cuisineLower = params.cuisine.toLowerCase();
      
      // Search by cuisine name
      if (cuisineLower !== 'all' && cuisineLower !== 'international') {
        apiCalls.push(searchTheMealDB(params.cuisine).catch(() => []));
      }
    }
  }

  // Search TheCocktailDB (if enabled and cocktails are included)
  if (API_CONFIG.useTheCocktailDB && includeCocktails && (!params.type || params.type === 'cocktail') && params.query) {
    apiCalls.push(searchTheCocktailDB(params.query).catch(() => []));
  }


  // Search RecipePuppy as fallback (if enabled and we have ingredients)
  if (API_CONFIG.useRecipePuppy && params.ingredients?.length && (!params.type || params.type === 'recipe')) {
    apiCalls.push(searchRecipePuppy(params.ingredients).catch(() => []));
  }

  // Execute all API calls in parallel
  const apiResults = await Promise.all(apiCalls);
  apiResults.forEach(apiResult => {
    if (Array.isArray(apiResult)) {
      results.push(...apiResult);
    }
  });

  // Filter by type if specified
  let filteredResults = results;
  if (params.type) {
    filteredResults = results.filter(r => r.type === params.type);
  }

  // Remove duplicates based on title
  const uniqueResults = filteredResults.filter((recipe, index, self) =>
    index === self.findIndex(r => r.title.toLowerCase() === recipe.title.toLowerCase())
  );

  return uniqueResults;
}

// Get recipe by ID (checks all sources)
export async function getRecipeById(id: string): Promise<Recipe | null> {
  // Try TheMealDB
  if (id.startsWith('themealdb-') && API_CONFIG.useTheMealDB) {
    const themealdbId = id.replace('themealdb-', '');
    const recipe = await getTheMealDBRecipe(themealdbId);
    if (recipe) return recipe;
  }

  // Try TheCocktailDB
  if (id.startsWith('cocktail-') && API_CONFIG.useTheCocktailDB) {
    const cocktailId = id.replace('cocktail-', '');
    const recipe = await getTheCocktailDBRecipe(cocktailId);
    if (recipe) return recipe;
  }


  // Try RecipePuppy
  if (id.startsWith('recipepuppy-')) {
    // RecipePuppy doesn't provide detailed endpoint - return null
  }

  // Check localStorage for user-submitted recipes
  if (typeof window !== 'undefined') {
    try {
      const localRecipes = JSON.parse(localStorage.getItem('local-recipes') || '[]');
      const localRecipe = localRecipes.find((r: Recipe) => r.id === id);
      if (localRecipe) return localRecipe as Recipe;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error reading local recipes:', error);
      }
    }
  }

  return null;
}

// Fetch recipes by area from TheMealDB
async function getRecipesByArea(area: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.themealdb.filter}?a=${encodeURIComponent(area)}`);
    const data = await response.json();
    if (data.meals && Array.isArray(data.meals)) {
      // Fetch full details for each recipe (limit to 10 to avoid too many requests)
      const fullRecipes = await Promise.all(
        data.meals.slice(0, 10).map(async (meal: any) => {
          try {
            const detailResponse = await fetch(`${API_ENDPOINTS.themealdb.lookup}?i=${meal.idMeal}`);
            const detailData = await detailResponse.json();
            if (detailData.meals && detailData.meals.length > 0) {
              return transformTheMealDB(detailData.meals[0]);
            }
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Error fetching details for meal ${meal.idMeal}:`, err);
            }
          }
          return null;
        })
      );
      return fullRecipes.filter((r): r is Recipe => r !== null);
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching recipes for area ${area}:`, error);
    }
    return [];
  }
}

// Get list of all areas from TheMealDB
async function getAvailableAreas(): Promise<string[]> {
  try {
    const response = await fetch(API_ENDPOINTS.themealdb.listAreas);
    const data = await response.json();
    if (data.meals && Array.isArray(data.meals)) {
      return data.meals.map((area: any) => area.strArea).filter(Boolean);
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching areas:', error);
    }
    return [];
  }
}

// Get regional spotlight recipes from API
export async function getRegionalSpotlight(): Promise<Recipe[]> {
  try {
    const allResults: Recipe[] = [];
    
    // Try to fetch from TheMealDB API
    if (API_CONFIG.useTheMealDB) {
      // First, get available areas to see what's supported
      const availableAreas = await getAvailableAreas();
      if (process.env.NODE_ENV === 'development') {
        console.log('Available areas from TheMealDB:', availableAreas);
      }
      
      // Try popular areas from TheMealDB
      const popularAreas = ['Italian', 'Mexican', 'American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch', 'Egyptian', 'French', 'Greek', 'Indian', 'Irish', 'Jamaican', 'Japanese', 'Kenyan', 'Malaysian', 'Moroccan', 'Polish', 'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish', 'Ukrainian', 'Vietnamese'];
      const validAreas = popularAreas.filter(area => 
        availableAreas.some(a => a.toLowerCase() === area.toLowerCase())
      );
      
      // Search from popular areas
      const areasToSearch = validAreas.length > 0 ? validAreas.slice(0, 5) : availableAreas.slice(0, 5);
      
      for (const area of areasToSearch) {
        try {
            const recipes = await getRecipesByArea(area);
            if (recipes.length > 0) {
              allResults.push(...recipes);
              if (allResults.length >= 15) break;
            }
        } catch (err) {
          // Continue to next area
        }
      }
      
      // Also search by popular dish names
      const popularDishes = [
        'pasta', 'pizza', 'chicken', 'beef', 'rice', 'soup', 
        'cake', 'bread', 'salad', 'curry', 'stew', 'roast'
      ];
      
      for (const dish of popularDishes.slice(0, 6)) {
        try {
          const searchResults = await searchTheMealDB(dish);
          if (searchResults.length > 0) {
            allResults.push(...searchResults);
            if (allResults.length >= 20) break;
          }
        } catch (err) {
          // Continue
        }
      }
    }
    
    // If we got results from API, return them (remove duplicates)
    if (allResults.length > 0) {
      const unique = allResults.filter((recipe, index, self) =>
        index === self.findIndex(r => r.id === recipe.id)
      );
      return unique.slice(0, 20); // Limit to 20
    }
    
      // If no results, return empty array (no fallback)
      return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching regional spotlight:', error);
    }
    return [];
  }
}

// Get popular recipes from TheMealDB (for initial display)
export async function getPopularRecipes(): Promise<Recipe[]> {
  try {
    const allResults: Recipe[] = [];
    
    // Always include regional recipes first
    const regionalRecipes = await getRegionalSpotlight();
    allResults.push(...regionalRecipes);
    
    // Fetch popular recipes from TheMealDB
    if (API_CONFIG.useTheMealDB) {
      const popularQueries = ['chicken', 'beef', 'pasta', 'rice', 'fish', 'cake'];
      
      // Execute queries in parallel for better performance
      const queryPromises = popularQueries.slice(0, 4).map(query =>
        searchTheMealDB(query).catch(() => [])
      );
      
      const queryResults = await Promise.all(queryPromises);
      queryResults.forEach(results => {
        if (results && Array.isArray(results) && results.length > 0) {
          allResults.push(...results.slice(0, 5)); // Limit to 5 per query
        }
      });
    }


    // Also include a handful of cocktails for featured content
    if (API_CONFIG.useTheCocktailDB) {
      try {
        // Pull a few random cocktails to mix into the feed
        const cocktailPromises = Array.from({ length: 6 }).map(() => getRandomCocktails().catch(() => []));
        const cocktailResults = await Promise.all(cocktailPromises);
        cocktailResults.forEach(drinks => {
          if (drinks && drinks.length > 0) {
            allResults.push(...drinks.slice(0, 1)); // add 1 from each pull to diversify
          }
        });
      } catch {}
    }
    
    // Remove duplicates
    const unique = allResults.filter((recipe, index, self) =>
      index === self.findIndex(r => r.title.toLowerCase() === recipe.title.toLowerCase())
    );
    
    // Shuffle array for variety
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    
    // Return up to 30 recipes
    return unique.slice(0, 30);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching popular recipes:', error);
    }
    // Fallback to regional recipes
    return getRegionalSpotlight();
  }
}

