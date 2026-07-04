import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { BookmarkButton } from '@/components/bookmark-button';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const excerpt = post.body.substring(0, 130);

  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600">
      <Link href={`/blog/${post.id}`} className="block">
        <h2 className="line-clamp-2 text-lg font-semibold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
          {post.title}
        </h2>
      </Link>
      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {excerpt}
      </p>
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <Link
          href={`/users/${post.userId}`}
          className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors dark:text-gray-500 dark:hover:text-blue-400"
        >
          User {post.userId}
        </Link>
        <div className="flex items-center gap-2">
          <BookmarkButton postId={post.id} />
          <Link
            href={`/blog/${post.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read more
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
