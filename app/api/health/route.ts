import { NextResponse } from 'next/server';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api-config';

type HealthStatus = {
  name: string;
  enabled: boolean;
  ok: boolean;
  message?: string;
  requiresKey?: boolean;
};

export async function GET() {
  const checks: Promise<HealthStatus>[] = [];

  // TheMealDB
  checks.push(
    (async () => {
      if (!API_CONFIG.useTheMealDB) return { name: 'TheMealDB', enabled: false, ok: true };
      try {
        const res = await fetch(API_ENDPOINTS.themealdb.random, { cache: 'no-store' });
        const ok = res.ok;
        return { name: 'TheMealDB', enabled: true, ok, message: ok ? 'ok' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { name: 'TheMealDB', enabled: true, ok: false, message: e?.message };
      }
    })()
  );

  // TheCocktailDB
  checks.push(
    (async () => {
      if (!API_CONFIG.useTheCocktailDB) return { name: 'TheCocktailDB', enabled: false, ok: true };
      try {
        const res = await fetch(API_ENDPOINTS.thecocktaildb.random, { cache: 'no-store' });
        const ok = res.ok;
        return { name: 'TheCocktailDB', enabled: true, ok, message: ok ? 'ok' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { name: 'TheCocktailDB', enabled: true, ok: false, message: e?.message };
      }
    })()
  );

  // RecipePuppy (optional)
  checks.push(
    (async () => {
      if (!API_CONFIG.useRecipePuppy) return { name: 'RecipePuppy', enabled: false, ok: true };
      try {
        const url = `${API_ENDPOINTS.recipepuppy}?i=egg`;
        const res = await fetch(url, { cache: 'no-store' });
        const ok = res.ok;
        return { name: 'RecipePuppy', enabled: true, ok, message: ok ? 'ok' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { name: 'RecipePuppy', enabled: true, ok: false, message: e?.message };
      }
    })()
  );


  const results = await Promise.all(checks);
  const allOk = results.filter(r => r.enabled).every(r => r.ok);
  return NextResponse.json({ ok: allOk, results });
}


