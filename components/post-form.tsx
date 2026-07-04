'use client';

import { useState } from 'react';
import { Button } from './ui/button';

interface PostFormProps {
  initialData?: { title: string; body: string };
  onSubmit: (data: { title: string; body: string }) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

interface FormErrors {
  title?: string;
  body?: string;
}

export function PostForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit',
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [body, setBody] = useState(initialData?.body ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (trimmedTitle.length === 0) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length > 255) {
      newErrors.title = 'Title must be 255 characters or fewer';
    }

    if (trimmedBody.length === 0) {
      newErrors.body = 'Body is required';
    } else if (trimmedBody.length > 10000) {
      newErrors.body = 'Body must be 10,000 characters or fewer';
    }

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({ title: title.trim(), body: body.trim() });
  }

  const inputClasses =
    'w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-base text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-900/30';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="post-title"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          id="post-title"
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: undefined }));
            }
          }}
          className={inputClasses}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
        />
        {errors.title && (
          <p
            id="post-title-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="post-body"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Body
        </label>
        <textarea
          id="post-body"
          placeholder="Write your post content..."
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (errors.body) {
              setErrors((prev) => ({ ...prev, body: undefined }));
            }
          }}
          rows={10}
          className={`${inputClasses} resize-none`}
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
        />
        {errors.body && (
          <p
            id="post-body-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.body}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
