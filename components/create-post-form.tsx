'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, PenLine } from 'lucide-react';
import { createPost, ALL_CATEGORIES } from '@/lib/api-client';

export function CreatePostForm() {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto reading time preview helper
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const autoReadTime = Math.max(1, Math.ceil(wordCount / 200));

  function validate() {
    const e: typeof errors = {};
    if (!title.trim()) e.title = 'Title is required';
    else if (title.trim().length > 255) e.title = 'Max 255 characters';
    if (!body.trim()) e.body = 'Content is required';
    else if (body.trim().length > 10000) e.body = 'Max 10,000 characters';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsSubmitting(true);
    setError(null);

    const processedTags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    try {
      const post = await createPost({
        title: title.trim(),
        body: body.trim(),
        category,
        coverImage: coverImage.trim() || undefined,
        tags: processedTags,
      });
      // Invalidate the posts list so feed refreshes
      await qc.invalidateQueries({ queryKey: ['posts'] });
      router.push(`/blog/${post.id}`);
    } catch {
      setError('Failed to publish. Please try again.');
      setIsSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-lg)',
    outline: 'none',
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '0.875rem',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: 'var(--shadow-sm)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)';
  };

  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError?: boolean) => {
    e.currentTarget.style.borderColor = hasError ? 'var(--color-danger)' : 'var(--border-default)';
    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
  };

  return (
    <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <Link
        href="/"
        className="flex items-center gap-2 text-sm mb-8 transition-colors hover:text-indigo-600"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'var(--accent)' }}
        >
          <PenLine className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Write an Article
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Share your ideas with the InkVerse community
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 rounded-xl p-4 text-sm"
          role="alert"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="post-title" style={labelStyle}>Title</label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: undefined })); }}
            placeholder="Give your article a compelling title…"
            style={{ ...inputStyle, borderColor: errors.title ? 'var(--color-danger)' : 'var(--border-default)' }}
            onFocus={focusInput}
            onBlur={(e) => blurInput(e, !!errors.title)}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-err' : undefined}
          />
          {errors.title && <p id="title-err" className="mt-1.5 text-xs" style={{ color: 'var(--color-danger)' }} role="alert">{errors.title}</p>}
        </div>

        {/* Category select */}
        <div>
          <label htmlFor="post-category" style={labelStyle}>Category</label>
          <select
            id="post-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle }}
            onFocus={focusInput}
            onBlur={(e) => blurInput(e)}
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Cover Image URL input */}
        <div>
          <label htmlFor="post-cover" style={labelStyle}>Cover Image URL</label>
          <input
            id="post-cover"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/photo-… (optional)"
            style={{ ...inputStyle }}
            onFocus={focusInput}
            onBlur={(e) => blurInput(e)}
          />
        </div>

        {/* Tags input */}
        <div>
          <label htmlFor="post-tags" style={labelStyle}>Tags</label>
          <input
            id="post-tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. technology, react, development (comma-separated)"
            style={{ ...inputStyle }}
            onFocus={focusInput}
            onBlur={(e) => blurInput(e)}
          />
        </div>

        {/* Body input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="post-body" style={labelStyle}>Content</label>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{autoReadTime} min read</span>
              <span>•</span>
              <span style={{ color: body.length > 9500 ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                {body.length} / 10,000 chars
              </span>
            </div>
          </div>
          <textarea
            id="post-body"
            value={body}
            onChange={(e) => { setBody(e.target.value); if (errors.body) setErrors((p) => ({ ...p, body: undefined })); }}
            placeholder="Write something thoughtful…"
            rows={14}
            style={{ ...inputStyle, resize: 'vertical', borderColor: errors.body ? 'var(--color-danger)' : 'var(--border-default)' }}
            onFocus={focusInput}
            onBlur={(e) => blurInput(e, !!errors.body)}
            aria-invalid={!!errors.body}
            aria-describedby={errors.body ? 'body-err' : undefined}
          />
          {errors.body && <p id="body-err" className="mt-1.5 text-xs" style={{ color: 'var(--color-danger)' }} role="alert">{errors.body}</p>}
        </div>

        {/* Markdown Guide Box */}
        <div className="rounded-xl p-4 text-xs space-y-1.5 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>✍️ Markdown Formatting Guide</p>
          <p style={{ color: 'var(--text-secondary)' }}>Type headings and lists directly in the content field. They will automatically build your article's structural headings and the dynamic Table of Contents sidebar!</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <div>## Section Heading (H2)</div>
            <div>### Subsection Heading (H3)</div>
            <div>**Bold Text**</div>
            <div>*Italic Text*</div>
            <div>- Bullet list item</div>
            <div>`inline code`</div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Publishing…
            </span>
          ) : (
            <><PenLine className="h-4 w-4" />Publish Article</>
          )}
        </button>
      </form>
    </div>
  );
}
