'use client';

import useSWR from 'swr';
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/contexts/bookmark-context';
import { fetchAllPosts } from '@/lib/api-client';
import { BlogCard } from '@/components/blog-card';
import { Breadcrumb } from '@/components/breadcrumb';
import { SkeletonCard } from '@/components/skeleton-card';

export default function BookmarksPage() {
  const { bookmarkedIds } = useBookmarks();

  const { data: allPosts, isLoading } = useSWR('posts', fetchAllPosts);

  const bookmarkedPosts = allPosts
    ? allPosts.filter((post) => bookmarkedIds.includes(post.id))
    : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Bookmarks' },
        ]}
      />

      <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
        Bookmarks
      </h1>

      {isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : bookmarkedPosts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <Bookmark className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
            No bookmarked posts yet.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Browse articles and save your favorites!
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarkedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
