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
 * Retrieves all blog posts from localStorage.
 */
export function getAllPosts(): BlogPost[] {
  return loadFromStorage();
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
