import axios from 'axios';
import { BlogPost, User, Comment, CreatePostInput, UpdatePostInput } from './types';

// ─── MockAPI (posts) ──────────────────────────────────────────────────────────
const MOCKAPI_BASE =
  process.env.NEXT_PUBLIC_MOCKAPI_URL ??
  'https://jsonplaceholder.typicode.com';

const mockClient = axios.create({ baseURL: MOCKAPI_BASE, timeout: 10000 });

// ─── JSONPlaceholder (users, comments) ───────────────────────────────────────
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

// Fallback in-memory posts store
let fallbackPosts: Record<string, unknown>[] = [
  {
    id: '1',
    userId: 1,
    title: 'Designing the Next Generation of SaaS Landing Pages',
    body: 'In the rapidly evolving world of software-as-a-service, landing pages are no longer just static digital brochures. They are dynamic experiences that must build trust, demonstrate value within seconds, and convert visitors into active users. This article dives deep into the visual cues, minimal copywriting structures, and performance optimizations that drive conversion rates in modern UI design. We discuss grid alignments, font pairing choices, and contrast values.',
    category: 'Design',
    createdAt: '2026-07-10T12:00:00.000Z',
    featured: true,
  },
  {
    id: '2',
    userId: 2,
    title: 'Unlocking Peak Performance in Tailwind CSS v4',
    body: 'Tailwind CSS v4 introduces a completely redesigned engine built for speed. With zero-configuration setup, Rust-powered build speed, and native CSS custom properties integration, it represents a massive leap forward. Here is a comprehensive guide to organizing your styling system and leveraging new layout properties to build pixel-perfect user interfaces.',
    category: 'Technology',
    createdAt: '2026-07-09T14:30:00.000Z',
    featured: false,
  },
  {
    id: '3',
    userId: 3,
    title: 'The Subtle Art of Minimalist Productivity',
    body: "Productivity isn't about doing more things; it's about doing the right things with fewer distractions. In this essay, we explore how reducing your daily tooling stack to the bare minimum can amplify your focus and help you achieve a flow state. We analyze calendar blocking, single-tasking, and the mental health benefits of going analog.",
    category: 'Lifestyle',
    createdAt: '2026-07-08T09:15:00.000Z',
    featured: false,
  },
  {
    id: '4',
    userId: 4,
    title: 'Scale or Fail: Technical Debt in Hypergrowth Startups',
    body: 'Building fast is a requirement for early-stage startups, but ignoring system architecture can lead to catastrophic failures later. We outline actionable strategies for engineering leaders to balance feature velocity with code quality, establish refactoring budgets, and scale microservices without losing developer productivity.',
    category: 'Business',
    createdAt: '2026-07-07T16:45:00.000Z',
    featured: false,
  },
  {
    id: '5',
    userId: 5,
    title: 'Chasing Solitude: A Travel Guide to Northern Patagonia',
    body: 'Patagonia is famous for its dramatic peaks and wild winds, but finding true solitude requires venturing off the beaten path. This travel diary covers the remote routes of Northern Patagonia, where pristine glacial lakes meet dense ancient forests, offering a quiet sanctuary for the modern traveler seeking disconnection.',
    category: 'Travel',
    createdAt: '2026-07-06T11:00:00.000Z',
    featured: false,
  },
  {
    id: '6',
    userId: 6,
    title: 'The Future of Quantum Computing and Cryptography',
    body: 'As quantum computers grow in power, the encryption standards that protect the modern internet are facing unprecedented risks. This paper explains the fundamental principles of post-quantum cryptography, detailing the new mathematical frameworks researchers are building to secure data in a post-quantum world.',
    category: 'Science',
    createdAt: '2026-07-05T08:00:00.000Z',
    featured: false,
  }
];

// Synchronize with localStorage on client side if available
function getLocalPosts(): Record<string, unknown>[] {
  if (typeof window === 'undefined') return fallbackPosts;
  try {
    const cached = localStorage.getItem('inkverse_fallback_posts');
    if (cached) {
      return JSON.parse(cached);
    } else {
      localStorage.setItem('inkverse_fallback_posts', JSON.stringify(fallbackPosts));
      return fallbackPosts;
    }
  } catch {
    return fallbackPosts;
  }
}

function saveLocalPosts(posts: Record<string, unknown>[]) {
  fallbackPosts = posts;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('inkverse_fallback_posts', JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save fallback posts', e);
  }
}

// ─── Posts API ────────────────────────────────────────────────────────────────

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await mockClient.get<Record<string, unknown>[]>('/posts');
    if (Array.isArray(data) && data.length > 0) {
      return data.map(enrichPost).reverse();
    }
  } catch (e) {
    console.warn('MockAPI failed, falling back to local posts storage:', e);
  }
  return getLocalPosts().map(enrichPost).reverse();
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data } = await mockClient.get<Record<string, unknown>>(`/posts/${id}`);
    return enrichPost(data);
  } catch (e) {
    console.warn(`MockAPI failed to fetch post ${id}, checking local posts:`, e);
    const local = getLocalPosts().find((p) => String(p.id) === id);
    if (local) return enrichPost(local);
    return null;
  }
}

export async function createPost(input: CreatePostInput): Promise<BlogPost> {
  const newRaw: Record<string, unknown> = {
    id: Date.now().toString(),
    title: input.title,
    body: input.body,
    userId: input.userId ?? 1,
    category: input.category ?? 'Technology',
    coverImage: input.coverImage,
    tags: input.tags,
    createdAt: new Date().toISOString(),
    featured: false,
    views: 0,
    likes: 0,
  };

  try {
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
    const posts = getLocalPosts();
    posts.push(data);
    saveLocalPosts(posts);
    return enrichPost(data);
  } catch (e) {
    console.warn('MockAPI failed to create post, creating locally:', e);
    const posts = getLocalPosts();
    posts.push(newRaw);
    saveLocalPosts(posts);
    return enrichPost(newRaw);
  }
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<BlogPost> {
  try {
    const { data } = await mockClient.put<Record<string, unknown>>(`/posts/${id}`, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
    const posts = getLocalPosts().map((p) => (String(p.id) === id ? { ...p, ...data } : p));
    saveLocalPosts(posts);
    return enrichPost(data);
  } catch (e) {
    console.warn(`MockAPI failed to update post ${id}, updating locally:`, e);
    const posts = getLocalPosts();
    const index = posts.findIndex((p) => String(p.id) === id);
    if (index !== -1) {
      const updated = {
        ...posts[index],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      posts[index] = updated;
      saveLocalPosts(posts);
      return enrichPost(updated);
    }
    throw new Error('Post not found locally');
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await mockClient.delete(`/posts/${id}`);
  } catch (e) {
    console.warn(`MockAPI failed to delete post ${id}, deleting locally:`, e);
  }
  const posts = getLocalPosts().filter((p) => String(p.id) !== id);
  saveLocalPosts(posts);
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

// ─── Users & Comments (JSONPlaceholder) ──────────────────────────────────────

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

export async function fetchCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const { data } = await jpClient.get<Comment[]>(`/posts/${postId}/comments`);
    return data;
  } catch {
    return [];
  }
}
