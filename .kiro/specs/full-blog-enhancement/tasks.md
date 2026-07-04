# Implementation Plan: Full Blog Enhancement

## Overview

This plan extends the existing Next.js blog viewer into a full-featured blog platform. Tasks are ordered by dependency: foundational types and utilities first, then context providers, then components, then pages/routes, and finally SEO and polish. The project uses TypeScript, Next.js App Router, SWR, Tailwind CSS, Axios, and lucide-react icons.

## Tasks

- [x] 1. Extend types and API client
  - [x] 1.1 Add Comment and User types to `lib/types.ts`
    - Add `Comment` interface (postId, id, name, email, body)
    - Add `User` interface (id, name, username, email, address, phone, website, company)
    - Add `BookmarkState` and `ThemeState` interfaces
    - _Requirements: 1.1, 1.2, 2.1, 2.2_

  - [x] 1.2 Add new API client functions to `lib/api-client.ts`
    - Implement `fetchCommentsByPostId(postId: number)` — GET `/posts/{id}/comments`
    - Implement `submitComment(postId, comment)` — POST `/posts/{id}/comments`
    - Implement `fetchAllUsers()` — GET `/users`
    - Implement `fetchUserById(id: number)` — GET `/users/{id}`
    - Implement `fetchPostsByUserId(userId: number)` — GET `/posts?userId={id}`
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3_

  - [ ]* 1.3 Write property tests for API utility functions
    - **Property 6: Filter by author shows only matching posts**
    - **Validates: Requirements 2.3, 3.2**
    - Test that filtering posts by userId returns only posts with that userId and excludes none

- [x] 2. Create context providers
  - [x] 2.1 Create `ThemeProvider` in `contexts/theme-context.tsx`
    - Implement React Context with `theme` state ('light' | 'dark')
    - Read initial value from `localStorage` key `blog-theme`
    - On toggle, persist new value to `localStorage` and toggle `dark` class on `<html>`
    - Export `useTheme` hook
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 2.2 Write property tests for ThemeProvider logic
    - **Property 13: Theme toggle is self-inverse**
    - **Validates: Requirements 8.2**
    - **Property 14: Theme persistence round-trip**
    - **Validates: Requirements 8.3, 8.4**

  - [x] 2.3 Create `BookmarkProvider` in `contexts/bookmark-context.tsx`
    - Implement React Context managing `bookmarkedIds: number[]`
    - Read initial value from `localStorage` key `blog-bookmarks`
    - Provide `addBookmark`, `removeBookmark`, `isBookmarked`, `toggleBookmark` functions
    - Sync state to `localStorage` on every change
    - Export `useBookmarks` hook
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 2.4 Write property tests for BookmarkProvider logic
    - **Property 10: Bookmark toggle round-trip**
    - **Validates: Requirements 6.1, 6.3**
    - **Property 11: Bookmark state reflection in UI**
    - **Validates: Requirements 6.2**

- [x] 3. Wire providers into layout
  - [x] 3.1 Modify `app/layout.tsx` to wrap children with ThemeProvider and BookmarkProvider
    - Convert layout body to use a client wrapper component that applies providers
    - Ensure `<html>` element gets `dark` class based on theme state
    - _Requirements: 8.2, 8.4, 6.1_

- [x] 4. Checkpoint
  - Ensure the app builds without errors (`next build` or `next dev`), ask the user if questions arise.

