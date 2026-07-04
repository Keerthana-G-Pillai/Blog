'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { BlogCard } from '@/components/blog-card';
import { SearchBar } from '@/components/search-bar';
import { Pagination } from '@/components/pagination';
import { AuthorFilter } from '@/components/author-filter';
import { SkeletonCard } from '@/components/skeleton-card';
import { fetchAllPosts, searchPosts } from '@/lib/api-client';
import { BlogPost } from '@/lib/types';

const PAGE_SIZE = 10;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: allPosts = [], isLoading, error } = useSWR(
    'all-posts',
    fetchAllPosts,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Filter posts based on search query and selected author
  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    if (selectedUserId !== null) {
      posts = posts.filter(p => p.userId === selectedUserId);
    }
    return searchPosts(posts, searchQuery);
  }, [allPosts, searchQuery, selectedUserId]);

  // Paginate the filtered posts
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (userId: number | null) => {
    setSelectedUserId(userId);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Search Section */}
      <section className="mb-16" aria-label="Search posts">
        <div className="mb-8">
          <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
            Find Articles
          </h2>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Author Filter */}
      <section className="mb-10">
        <AuthorFilter onFilterChange={handleFilterChange} selectedUserId={selectedUserId} />
      </section>

      {/* Results Info */}
      <section className="mb-10" aria-label="Search results info">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {searchQuery ? (
            <>
              Found <span className="text-gray-900 dark:text-white font-semibold">{filteredPosts.length}</span> article
              {filteredPosts.length !== 1 ? 's' : ''} matching &quot;<span className="font-semibold">{searchQuery}</span>&quot;
            </>
          ) : (
            <>
              Showing <span className="text-gray-900 dark:text-white font-semibold">{paginatedPosts.length}</span> of{' '}
              <span className="text-gray-900 dark:text-white font-semibold">{allPosts.length}</span> articles
            </>
          )}
        </p>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </section>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            Failed to load articles. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredPosts.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <svg className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {searchQuery ? 'No articles found matching your search.' : 'No articles available.'}
          </p>
        </div>
      )}

      {/* Blog Posts Grid */}
      {!isLoading && !error && paginatedPosts.length > 0 && (
        <>
          <section className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Blog articles">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="flex justify-center pt-8" aria-label="Pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
