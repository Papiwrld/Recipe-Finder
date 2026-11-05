'use client';

import { useEffect } from 'react';
import { initTheme } from '@/lib/utils/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTheme();
  }, []);

  return <>{children}</>;
}

