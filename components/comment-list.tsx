'use client';

import useSWR from 'swr';
import { fetchCommentsByPostId } from '@/lib/api-client';
import { Comment } from '@/lib/types';

interface CommentListProps {
  postId: number;
}

export function CommentList({ postId }: CommentListProps) {
  const { data: comments, error, isLoading } = useSWR<Comment[]>(
    `comments-${postId}`,
    () => fetchCommentsByPostId(postId)
  );

  if (isLoading) {
    return (
      <div className="mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load comments. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Comments ({comments?.length ?? 0})
      </h2>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="font-semibold text-gray-900 dark:text-white">
              {comment.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {comment.email}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
