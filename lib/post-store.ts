import { BlogPost, CreatePostInput, UpdatePostInput } from './types';

const STORAGE_KEY = 'blog-posts';

/**
 * Validates that a value is a valid BlogPost object with the required fields.
 */
function isValidPost(item: unknown): item is BlogPost {
  if (typeof item !== 'object' || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'number' &&
    typeof obj.userId === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.body === 'string'
  );
}

/**
 * Reads and validates blog posts from localStorage.
 * Returns an empty array on failure with a console warning.
 */
export function loadFromStorage(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      console.warn('[post-store] Stored data is not an array. Initializing with empty array.');
      return [];
    }

    if (!parsed.every(isValidPost)) {
      console.warn('[post-store] Stored data contains invalid post objects. Initializing with empty array.');
      return [];
    }

    return parsed as BlogPost[];
  } catch (error) {
    console.warn('[post-store] Failed to load posts from localStorage.', error);
    return [];
  }
}

/**
 * Writes blog posts to localStorage as JSON.
 * Logs a warning on quota exceeded or other write failures.
 */
export function saveToStorage(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('[post-store] localStorage quota exceeded. Data not persisted.');
    } else {
      console.warn('[post-store] Failed to save posts to localStorage.', error);
    }
  }
}

/**
 * Generates a unique ID for a new post.
 * Returns max(existingIds) + 1, or 1 if the array is empty.
 */
export function generateId(posts: BlogPost[]): number {
  if (posts.length === 0) {
    return 1;
  }
  const maxId = Math.max(...posts.map((p) => p.id));
  return maxId + 1;
}

/**
 * Default seed posts to pre-populate the blog when localStorage is empty.
 */