- [x] 5. Create shared UI components
  - [x] 5.1 Create `DarkModeToggle` component in `components/dark-mode-toggle.tsx`
    - Render sun/moon icon using lucide-react
    - Use `useTheme` context hook to read and toggle theme
    - _Requirements: 8.1, 8.2_

  - [x] 5.2 Create `BookmarkButton` component in `components/bookmark-button.tsx`
    - Render filled/outline bookmark icon based on `isBookmarked` state from context
    - Call `toggleBookmark` on click
    - Accept `postId` prop
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 5.3 Create `Breadcrumb` component in `components/breadcrumb.tsx`
    - Accept `items: { label: string; href?: string }[]` prop
    - Render chevron-separated links; last item is plain text (current page)
    - _Requirements: 4.2, 4.3_

  - [ ]* 5.4 Write property tests for Breadcrumb path generation
    - **Property 8: Breadcrumb path generation**
    - **Validates: Requirements 4.2, 4.3**

  - [x] 5.5 Create `ReadingProgress` component in `components/reading-progress.tsx`
    - Fixed bar at top of viewport
    - Calculate scroll percentage: `scrollY / (documentHeight - viewportHeight) * 100`
    - Clamp between 0 and 100
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 5.6 Write property tests for reading progress calculation
    - **Property 9: Reading progress bounds and proportionality**
    - **Validates: Requirements 5.1, 5.2, 5.3**

  - [x] 5.7 Create `ShareButtons` component in `components/share-buttons.tsx`
    - Accept `title` and `url` props
    - Render Copy Link, Twitter/X, and LinkedIn share buttons
    - Copy Link: use `navigator.clipboard.writeText`, show confirmation toast
    - Twitter: open `https://twitter.com/intent/tweet?text={title}&url={url}`
    - LinkedIn: open `https://www.linkedin.com/sharing/share-offsite/?url={url}`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 5.8 Write property tests for share URL generation
    - **Property 12: Share URL generation contains required data**
    - **Validates: Requirements 7.3, 7.4**

  - [x] 5.9 Create skeleton components
    - Create `components/skeleton-card.tsx` — animated shimmer card placeholder matching blog card layout
    - Create `components/skeleton-post.tsx` — placeholder for post detail page
    - Create `components/skeleton-user.tsx` — placeholder for user profile layout
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 6. Create comment components
  - [x] 6.1 Create `CommentList` component in `components/comment-list.tsx`
    - Use SWR to fetch comments via `fetchCommentsByPostId`
    - Render each comment showing name, email, and body
    - Accept `postId` prop
    - _Requirements: 1.1, 1.2_

  - [ ]* 6.2 Write property tests for comment rendering
    - **Property 1: Comment rendering completeness**
    - **Validates: Requirements 1.2**

  - [x] 6.3 Create `CommentForm` component in `components/comment-form.tsx`
    - Form with name, email, and body fields
    - Client-side validation: reject empty/whitespace-only required fields
    - On valid submit: call `submitComment` API, add comment optimistically to list via SWR `mutate`
    - Show validation errors inline
    - _Requirements: 1.3, 1.4, 1.5_

  - [ ]* 6.4 Write property tests for comment form validation
    - **Property 2: Optimistic comment addition**
    - **Validates: Requirements 1.4**
    - **Property 3: Comment validation rejects invalid input**
    - **Validates: Requirements 1.5**

- [x] 7. Create author filter component
  - [x] 7.1 Create `AuthorFilter` component in `components/author-filter.tsx`
    - Fetch users list via SWR (`fetchAllUsers`)
    - Render filter chips or dropdown with author names
    - Accept `onFilterChange(userId: number | null)` callback
    - Visually highlight selected author
    - Include a "Clear filter" option
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 7.2 Write property tests for filter logic
    - **Property 6: Filter by author shows only matching posts** (shared with 1.3)
    - **Property 7: Clear filter restores full post list**
    - **Validates: Requirements 3.2, 3.4**

- [x] 8. Checkpoint
  - Ensure the app builds without errors and all new components render correctly in isolation. Ask the user if questions arise.

- [x] 9. Update existing components and pages
  - [x] 9.1 Update `Header` component
    - Add navigation links: Home (`/`), Users (`/users`), Bookmarks (`/bookmarks`), About (`/about`)
    - Add `DarkModeToggle` to the header
    - _Requirements: 4.1, 8.1_

  - [x] 9.2 Update `BlogCard` component
    - Add `BookmarkButton` to each card
    - Make the author name ("User {userId}") a clickable link to `/users/{userId}`
    - _Requirements: 2.4, 6.1, 6.2_

  - [ ]* 9.3 Write property tests for author link correctness
    - **Property 5: Author link correctness**
    - **Validates: Requirements 2.4**

  - [x] 9.4 Update homepage (`app/page.tsx`)
    - Add `AuthorFilter` above the post grid
    - Integrate author filtering with existing search/pagination logic
    - Replace spinner loading state with `SkeletonCard` grid
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 10.1_

  - [x] 9.5 Update blog post detail page (`app/blog/[id]/page.tsx`)
    - Add `ReadingProgress` bar
    - Add `Breadcrumb` with path: Home > Blog > [Post Title]
    - Add `ShareButtons` below the article content
    - Add `CommentList` and `CommentForm` below the article
    - Make author badge a link to `/users/{userId}`
    - Add JSON-LD structured data (`<script type="application/ld+json">`) with article schema
    - _Requirements: 1.1, 4.2, 5.1, 7.1, 9.1_

  - [ ]* 9.6 Write property tests for JSON-LD structured data
    - **Property 15: JSON-LD structured data completeness**
    - **Validates: Requirements 9.1**

