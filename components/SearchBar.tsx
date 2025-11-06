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
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 p-2.5 sm:p-3 bg-white/95 dark:bg-surface rounded-xl sm:rounded-2xl border-2 border-white/20 dark:border-muted focus-within:border-accent focus-within:shadow-2xl transition-all shadow-xl backdrop-blur-sm">
          {/* Ingredient chips */}
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-1 bg-accent/20 text-accent rounded-full text-xs sm:text-sm font-medium"
            >
              {ingredient}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeIngredient(index);
                }}
                className="hover:bg-accent/30 rounded-full p-0.5 sm:p-1 touch-manipulation active:scale-95 transition-transform"
                aria-label={`Remove ${ingredient}`}
                type="button"
              >
                <X className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
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
            className="flex-1 min-w-[120px] sm:min-w-[200px] bg-transparent outline-none text-sm sm:text-base text-text placeholder:text-text-secondary/70 font-medium"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          
          {/* Search button */}
          <button
            onClick={handleSearch}
            className="p-2 sm:p-2.5 bg-accent text-white rounded-lg sm:rounded-xl hover:bg-accent/90 active:bg-accent/80 transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Search recipes"
            type="button"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-muted rounded-lg shadow-xl z-50 max-h-[200px] overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 sm:py-2 hover:bg-muted active:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg text-sm sm:text-base touch-manipulation min-h-[44px] sm:min-h-[36px] flex items-center"
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

