export interface BlogPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
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

export interface BookmarkState {
  bookmarkedIds: number[];
  addBookmark: (postId: number) => void;
  removeBookmark: (postId: number) => void;
  isBookmarked: (postId: number) => boolean;
  toggleBookmark: (postId: number) => void;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
