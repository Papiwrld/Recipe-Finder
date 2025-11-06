import type { Recipe } from '@/types/recipe';

const GHANA_KW = ['jollof', 'banku', 'fufu', 'waakye', 'kenkey', 'kelewele', 'light soup'];
const NIGERIA_KW = ['jollof', 'egusi', 'suya', 'akara', 'moin moin', 'pounded yam', 'pepper soup'];
const AFRICA_KW = ['tagine', 'injera', 'couscous', 'bobotie', 'pilau'];

export function inferOrigin(title: string, area?: string): Recipe['origin'] {
  const t = title.toLowerCase();
  if (area) {
    const a = area.toLowerCase();
    if (a.includes('ghana')) return 'Ghana';
    if (a.includes('nigeria')) return 'Nigeria';
    if (a.includes('africa')) return 'Africa';
  }
  if (GHANA_KW.some(k => t.includes(k))) return 'Ghana';
  if (NIGERIA_KW.some(k => t.includes(k))) return 'Nigeria';
  if (AFRICA_KW.some(k => t.includes(k))) return 'Africa';
  return 'Global';
}


