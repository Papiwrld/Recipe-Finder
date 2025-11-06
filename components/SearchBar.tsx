'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, ingredients: string[]) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Try: pasta, chicken curry, chocolate cake" }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const commonIngredients = [
    'chicken', 'beef', 'rice', 'tomato', 'onion', 'garlic', 'ginger',
    'pasta', 'fish', 'pepper', 'oil', 'salt', 'spices', 'beans',
    'potato', 'cheese', 'coconut', 'mushroom', 'spinach', 'lemon'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Show suggestions based on input
    if (value.length > 1) {
      const filtered = commonIngredients.filter(ing =>
        ing.toLowerCase().includes(value.toLowerCase()) &&
        !ingredients.includes(ing)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const query = inputValue.trim() || ingredients.join(' ');
    onSearch(query, ingredients);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addIngredient(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 p-3 bg-white/95 dark:bg-surface rounded-2xl border-2 border-white/20 dark:border-muted focus-within:border-accent focus-within:shadow-2xl transition-all shadow-xl backdrop-blur-sm">
          {/* Ingredient chips */}
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(index)}
                className="hover:bg-accent/30 rounded-full p-0.5"
                aria-label={`Remove ${ingredient}`}
              >
                <X className="w-3 h-3" />
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
            placeholder={ingredients.length === 0 ? placeholder : "Add more ingredients..."}
            className="flex-1 min-w-[250px] bg-transparent outline-none text-base text-text placeholder:text-text-secondary/70 font-medium"
          />
          
          {/* Search button */}
          <button
            onClick={handleSearch}
            className="p-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Search recipes"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-muted rounded-lg shadow-lg z-50">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
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

