export function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Image */}
      <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
      {/* Body */}
      <div className="p-5 space-y-3">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-4 w-full rounded-md" />
        <div className="skeleton h-4 w-4/5 rounded-md" />
        <div className="skeleton h-3 w-full rounded-md mt-1" />
        <div className="skeleton h-3 w-3/4 rounded-md" />
        <div className="flex items-center justify-between pt-3 mt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <div className="skeleton h-7 w-7 rounded-full" />
            <div className="skeleton h-3 w-20 rounded-md" />
          </div>
          <div className="skeleton h-3 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="skeleton rounded-2xl mb-12" style={{ aspectRatio: '21/9', width: '100%' }} />
  );
}

export function PostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton h-8 w-3/4 rounded-lg" />
      <div className="skeleton h-8 w-1/2 rounded-lg" />
      <div className="flex items-center gap-4">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-32 rounded-md" />
          <div className="skeleton h-3 w-20 rounded-md" />
        </div>
      </div>
      <div className="skeleton rounded-2xl" style={{ aspectRatio: '16/9' }} />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-4 rounded-md" style={{ width: `${85 + (i % 3) * 5}%` }} />
        ))}
      </div>
    </div>
  );
}
