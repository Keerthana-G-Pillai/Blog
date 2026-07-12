'use client';

import { useQuery } from '@tanstack/react-query';
import { Flame, TrendingUp } from 'lucide-react';
import { fetchAllPosts } from '@/lib/api-client';
import { BlogCard } from '@/components/blog-card';
import { CardSkeleton } from '@/components/skeletons';

export default function TrendingPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });

  // Sort posts by views descending
  const trending = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Popular
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
          Trending Now
        </h1>
        <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
          Discover the most viewed articles and community favorites this week.
        </p>
      </header>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : trending.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
          <p className="text-sm font-semibold">No trending posts found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
