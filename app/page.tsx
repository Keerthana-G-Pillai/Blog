import { Metadata } from 'next';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { fetchAllPosts } from '@/lib/api-client';
import { HomeFeed } from '@/components/home-feed';

export const metadata: Metadata = {
  title: 'InkVerse — Discover & Share Amazing Stories',
  description: 'Explore a curated collection of articles on technology, design, lifestyle, and more. Read, write, and bookmark your favourite stories.',
  openGraph: {
    title: 'InkVerse — Discover & Share Amazing Stories',
    description: 'Explore a curated collection of articles on technology, design, lifestyle, and more.',
    type: 'website',
  },
};

// SSR: pre-fetch posts on the server
export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={
        <div className="mx-auto max-w-[1200px] px-4 py-20 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading feed…
        </div>
      }>
        <HomeFeed />
      </Suspense>
    </HydrationBoundary>
  );
}
