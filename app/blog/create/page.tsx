'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/post-form';
import { createPost } from '@/lib/post-store';
import { Breadcrumb } from '@/components/breadcrumb';

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(data: { title: string; body: string }) {
    setIsSubmitting(true);
    setError(null);

    try {
      const newPost = createPost({ title: data.title, body: data.body });
      router.push(`/blog/${newPost.id}`);
    } catch {
      setError('Failed to save the post. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Create Post' },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
        Create Post
      </h1>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <div className="mt-6">
        <PostForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Create Post"
        />
      </div>
    </div>
  );
}
