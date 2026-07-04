'use client';

import useSWR from 'swr';
import { fetchAllUsers } from '@/lib/api-client';
import { User } from '@/lib/types';

interface AuthorFilterProps {
  onFilterChange: (userId: number | null) => void;
  selectedUserId: number | null;
}

export function AuthorFilter({ onFilterChange, selectedUserId }: AuthorFilterProps) {
  const { data: users, isLoading } = useSWR<User[]>('all-users', fetchAllUsers);

  if (isLoading) {
    return (
      <section aria-label="Filter by Author">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Author
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Filter by Author">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Filter by Author
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => onFilterChange(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedUserId === null
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          aria-pressed={selectedUserId === null}
        >
          All
        </button>
        {users?.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => onFilterChange(user.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedUserId === user.id
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            aria-pressed={selectedUserId === user.id}
          >
            {user.name}
          </button>
        ))}
      </div>
    </section>
  );
}
