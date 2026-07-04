# Requirements Document

## Introduction

This document specifies the requirements for transforming an existing Next.js 16 blog skeleton into a full-featured blog application. The application consumes the JSONPlaceholder API for posts, comments, and user data, and uses localStorage for client-side persistence features. The enhancement covers 15 feature areas: category/tag filtering, comments, user profiles, bookmarks, reading progress, sharing, dark mode toggle, table of contents, reading time, newsletter subscription, sort options, responsive navigation, SEO improvements, loading skeletons, and toast notifications.

## Glossary

- **Blog_App**: The Next.js 16 blog application consuming JSONPlaceholder API data
- **Post_List_Page**: The home page displaying paginated blog posts with search and filtering
- **Post_Detail_Page**: The individual blog post page showing full content and related features
- **Comment_Section**: The UI area on Post_Detail_Page displaying and allowing submission of comments
- **User_Profile_Page**: A dedicated page showing author information and their posts
- **Category_Filter**: A UI control allowing users to filter posts by assigned category
- **Sort_Control**: A UI control allowing users to change the ordering of posts
- **Bookmark_Manager**: The client-side system managing saved posts in localStorage
- **Reading_Progress_Indicator**: A visual bar showing scroll progress through a post
- **Share_Panel**: A UI component offering social media sharing and link copying
- **Theme_Toggle**: A UI control for switching between light and dark color modes
- **Table_Of_Contents**: A navigable outline generated from post content structure
- **Newsletter_Form**: A UI form for email subscription with mock submission
- **Toast_System**: A notification system providing transient feedback messages
- **Navigation_Menu**: The responsive header navigation with mobile hamburger support
- **Skeleton_Loader**: A placeholder UI component displayed while content loads
- **LocalStorage_Service**: An abstraction layer for reading and writing localStorage data

## Requirements

### Requirement 1: Category and Tag Filtering

**User Story:** As a reader, I want to filter blog posts by category or tag, so that I can quickly find content relevant to my interests.

#### Acceptance Criteria

1. THE Blog_App SHALL assign each post a deterministic category derived from the post userId field using the following mapping: userId 1-2 → "Technology", userId 3-4 → "Lifestyle", userId 5-6 → "Science", userId 7-8 → "Business", userId 9-10 → "Health"
2. THE Blog_App SHALL assign each post a set of tags by extracting words from the post title that are 5 or more characters long, lowercased, and deduplicated
3. WHEN a user selects a category from the Category_Filter, THE Post_List_Page SHALL display only posts belonging to the selected category and reset pagination to page 1
4. WHEN a user selects a tag, THE Post_List_Page SHALL display only posts containing the selected tag and reset pagination to page 1
5. WHEN a category or tag filter is active, THE Post_List_Page SHALL display the active filter as a chip with an option to clear it
6. WHEN a filter is cleared, THE Post_List_Page SHALL return to displaying all posts respecting existing search and sort state
7. WHEN both a category filter and a search query are active simultaneously, THE Post_List_Page SHALL display posts matching both the selected category AND the search query

### Requirement 2: Comments System

**User Story:** As a reader, I want to view and add comments on blog posts, so that I can engage in discussion with other readers.

#### Acceptance Criteria

1. WHEN a user navigates to the Post_Detail_Page, THE Comment_Section SHALL fetch and display comments from the JSONPlaceholder /posts/{id}/comments endpoint in reverse chronological order (newest comment displayed first based on comment ID descending)
2. THE Comment_Section SHALL display each comment with the commenter name, email, and comment body in a card layout
3. WHEN a user submits a new comment via the comment form, THE Comment_Section SHALL POST the comment to the JSONPlaceholder /comments endpoint and display the new comment optimistically at the top of the list
4. IF the comment submission POST request fails, THEN THE Toast_System SHALL display an error message and THE Comment_Section SHALL remove the optimistically added comment from the displayed list
5. THE Comment_Section SHALL validate that the name field is non-empty (minimum 2 characters), the email field matches a standard email format, and the body field is non-empty (minimum 10 characters) before enabling the submit button
6. WHILE comments are loading, THE Comment_Section SHALL display Skeleton_Loader placeholders matching the comment card layout
7. IF the comment fetch request fails, THEN THE Comment_Section SHALL display an error message with a retry button that re-attempts the fetch

