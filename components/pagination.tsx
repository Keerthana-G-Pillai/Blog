import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const btnBase = 'flex items-center justify-center h-10 min-w-10 px-3 rounded-xl text-sm font-medium transition-all';

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={btnBase}
        aria-label="Previous page"
        style={currentPage <= 1
          ? { background: 'var(--bg-elevated)', color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.4, border: '1px solid var(--border-subtle)' }
          : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', cursor: 'pointer' }}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={btnBase}
            style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
            1
          </button>
          {start > 2 && <span style={{ color: 'var(--text-muted)' }} className="px-1 text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={btnBase}
          style={p === currentPage
            ? { background: 'var(--accent)', color: '#fff', border: '1px solid transparent', boxShadow: '0 2px 8px rgba(79,70,229,0.25)' }
            : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: 'var(--text-muted)' }} className="px-1 text-sm">…</span>}
          <button onClick={() => onPageChange(totalPages)} className={btnBase}
            style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={btnBase}
        aria-label="Next page"
        style={currentPage >= totalPages
          ? { background: 'var(--bg-elevated)', color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.4, border: '1px solid var(--border-subtle)' }
          : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', cursor: 'pointer' }}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