const SEED_POSTS: BlogPost[] = [
  {
    id: 1,
    userId: 1,
    title: 'Getting Started with Next.js 14',
    body: 'Next.js 14 introduces several groundbreaking features that make building web applications faster and more intuitive. The App Router has matured significantly, offering better performance with React Server Components out of the box. In this post, we explore how to set up a new project, leverage the file-based routing system, and take advantage of built-in optimizations like automatic code splitting and image optimization. Whether you are migrating from Pages Router or starting fresh, Next.js 14 provides a smooth developer experience that scales from simple blogs to enterprise applications.',
    createdAt: '2024-12-15T10:30:00.000Z',
  },
  {
    id: 2,
    userId: 2,
    title: 'Understanding TypeScript Generics',
    body: 'Generics are one of the most powerful features in TypeScript, yet many developers find them intimidating at first. At their core, generics allow you to write reusable code that works with multiple types while maintaining type safety. Think of them as type variables — placeholders that get filled in when the function or class is used. In this article, we walk through practical examples including generic functions, interfaces, and constraints. By the end, you will be comfortable creating utility types and understanding complex generic patterns found in popular libraries like React and Express.',
    createdAt: '2024-12-18T14:15:00.000Z',
  },
  {
    id: 3,
    userId: 1,
    title: 'Tailwind CSS Tips for Cleaner Components',
    body: 'Tailwind CSS gives you tremendous flexibility, but without discipline, your components can become hard to read. Here are strategies that keep your Tailwind markup clean and maintainable. First, extract repeated utility patterns into component classes using @apply sparingly. Second, leverage the cn() utility with clsx and tailwind-merge to conditionally apply classes. Third, organize your classes in a consistent order: layout, spacing, sizing, typography, colors, and effects. Finally, consider creating a design system with CSS variables for your theme tokens. These patterns will make your codebase easier to navigate and modify as your project grows.',
    createdAt: '2024-12-20T09:00:00.000Z',
  },
  {
    id: 4,
    userId: 3,
    title: 'Building Accessible Web Forms',
    body: 'Accessibility in web forms is not just about compliance — it is about ensuring every user can interact with your application effectively. Start with semantic HTML: use proper label elements linked with htmlFor, group related fields with fieldset and legend, and use the correct input types. Add aria-describedby for error messages and aria-invalid for fields in an error state. Keyboard navigation should work naturally with Tab order following visual order. Screen readers should announce field names, requirements, and errors clearly. Test with actual assistive technologies like NVDA or VoiceOver rather than relying solely on automated checks.',
    createdAt: '2025-01-02T11:45:00.000Z',
  },
  {
    id: 5,
    userId: 4,
    title: 'The Power of localStorage for Client-Side Apps',
    body: 'localStorage provides a simple yet effective way to persist data in the browser without a backend. It stores up to 5-10MB of string data per origin, survives page refreshes and browser restarts, and has a synchronous API that is easy to work with. For small-to-medium applications like note-taking apps, bookmark managers, or blog platforms, localStorage is often all you need. However, be aware of its limitations: no expiration mechanism, same-origin restriction, blocking synchronous reads on large datasets, and vulnerability to XSS if you store sensitive data. For larger datasets, consider IndexedDB instead.',
    createdAt: '2025-01-05T16:20:00.000Z',
  },
  {
    id: 6,
    userId: 5,
    title: 'React State Management in 2025',
    body: 'The React state management landscape has evolved considerably. While Redux remains popular for large applications, many teams are finding simpler alternatives sufficient for their needs. React Context with useReducer handles moderate complexity well. Zustand offers a lightweight API with minimal boilerplate. Jotai provides atomic state management that scales naturally. For server state, TanStack Query (React Query) has become the de facto standard, separating server cache from UI state. The key insight is that most applications do not need a single global store — they need the right tool for each category of state: local UI state, shared client state, and server-synchronized state.',
    createdAt: '2025-01-08T08:30:00.000Z',
  },
  {
    id: 7,
    userId: 2,
    title: 'Writing Clean Commit Messages',
    body: 'Good commit messages are a form of documentation that your future self and teammates will thank you for. Follow the conventional commits format: a type prefix (feat, fix, docs, refactor), an optional scope, and a concise description in imperative mood. The subject line should be under 72 characters. Use the body to explain why a change was made, not what was changed — the diff shows that. Reference issue numbers when applicable. Avoid vague messages like "fix bug" or "update code." Instead, write "fix: prevent duplicate form submission on slow networks." This discipline pays dividends during code reviews, debugging, and changelog generation.',
    createdAt: '2025-01-10T13:00:00.000Z',
  },
  {
    id: 8,
    userId: 6,
    title: 'Deploying Next.js Apps on Vercel',
    body: 'Vercel is the platform built by the creators of Next.js, making it the most seamless deployment target. Connect your GitHub repository, and every push to main triggers a production deployment. Preview deployments are created for every pull request, giving reviewers a live URL to test. Environment variables are managed through the dashboard with support for development, preview, and production scopes. Edge Functions run your API routes close to users globally. Analytics provide real-user performance metrics out of the box. The free tier is generous for personal projects, and scaling is automatic as traffic grows. No infrastructure management required.',
    createdAt: '2025-01-12T10:00:00.000Z',
  },
  {
    id: 9,
    userId: 3,
    title: 'CSS Grid vs Flexbox: When to Use Each',
    body: 'Both CSS Grid and Flexbox are essential layout tools, but they excel in different scenarios. Flexbox is one-dimensional — ideal for navigation bars, card rows, and aligning items along a single axis. Grid is two-dimensional — perfect for page layouts, dashboards, and complex arrangements where you need control over both rows and columns simultaneously. A practical rule: if your layout is primarily a row or column of items, use Flexbox. If you are placing items in a defined grid structure, use Grid. They also compose beautifully together — a Grid layout can contain Flex containers as children, giving you the best of both worlds.',
    createdAt: '2025-01-14T15:30:00.000Z',
  },
  {
    id: 10,
    userId: 7,
    title: 'Introduction to Property-Based Testing',
    body: 'Traditional unit tests verify specific examples, but property-based tests verify that properties hold for all valid inputs. Instead of writing test cases by hand, you describe the characteristics your code should maintain, and the testing framework generates hundreds of random inputs to verify them. Libraries like fast-check for JavaScript or Hypothesis for Python make this approachable. For example, testing a sort function: the output length should equal input length, every element in the output should exist in the input, and each element should be less than or equal to the next. When a property fails, the framework shrinks the input to the minimal failing case, making debugging straightforward.',
    createdAt: '2025-01-16T09:45:00.000Z',
  },
  {
    id: 11,
    userId: 4,
    title: 'Dark Mode Done Right',
    body: 'Implementing dark mode goes beyond swapping background colors. A well-designed dark theme reduces eye strain, saves battery on OLED screens, and respects user preferences. Start by detecting the system preference with prefers-color-scheme media query. Use CSS custom properties for your color tokens so switching themes is a single class toggle on the root element. Design your dark palette with reduced contrast — pure white on pure black is harsh. Use elevated surfaces (slightly lighter backgrounds) to convey depth instead of shadows. Test your color combinations for WCAG contrast ratios. Store the user preference in localStorage so it persists across sessions.',
    createdAt: '2025-01-18T12:00:00.000Z',
  },
  {
    id: 12,
    userId: 8,
    title: 'API Design Best Practices for REST',
    body: 'A well-designed REST API is predictable, consistent, and easy to consume. Use nouns for resource endpoints (users, posts, comments) and HTTP verbs for actions (GET, POST, PUT, DELETE). Return appropriate status codes: 200 for success, 201 for created, 400 for bad request, 404 for not found, 500 for server errors. Implement pagination for list endpoints using limit and offset or cursor-based pagination. Version your API in the URL path (v1, v2) for breaking changes. Provide filtering and sorting via query parameters. Document with OpenAPI/Swagger. Rate limit to prevent abuse. These conventions make your API intuitive for consumers without needing extensive documentation.',
    createdAt: '2025-01-20T14:30:00.000Z',
  },
];