### Requirement 3: User Profiles

**User Story:** As a reader, I want to view author profiles and browse their posts, so that I can discover more content from writers I enjoy.

#### Acceptance Criteria

1. WHEN a user clicks an author name or avatar on a post, THE Blog_App SHALL navigate to the User_Profile_Page at the route /user/{userId} for that author
2. THE User_Profile_Page SHALL fetch and display user details from the JSONPlaceholder /users/{id} endpoint including name, email, company name, and website displayed as a clickable link
3. THE User_Profile_Page SHALL display all posts authored by the selected user, ordered by post ID descending, each rendered as a navigable card showing the post title and an excerpt of the body truncated to 130 characters
4. WHILE the User_Profile_Page data is loading, THE Blog_App SHALL display Skeleton_Loader placeholders in place of the user details section and the posts list section
5. IF the user ID does not exist or the /users/{id} endpoint returns a 404 response, THEN THE User_Profile_Page SHALL display a not-found message and a link that navigates back to the Post_List_Page
6. IF the API request to fetch user details or user posts fails due to a network error or timeout, THEN THE User_Profile_Page SHALL display an error message indicating the data could not be loaded and provide a retry action that re-attempts the failed request

### Requirement 4: Bookmarks and Favorites

**User Story:** As a reader, I want to bookmark posts for later reading, so that I can easily return to interesting articles.

#### Acceptance Criteria

1. THE Blog_App SHALL display a bookmark toggle button on each blog post card and on the Post_Detail_Page, with an accessible label indicating the current bookmark state
2. WHEN a user clicks the bookmark button on an unbookmarked post, THE Bookmark_Manager SHALL save the post ID to localStorage and THE Toast_System SHALL display a confirmation message indicating the post was bookmarked, visible for 3 seconds
3. WHEN a user clicks the bookmark button on a bookmarked post, THE Bookmark_Manager SHALL remove the post ID from localStorage and THE Toast_System SHALL display a message indicating the post was removed from bookmarks, visible for 3 seconds
4. THE Blog_App SHALL provide a dedicated bookmarks page at the /bookmarks route displaying all bookmarked posts in a grid layout, and SHALL display an empty state message when no posts are bookmarked
5. THE Blog_App SHALL visually distinguish bookmarked posts from non-bookmarked posts using a filled icon state for bookmarked and an outline icon state for non-bookmarked
6. IF localStorage is unavailable, THEN THE Bookmark_Manager SHALL disable all bookmark toggle buttons and display a tooltip on each button explaining that bookmark functionality requires localStorage
7. WHEN a user navigates to the bookmarks page, THE Blog_App SHALL fetch post data from the JSONPlaceholder API filtered by the stored post IDs and SHALL display a loading indicator while the fetch is in progress

### Requirement 5: Reading Progress Indicator

**User Story:** As a reader, I want to see my reading progress on a post, so that I know how much of the article remains.

#### Acceptance Criteria

1. WHILE a user scrolls through the Post_Detail_Page, THE Reading_Progress_Indicator SHALL display a fixed-position horizontal progress bar at the top of the viewport that does not affect the document flow or cause layout shifts (0 Cumulative Layout Shift contribution)
2. WHEN the Post_Detail_Page loads, THE Reading_Progress_Indicator SHALL display 0% progress if the article content extends beyond the viewport, or 100% progress if the entire article content fits within the viewport
3. THE Reading_Progress_Indicator SHALL calculate progress as the percentage of the article element (from its top edge to its bottom edge) that has scrolled past the top of the viewport, clamped between 0% and 100%
4. THE Reading_Progress_Indicator SHALL update the displayed progress on each scroll event within a single animation frame, reflecting both forward and backward scroll direction changes
5. WHEN the bottom edge of the article element scrolls to or above the bottom of the viewport, THE Reading_Progress_Indicator SHALL show 100% completion

