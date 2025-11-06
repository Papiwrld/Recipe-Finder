'use client';

import { FilterState } from '@/types/recipe';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const cuisines = ['All', 'Ghana', 'Nigeria', 'West African', 'International'];
const cookTimes = [null, 15, 30, 45, 60, 90];
const diets = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="w-full bg-surface rounded-lg p-4 border border-muted">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => updateFilter('type', e.target.value as 'recipe' | 'cocktail' | undefined || undefined)}
            className="w-full p-2 bg-bg border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
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
            className="w-full p-2 bg-bg border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
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
            className="w-full p-2 bg-bg border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
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
            className="w-full p-2 bg-bg border border-muted rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
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
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="video-only"
          checked={filters.videoOnly}
          onChange={(e) => updateFilter('videoOnly', e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <label htmlFor="video-only" className="text-sm text-text">
          Show only recipes with video
        </label>
      </div>
    </div>
  );
}

