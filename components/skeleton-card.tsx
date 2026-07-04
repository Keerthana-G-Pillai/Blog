export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Title lines */}
      <div className="space-y-2">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Body lines */}
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Bottom row: author and link */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-800">
        <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
