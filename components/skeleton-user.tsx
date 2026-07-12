export function SkeletonUser() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <div className="skeleton h-4 w-24 rounded-full mb-8" />

      {/* Profile card */}
      <div
        className="rounded-2xl overflow-hidden mb-10"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="skeleton h-1 w-full" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="skeleton h-16 w-16 rounded-2xl" />
            <div className="space-y-2">
              <div className="skeleton h-5 w-40 rounded-md" />
              <div className="skeleton h-3 w-24 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton h-4 w-4 rounded" />
                <div className="skeleton h-3 w-40 rounded-md" />
              </div>
            ))}
          </div>
          <div className="skeleton h-4 w-3/4 rounded-md" />
        </div>
      </div>

      {/* Posts skeleton */}
      <div className="skeleton h-5 w-48 rounded-md mb-5" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
            <div className="p-5 space-y-3">
              <div className="skeleton h-4 w-full rounded-md" />
              <div className="skeleton h-4 w-3/4 rounded-md" />
              <div className="skeleton h-3 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
