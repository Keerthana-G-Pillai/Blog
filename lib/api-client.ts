import axios from 'axios';
import { BlogPost, User, CreatePostInput, UpdatePostInput } from './types';

const MOCKAPI_BASE = process.env.NEXT_PUBLIC_MOCKAPI_URL ?? '';

const mockClient = axios.create({ baseURL: MOCKAPI_BASE, timeout: 10000 });

const devtoClient = axios.create({
  baseURL: 'https://dev.to/api',
  timeout: 10000,
  headers: { 'api-key': process.env.NEXT_PUBLIC_DEVTO_API_KEY ?? '' },
});

const jpClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

const CATEGORIES = ['Technology', 'Design', 'Business', 'Lifestyle', 'Travel', 'Science', 'Culture', 'Health'];

const COVER_IMAGES: Record<string, string[]> = {
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  ],
  Design: [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&q=80',
  ],
  Business: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  ],
  Lifestyle: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  ],
  Travel: [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
  ],
  Science: [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&q=80',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
  ],
  Culture: [
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80',
  ],
  Health: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  ],
};

const AUTHOR_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=alpha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=beta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gamma',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=delta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=epsilon',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=zeta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=eta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=theta',
];

const AUTHOR_NAMES = [
  'Alex Rivera', 'Jordan Lee', 'Sam Chen', 'Taylor Brooks',
  'Morgan Davis', 'Casey Kim', 'Riley Zhang', 'Quinn Park',
];

function enrichPost(raw: Record<string, unknown>): BlogPost {
  const id = String(raw.id ?? '');
  const numId = parseInt(id, 10) || 0;

  const title = String(raw.title ?? '');
  const body = String(raw.body ?? '');

  const category = (raw.category as string) || CATEGORIES[numId % CATEGORIES.length];
  const covers = COVER_IMAGES[category] ?? COVER_IMAGES.Technology;
  const coverImage = (raw.coverImage as string) || covers[numId % covers.length];
  const authorName = (raw.authorName as string) || AUTHOR_NAMES[numId % AUTHOR_NAMES.length];
  const authorAvatar = (raw.authorAvatar as string) || AUTHOR_AVATARS[numId % AUTHOR_AVATARS.length];
  const readTime = (raw.readTime as number) || Math.max(3, Math.min(10, Math.floor(((numId * 3) % 8) + 3)));
  const excerpt = body.length > 140 ? body.substring(0, 140) + '…' : body;

  const defaultTags = [
    category.toLowerCase(),
    'writing',
    numId % 2 === 0 ? 'insights' : 'learning'
  ];
  const tags = Array.isArray(raw.tags)
    ? raw.tags.map(String)
    : (typeof raw.tags === 'string' && raw.tags ? (raw.tags as string).split(',').map((s) => s.trim()) : defaultTags);

  const views = (raw.views as number) || Math.floor(((numId * 1357) % 8000) + 1240);
  const likes = (raw.likes as number) || Math.floor((views * 0.15) + ((numId * 3) % 45));

  return {
    id,
    userId: Number(raw.userId ?? 1),
    title,
    body,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    category,
    coverImage,
    authorName,
    authorAvatar,
    readTime,
    excerpt,
    featured: (raw.featured as boolean) ?? false,
    views,
    likes,
    tags,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDevtoPost(a: any): BlogPost {
  const tags: string[] = Array.isArray(a.tag_list) ? a.tag_list : [];
  const category = tags[0]
    ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1)
    : CATEGORIES[a.id % CATEGORIES.length];
  const coverImage = a.cover_image || a.social_image
    || (COVER_IMAGES[category] ?? COVER_IMAGES.Technology)[a.id % 3];
  const body = a.body_markdown || a.description || '';
  const excerpt = a.description || body.substring(0, 140) + '…';
  return {
    id: String(a.id),
    userId: a.user_id ?? 1,
    title: a.title,
    body,
    excerpt,
    category,
    coverImage,
    authorName: a.user?.name ?? '',
    authorAvatar: a.user?.profile_image_90 ?? a.user?.profile_image ?? '',
    readTime: a.reading_time_minutes ?? 5,
    featured: false,
    views: a.page_views_count ?? 0,
    likes: a.public_reactions_count ?? 0,
    tags,
    createdAt: a.published_at,
  };
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await devtoClient.get('/articles?per_page=30&top=30');
    return data.map(mapDevtoPost);
  } catch {
    return [];
  }
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data } = await devtoClient.get(`/articles/${id}`);
    return mapDevtoPost(data);
  } catch {
    return null;
  }
}

export async function createPost(input: CreatePostInput): Promise<BlogPost> {
  const { data } = await mockClient.post<Record<string, unknown>>('/post', {
    title: input.title,
    body: input.body,
    userId: input.userId,
    category: input.category,
    coverImage: input.coverImage,
    tags: input.tags,
    createdAt: new Date().toISOString(),
    views: 0,
    likes: 0,
  });
  return enrichPost(data);
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<BlogPost> {
  const { data } = await mockClient.put<Record<string, unknown>>(`/post/${id}`, {
    ...input,
    updatedAt: new Date().toISOString(),
  });
  return enrichPost(data);
}

export async function deletePost(id: string): Promise<void> {
  await mockClient.delete(`/post/${id}`);
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts;
  const q = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q) ||
      (p.authorName ?? '').toLowerCase().includes(q)
  );
}

export function filterByCategory(posts: BlogPost[], category: string | null): BlogPost[] {
  if (!category) return posts;
  return posts.filter((p) => p.category === category);
}

export function getRelatedPosts(posts: BlogPost[], current: BlogPost, limit = 3): BlogPost[] {
  return posts
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, limit);
}

export const ALL_CATEGORIES = CATEGORIES;

export async function fetchAllUsers(): Promise<User[]> {
  const { data } = await jpClient.get<User[]>('/users');
  return data;
}

export async function fetchUserById(id: number): Promise<User | null> {
  try {
    const { data } = await jpClient.get<User>(`/users/${id}`);
    return data;
  } catch {
    return null;
  }
}
