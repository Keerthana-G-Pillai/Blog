import { Metadata } from 'next';
import Link from 'next/link';
import { Users, Mail, Building2, MapPin } from 'lucide-react';
import { fetchAllUsers } from '@/lib/api-client';

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Meet the talented writers publishing on InkVerse.',
};

const ACCENTS = [
  { bg: 'rgba(79,70,229,0.08)',   color: '#4F46E5', line: '#4F46E5' },
  { bg: 'rgba(236,72,153,0.08)',  color: '#EC4899', line: '#EC4899' },
  { bg: 'rgba(16,185,129,0.08)',  color: '#10B981', line: '#10B981' },
  { bg: 'rgba(245,158,11,0.08)',  color: '#F59E0B', line: '#F59E0B' },
  { bg: 'rgba(14,165,233,0.08)',  color: '#0EA5E9', line: '#0EA5E9' },
  { bg: 'rgba(168,85,247,0.08)',  color: '#A855F7', line: '#A855F7' },
  { bg: 'rgba(249,115,22,0.08)',  color: '#F97316', line: '#F97316' },
  { bg: 'rgba(34,197,94,0.08)',   color: '#22C55E', line: '#22C55E' },
];

export default async function UsersPage() {
  const users = await fetchAllUsers();

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}>Community</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Authors
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {users.length} writers sharing their stories on InkVerse
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

          return (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="blog-card group flex flex-col gap-4 p-5"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                  style={{ background: accent.bg, color: accent.color }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-indigo-600 transition-colors"
                    style={{ color: 'var(--text-primary)' }}>
                    {user.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user.company.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {user.address.city}
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="h-px w-full opacity-30 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to right, ${accent.line}, transparent)` }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
