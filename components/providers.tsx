'use client';

import { ThemeProvider } from '@/contexts/theme-context';
import { BookmarkProvider } from '@/contexts/bookmark-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BookmarkProvider>
        {children}
      </BookmarkProvider>
    </ThemeProvider>
  );
}
