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

const REALISTIC_ENGLISH_POSTS = [
  {
    title: 'Designing the Next Generation of SaaS Landing Pages',
    body: 'In the rapidly evolving world of software-as-a-service, landing pages are no longer just static digital brochures. They are dynamic experiences that must build trust, demonstrate value within seconds, and convert visitors into active users.\n\n### The Importance of Visual Hierarchy\nVisual hierarchy guides visitors through your landing page, emphasizing core value propositions first. By using scale, contrast, and layout positioning, you can direct attention to call-to-action buttons and key benefits.\n\n### Minimal Copywriting Structures\nKeep copy concise and benefit-focused. Instead of describing features, highlight how the tool solves the user\'s specific pain points. Use short paragraphs and lists to make the content easily scannable.\n\n### Performance Optimization\nFast page load speed is critical. Compress images, eliminate unused CSS, and defer heavy scripts to make sure users don\'t abandon the page before it loads. A faster page directly improves conversion rates.',
  },
  {
    title: 'Unlocking Peak Performance in Tailwind CSS v4',
    body: 'Tailwind CSS v4 introduces a completely redesigned compilation engine built for extreme speed. With zero-configuration setup, Rust-powered build speed, and native CSS custom properties integration, it represents a massive leap forward for front-end developers.\n\n### Rust-Powered Compilation\nThe new engine compiles utility classes up to 10x faster than previous versions. This instant feedback loop increases developer productivity and shortens build times in large codebases.\n\n### CSS Custom Properties\nTailwind v4 maps theme variables directly to CSS custom properties. This makes it easier to manipulate styles at runtime using vanilla JavaScript, simplifying dynamic theme switcher implementations.\n\n### Zero-Config Setup\nYou no longer need configuration files to get started. Tailwind automatically detects your project structure and configures the build pipe, allowing you to start writing styles immediately.',
  },
  {
    title: 'The Subtle Art of Minimalist Productivity',
    body: 'Productivity isn\'t about doing more things; it\'s about doing the right things with fewer distractions. In this article, we explore how reducing your daily tooling stack can amplify focus and help you achieve a deep flow state.\n\n### Audit Your Tool Stack\nIdentify tools that create friction or cause distraction. Consolidating your tasks and documentation into a single workspace reduces context switching and saves cognitive energy.\n\n### Calendar Blocking\nSchedule dedicated time blocks for specific tasks. Treat these blocks as non-negotiable appointments, ensuring you have uninterrupted focus for high-priority creative or technical work.\n\n### Going Analog\nTake breaks from screens. Writing down daily goals in a physical notebook or brainstorming on a whiteboard can clear mental clutter and spark creative problem-solving.',
  },
  {
    title: 'Scale or Fail: Handling Technical Debt in Hypergrowth',
    body: 'Building fast is essential for early-stage startups, but ignoring system architecture can lead to structural failures later. We outline actionable strategies for engineering leaders to balance feature velocity with code quality.\n\n### Define a Refactoring Budget\nDedicate 20% of each sprint to refactoring and resolving technical debt. This consistent maintenance keeps codebase complexity manageable and prevents system degradation.\n\n### Establish Modular Interfaces\nBuild loosely coupled components and microservices. This modularity allows different teams to develop features independently without introducing circular dependencies or merge conflicts.\n\n### Invest in Automated Tests\nImplement a robust testing suite to catch bugs early. Comprehensive unit and integration tests give developers the confidence to refactor complex systems without breaking existing functionality.',
  },
  {
    title: 'Chasing Solitude: A Travel Guide to Northern Patagonia',
    body: 'Patagonia is famous for its dramatic peaks and wild winds, but finding true solitude requires venturing off the beaten path. This travel diary covers remote routes where pristine glacial lakes meet ancient forests.\n\n### Venturing Off the Beaten Path\nAvoid major tourist hubs and choose lesser-known hiking trails. Exploring remote valleys gives you a deeper connection with the wilderness and a quiet sanctuary away from crowds.\n\n### Pristine Glacial Landscapes\nThe lakes of Northern Patagonia are fed by ancient glaciers, creating stunning turquoise waters. Camping near these remote shores offers an immersive experience in one of Earth\'s wildest places.\n\n### Gear Preparation for Remote Travel\nPack windproof layers, reliable navigation tools, and water filtration devices. In remote Patagonia, emergency support is distant, so self-reliance and thorough planning are essential.',
  },
  {
    title: 'The Future of Quantum Computing and Cryptography',
    body: 'As quantum computers grow in power, the encryption standards that protect the modern internet face unprecedented challenges. This paper explains the fundamental principles of post-quantum cryptography.\n\n### Quantum Superposition and Encryption\nQuantum bits can exist in multiple states simultaneously, allowing quantum computers to solve complex mathematical problems much faster than traditional systems. This capability poses a threat to current RSA cryptography.\n\n### Transitioning to Post-Quantum Standards\nResearchers are developing new mathematical frameworks to secure data against quantum attacks. These algorithms rely on lattice-based cryptography, which remains secure for both traditional and quantum computers.\n\n### Preparing Infrastructure for the Shift\nOrganizations must update their security protocols and software libraries to support post-quantum algorithms. Preparing systems early ensures a seamless transition when quantum decryption becomes viable.',
  },
  {
    title: 'Building Inclusive User Experiences with Modern Web Accessibility',
    body: 'Web accessibility is not a compliance checklist; it is a fundamental design requirement. Making your web applications accessible ensures that individuals of all abilities can browse and interact with your content.\n\n### Semantic HTML Structure\nUse appropriate HTML tags for headers, sections, and navigation. Semantic elements allow screen readers and assistive technologies to interpret page hierarchy and structure accurately.\n\n### Keyboard Navigability\nMake sure all interactive elements can be focused and triggered using only a keyboard. This support is critical for users with motor impairments who cannot use a pointer or mouse.\n\n### Color Contrast and Visual Indicators\nProvide sufficient color contrast between text and background layers. Use clear focus borders and visual cues to guide users through states, rather than relying solely on color changes.',
  },
  {
    title: 'Mastering Remote Engineering: Collaboration in Distributed Teams',
    body: 'Remote engineering teams offer access to global talent, but successful collaboration requires intentional communication systems. Learn how to establish documentation practices that keep teams aligned.\n\n### Asynchronous Communication Protocols\nMinimize real-time meetings in favor of detailed written updates. Documenting decisions in tickets, pull requests, and design docs allows team members in different time zones to work efficiently.\n\n### Establishing Clear Ownership\nDefine ownership boundaries for code components and system modules. Clear ownership empowers developers to make decisions quickly and reduces duplicate work or friction.\n\n### Fostering Social Connection\nCreate virtual spaces for casual chats and team bonding. Building social connection increases empathy, improves trust, and strengthens collaboration across distributed teams.',
  }
];

