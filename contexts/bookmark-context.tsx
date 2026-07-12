'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BookmarkState } from '@/lib/types';

const STORAGE_KEY = 'inkverse-bookmarks';
const BookmarkContext = createContext<BookmarkState | undefined>(undefined);

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    }
  } catch { /* ignore */ }
  return [];
}

function writeToStorage(ids: string[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); }
  catch { /* ignore */ }
}

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookmarkedIds(readFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeToStorage(bookmarkedIds);
  }, [bookmarkedIds, hydrated]);

  const toggleBookmark = useCallback((postId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  }, []);

  const isBookmarked = useCallback(
    (postId: string) => bookmarkedIds.includes(postId),
    [bookmarkedIds]
  );

  const addBookmark = useCallback((postId: string) => {
    setBookmarkedIds((prev) => prev.includes(postId) ? prev : [...prev, postId]);
  }, []);

  const removeBookmark = useCallback((postId: string) => {
    setBookmarkedIds((prev) => prev.filter((id) => id !== postId));
  }, []);

  return (
    <BookmarkContext.Provider value={{ bookmarkedIds, addBookmark, removeBookmark, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkState {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
}
