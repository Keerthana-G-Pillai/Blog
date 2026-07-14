export interface BlogPost {
  id: string;
  userId: number;
  title: string;
  body: string;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  coverImage?: string;
  readTime?: number;
  authorName?: string;
  authorAvatar?: string;
  excerpt?: string;
  featured?: boolean;
  views?: number;
  likes?: number;
  tags?: string[];
}

export interface CreatePostInput {
  title: string;
  body: string;
  category?: string;
  userId?: number;
  coverImage?: string;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  body?: string;
  category?: string;
  views?: number;
  likes?: number;
  tags?: string[];
  coverImage?: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface BookmarkState {
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
//...