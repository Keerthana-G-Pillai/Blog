import Link from 'next/link';
import { Metadata } from 'next';
import { fetchPostById, fetchAllPosts, getRelatedPosts } from '@/lib/api-client';
import { BlogCard } from '@/components/blog-card';
import { ReadingProgress } from '@/components/reading-progress';
import { Breadcrumb } from '@/components/breadcrumb';
import { ShareButtons } from '@/components/share-buttons';
import { CommentList } from '@/components/comment-list';
import { CommentForm } from '@/components/comment-form';

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPostById(Number(id));

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  return {
    title: post.title,
    description: post.body.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.body.substring(0, 160),
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await fetchPostById(Number(id));
  const allPosts = await fetchAllPosts();
  const relatedPosts = post ? getRelatedPosts(allPosts, post, 3) : [];

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Post Not Found
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The blog post you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md dark:hover:bg-blue-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "author": {
      "@type": "Person",
      "name": `User ${post.userId}`
    },
    "description": post.body.substring(0, 160)
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-12">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/' },
            { label: post.title }
          ]} />
        </div>

        {/* Article Header */}
        <article className="mb-16">
          <header className="mb-10">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white">
              {post.title}
            </h1>
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/users/${post.userId}`}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  User {post.userId}
                </Link>
                <time className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{Math.ceil(post.body.length / 200)} min read</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="mb-12 space-y-6">
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {post.body}
            </p>
          </div>
        </article>

        {/* Share Buttons */}
        <ShareButtons title={post.title} url={`/blog/${post.id}`} />

        {/* Comments Section */}
        <CommentList postId={post.id} />
        <div className="mt-8">
          <CommentForm postId={post.id} />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 pt-16 mt-16 dark:border-gray-700">
            <h2 className="mb-10 text-2xl font-bold text-gray-900 dark:text-white">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
