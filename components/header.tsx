import Link from 'next/link';
import { DarkModeToggle } from './dark-mode-toggle';

export function Header() {
  return (
    <header className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Top section: brand on left, dark mode toggle on right */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-700">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
                  Blog
                </h1>
              </div>
            </Link>
            <DarkModeToggle />
          </div>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover insightful articles, thoughtful perspectives, and engaging stories from writers around the world.
          </p>

          {/* Navigation row */}
          <nav className="mt-4 flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <Link
              href="/users"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            >
              Users
            </Link>
            <Link
              href="/bookmarks"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            >
              Bookmarks
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
