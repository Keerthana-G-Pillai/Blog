'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Clock,
  Pencil,
  Trash2,
  Bookmark,
  Share2,
  Heart,
  Eye,
  MessageSquare,
  Send,
  User,
} from 'lucide-react';
import {
  fetchPostById,
  fetchAllPosts,
  getRelatedPosts,
  deletePost,
  updatePost,
  fetchCommentsByPostId,
} from '@/lib/api-client';
import { useBookmarks } from '@/contexts/bookmark-context';
import { BlogCard } from '@/components/blog-card';
import { PostSkeleton } from '@/components/skeletons';
import { ConfirmationDialog } from '@/components/confirmation-dialog';

interface PostViewProps {
  postId: string;
}

interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

interface LocalComment {
  id: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
}

// Helper to extract Markdown headings
function extractHeadings(text: string): HeadingItem[] {
  const lines = text.split('\n');
  const headings: HeadingItem[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      const text = trimmed.substring(2);
      headings.push({ text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'), level: 1 });
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.substring(3);
      headings.push({ text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'), level: 2 });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.substring(4);
      headings.push({ text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-'), level: 3 });
    }
  });

  return headings;
}

// Simple Markdown inline parser
function parseInline(str: string): string {
  let s = str;
  // Bold: **text**
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Inline code: `code`
  s = s.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-xs">$1</code>');
  return s;
}

// Markdown blocks rendering engine
function parseMarkdownToReact(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-6 my-4 space-y-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(trimmed.substring(2));
      return;
    } else if (inList) {
      flushList(index);
      inList = false;
    }

    if (trimmed.startsWith('### ')) {
      const heading = trimmed.substring(4);
      const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h3 key={index} id={id} className="text-md sm:text-lg font-bold mt-6 mb-3 scroll-mt-20" style={{ color: 'var(--text-primary)' }}>
          {heading}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      const heading = trimmed.substring(3);
      const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h2 key={index} id={id} className="text-lg sm:text-xl font-bold mt-8 mb-4 pb-2 border-b scroll-mt-20" style={{ borderBottomColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
          {heading}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      const heading = trimmed.substring(2);
      const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h1 key={index} id={id} className="text-xl sm:text-2xl font-extrabold mt-10 mb-5 scroll-mt-20" style={{ color: 'var(--text-primary)' }}>
          {heading}
        </h1>
      );
    } else if (trimmed === '') {
      elements.push(<div key={index} className="h-3" />);
    } else {
      elements.push(
        <p
          key={index}
          className="text-sm sm:text-base leading-7 sm:leading-8 mb-4"
          style={{ color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }}
        />
      );
    }
  });

  if (inList) {
    flushList(lines.length);
  }

  return elements;
}

export function PostView({ postId }: PostViewProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Likes state
  const [hasLiked, setHasLiked] = useState(false);

  // Comments state
  const [localComments, setLocalComments] = useState<LocalComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  // TOC active heading states
  const [activeId, setActiveId] = useState<string>('');

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });

  // Fetch server comments
  const { data: serverComments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId),
    enabled: !!post,
  });

  // Extract headings memo
  const headings = useMemo(() => {
    if (!post?.body) return [];
    return extractHeadings(post.body);
  }, [post?.body]);

  // Merge server comments and local comments
  const comments = useMemo(() => {
    const mappedServer = serverComments.map((c) => ({
      id: `server-${c.id}`,
      name: c.name,
      email: c.email,
      body: c.body,
      createdAt: new Date().toISOString(), // Mock timestamp for display
    }));
    return [...localComments, ...mappedServer];
  }, [serverComments, localComments]);

  // Load liked state and local comments on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHasLiked(localStorage.getItem(`inkverse_liked_${postId}`) === 'true');

    try {
      const cachedComments = localStorage.getItem(`inkverse_comments_${postId}`);
      if (cachedComments) {
        setLocalComments(JSON.parse(cachedComments));
      }
    } catch (e) {
      console.error(e);
    }
  }, [postId]);

  // Session storage views tracking
  useEffect(() => {
    if (!post) return;
    const viewedKey = `inkverse_viewed_${postId}`;
    const alreadyViewed = sessionStorage.getItem(viewedKey);
    if (!alreadyViewed) {
      sessionStorage.setItem(viewedKey, 'true');
      updatePost(postId, { views: (post.views || 0) + 1 })
        .then(() => {
          qc.invalidateQueries({ queryKey: ['post', postId] });
        })
        .catch((err) => {
          console.warn('Failed to increment view counter:', err);
        });
    }
  }, [postId, post, qc]);

  // Scrollspy for active heading highlight
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      let currentActive = '';
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            currentActive = heading.id;
          }
        }
      }
      setActiveId(currentActive || headings[0]?.id || '');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (isLoading) return <div className="px-6 py-8"><PostSkeleton /></div>;
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="text-5xl">📭</span>
        <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Post not found</p>
        <Link href="/" className="btn-ghost text-sm">← Back to Feed</Link>
      </div>
    );
  }

  const related = getRelatedPosts(allPosts, post, 3);
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const saved = isBookmarked(post.id);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      router.push('/');
    } catch {
      setError('Could not delete. Please try again.');
      setDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLikeToggle = async () => {
    const likedKey = `inkverse_liked_${postId}`;
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);

    const delta = nextLiked ? 1 : -1;
    const nextLikesCount = Math.max(0, (post.likes || 0) + delta);

    if (nextLiked) {
      localStorage.setItem(likedKey, 'true');
    } else {
      localStorage.removeItem(likedKey);
    }

    try {
      await updatePost(postId, { likes: nextLikesCount });
      qc.invalidateQueries({ queryKey: ['post', postId] });
    } catch (err) {
      console.warn('Failed to update likes count:', err);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);

    if (!commentName.trim()) {
      setCommentError('Name is required');
      return;
    }
    if (!commentText.trim()) {
      setCommentError('Comment body is required');
      return;
    }

    const newComment: LocalComment = {
      id: Date.now().toString(),
      name: commentName.trim(),
      email: commentEmail.trim() || 'anonymous@inkverse.dev',
      body: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newComment, ...localComments];
    setLocalComments(updated);
    localStorage.setItem(`inkverse_comments_${postId}`, JSON.stringify(updated));

    setCommentText('');
    setCommentName('');
    setCommentEmail('');
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb / back */}
      <nav className="flex items-center gap-2 mb-8 text-sm" aria-label="Breadcrumb">
        <Link
          href="/"
          className="flex items-center gap-1.5 transition-colors hover:text-indigo-600"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Feed
        </Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        {post.category && (
          <>
            <span style={{ color: 'var(--text-muted)' }}>{post.category}</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
          </>
        )}
        <span className="line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
          {post.title}
        </span>
      </nav>

      {/* Error */}
      {error && (
        <div
          className="mb-6 rounded-xl p-4 text-sm flex items-center justify-between"
          role="alert"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}
        >
          {error}
          <button onClick={() => setError(null)} aria-label="Dismiss">✕</button>
        </div>
      )}

      <article>
        {/* Category + read time + counters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-1 border-b border-default" style={{ borderBottomColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            {post.category && <span className="tag">{post.category}</span>}
            <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              <Clock className="h-3.5 w-3.5" />
              {post.readTime} min read
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-gray-400" />
              {post.views ?? 0} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-400 fill-red-400/20" />
              {post.likes ?? 0} likes
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              {comments.length} comments
            </span>
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {post.title}
        </h1>

        {/* Author + actions row */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            {post.authorAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.authorAvatar}
                alt={post.authorName ?? ''}
                className="h-11 w-11 rounded-full"
                style={{ border: '2px solid var(--border-default)' }}
              />
            ) : (
              <div className="h-11 w-11 rounded-full flex items-center justify-center bg-indigo-50 border border-default text-indigo-600">
                <User className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {post.authorName ?? 'Anonymous'}
              </p>
              {date && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLikeToggle}
              aria-label={hasLiked ? 'Unlike' : 'Like'}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border"
              style={hasLiked
                ? { background: 'rgba(239,68,68,0.06)', color: '#EF4444', borderColor: 'rgba(239,68,68,0.2)' }
                : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
              }
            >
              <Heart className="h-3.5 w-3.5" fill={hasLiked ? 'currentColor' : 'none'} />
              {hasLiked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={() => toggleBookmark(post.id)}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark'}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border"
              style={saved
                ? { background: 'var(--accent-subtle)', color: 'var(--accent)', borderColor: 'rgba(79,70,229,0.2)' }
                : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
              }
            >
              <Bookmark className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              aria-label="Share article"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }}
            >
              <Share2 className="h-3.5 w-3.5" />
              {copied ? 'Copied!' : 'Share'}
            </button>
            <Link
              href={`/blog/${post.id}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border"
              style={{ background: 'rgba(239,68,68,0.06)', color: '#EF4444', borderColor: 'rgba(239,68,68,0.15)' }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', boxShadow: 'var(--shadow-md)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Dynamic Column Layout for Table of Contents and Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
          {/* Article Main Body */}
          <div className="lg:col-span-3 prose-custom max-w-none min-w-0">
            {parseMarkdownToReact(post.body)}

            {/* Tags display */}
            {post.tags && post.tags.length > 0 && (
              <div
                className="mt-8 pt-8 flex flex-wrap gap-2"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Table of Contents Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {headings.length > 0 && (
                <div
                  className="rounded-2xl p-5 border"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    background: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <h4
                    className="text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Table of Contents
                  </h4>
                  <nav className="space-y-2 border-l border-default" style={{ borderColor: 'var(--border-subtle)' }}>
                    {headings.map((h) => {
                      const isActive = activeId === h.id;
                      const paddingLeft = h.level === 1 ? 'pl-4' : h.level === 2 ? 'pl-6' : 'pl-8';
                      return (
                        <button
                          key={h.id}
                          onClick={() => scrollToHeading(h.id)}
                          className={`w-full text-left text-xs transition-all hover:text-indigo-600 block py-1.5 -ml-[1px] border-l ${paddingLeft}`}
                          style={{
                            borderColor: isActive ? 'var(--accent)' : 'transparent',
                            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                            fontWeight: isActive ? '600' : '400',
                          }}
                        >
                          {h.text}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>


      {/* ── Comments Section ── */}
      <section className="mt-16 pt-10 border-t" style={{ borderTopColor: 'var(--border-subtle)' }} aria-label="Comments">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <MessageSquare className="h-5 w-5 text-indigo-500" />
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-10 rounded-2xl p-5 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Join the conversation</h3>

          {commentError && (
            <div className="mb-4 text-xs font-semibold" style={{ color: 'var(--color-danger)' }}>
              {commentError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="comment-name" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name *</label>
              <input
                id="comment-name"
                type="text"
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none bg-input"
                style={{
                  background: 'var(--bg-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                id="comment-email"
                type="email"
                placeholder="your@email.com (optional)"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none bg-input"
                style={{
                  background: 'var(--bg-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment-body" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Comment *</label>
            <textarea
              id="comment-body"
              rows={4}
              placeholder="What are your thoughts on this article?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border outline-none bg-input resize-y"
              style={{
                background: 'var(--bg-input)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary py-2 px-5 text-sm"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <Send className="h-3.5 w-3.5" />
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        {commentsLoading ? (
          <div className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>Loading comments…</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-2xl" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
            <p className="text-sm font-semibold mb-1">No comments yet</p>
            <p className="text-xs">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl p-5 border flex gap-4"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
              >
                <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                  {comment.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{comment.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{comment.email}</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmationDialog
        isOpen={deleteOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        title="Delete Article"
        message={`Delete "${post.title}"? This cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        isDestructive
      />
    </div>
  );
}
