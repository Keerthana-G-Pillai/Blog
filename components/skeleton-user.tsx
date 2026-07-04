import { SkeletonCard } from './skeleton-card';

export function SkeletonUser() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Name placeholder */}
      <div className="mb-6 h-6 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

      {/* Info fields */}
      <div className="mb-10 space-y-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Posts section heading placeholder */}
      <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

      {/* Grid of skeleton cards for user's posts */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
