// Theme management utilities
export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
  // Dispatch custom event for theme change
  window.dispatchEvent(new Event('themechange'));
}

export function toggleTheme(): Theme {
  const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

// Initialize theme on load. Only an explicit toggle is saved, so visitors who
// never choose keep following their system setting.
export function initTheme(): void {
  if (typeof window === 'undefined') return;
  applyTheme(getTheme());
}