- [x] 10. Create new pages/routes
  - [x] 10.1 Create Users list page at `app/users/page.tsx`
    - Fetch all users with SWR
    - Display user cards in a grid (name, email, company)
    - Each card links to `/users/{id}`
    - Show `SkeletonUser` during loading
    - _Requirements: 2.1, 10.3_

  - [x] 10.2 Create User profile page at `app/users/[id]/page.tsx`
    - Fetch user by ID and their posts
    - Display user info: name, email, phone, website, company name, address city
    - Display user's posts in a grid using `BlogCard`
    - Add `Breadcrumb` with path: Home > Users > [User Name]
    - Show `SkeletonUser` during loading
    - _Requirements: 2.2, 2.3, 4.3, 10.3_

  - [ ]* 10.3 Write property tests for user profile rendering
    - **Property 4: User profile rendering completeness**
    - **Validates: Requirements 2.2**

  - [x] 10.4 Create Bookmarks page at `app/bookmarks/page.tsx`
    - Read bookmarked IDs from `useBookmarks` context
    - Fetch each bookmarked post by ID (or batch via SWR)
    - Display posts in a grid using `BlogCard`
    - Show empty state message when no bookmarks exist
    - _Requirements: 6.4, 6.5_

  - [x] 10.5 Create About page at `app/about/page.tsx`
    - Static page with platform information
    - _Requirements: 4.4_

- [x] 11. SEO — Sitemap and Robots
  - [x] 11.1 Create sitemap route at `app/sitemap.ts`
    - Export default function returning `MetadataRoute.Sitemap`
    - Fetch all posts and users to generate URLs: `/blog/{id}` and `/users/{id}`
    - Include homepage, `/users`, `/about`, `/bookmarks`
    - _Requirements: 9.2_

  - [ ]* 11.2 Write property tests for sitemap URL coverage
    - **Property 16: Sitemap URL coverage**
    - **Validates: Requirements 9.2**

  - [x] 11.3 Create robots route at `app/robots.ts`
    - Export default function returning `MetadataRoute.Robots`
    - Allow all user agents on all public paths
    - Reference sitemap URL
    - _Requirements: 9.3_

- [x] 12. Final checkpoint
  - Ensure `next build` succeeds with no errors
  - Verify all new routes are accessible: `/users`, `/users/1`, `/bookmarks`, `/about`
  - Verify dark mode toggle persists across page reloads
  - Verify bookmarks persist across page reloads
  - Verify comments load on blog post pages
  - Ask the user if questions arise.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "name": "Foundation",
      "tasks": ["1.1", "1.2"]
    },
    {
      "name": "Context & State",
      "tasks": ["2.1", "2.3", "3.1"],
      "dependsOn": ["1.1"]
    },
    {
      "name": "UI Components",
      "tasks": ["5.1", "5.2", "5.3", "5.5", "5.7", "5.9", "6.1", "6.3", "7.1"],
      "dependsOn": ["2.1", "2.3", "1.2"]
    },
    {
      "name": "Integrate into Existing Pages",
      "tasks": ["9.1", "9.2", "9.4", "9.5"],
      "dependsOn": ["5.1", "5.2", "5.3", "5.5", "5.7", "5.9", "6.1", "6.3", "7.1"]
    },
    {
      "name": "New Pages",
      "tasks": ["10.1", "10.2", "10.4", "10.5"],
      "dependsOn": ["9.1", "9.2"]
    },
    {
      "name": "SEO & Final",
      "tasks": ["11.1", "11.3"],
      "dependsOn": ["10.1", "10.2"]
    }
  ]
}
```

## Notes

- Tasks marked with `*` are optional property-based test tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The project already uses TypeScript, SWR, Tailwind CSS, and lucide-react — no new major dependencies needed
- Checkpoints ensure incremental validation between major phases
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
