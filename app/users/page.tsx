import Link from 'next/link';
import { Metadata } from 'next';
import { fetchAllUsers } from '@/lib/api-client';
import { User } from '@/lib/types';
import { Breadcrumb } from '@/components/breadcrumb';

export const metadata: Metadata = {
  title: 'Authors | Blog Platform',
  description: 'Browse all authors and their profiles on the blog platform.',
};

export default async function UsersPage() {
  const users: User[] = await fetchAllUsers();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Users' },
          ]}
        />
      </div>

      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Authors
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
              {user.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {user.company.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              {user.address.city}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
