export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Blog</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              A modern platform for discovering great articles and insights.
            </p>
          </div>
          <nav className="space-y-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Resources</p>
            <ul className="space-y-2">
              <li><a href="/" className="text-xs text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">Home</a></li>
              <li><a href="/" className="text-xs text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">Browse</a></li>
              <li><a href="/" className="text-xs text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">Topics</a></li>
            </ul>
          </nav>
          <nav className="space-y-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</p>
            <ul className="space-y-2">
              <li><a href="/" className="text-xs text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">Privacy</a></li>
              <li><a href="/" className="text-xs text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">Terms</a></li>
              <li><a href="/" className="text-xs text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            © {currentYear} Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