### Requirement 6: Share Functionality

**User Story:** As a reader, I want to share blog posts via social media or by copying the link, so that I can recommend articles to others.

#### Acceptance Criteria

1. THE Post_Detail_Page SHALL display a Share_Panel with options to share via Twitter, Facebook, LinkedIn, and copy link
2. WHEN a user clicks the Twitter share button, THE Share_Panel SHALL open a new window (width 550px, height 420px) to https://twitter.com/intent/tweet with the post title and URL as query parameters
3. WHEN a user clicks the Facebook share button, THE Share_Panel SHALL open a new window (width 550px, height 420px) to https://www.facebook.com/sharer/sharer.php with the post URL as the u parameter
4. WHEN a user clicks the LinkedIn share button, THE Share_Panel SHALL open a new window (width 550px, height 420px) to https://www.linkedin.com/sharing/share-offsite/ with the post URL as the url parameter
5. WHEN a user clicks the copy link button, THE Share_Panel SHALL copy the post URL to the clipboard using navigator.clipboard.writeText() and THE Toast_System SHALL display a "Link copied!" confirmation message
6. IF the clipboard API is unavailable (navigator.clipboard is undefined), THEN THE Share_Panel SHALL display a read-only text input containing the URL with the text pre-selected for manual copying

### Requirement 7: Dark Mode Toggle

**User Story:** As a reader, I want to manually switch between light and dark themes, so that I can choose my preferred reading experience regardless of system settings.

#### Acceptance Criteria

1. THE Navigation_Menu SHALL display a Theme_Toggle button that is visible without opening a submenu on all pages
2. WHEN a user clicks the Theme_Toggle, THE Blog_App SHALL toggle the 'dark' class on the html element, switching all dark:-prefixed styles between light and dark color modes within 100ms of the click
3. WHEN a user clicks the Theme_Toggle, THE Blog_App SHALL persist the selected theme value ('light' or 'dark') to the localStorage key 'theme'
4. WHEN a user loads the Blog_App with a stored theme preference, THE Blog_App SHALL apply the stored preference by setting the html class before the first content paint to prevent a flash of incorrect theme
5. WHEN no stored preference exists, THE Blog_App SHALL default to the system color scheme preference via prefers-color-scheme media query
6. THE Theme_Toggle SHALL display a sun icon when dark mode is active (indicating switch to light) and a moon icon when light mode is active (indicating switch to dark)
7. IF the stored theme value in localStorage is neither 'light' nor 'dark', THEN THE Blog_App SHALL discard the invalid value and fall back to the system color scheme preference

### Requirement 8: Table of Contents

**User Story:** As a reader, I want to see a table of contents for longer articles, so that I can navigate to specific sections quickly.

#### Acceptance Criteria

1. WHEN a post body contains 3 or more paragraph sections (separated by double newlines "\n\n"), THE Post_Detail_Page SHALL generate a Table_Of_Contents sidebar listing all identified sections
2. IF a post body contains fewer than 3 paragraph sections, THEN THE Post_Detail_Page SHALL NOT display a Table_Of_Contents sidebar
3. THE Table_Of_Contents SHALL list section headings derived from the first sentence (terminated by a period, question mark, exclamation mark, or end of paragraph) of each paragraph, truncated to a maximum of 60 characters with an ellipsis appended if the sentence exceeds that length
4. WHEN a user clicks a Table_Of_Contents entry, THE Post_Detail_Page SHALL smooth-scroll to position the corresponding section at the top of the viewport
5. WHILE the user scrolls, THE Table_Of_Contents SHALL highlight the entry whose corresponding section is currently intersecting the viewport (using the topmost visible section if multiple sections are visible)
6. THE Table_Of_Contents SHALL be hidden on viewports 1024px wide or narrower and displayed as a fixed-position sidebar on viewports wider than 1024px

