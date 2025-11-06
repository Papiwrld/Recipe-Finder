'use client';

import { useState } from 'react';
import { FilterState } from '@/types/recipe';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const cuisines = ['All', 'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'International'];
const cookTimes = [null, 15, 30, 45, 60, 90];
const diets = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full bg-surface rounded-lg border border-muted overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors touch-manipulation min-h-[44px]"
        aria-label={isOpen ? 'Hide filters' : 'Show filters'}
        type="button"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          <h3 className="font-semibold text-sm sm:text-base text-text">Filters</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        )}
      </button>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-3 sm:p-4 pt-0 border-t border-muted">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => updateFilter('type', e.target.value as 'recipe' | 'cocktail' | undefined || undefined)}
            className="w-full p-2.5 sm:p-2 bg-bg border border-muted rounded-lg text-sm sm:text-base text-text focus:outline-none focus:ring-2 focus:ring-accent touch-manipulation min-h-[44px] sm:min-h-[36px]"
          >
            <option value="">All</option>
            <option value="recipe">Recipes</option>
            <option value="cocktail">Cocktails</option>
          </select>
        </div>

        {/* Cuisine Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Cuisine
          </label>
          <select
            value={filters.cuisine}
            onChange={(e) => updateFilter('cuisine', e.target.value)}
            className="w-full p-2.5 sm:p-2 bg-bg border border-muted rounded-lg text-sm sm:text-base text-text focus:outline-none focus:ring-2 focus:ring-accent touch-manipulation min-h-[44px] sm:min-h-[36px]"
          >
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine === 'All' ? '' : cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Cook Time Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Cook Time (minutes)
          </label>
          <select
            value={filters.cookTime || ''}
            onChange={(e) => updateFilter('cookTime', e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2.5 sm:p-2 bg-bg border border-muted rounded-lg text-sm sm:text-base text-text focus:outline-none focus:ring-2 focus:ring-accent touch-manipulation min-h-[44px] sm:min-h-[36px]"
          >
            <option value="">Any</option>
            {cookTimes.filter(t => t !== null).map(time => (
              <option key={time} value={time}>
                &lt; {time} min
              </option>
            ))}
          </select>
        </div>

        {/* Diet Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Diet
          </label>
          <select
            value={filters.diet}
            onChange={(e) => updateFilter('diet', e.target.value)}
            className="w-full p-2.5 sm:p-2 bg-bg border border-muted rounded-lg text-sm sm:text-base text-text focus:outline-none focus:ring-2 focus:ring-accent touch-manipulation min-h-[44px] sm:min-h-[36px]"
          >
            {diets.map(diet => (
              <option key={diet} value={diet === 'All' ? '' : diet}>
                {diet}
              </option>
            ))}
          </select>
        </div>
      </div>

          {/* Video Only Toggle */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2.5 sm:gap-2">
            <input
              type="checkbox"
              id="video-only"
              checked={filters.videoOnly}
              onChange={(e) => updateFilter('videoOnly', e.target.checked)}
              className="w-5 h-5 sm:w-4 sm:h-4 accent-accent touch-manipulation cursor-pointer"
            />
            <label htmlFor="video-only" className="text-sm sm:text-sm text-text cursor-pointer touch-manipulation select-none">
              Show only recipes with video
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

