'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Laptop,
  Palette,
  Briefcase,
  Sparkles,
  Compass,
  FlaskConical,
  BookOpen,
  HeartPulse,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { fetchAllPosts } from '@/lib/api-client';

const CATEGORIES_DATA = [
  { name: 'Technology', icon: Laptop, color: '#4F46E5', bg: 'rgba(79,70,229,0.05)' },
  { name: 'Design', icon: Palette, color: '#EC4899', bg: 'rgba(236,72,153,0.05)' },
  { name: 'Business', icon: Briefcase, color: '#10B981', bg: 'rgba(16,185,129,0.05)' },
  { name: 'Lifestyle', icon: Sparkles, color: '#F59E0B', bg: 'rgba(245,158,11,0.05)' },
  { name: 'Travel', icon: Compass, color: '#0EA5E9', bg: 'rgba(14,165,233,0.05)' },
  { name: 'Science', icon: FlaskConical, color: '#A855F7', bg: 'rgba(168,85,247,0.05)' },
  { name: 'Culture', icon: BookOpen, color: '#F97316', bg: 'rgba(249,115,22,0.05)' },
  { name: 'Health', icon: HeartPulse, color: '#22C55E', bg: 'rgba(34,197,94,0.05)' },
];

export default function CategoriesPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });

  // Calculate dynamic post counts per category
  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    if (p.category) {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <FolderOpen className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            Topics
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
          All Categories
        </h1>
        <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
          Explore articles across our content categories and find matching stories.
        </p>
      </header>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES_DATA.map((cat) => {
          const Icon = cat.icon;
          const count = counts[cat.name] ?? 0;
          return (
            <Link
              key={cat.name}
              href={`/?category=${cat.name}`}
              className="group rounded-2xl p-6 flex items-center justify-between border transition-all hover:scale-[1.02] hover:shadow-md"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                  style={{ background: cat.bg }}
                >
                  <Icon className="h-5.5 w-5.5" style={{ color: cat.color }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm leading-snug group-hover:text-indigo-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {isLoading ? 'Counting…' : `${count} ${count === 1 ? 'article' : 'articles'}`}
                  </p>
                </div>
              </div>
              <ArrowRight
                className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: 'var(--text-muted)' }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
