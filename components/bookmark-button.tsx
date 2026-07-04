'use client';

import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/contexts/bookmark-context';

interface BookmarkButtonProps {
  postId: number;
}

export function BookmarkButton({ postId }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(postId);

  return (
    <button
      type="button"
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleBookmark(postId);
      }}
      className="inline-flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Bookmark
        className={
          bookmarked
            ? 'h-5 w-5 text-blue-600 dark:text-blue-400'
            : 'h-5 w-5 text-gray-400 dark:text-gray-500'
        }
        fill={bookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
}
