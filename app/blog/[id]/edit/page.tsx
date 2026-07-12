import { Metadata } from 'next';
import { fetchPostById } from '@/lib/api-client';
import { EditPostForm } from '@/components/edit-post-form';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPostById(id);
  return { title: post ? `Edit: ${post.title}` : 'Edit Article' };
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  return <EditPostForm postId={id} />;
}
