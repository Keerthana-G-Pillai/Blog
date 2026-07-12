import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchPostById, fetchAllPosts } from '@/lib/api-client';
import { PostView } from '@/components/post-view';

interface Props {
  params: Promise<{ id: string }>;
}

// SSR metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPostById(id);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt ?? post.body.substring(0, 160),
    keywords: [post.category ?? '', post.authorName ?? '', 'blog', 'article'],
    authors: [{ name: post.authorName }],
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.body.substring(0, 160),
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName ?? ''],
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? post.body.substring(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

// SSR: prefetch post + all posts for related section
export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  const post = await fetchPostById(id);
  const isLocalId = id.length > 5;
  if (!post && !isLocalId) notFound();

  if (post) {
    queryClient.setQueryData(['post', id], post);
  }

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostView postId={id} />
    </HydrationBoundary>
  );
}
