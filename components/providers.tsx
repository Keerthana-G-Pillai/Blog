'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { BookmarkProvider } from '@/contexts/bookmark-context';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient per session (stable across re-renders)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BookmarkProvider>{children}</BookmarkProvider>
    </QueryClientProvider>
  );
}
