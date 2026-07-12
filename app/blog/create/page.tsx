import { Metadata } from 'next';
import { CreatePostForm } from '@/components/create-post-form';

export const metadata: Metadata = {
  title: 'Write an Article',
  description: 'Share your story with the InkVerse community.',
};

export default function CreatePostPage() {
  return <CreatePostForm />;
}
