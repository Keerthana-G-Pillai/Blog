import { MetadataRoute } from 'next';
import { fetchAllPosts, fetchAllUsers } from '@/lib/api-client';

const BASE_URL = 'https://blog-hub.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();
  const users = await fetchAllUsers();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/users`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/bookmarks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const userPages: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${BASE_URL}/users/${user.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...userPages];
}
