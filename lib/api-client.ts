import axios from 'axios';
import { BlogPost, Comment, PaginatedResponse, PaginationParams, User } from './types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Fetch all blog posts
export async function fetchAllPosts(): Promise<BlogPost[]> {
  const response = await apiClient.get<BlogPost[]>('/posts');
  return response.data;
}

// Fetch a single blog post by ID
export async function fetchPostById(id: number): Promise<BlogPost | null> {
  try {
    const response = await apiClient.get<BlogPost>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

// Fetch paginated posts
export async function fetchPaginatedPosts(
  params: PaginationParams
): Promise<PaginatedResponse> {
  const allPosts = await fetchAllPosts();
  const { page, pageSize } = params;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedPosts = allPosts.slice(start, end);
  const totalPages = Math.ceil(allPosts.length / pageSize);

  return {
    posts: paginatedPosts,
    total: allPosts.length,
    page,
    pageSize,
    totalPages,
  };
}

// Search posts by title or body
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts;
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.body.toLowerCase().includes(lowerQuery)
  );
}

// Get related posts (posts by the same user, excluding the current post)
export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit: number = 3
): BlogPost[] {
  return posts
    .filter((post) => post.userId === currentPost.userId && post.id !== currentPost.id)
    .slice(0, limit);
}

// Fetch comments for a specific post
export async function fetchCommentsByPostId(postId: number): Promise<Comment[]> {
  const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
  return response.data;
}

// Submit a new comment (JSONPlaceholder returns a fake response with id: 501)
export async function submitComment(
  postId: number,
  comment: Omit<Comment, 'id' | 'postId'>
): Promise<Comment> {
  const response = await apiClient.post<Comment>(`/posts/${postId}/comments`, {
    ...comment,
    postId,
  });
  return response.data;
}

// Fetch all users
export async function fetchAllUsers(): Promise<User[]> {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
}

// Fetch a single user by ID
export async function fetchUserById(id: number): Promise<User | null> {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

// Fetch posts by a specific user
export async function fetchPostsByUserId(userId: number): Promise<BlogPost[]> {
  const response = await apiClient.get<BlogPost[]>(`/posts?userId=${userId}`);
  return response.data;
}
