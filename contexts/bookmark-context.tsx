'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BookmarkState } from '@/lib/types';

const STORAGE_KEY = 'blog-bookmarks';

const BookmarkContext = createContext<BookmarkState | undefined>(undefined);

function readBookmarksFromStorage(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'number')) {
        return parsed;
      }
    }
  } catch {
    // localStorage unavailable or invalid JSON – fall back to empty
  }
  return [];
}

function writeBookmarksToStorage(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable – silently ignore
  }
}

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    setBookmarkedIds(readBookmarksFromStorage());
  }, []);

  // Sync to localStorage whenever bookmarkedIds changes (skip initial empty state)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (hydrated) {
      writeBookmarksToStorage(bookmarkedIds);
    }
  }, [bookmarkedIds, hydrated]);

  // Mark hydrated after the first read from localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  const addBookmark = useCallback((postId: number) => {
    setBookmarkedIds((prev) => {
      if (prev.includes(postId)) return prev;
      return [...prev, postId];
    });
  }, []);

  const removeBookmark = useCallback((postId: number) => {
    setBookmarkedIds((prev) => prev.filter((id) => id !== postId));
  }, []);

  const isBookmarked = useCallback(
    (postId: number) => bookmarkedIds.includes(postId),
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback((postId: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  }, []);

  return (
    <BookmarkContext.Provider
      value={{ bookmarkedIds, addBookmark, removeBookmark, isBookmarked, toggleBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkState {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
