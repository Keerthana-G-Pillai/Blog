export function SkeletonPost() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back link placeholder */}
      <div className="mb-12 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

      {/* Title placeholder */}
      <div className="mb-6 space-y-3">
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Meta info: author badge and date */}
      <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 dark:border-gray-700">
        <div className="h-8 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Paragraph lines */}
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
