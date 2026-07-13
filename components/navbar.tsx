'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Flame,
  Info,
  MessageSquareText,
  Bookmark,
  PenLine,
  Rss,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { SignInModal } from '@/components/signin-modal';

const NAV = [
  { href: '/',           label: 'Home',       icon: LayoutDashboard },
  { href: '/categories', label: 'Categories', icon: FolderOpen },
  { href: '/trending',   label: 'Trending',   icon: Flame },
  { href: '/bookmarks',  label: 'Bookmarks',  icon: Bookmark },
  { href: '/about',      label: 'About',      icon: Info },
  { href: '/contact',    label: 'Contact',    icon: MessageSquareText },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('inkverse_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedUser = localStorage.getItem('inkverse_user');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('inkverse_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('inkverse_user', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('inkverse_user');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const focusSearch = () => {
    if (pathname === '/') {
      const searchEl = document.getElementById('search-input');
      if (searchEl) searchEl.focus();
    } else {
      router.push('/?focusSearch=true');
    }
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--bg-navbar)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="InkVerse Home">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'var(--accent)' }}
            >
              <Rss className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Ink<span style={{ color: 'var(--accent)' }}>Verse</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="nav-link"
                  aria-current={active ? 'page' : undefined}
                  style={active ? {
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  } : {}}
                >
                  <Icon
                    className="h-[15px] w-[15px] shrink-0"
                    style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={focusSearch}
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-default text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              style={{
                borderColor: 'var(--border-default)',
                background: 'var(--bg-input)',
              }}
              title="Search articles (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search...</span>
              <kbd className="pointer-events-none select-none rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                ⌘K
              </kbd>
            </button>

            <button
              onClick={focusSearch}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-default"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              aria-label="Search articles"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-default transition-all"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              aria-label="Toggle theme mode"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <Link href="/blog/create" className="btn-primary text-xs py-2 px-4 h-9">
              <PenLine className="h-3.5 w-3.5" />
              Write
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-default text-xs font-semibold"
                  style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }}
                >
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <span>{currentUser}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-default hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="text-xs h-9 py-2 px-4 rounded-lg font-bold text-white transition-all shadow-sm"
                style={{
                  background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
                }}
              >
                Sign In
              </button>
            )}

            <button
              className="xl:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-default transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }}
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="relative mx-4 mt-4 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--accent)' }}>
                  <Rss className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Ink<span style={{ color: 'var(--accent)' }}>Verse</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                aria-label="Close menu"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="px-3 py-3 space-y-0.5" aria-label="Mobile navigation">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    style={active ? {
                      background: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                      fontWeight: 600,
                    } : {
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Icon className="h-[18px] w-[18px]" style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {currentUser ? (
                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-default text-xs font-semibold justify-center"
                    style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }}
                  >
                    <User className="h-4 w-4 text-indigo-500" />
                    <span>Logged in as {currentUser}</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-default text-sm font-semibold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsAuthOpen(true); setMobileOpen(false); }}
                  className="w-full justify-center text-sm py-3 rounded-xl font-bold text-white transition-all shadow-sm flex items-center"
                  style={{
                    background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
                  }}
                >
                  Sign In to InkVerse
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <SignInModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </header>
  );
}
