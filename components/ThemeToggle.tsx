'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getTheme, toggleTheme as toggleThemeUtil } from '@/lib/utils/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setTheme(getTheme());
    
    // Listen for theme changes
    const handleStorageChange = () => {
      setTheme(getTheme());
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom theme change event
    const handleThemeChange = () => {
      setTheme(getTheme());
    };
    window.addEventListener('themechange', handleThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  const handleToggle = () => {
    const newTheme = toggleThemeUtil();
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-200 shadow-lg ${
        theme === 'dark'
          ? 'bg-white/10 hover:bg-white/20 border-white/20'
          : 'bg-black/10 hover:bg-black/20 border-black/20'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-white" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </button>
  );
}

