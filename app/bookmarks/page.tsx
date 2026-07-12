'use client';

import Link from 'next/link';
import { Bookmark, PenLine, Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useBookmarks } from '@/contexts/bookmark-context';
import { fetchAllPosts } from '@/lib/api-client';
import { BlogCard } from '@/components/blog-card';
import { CardSkeleton } from '@/components/skeletons';

export default function BookmarksPage() {
  const { bookmarkedIds } = useBookmarks();

  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });

  const saved = allPosts.filter((p) => bookmarkedIds.includes(p.id));

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Saved Reading
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          My Bookmarks
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {isLoading
            ? 'Loading…'
            : saved.length > 0
            ? `${saved.length} saved article${saved.length !== 1 ? 's' : ''}`
            : 'Articles you save will appear here'}
        </p>
      </header>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && saved.length === 0 && (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-24 text-center gap-5"
          style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-default)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'var(--accent-subtle)' }}
          >
            <Bookmark className="h-7 w-7" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              No bookmarks yet
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Hit the bookmark icon on any article to save it here.
            </p>
          </div>
          <Link href="/" className="btn-primary text-sm">
            <PenLine className="h-4 w-4" />
            Browse Articles
          </Link>
        </div>
      )}

      {/* Grid */}
      {!isLoading && saved.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-6">
            <Layers className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {saved.length}
              </span>{' '}
              saved article{saved.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        </>
      )}
    </div>
  );
}
