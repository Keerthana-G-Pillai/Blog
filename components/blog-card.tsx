import Link from 'next/link';
import { Clock, Eye, Heart } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { BookmarkButton } from '@/components/bookmark-button';

interface BlogCardProps {
  post: BlogPost;
  size?: 'default' | 'compact';
}

export function BlogCard({ post, size = 'default' }: BlogCardProps) {
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null;

  if (size === 'compact') {
    return (
      <article className="flex gap-4 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        {post.coverImage && (
          <Link href={`/blog/${post.id}`} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-16 w-24 rounded-lg object-cover"
            />
          </Link>
        )}
        <div className="flex flex-col justify-between min-w-0">
          {post.category && <span className="tag mb-1 self-start">{post.category}</span>}
          <Link href={`/blog/${post.id}`}>
            <h3
              className="text-sm font-semibold leading-snug line-clamp-2 hover:text-indigo-600 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {post.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.authorName}</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Clock className="h-3 w-3" />{post.readTime}m
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="blog-card group flex flex-col">
      {/* Thumbnail */}
      <Link
        href={`/blog/${post.id}`}
        className="block overflow-hidden"
        style={{ borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {post.coverImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full" style={{ background: 'var(--bg-elevated)' }} />
          )}
          {/* Category badge over image */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="tag" style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--accent)', borderColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}>
                {post.category}
              </span>
            </div>
          )}
          {/* Bookmark top-right */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <BookmarkButton postId={post.id} />
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <Link href={`/blog/${post.id}`}>
          <h2
            className="font-bold text-base leading-snug line-clamp-2 mb-2 transition-colors duration-150
              hover:text-indigo-600"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed line-clamp-2 mb-4 flex-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          {post.excerpt ?? post.body.substring(0, 120) + '…'}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-auto pt-4 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {/* Author */}
          <div className="flex items-center gap-2.5 min-w-0">
            {post.authorAvatar && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.authorAvatar}
                alt={post.authorName ?? ''}
                className="h-7 w-7 rounded-full shrink-0"
                style={{ border: '2px solid var(--border-default)' }}
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {post.authorName}
              </p>
              {date && (
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{date}</p>
              )}
            </div>
          </div>

          {/* Read time & stats */}
          <div className="flex items-center gap-3.5 shrink-0 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1" title="Views">
              <Eye className="h-3.5 w-3.5" />
              {post.views ?? 0}
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <Heart className="h-3.5 w-3.5" />
              {post.likes ?? 0}
            </span>
            <span className="flex items-center gap-1" title="Reading time">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}m
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
