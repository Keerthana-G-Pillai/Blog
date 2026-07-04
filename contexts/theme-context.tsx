'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeState } from '@/lib/types';

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const STORAGE_KEY = 'blog-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Read initial value from localStorage or system preference on mount
  useEffect(() => {
    let initialTheme: 'light' | 'dark' = 'light';

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        initialTheme = stored;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initialTheme = 'dark';
      }
    } catch {
      // localStorage unavailable, fallback to light
    }

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage unavailable, continue with in-memory state
      }

      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  // Prevent flash of incorrect theme during SSR hydration
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
