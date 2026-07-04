'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PostForm } from '@/components/post-form';
import { getPostById, updatePost } from '@/lib/post-store';
import { BlogPost } from '@/lib/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingPost = getPostById(id);
    setPost(existingPost);
  }, [id]);

  // Loading state
  if (post === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-12 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  // Post not found
  if (post === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Post Not Found
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The blog post you are trying to edit does not exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md dark:hover:bg-blue-500"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  function handleSubmit(data: { title: string; body: string }) {
    setIsSubmitting(true);
    setError(null);

    try {
      const updated = updatePost(id, data);
      if (updated) {
        router.push(`/blog/${id}`);
      } else {
        setError('Could not update the post. The post may have been deleted.');
        setIsSubmitting(false);
      }
    } catch {
      setError('Failed to save changes. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/blog/${id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
          Post
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Edit</span>
      </nav>

      {/* Page Heading */}
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Edit Post
      </h1>

      {/* Error Banner */}
      {error && (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {/* Edit Form */}
      <PostForm
        initialData={{ title: post.title, body: post.body }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
      />
    </div>
  );
}