/**
 * Seeds the store with default posts if localStorage is empty.
 * Called automatically on first getAllPosts() when no data exists.
 */
function seedIfEmpty(): BlogPost[] {
  const posts = loadFromStorage();
  if (posts.length === 0) {
    saveToStorage(SEED_POSTS);
    return [...SEED_POSTS];
  }
  return posts;
}

/**
 * Retrieves all blog posts from localStorage.
 * Seeds with sample posts on first load if the store is empty.
 */
export function getAllPosts(): BlogPost[] {
  return seedIfEmpty();
}

/**
 * Retrieves a single blog post by ID, or null if not found.
 */
export function getPostById(id: number): BlogPost | null {
  const posts = loadFromStorage();
  return posts.find((p) => p.id === id) ?? null;
}

/**
 * Creates a new blog post, persists it, and returns the created post.
 */
export function createPost(data: CreatePostInput): BlogPost {
  const posts = loadFromStorage();
  const newPost: BlogPost = {
    id: generateId(posts),
    userId: data.userId ?? 1,
    title: data.title,
    body: data.body,
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  saveToStorage(posts);
  return newPost;
}

/**
 * Updates an existing blog post by ID.
 * Returns the updated post, or null if not found.
 */
export function updatePost(id: number, data: UpdatePostInput): BlogPost | null {
  const posts = loadFromStorage();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return null;
  }

  const existing = posts[index];
  const updated: BlogPost = {
    ...existing,
    ...(data.title !== undefined && { title: data.title }),
    ...(data.body !== undefined && { body: data.body }),
    updatedAt: new Date().toISOString(),
  };
  posts[index] = updated;
  saveToStorage(posts);
  return updated;
}

/**
 * Deletes a blog post by ID.
 * Returns true if the post was found and removed, false otherwise.
 */
export function deletePost(id: number): boolean {
  const posts = loadFromStorage();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }
  posts.splice(index, 1);
  saveToStorage(posts);
  return true;
}

/**
 * Filters posts by case-insensitive substring matching on title and body.
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) {
    return posts;
  }
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.body.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Returns posts by the same userId as the current post, excluding the current post.
 * Optionally limited to a maximum number of results.
 */
export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit?: number
): BlogPost[] {
  const related = posts.filter(
    (post) => post.userId === currentPost.userId && post.id !== currentPost.id
  );
  if (limit !== undefined && limit >= 0) {
    return related.slice(0, limit);
  }
  return related;
}
