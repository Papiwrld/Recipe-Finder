import type { Config } from 'tailwindcss'

// Colors are stored as RGB channels so opacity modifiers (bg-accent/10) work.
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'on-accent': token('on-accent'),
        text: token('text'),
        'text-secondary': token('text-secondary'),
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(var(--color-shadow) / 0.06), 0 8px 24px -12px rgb(var(--color-shadow) / 0.18)',
        lifted: '0 2px 4px rgb(var(--color-shadow) / 0.08), 0 24px 48px -20px rgb(var(--color-shadow) / 0.35)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
export default config
