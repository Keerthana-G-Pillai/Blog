import { Metadata } from 'next';
import Link from 'next/link';
import { PenLine, Search, Bookmark, Zap, Users, Server, Layers, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about InkVerse — a modern, API-powered blog platform built with Next.js 16, React Query, and MockAPI.',
};

const features = [
  {
    icon: Server,
    title: 'Server-Side Rendering',
    desc: 'Homepage pre-fetches posts on the server via Next.js SSR for fast first loads and great SEO.',
    accent: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
  },
  {
    icon: Zap,
    title: 'React Query Caching',
    desc: 'TanStack Query handles client-side caching, background refetching, and stale-while-revalidate patterns.',
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    icon: PenLine,
    title: 'Full CRUD via MockAPI',
    desc: 'Create, read, update, and delete articles — all persisted in MockAPI.io with no backend needed.',
    accent: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
  },
  {
    icon: Search,
    title: 'Search & Category Filter',
    desc: 'Real-time full-text search across titles, bodies, and authors, plus category pill filters.',
    accent: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    icon: Bookmark,
    title: 'Bookmarks',
    desc: 'Save articles to read later. Bookmarks persist via localStorage — no auth required.',
    accent: '#EC4899',
    bg: 'rgba(236,72,153,0.08)',
  },
  {
    icon: Users,
    title: 'Author Profiles',
    desc: 'Browse authors from JSONPlaceholder and explore all their published articles.',
    accent: '#F97316',
    bg: 'rgba(249,115,22,0.08)',
  },
];

const stack = [
  { name: 'Next.js 16', note: 'App Router + SSR' },
  { name: 'React 19', note: 'Server & Client components' },
  { name: 'TypeScript', note: 'Full type safety' },
  { name: 'Tailwind CSS 4', note: 'Utility-first styling' },
  { name: 'TanStack Query v5', note: 'Data fetching & caching' },
  { name: 'MockAPI.io', note: 'Persistent REST API' },
  { name: 'Axios', note: 'HTTP client' },
  { name: 'Lucide React', note: 'Icon library' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            About
          </span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Built for the{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Modern Web
          </span>
        </h1>
        <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
          InkVerse is a full-featured blog application built as a showcase of Next.js best practices —
          SSR, dynamic routing, React Query, MockAPI integration, SEO, and accessibility.
        </p>
      </div>

      {/* Features */}
      <section className="mb-14">
        <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Key Features
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, accent, bg }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
                style={{ background: bg }}
              >
                <Icon className="h-5 w-5" style={{ color: accent }} />
              </div>
              <p className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>
                {title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section
        className="rounded-2xl p-6 mb-12"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stack.map(({ name, note }) => (
            <div
              key={name}
              className="rounded-xl p-3"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {name}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(124,58,237,0.03) 100%)',
          border: '1px solid rgba(79,70,229,0.15)',
        }}
      >
        <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
          Ready to start writing?
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Publish your first article and share your ideas with the world.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/blog/create" className="btn-primary">
            <PenLine className="h-4 w-4" />
            Write an Article
          </Link>
          <Link href="/" className="btn-ghost">
            Explore Feed
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
