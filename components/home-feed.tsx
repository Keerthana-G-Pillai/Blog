'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchAllPosts, searchPosts, filterByCategory } from '@/lib/api-client';
import { FeaturedPost } from '@/components/featured-post';
import { BlogCard } from '@/components/blog-card';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { CardSkeleton, FeaturedSkeleton } from '@/components/skeletons';
import { Pagination } from '@/components/pagination';
import { Layers } from 'lucide-react';

const PAGE_SIZE = 9;

export function HomeFeed() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Sync state with URL category filter
  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  const { data: allPosts = [], isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });

  // Filter & search
  const filtered = useMemo(() => {
    let posts = filterByCategory(allPosts, category);
    posts = searchPosts(posts, query);
    return posts;
  }, [allPosts, category, query]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return allPosts.reduce<Record<string, number>>((acc, p) => {
      if (p.category) acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [allPosts]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const featured = allPosts[0] ?? null;
  const handleSearch = (q: string) => { setQuery(q); setPage(1); };
  const handleCategory = (c: string | null) => { setCategory(c); setPage(1); };
  const handlePage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">

      {/* ── Hero Header Section ──────────────────────────────────── */}
      <header className="text-center pt-16 pb-12 sm:pt-20 sm:pb-16">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5"
          style={{ color: 'var(--text-primary)' }}
        >
          InkVerse Blog
        </h1>
        <p
          className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Read the latest articles or discover valuable advice, expert insights,
          technology, design, and lifestyle tips — all in one place.
        </p>
        {!isLoading && (
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            {allPosts.length} articles across {Object.keys(categoryCounts).length} categories
          </p>
        )}
      </header>

      {/* ── Featured hero ─────────────────────────────────────────── */}
      {isLoading ? (
        <FeaturedSkeleton />
      ) : featured ? (
        <section className="mb-12" aria-label="Featured article">
          <FeaturedPost post={featured} />
        </section>
      ) : null}

      {/* ── Search + Filter row ───────────────────────────────────── */}
      <section className="mb-10 space-y-5" aria-label="Search and filter">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter selected={category} onChange={handleCategory} counts={categoryCounts} />
      </section>

      {/* ── Results meta ─────────────────────────────────────────── */}
      {!isLoading && (
        <div className="flex items-center gap-2 mb-6">
          <Layers className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {query || category ? (
              <>
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {filtered.length}
                </span>{' '}
                {query ? `result${filtered.length !== 1 ? 's' : ''} for "${query}"` : `article${filtered.length !== 1 ? 's' : ''}`}
                {category ? ` in ${category}` : ''}
              </>
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {filtered.length}
                </span>{' '}
                articles
              </>
            )}
          </p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────── */}
      {isError && (
        <div
          className="mb-8 rounded-2xl p-6 text-center text-sm"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}
        >
          Failed to load articles. Please check your connection and refresh.
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {isLoading ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)}
        </section>
      ) : paginated.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
          style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-default)' }}
        >
          <div className="text-4xl mb-4">🔍</div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            No articles found
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {query ? `Try a different search term.` : 'No posts yet — be the first to write one!'}
          </p>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Articles">
          {paginated.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </section>
      )}

      {/* ── Pagination ───────────────────────────────────────────── */}
      {totalPages > 1 && !isLoading && (
        <div className="mt-12 mb-8 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePage} />
        </div>
      )}
    </div>
  );
}
