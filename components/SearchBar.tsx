'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MagnifyingGlass, Plus, X } from '@phosphor-icons/react';

interface SearchBarProps {
  onSearch: (query: string, ingredients: string[]) => void;
  placeholder?: string;
  quickPicks?: string[];
}

const commonIngredients = [
  'chicken', 'beef', 'rice', 'tomato', 'onion', 'garlic', 'ginger',
  'pasta', 'fish', 'pepper', 'oil', 'salt', 'spices', 'beans',
  'potato', 'cheese', 'coconut', 'mushroom', 'spinach', 'lemon',
  'carrot', 'broccoli', 'egg', 'milk', 'butter', 'flour',
  'sugar', 'honey', 'bread', 'lettuce', 'cucumber', 'avocado',
];

export default function SearchBar({
  onSearch,
  placeholder = 'Try: pasta, chicken curry, chocolate cake',
  quickPicks = [],
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const performSearch = useCallback((query: string, ingList: string[]) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(query, ingList);
    }, 500); // 500ms debounce
  }, [onSearch]);

  const searchNow = (query: string, ingList: string[]) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearch(query, ingList);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Show suggestions based on input
    if (value.length > 1) {
      const filtered = commonIngredients.filter(ing =>
        ing.toLowerCase().includes(value.toLowerCase()) &&
        !ingredients.includes(ing)
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Auto-search when typing (debounced)
    if (value.trim().length > 2) {
      performSearch(value.trim(), ingredients);
    } else {
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
    } else {
      performSearch('', []);
    }
  };

  const handleSearch = () => {
    const query = inputValue.trim() || ingredients.join(' ');
    searchNow(query, ingredients);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setInputValue('');
    setIngredients([]);
    setSuggestions([]);
    searchNow('', []);
    inputRef.current?.focus();
  };

  const handleQuickPick = (pick: string) => {
    setInputValue(pick);
    setIngredients([]);
    setSuggestions([]);
    searchNow(pick, []);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addIngredient(suggestion);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const hasContent = inputValue.length > 0 || ingredients.length > 0;

  return (
    <div className="w-full">
      <div className="relative text-left" ref={containerRef}>
        <div className="flex items-center gap-2 rounded-[1.75rem] border border-line bg-surface p-2 shadow-soft transition duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 pl-3">
            <MagnifyingGlass className="mr-1 h-5 w-5 flex-shrink-0 text-text-secondary" aria-hidden="true" />

            {ingredients.map((ingredient, index) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-1 rounded-full bg-muted py-1 pl-3 pr-1.5 text-sm font-medium capitalize text-text"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="rounded-full p-0.5 text-text-secondary transition-colors hover:text-text"
                  aria-label={`Remove ${ingredient}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}

            <input
              ref={inputRef}
              type="text"
              aria-label="Search recipes or add ingredients"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              placeholder={ingredients.length === 0 ? placeholder : 'Add another ingredient'}
              className="h-10 min-w-[8rem] flex-1 bg-transparent text-base text-text outline-none placeholder:text-text-secondary focus-visible:outline-none"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          {hasContent && (
            <button type="button" onClick={handleClear} className="icon-btn flex-shrink-0" aria-label="Clear search">
              <X className="h-[18px] w-[18px]" />
            </button>
          )}

          <button type="button" onClick={handleSearch} className="btn-primary flex-shrink-0 px-3 sm:px-5" aria-label="Search recipes">
            <MagnifyingGlass className="h-5 w-5 sm:hidden" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-[1.75rem] border border-line bg-surface py-2 shadow-lifted">
            <p className="px-4 pb-1 pt-1.5 text-xs text-text-secondary">Add an ingredient</p>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex min-h-[44px] w-full items-center gap-2.5 px-4 py-2 text-left text-base capitalize text-text transition-colors duration-150 hover:bg-muted"
              >
                <Plus className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {quickPicks.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {quickPicks.map((pick) => (
            <button key={pick} type="button" onClick={() => handleQuickPick(pick)} className="chip capitalize">
              {pick}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
