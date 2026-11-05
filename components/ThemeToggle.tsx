'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from '@phosphor-icons/react';
import { getTheme, toggleTheme as toggleThemeUtil } from '@/lib/utils/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const syncTheme = () => setTheme(getTheme());
    syncTheme();

    window.addEventListener('storage', syncTheme);
    window.addEventListener('themechange', syncTheme);

    return () => {
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener('themechange', syncTheme);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => setTheme(toggleThemeUtil())}
      className="icon-btn h-12 w-12"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
