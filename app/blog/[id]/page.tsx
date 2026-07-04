'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPostById, deletePost, getAllPosts, getRelatedPosts } from '@/lib/post-store'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog-card'
import { BlogPost } from '@/lib/types'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const foundPost = getPostById(id)
    setPost(foundPost)

    if (foundPost) {
      const allPosts = getAllPosts()
      setRelatedPosts(getRelatedPosts(allPosts, foundPost, 3))
    }

    setIsLoaded(true)
  }, [id])

  const handleDelete = () => {
    setError(null)
    const success = deletePost(id)
    if (success) {
      setIsDeleteDialogOpen(false)
      router.push('/')
    } else {
      setIsDeleteDialogOpen(false)
      setError('Could not delete post. Please try again.')
    }
  }

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    )
  }

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
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
        >
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
              {post.createdAt && (
                <time className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {post.updatedAt && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{Math.ceil(post.body.length / 200)} min read</span>
            </div>
          </div>
        </header>

        {/* Edit / Delete Buttons */}
        <div className="mb-8 flex items-center gap-3">
          <Link href={`/blog/${post.id}/edit`}>
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>

        {/* Article Content */}
        <div className="mb-12 space-y-6">
          <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {post.body}
          </p>
        </div>
      </article>

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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  )
}
