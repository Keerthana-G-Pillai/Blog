'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Users,
  Info,
  PenLine,
  Rss,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/',           label: 'Feed',       icon: LayoutDashboard },
  { href: '/blog/create',label: 'Write',      icon: PenLine },
  { href: '/bookmarks',  label: 'Bookmarks',  icon: Bookmark },
  { href: '/users',      label: 'Authors',    icon: Users },
  { href: '/about',      label: 'About',      icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex h-full flex-col" style={{ background: 'var(--bg-sidebar)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: 'var(--accent)' }}>
          <Rss className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Ink<span style={{ color: 'var(--accent)' }}>Verse</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Main navigation">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}>
          Menu
        </p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="nav-link"
              data-active={active}
              style={active ? {
                background: 'var(--accent-subtle)',
                color: 'var(--accent)',
              } : {}}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-[18px] w-[18px] shrink-0"
                style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }} />
              <span>{label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Write CTA */}
      <div className="px-4 pb-6 mt-auto">
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(124,106,255,0.25)' }}>
          <PenLine className="mx-auto mb-2 h-5 w-5" style={{ color: 'var(--accent)' }} />
          <p className="text-xs font-semibold text-white mb-0.5">Share your story</p>
          <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
            Publish an article today
          </p>
          <Link href="/blog/create"
            className="btn-primary w-full justify-center text-xs py-2"
            style={{ borderRadius: 'var(--radius-md)' }}
            onClick={() => setMobileOpen(false)}>
            Write Now
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{ borderRight: '1px solid var(--border-subtle)' }}
        aria-label="Sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-4 sticky top-0 z-50"
        style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'var(--accent)' }}>
            <Rss className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-white">
            Ink<span style={{ color: 'var(--accent)' }}>Verse</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-lg"
          style={{ color: 'var(--text-secondary)' }}>
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 h-full overflow-y-auto z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg z-20"
              aria-label="Close menu"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
