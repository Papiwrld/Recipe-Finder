'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, ingredients: string[]) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Try: pasta, chicken curry, chocolate cake" }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const commonIngredients = [
    'chicken', 'beef', 'rice', 'tomato', 'onion', 'garlic', 'ginger',
    'pasta', 'fish', 'pepper', 'oil', 'salt', 'spices', 'beans',
    'potato', 'cheese', 'coconut', 'mushroom', 'spinach', 'lemon',
    'carrot', 'broccoli', 'pepper', 'egg', 'milk', 'butter', 'flour',
    'sugar', 'honey', 'bread', 'lettuce', 'cucumber', 'avocado'
  ];

  // Debounced search function
  const performSearch = useCallback((query: string, ingList: string[]) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(query, ingList);
    }, 500); // 500ms debounce
  }, [onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Show suggestions based on input
    if (value.length > 1) {
      const filtered = commonIngredients.filter(ing =>
        ing.toLowerCase().includes(value.toLowerCase()) &&
        !ingredients.includes(ing)
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Auto-search when typing (debounced)
    if (value.trim().length > 2) {
      performSearch(value.trim(), ingredients);
    } else if (ingredients.length > 0) {
      performSearch('', ingredients);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        addIngredient(suggestions[0]);
      } else {
        addIngredient(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
      const newIngredients = [...ingredients, ingredient.toLowerCase()];
      setIngredients(newIngredients);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      // Trigger search with new ingredients
      performSearch('', newIngredients);
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    // Trigger search with updated ingredients
    if (newIngredients.length > 0) {
      performSearch('', newIngredients);
    } else if (inputValue.trim().length > 2) {
      performSearch(inputValue.trim(), []);
    }
  };

  const handleSearch = () => {
    const query = inputValue.trim() || ingredients.join(' ');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearch(query, ingredients);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestion: string) => {
    addIngredient(suggestion);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-white/98 dark:bg-surface/98 backdrop-blur-xl rounded-3xl transition-all duration-300 shadow-xl">
          {/* Search Icon (Left) */}
          <div className="hidden sm:flex items-center justify-center text-text-secondary/60">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Ingredient chips */}
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-accent/20 to-accent/10 text-accent rounded-full text-xs sm:text-sm font-semibold border border-accent/30 shadow-sm hover:shadow-md transition-all"
            >
              <span className="capitalize">{ingredient}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeIngredient(index);
                }}
                className="hover:bg-accent/30 rounded-full p-0.5 sm:p-1 touch-manipulation active:scale-90 transition-transform"
                aria-label={`Remove ${ingredient}`}
                type="button"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </span>
          ))}
          
          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            placeholder={ingredients.length === 0 ? placeholder : "Add more ingredients..."}
            className="flex-1 min-w-0 sm:min-w-[180px] md:min-w-[250px] bg-transparent outline-none focus:outline-none focus-visible:outline-none text-sm sm:text-base text-text placeholder:text-text-secondary/60 font-medium py-0"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          
          {/* Search button */}
          <button
            onClick={handleSearch}
            className="p-2 sm:p-2.5 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl hover:from-accent/90 hover:to-accent/80 active:from-accent/80 active:to-accent/70 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-manipulation min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center group"
            aria-label="Search recipes"
            type="button"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-surface/98 backdrop-blur-xl border-2 border-muted/50 rounded-xl sm:rounded-2xl shadow-2xl z-50 max-h-[240px] overflow-y-auto overflow-x-hidden">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-muted/50 active:bg-muted transition-colors first:rounded-t-xl sm:first:rounded-t-2xl last:rounded-b-xl sm:last:rounded-b-2xl text-sm sm:text-base touch-manipulation min-h-[48px] sm:min-h-[44px] flex items-center gap-2 group"
                type="button"
              >
                <Search className="w-4 h-4 text-text-secondary/40 group-hover:text-accent transition-colors" />
                <span className="capitalize">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

