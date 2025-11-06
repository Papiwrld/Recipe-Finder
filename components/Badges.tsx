'use client';

import { BadgeInfo, Clapperboard } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

export function OriginBadge({ origin }: { origin?: Recipe['origin'] }) {
  if (!origin) return null;
  const cls = 'px-2 py-1 rounded text-xs';
  const map: Record<NonNullable<Recipe['origin']>, string> = {
    Africa: 'bg-yellow-500/20 text-yellow-300',
    Asia: 'bg-red-500/20 text-red-300',
    Europe: 'bg-blue-500/20 text-blue-300',
    Americas: 'bg-green-500/20 text-green-300',
    Global: 'bg-muted text-text-secondary',
  };
  return <span className={`${cls} ${map[origin]}`}>{origin}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty?: Recipe['difficulty'] }) {
  if (!difficulty) return null;
  const cls = 'px-2 py-1 rounded text-xs';
  const map: Record<NonNullable<Recipe['difficulty']>, string> = {
    Easy: 'bg-blue-500/20 text-blue-300',
    Medium: 'bg-orange-500/20 text-orange-300',
    Hard: 'bg-red-500/20 text-red-300',
  };
  return (
    <span className={`${cls} ${map[difficulty]} inline-flex items-center gap-1`}>
      <BadgeInfo className="w-3 h-3" />
      {difficulty}
    </span>
  );
}

export function VideoBadge({ hasVideo }: { hasVideo?: boolean }) {
  if (!hasVideo) return null;
  return (
    <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300 inline-flex items-center gap-1">
      <Clapperboard className="w-3 h-3" />
      Video
    </span>
  );
}


