import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/types';

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/blog/${post.id}`}
      className="group block relative rounded-2xl overflow-hidden"
      style={{ boxShadow: 'var(--shadow-lg)' }}
      aria-label={`Featured: ${post.title}`}
    >
      {/* Cover image */}
      <div className="relative w-full" style={{ aspectRatio: '21/9' }}>
        {post.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ aspectRatio: '21/9' }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'var(--bg-elevated)' }} />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Content over image */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          {/* Featured badge + category */}
          <div className="flex items-center gap-2.5 mb-4">
            <span
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              ★ Featured
            </span>
            {post.category && <span className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>{post.category}</span>}
          </div>

          {/* Title */}
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug mb-4 max-w-3xl
              group-hover:text-indigo-200 transition-colors duration-200"
          >
            {post.title}
          </h2>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              {post.authorAvatar && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={post.authorAvatar}
                  alt={post.authorName ?? ''}
                  className="h-8 w-8 rounded-full border-2 border-white/40"
                />
              )}
              <span className="text-sm font-medium text-white/90">{post.authorName}</span>
            </div>

            {/* Divider */}
            <span className="text-white/30">·</span>

            {/* Date */}
            {date && <span className="text-sm text-white/70">{date}</span>}

            {/* Read time */}
            <span className="flex items-center gap-1 text-sm text-white/70">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min read
            </span>

            {/* CTA */}
            <span
              className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-white/90
                group-hover:gap-2.5 transition-all duration-200"
            >
              Read article
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
