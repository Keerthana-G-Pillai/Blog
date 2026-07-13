import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Globe, Building2, MapPin, FileText } from 'lucide-react';
import { fetchUserById, fetchAllUsers, fetchAllPosts } from '@/lib/api-client';
import { BlogCard } from '@/components/blog-card';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await fetchUserById(Number(id));
  if (!user) return { title: 'Author Not Found' };
  return {
    title: `${user.name}`,
    description: `Articles by ${user.name} — ${user.company.catchPhrase}`,
  };
}

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

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await fetchUserById(Number(id));
  if (!user) notFound();

  const allPosts = await fetchAllPosts().catch(() => []);
  const posts = allPosts.filter((p) => p.userId === user.id);

  const accent = ACCENTS[(user.id - 1) % ACCENTS.length];
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-indigo-600"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        All Authors
      </Link>

      <div
        className="rounded-2xl overflow-hidden mb-10"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${accent.line}, transparent)` }} />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold"
              style={{ background: accent.bg, color: accent.color }}
            >
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-extrabold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {user.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@{user.username}</p>
            </div>
            <div className="sm:ml-auto flex items-center gap-2 self-start sm:self-center">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: accent.bg, color: accent.color }}
              >
                <FileText className="h-3.5 w-3.5" />
                {posts.length} article{posts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { icon: Mail, label: user.email },
              { icon: Phone, label: user.phone },
              { icon: Globe, label: user.website, href: `https://${user.website}` },
              { icon: Building2, label: user.company.name },
              { icon: MapPin, label: `${user.address.city}, ${user.address.zipcode}` },
            ].map(({ icon: Icon, label, href }) => (
              <div key={label} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Icon className="h-4 w-4 shrink-0" style={{ color: accent.color, opacity: 0.8 }} />
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="truncate transition-colors hover:text-indigo-600"
                    style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </a>
                ) : (
                  <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                )}
              </div>
            ))}
          </div>

          {user.company.catchPhrase && (
            <blockquote
              className="pl-4 italic text-sm"
              style={{
                borderLeft: `3px solid ${accent.line}`,
                color: 'var(--text-muted)',
              }}
            >
              &ldquo;{user.company.catchPhrase}&rdquo;
            </blockquote>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
          Articles by{' '}
          <span style={{ color: accent.color }}>{user.name.split(' ')[0]}</span>
        </h2>

        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div
            className="rounded-2xl py-16 text-center"
            style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-default)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No articles published yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
