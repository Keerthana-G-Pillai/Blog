# InkVerse

A blog app built with Next.js. Pulls articles from the Dev.to API and lets you create your own posts too.

## What's in it

- Browse real articles from Dev.to
- Dark/light mode toggle
- Search and filter by category
- Trending posts sorted by views
- Table of contents on article pages (with scroll tracking)
- Like and comment on posts
- Write and publish your own posts
- Author profiles

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TanStack Query v5
- Axios
- Dev.to public API

## Running locally

```bash
npm install
npm run dev
```

Then go to `http://localhost:3000`.

## Environment

Create a `.env.local` file if you want to connect your own MockAPI for storing user-created posts:

```
NEXT_PUBLIC_MOCKAPI_URL=your_mockapi_url_here
```

Posts from Dev.to work without any setup.
