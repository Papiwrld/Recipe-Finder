'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ForkKnife, Heart, Wine } from '@phosphor-icons/react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Recipes', icon: ForkKnife },
  { href: '/cocktails', label: 'Cocktails', icon: Wine },
  { href: '/favorites', label: 'Favorites', icon: Heart },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const activeIndex = navLinks.findIndex(({ href }) => href === pathname);

  return (
    <>
      <header className="flex h-16 items-center justify-center px-4">
        <Link href="/" className="rounded font-display text-xl font-bold tracking-tight text-accent sm:text-2xl">
          Recipe Finder
        </Link>
      </header>

      <nav
        aria-label="Main"
        className="dock fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex w-max items-center gap-1 rounded-full p-1.5"
      >
        <div className="relative grid grid-cols-3">
          {activeIndex >= 0 && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
          )}
          {navLinks.map(({ href, label, icon: Icon }, index) => {
            const active = index === activeIndex;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-12 w-[4.75rem] flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium transition-colors duration-200 active:scale-[0.97] sm:w-[7.25rem] sm:flex-row sm:gap-2 sm:text-sm ${
                  active ? 'text-on-accent' : 'text-text-secondary hover:text-text'
                }`}
              >
                <Icon className="h-5 w-5" weight={active ? 'fill' : 'regular'} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
        <span aria-hidden="true" className="h-6 w-px bg-line" />
        <ThemeToggle />
      </nav>
    </>
  );
}
