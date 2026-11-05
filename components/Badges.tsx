import type { Recipe } from '@/types/recipe';

export function OriginBadge({ origin }: { origin?: Recipe['origin'] }) {
  if (!origin) return null;
  return <span className="tag">{origin}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty?: Recipe['difficulty'] }) {
  if (!difficulty) return null;
  return <span className="tag">{difficulty}</span>;
}