### Requirement 9: Enhanced Reading Time

**User Story:** As a reader, I want to see an accurate estimated reading time for each post, so that I can decide whether to read it now or save it for later.

#### Acceptance Criteria

1. THE Blog_App SHALL calculate reading time by splitting the post body by whitespace to count words, dividing by 200, and rounding up to the nearest integer
2. THE Blog_App SHALL display the estimated reading time on each blog post card on the Post_List_Page with a clock icon
3. THE Blog_App SHALL display the estimated reading time in the Post_Detail_Page header
4. THE Blog_App SHALL format reading time as "X min read" with a minimum display of "1 min read" for posts with fewer than 200 words

### Requirement 10: Newsletter Subscription

**User Story:** As a site visitor, I want to subscribe to a newsletter, so that I can receive updates about new content.

#### Acceptance Criteria

1. THE Blog_App SHALL display a Newsletter_Form in the footer area and optionally on the Post_List_Page
2. THE Newsletter_Form SHALL accept an email address input with a maximum length of 254 characters and validate the email format using a standard regex pattern before submission
3. WHILE the Newsletter_Form is submitting, THE Newsletter_Form SHALL display a loading state with the submit button disabled for the duration of the 1-second simulated delay
4. WHEN a user submits a valid email address, THE Newsletter_Form SHALL simulate a successful subscription after a 1-second delay and THE Toast_System SHALL display a success message
5. IF the email format is invalid or the email input is empty at the time of submission, THEN THE Newsletter_Form SHALL display an inline validation error message below the email input field indicating the expected format
6. WHEN a subscription succeeds, THE Newsletter_Form SHALL store the email in localStorage under the key 'newsletter_email' to prevent duplicate submissions
7. IF the localStorage key 'newsletter_email' already contains a value when the Newsletter_Form renders, THEN THE Newsletter_Form SHALL display an "already subscribed" state showing the stored email and hiding the submit button and email input

### Requirement 11: Sort Options

**User Story:** As a reader, I want to sort blog posts by different criteria, so that I can find posts in my preferred order.

#### Acceptance Criteria

1. THE Post_List_Page SHALL display a Sort_Control with options: Default (by ID ascending), Title (A-Z) (alphabetical ascending, case-insensitive), Title (Z-A) (alphabetical descending, case-insensitive), Author (by userId ascending), and Post Length (by body character count descending)
2. WHEN a user selects a sort option, THE Post_List_Page SHALL reorder the displayed posts according to the selected criteria and reset the current page to page 1
3. WHEN a pagination change occurs, THE Sort_Control SHALL maintain the currently selected sort option
4. WHILE a search query is active, THE Sort_Control SHALL apply the selected sorting to the filtered result set
5. WHEN the Post_List_Page loads for the first time, THE Sort_Control SHALL have "Default (by ID)" selected as the initial sort option
6. WHEN two or more posts have equal values for the selected sort field, THE Post_List_Page SHALL use post ID ascending as a secondary sort to maintain a stable order

### Requirement 12: Responsive Navigation

**User Story:** As a mobile user, I want a responsive navigation menu, so that I can easily access all sections of the blog on any device.

#### Acceptance Criteria

1. THE Navigation_Menu SHALL display a hamburger icon button on viewports of 767px width or narrower, and SHALL set aria-expanded="false" on the button when the overlay is closed
2. WHEN a user taps the hamburger icon, THE Navigation_Menu SHALL display a full-screen overlay menu containing navigation links and SHALL set aria-expanded="true" on the hamburger button
3. THE Navigation_Menu SHALL include links to: Home and Bookmarks
4. WHILE the overlay menu is open, THE Navigation_Menu SHALL trap focus within the overlay so that Tab and Shift+Tab cycle only through focusable elements inside the menu
5. WHEN a user selects a navigation link, OR presses the Escape key, OR activates a close button within the overlay, THE Navigation_Menu SHALL close the overlay within 300ms and return focus to the hamburger icon button
6. THE Navigation_Menu SHALL display navigation links inline (horizontally) on viewports of 768px width or wider, with no hamburger icon visible