function isLatin(str: string): boolean {
  const latinWords = ['sunt', 'facere', 'qui', 'est', 'esse', 'aut', 'eum', 'dolor', 'quia', 'suscipit', 'provident', 'voluptas'];
  const words = str.toLowerCase().split(/\s+/);
  return words.some(w => latinWords.includes(w));
}

/** Enrich a raw MockAPI post with visual metadata derived deterministically from its id */
function enrichPost(raw: Record<string, unknown>): BlogPost {
  const id = String(raw.id ?? '');
  const numId = parseInt(id, 10) || 0;

  let title = String(raw.title ?? '');
  let body = String(raw.body ?? '');

  if (numId <= 100 && (isLatin(title) || isLatin(body))) {
    const fallback = REALISTIC_ENGLISH_POSTS[numId % REALISTIC_ENGLISH_POSTS.length];
    title = fallback.title;
    body = fallback.body;
  }

  const category = (raw.category as string) || CATEGORIES[numId % CATEGORIES.length];
  const covers = COVER_IMAGES[category] ?? COVER_IMAGES.Technology;
  const coverImage = (raw.coverImage as string) || covers[numId % covers.length];
  const authorName = (raw.authorName as string) || AUTHOR_NAMES[numId % AUTHOR_NAMES.length];
  const authorAvatar = (raw.authorAvatar as string) || AUTHOR_AVATARS[numId % AUTHOR_AVATARS.length];
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


