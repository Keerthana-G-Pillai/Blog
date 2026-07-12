'use client';

import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/contexts/bookmark-context';

export function BookmarkButton({ postId }: { postId: string }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(postId);

  return (
    <button
      type="button"
      aria-label={saved ? 'Remove bookmark' : 'Bookmark this post'}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleBookmark(postId); }}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90"
      style={saved ? {
        background: 'var(--accent-subtle)',
        color: 'var(--accent)',
        border: '1px solid rgba(79,70,229,0.2)',
      } : {
        background: 'rgba(255,255,255,0.9)',
        color: 'var(--text-secondary)',
        backdropFilter: 'blur(4px)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
