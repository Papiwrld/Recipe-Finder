import type { Recipe } from '@/types/recipe';

const REGIONAL_KEYWORDS: Record<string, string[]> = {
  'Africa': ['tagine', 'injera', 'couscous', 'bobotie', 'pilau'],
  'Asia': ['sushi', 'ramen', 'curry', 'pad thai', 'pho', 'kimchi'],
  'Europe': ['pasta', 'paella', 'ratatouille', 'goulash', 'moussaka'],
  'Americas': ['tacos', 'burrito', 'jambalaya', 'poutine', 'ceviche'],
};

export function inferOrigin(title: string, area?: string): Recipe['origin'] {
  const t = title.toLowerCase();
  if (area) {
    const a = area.toLowerCase();
    if (a.includes('africa')) return 'Africa';
    if (a.includes('asia') || a.includes('chinese') || a.includes('japanese') || a.includes('thai') || a.includes('indian')) return 'Asia';
    if (a.includes('europe') || a.includes('italian') || a.includes('french') || a.includes('spanish') || a.includes('greek')) return 'Europe';
    if (a.includes('american') || a.includes('mexican') || a.includes('canadian')) return 'Americas';
  }
  
  // Check keywords
  for (const [region, keywords] of Object.entries(REGIONAL_KEYWORDS)) {
    if (keywords.some(k => t.includes(k))) {
      return region as Recipe['origin'];
    }
  }
  
  return 'Global';
}


