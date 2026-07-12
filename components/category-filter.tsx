'use client';

import { ALL_CATEGORIES } from '@/lib/api-client';

interface CategoryFilterProps {
  selected: string | null;
  onChange: (cat: string | null) => void;
  counts?: Record<string, number>;
}

export function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  const all = [null, ...ALL_CATEGORIES];

  return (
    <div className="flex gap-2.5 flex-wrap justify-center" role="group" aria-label="Filter by category">
      {all.map((cat) => {
        const active = selected === cat;
        const label = cat ?? 'All';
        const count = cat ? (counts?.[cat] ?? 0) : Object.values(counts ?? {}).reduce((a, b) => a + b, 0);

        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(cat)}
            aria-pressed={active}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150"
            style={active ? {
              background: 'var(--accent)',
              color: '#fff',
              border: '1px solid transparent',
              boxShadow: '0 2px 8px rgba(79,70,229,0.25)',
            } : {
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
            }}
          >
            {label}
            {count > 0 && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={active
                  ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                  : { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }
                }
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
