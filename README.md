# InkVerse — Modern & Resilient Blog Platform

InkVerse is a premium, feature-rich blog application built using **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS 4**. It focuses heavily on functional editorial capabilities, offering a seamless writing experience, dynamic reading assistants, interactive feedback widgets, and resilient offline fallbacks.

---

## ✨ Features

### 1. ✍️ Robust Writing & Editorial Experience
* **Auto-calculated Reading Time**: The editor dynamically estimates reading time in real-time as you write.
* **Custom Covers & Metadata**: Supports custom Cover Image URLs and comma-separated tags grouping.
* **Markdown Formatting Cheat Sheet**: A collapsible markdown syntax guide is embedded directly in the creation/editing forms.

### 2. 📖 Rich Content Formatting & Reading Assistants
* **Markdown Parser**: Renders article content dynamically into structured headers, bulleted lists, bold text, italics, and inline code.
* **Dynamic Table of Contents (TOC)**: Parses headings dynamically to construct a right-hand anchor menu.
* **Scroll-Spy Active Heading**: The TOC sidebar monitors your scroll position and highlights the section you are currently reading.
* **Smooth-Scroll Navigation**: Clicking any heading in the TOC smoothly scrolls the viewport to that exact section.

### 3. 💬 Interactive Community Engagement
* **Liking System**: A like/heart toggle button on articles that updates the likes count dynamically. State is stored in `localStorage` to restrict users to one like per post.
* **Session-based Views Tracker**: Automatically tracks and counts unique views per browser tab session.
* **Post-scoped Comments Section**: An interactive comments feed at the bottom of each post. Users can submit comments with their names and emails, which render instantly and persist.

### 4. 🗂️ Content Dashboards & Navigation
* **Categories Directory (`/categories`)**: A clean dashboard listing all topics (Technology, Design, Business, etc.) with dynamic post counts. Clicking any category filters the homepage feed.
* **Trending Section (`/trending`)**: Aggregates all posts and sorts them dynamically based on the number of views.
* **Contact Center (`/contact`)**: A validated user messaging form with custom message success screens.
* **Theme Mode Switcher**: A sticky sun/moon toggle in the top navbar that instantly swaps between **Light Mode** and **Dark Mode** using CSS variables.
* **Command Bar Focus Shortcut**: Pressing `Cmd+K` or `Ctrl+K` anywhere on the site focuses the main search bar to instantly query articles.

### 5. 🛡️ Offline Resilience & Fail-safes
* If external REST APIs (such as MockAPI or JSONPlaceholder) return a 404 or time out, InkVerse automatically switches to an in-memory and `localStorage` fallback layer.
* You can write, read, edit, delete, like, and comment on articles completely offline—everything persists directly in the browser.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16.2.6 (App Router)
* **Library**: React 19 (Server-Side Rendering & Client components)
* **Styling**: Tailwind CSS v4.2.0 (Theme-adaptive variables, custom styles)
* **State & Caching**: TanStack Query v5 (Data caching, automatic refetching, query invalidation)
* **API Clients**: Axios (HTTP client with timeout fallbacks)
* **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (version 18+ recommended) installed.

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd Blog
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build
To create a production-ready optimized build:
```bash
npm run build
```
Verify and start the server:
```bash
npm run start
```
