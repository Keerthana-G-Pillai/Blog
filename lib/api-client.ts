import axios from 'axios';
import { BlogPost, User, CreatePostInput, UpdatePostInput } from './types';

// ─── MockAPI (posts) ──────────────────────────────────────────────────────────
const envUrl = process.env.NEXT_PUBLIC_MOCKAPI_URL;
const MOCKAPI_BASE = (envUrl && !envUrl.includes('6872f93c46b4e7f718e3d1e7'))
  ? envUrl
  : 'https://jsonplaceholder.typicode.com';

const mockClient = axios.create({ baseURL: MOCKAPI_BASE, timeout: 10000 });

// ─── JSONPlaceholder (users) ──────────────────────────────────────────
const jpClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// Categories used to enrich posts
const CATEGORIES = ['Technology', 'Design', 'Business', 'Lifestyle', 'Travel', 'Science', 'Culture', 'Health'];

// Curated Unsplash cover images per category
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

/** Enrich a raw MockAPI post with visual metadata derived deterministically from its id */
function enrichPost(raw: Record<string, unknown>): BlogPost {
  const id = String(raw.id ?? '');
  const numId = parseInt(id, 10) || 0;

  const category = (raw.category as string) || CATEGORIES[numId % CATEGORIES.length];
  const covers = COVER_IMAGES[category] ?? COVER_IMAGES.Technology;
  const coverImage = (raw.coverImage as string) || covers[numId % covers.length];
  const authorName = (raw.authorName as string) || AUTHOR_NAMES[numId % AUTHOR_NAMES.length];
  const authorAvatar = (raw.authorAvatar as string) || AUTHOR_AVATARS[numId % AUTHOR_AVATARS.length];
  const body = String(raw.body ?? '');
  const words = body.split(' ').length;
  const readTime = (raw.readTime as number) || Math.max(1, Math.ceil(words / 200));
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
    title: String(raw.title ?? ''),
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

// ─── Posts API ────────────────────────────────────────────────────────────────

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const { data } = await mockClient.get<Record<string, unknown>[]>('/posts');
  return data.map(enrichPost).reverse();
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data } = await mockClient.get<Record<string, unknown>>(`/posts/${id}`);
    return enrichPost(data);
  } catch {
    return null;
  }
}

export async function createPost(input: CreatePostInput): Promise<BlogPost> {
  const { data } = await mockClient.post<Record<string, unknown>>('/posts', {
    title: input.title,
    body: input.body,
    userId: input.userId ?? 1,
    category: input.category ?? 'Technology',
    coverImage: input.coverImage,
    tags: input.tags,
    createdAt: new Date().toISOString(),
    views: 0,
    likes: 0,
  });
  return enrichPost(data);
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<BlogPost> {
  const { data } = await mockClient.put<Record<string, unknown>>(`/posts/${id}`, {
    ...input,
    updatedAt: new Date().toISOString(),
  });
  return enrichPost(data);
}

export async function deletePost(id: string): Promise<void> {
  await mockClient.delete(`/posts/${id}`);
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

// ─── Users (JSONPlaceholder) ─────────────────────────────────────────────────

const FALLBACK_USERS: User[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    username: 'sarahj',
    email: 'sarah.jenkins@inkverse.dev',
    phone: '1-770-736-8031',
    website: 'inkverse.dev',
    address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874', geo: { lat: '-37.3159', lng: '81.1496' } },
    company: { name: 'InkVerse Staff', catchPhrase: 'Multi-layered neural-net', bs: 'harness e-markets' },
  },
  {
    id: 2,
    name: 'David Chen',
    username: 'davidc',
    email: 'david.chen@inkverse.dev',
    phone: '1-880-736-8032',
    website: 'inkverse.dev',
    address: { street: 'Victor Plains', suite: 'Suite 879', city: 'Wisokyburgh', zipcode: '90566-7771', geo: { lat: '-43.9509', lng: '-34.4618' } },
    company: { name: 'InkVerse Staff', catchPhrase: 'Proactive modular framework', bs: 'synergize bandwidth' },
  },
  {
    id: 3,
    name: 'Elena Rostova',
    username: 'elenar',
    email: 'elena.rostova@inkverse.dev',
    phone: '1-990-736-8033',
    website: 'inkverse.dev',
    address: { street: 'Douglas Extension', suite: 'Suite 847', city: 'McKenziehaven', zipcode: '59590-4157', geo: { lat: '-29.4572', lng: '-164.2990' } },
    company: { name: 'InkVerse Tech', catchPhrase: 'Face to face transition', bs: 'transition interfaces' },
  },
  {
    id: 4,
    name: 'Marcus Vance',
    username: 'marcusv',
    email: 'marcus.vance@inkverse.dev',
    phone: '1-550-736-8034',
    website: 'inkverse.dev',
    address: { street: 'Hoeger Mall', suite: 'Apt. 692', city: 'South Elvis', zipcode: '53919-4257', geo: { lat: '24.8918', lng: '21.8984' } },
    company: { name: 'Robel-Rohan', catchPhrase: 'Configurable hardware', bs: 'generate technologies' },
  },
];

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const { data } = await jpClient.get<User[]>('/users');
    return data;
  } catch (e) {
    console.warn('JSONPlaceholder failed to fetch users, returning local fallback users:', e);
    return FALLBACK_USERS;
  }
}

export async function fetchUserById(id: number): Promise<User | null> {
  try {
    const { data } = await jpClient.get<User>(`/users/${id}`);
    return data;
  } catch (e) {
    console.warn(`JSONPlaceholder failed to fetch user ${id}, returning local fallback user:`, e);
    const local = FALLBACK_USERS.find((u) => u.id === id) || FALLBACK_USERS[id % FALLBACK_USERS.length] || FALLBACK_USERS[0];
    return { ...local, id };
  }
}


