'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { submitComment } from '@/lib/api-client';
import { Comment } from '@/lib/types';

interface CommentFormProps {
  postId: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  body?: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const { mutate } = useSWRConfig();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!body.trim()) {
      newErrors.body = 'Comment body is required';
    }
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    const optimisticComment: Comment = {
      id: Date.now(),
      postId,
      name: name.trim(),
      email: email.trim(),
      body: body.trim(),
    };

    // Optimistically add comment to the SWR cache
    mutate(
      `comments-${postId}`,
      (currentComments: Comment[] | undefined) => {
        return [...(currentComments || []), optimisticComment];
      },
      false
    );

    try {
      await submitComment(postId, {
        name: name.trim(),
        email: email.trim(),
        body: body.trim(),
      });
      // Reset form on success
      setName('');
      setEmail('');
      setBody('');
      setErrors({});
    } catch {
      // Revert the optimistic update on error
      mutate(`comments-${postId}`);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    'w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-base text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/30';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Leave a Comment
      </h3>

      <div>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
          aria-label="Your name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
          aria-label="Your email"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <textarea
          placeholder="Write your comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className={`${inputClasses} resize-none`}
          aria-label="Comment body"
          aria-invalid={!!errors.body}
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.body}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
      >
        {submitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
}