### Requirement 13: SEO Improvements

**User Story:** As a site owner, I want improved SEO metadata and structured data, so that search engines can better index and display the blog content.

#### Acceptance Criteria

1. THE Blog_App SHALL include a JSON-LD structured data block of type BlogPosting on each Post_Detail_Page containing at minimum the following schema.org properties: @type, headline, author (with @type Person and name), datePublished (ISO 8601 format), and mainEntityOfPage with the canonical URL of the post
2. THE Blog_App SHALL include a JSON-LD structured data block of type Blog on the Post_List_Page containing at minimum the following schema.org properties: @type, name, and description
3. THE Blog_App SHALL generate Open Graph meta tags (og:title, og:description, og:type, og:url) for each page, where og:description is truncated to a maximum of 160 characters and og:url is the absolute canonical URL of the page
4. THE Blog_App SHALL include a canonical URL link element on all pages, where the canonical URL is an absolute URL matching the page's publicly accessible address
5. THE User_Profile_Page SHALL include a JSON-LD structured data block of type Person for the author containing at minimum the following schema.org properties: @type, name, and url
6. THE Blog_App SHALL render all JSON-LD structured data within a script element with type attribute set to "application/ld+json" and the content SHALL be valid JSON parseable without errors

### Requirement 14: Loading Skeletons

**User Story:** As a reader, I want to see skeleton loading states while content loads, so that I have a smooth visual experience and understand content is on its way.

#### Acceptance Criteria

1. WHILE posts are loading on the Post_List_Page, THE Blog_App SHALL display Skeleton_Loader components matching the layout of blog post cards (title placeholder, 3 lines of text placeholder, footer row)
2. WHILE the Post_Detail_Page content is loading, THE Blog_App SHALL display Skeleton_Loader components matching the article layout (heading placeholder, metadata row, body text block)
3. WHILE the User_Profile_Page data is loading, THE Blog_App SHALL display Skeleton_Loader components matching the profile layout (avatar circle, name/email placeholders, post cards grid)
4. THE Skeleton_Loader SHALL use the Tailwind CSS animate-pulse class to indicate loading state
5. THE Skeleton_Loader SHALL match the dimensions and spacing of the actual content it replaces to prevent layout shifts

### Requirement 15: Toast Notifications

**User Story:** As a reader, I want to receive brief visual feedback for my actions, so that I know my interactions (bookmarking, copying, subscribing) were successful.

#### Acceptance Criteria

1. THE Toast_System SHALL display notification messages at the bottom-right of the viewport with a maximum message length of 100 characters
2. THE Toast_System SHALL support success, error, and info notification types, each distinguished by a unique icon and background color
3. THE Toast_System SHALL automatically dismiss notifications after 4 seconds with a fade-out animation lasting 300 milliseconds
4. WHEN multiple notifications are triggered, THE Toast_System SHALL stack them vertically with the newest on top, displaying a maximum of 5 notifications simultaneously and discarding the oldest when the limit is exceeded
5. WHEN the user activates the dismiss button on a notification, THE Toast_System SHALL remove that notification with the exit animation and cancel its auto-dismiss timer
6. THE Toast_System SHALL animate notifications on entry with a slide-in transition lasting 300 milliseconds and on exit with a fade-out transition lasting 300 milliseconds
7. THE Toast_System SHALL announce each notification to assistive technologies using an ARIA live region with a politeness level of "polite" for success and info types, and "assertive" for error types
8. THE Toast_System SHALL render the dismiss button with an accessible label indicating its purpose and a minimum touch target of 24 by 24 pixels
