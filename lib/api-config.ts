// API Configuration - All APIs are public (no API keys required)
export const API_CONFIG = {
  useTheMealDB: process.env.NEXT_PUBLIC_USE_THEMEALDB !== 'false', // Default: true, free, public
  useTheCocktailDB: process.env.NEXT_PUBLIC_USE_THE_COCKTAIL_DB !== 'false', // Default: true, free, public
  useRecipePuppy: process.env.NEXT_PUBLIC_USE_RECIPEPUPPY === 'true', // Default: false, free, public
};

// API Base URLs
export const API_ENDPOINTS = {
  themealdb: {
    search: 'https://www.themealdb.com/api/json/v1/1/search.php',
    lookup: 'https://www.themealdb.com/api/json/v1/1/lookup.php',
    filter: 'https://www.themealdb.com/api/json/v1/1/filter.php',
    listAreas: 'https://www.themealdb.com/api/json/v1/1/list.php?a=list',
    random: 'https://www.themealdb.com/api/json/v1/1/random.php',
  },
  thecocktaildb: {
    search: 'https://www.thecocktaildb.com/api/json/v1/1/search.php',
    lookup: 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php',
    filter: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php',
    random: 'https://www.thecocktaildb.com/api/json/v1/1/random.php',
    listCategories: 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list',
    listGlasses: 'https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list',
    listIngredients: 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list',
  },
  recipepuppy: 'http://www.recipepuppy.com/api',
};
