/**
 * Seed script — populates MockAPI with 12 rich blog posts.
 * Run with: node scripts/seed.mjs
 */
const MOCKAPI_BASE = process.env.NEXT_PUBLIC_MOCKAPI_URL
  ?? 'https://6872f93c46b4e7f718e3d1e7.mockapi.io/api/v1';

const POSTS = [
  {
    userId: 1, category: 'Technology',
    title: 'Getting Started with Next.js 16 and the App Router',
    body: `Next.js 16 brings significant improvements to the App Router, making it the recommended way to build modern React applications. The new architecture separates Server Components from Client Components clearly, allowing you to co-locate data fetching right where it's needed.

In this guide, we walk through setting up a new project from scratch, understanding the file-based routing system, and leveraging React Server Components for blazing-fast performance. The App Router supports nested layouts, loading UI, error boundaries, and streaming out of the box.

Key improvements include faster build times with Turbopack, improved TypeScript support, and a cleaner mental model for data fetching. Whether you're migrating from Pages Router or starting fresh, the App Router provides a solid foundation for production applications.`,
  },
  {
    userId: 2, category: 'Design',
    title: 'Designing for Dark Mode: Principles and Pitfalls',
    body: `Dark mode has moved from a novelty to a necessity. Users spend hours staring at screens, and a well-implemented dark theme reduces eye strain, saves battery on OLED displays, and simply looks stunning.

But dark mode done wrong is worse than no dark mode at all. Common mistakes include using pure black (#000000) as the background — which creates harsh contrast — or simply inverting light colors without considering hierarchy.

The key insight is elevation: in dark UIs, surfaces get progressively lighter as they stack. Cards sit slightly above the base, modals higher still. Use CSS custom properties for your color tokens, and never hardcode hex values in components.

Typography also needs special attention. Body text at 100% white on a dark surface is too bright — use 85–90% opacity instead. Reserve full white for headings and key interactive elements.`,
  },
  {
    userId: 3, category: 'Business',
    title: 'How to Write a Technical Spec That Engineers Actually Read',
    body: `Most technical specs are written to be comprehensive. They end up never being read. Here's a counterintuitive truth: a shorter spec that answers the three questions engineers care about is worth ten exhaustive documents.

The three questions: What problem are we solving? What are the constraints? What does success look like?

Start with context, not requirements. Engineers need to understand the why before they can reason about the how. A single paragraph of business context saves hours of back-and-forth.

Use diagrams sparingly but deliberately. A sequence diagram for a complex API flow is worth a thousand words. An architecture diagram for a two-endpoint CRUD service is noise.

Finally, get feedback before you finalize. Sharing a draft with one senior engineer catches 80% of the gaps and builds buy-in from the start.`,
  },
  {
    userId: 4, category: 'Technology',
    title: 'TanStack Query v5: The Complete Migration Guide',
    body: `TanStack Query v5 (formerly React Query) ships with a leaner API and better TypeScript types. If you're on v4, migration is mostly mechanical — but there are a few subtle breaking changes worth understanding.

The biggest shift is that useQuery now takes a single options object instead of positional arguments. The queryKey must be an array, and the queryFn is required. The enabled option still works exactly as before.

useInfiniteQuery gains a new initialPageParam option, and getNextPageParam is now required rather than optional. The direction of the pages array is now configurable.

On the positive side, v5 removes the need for QueryClientProvider when using suspense: true — Suspense mode is now first-class. The refetchOnMount behavior is cleaner, and the error types are more precise. Overall it's a net improvement worth the migration effort.`,
  },
  {
    userId: 5, category: 'Lifestyle',
    title: 'The Pomodoro Technique Revisited: What the Research Actually Says',
    body: `The Pomodoro Technique — 25 minutes of work, 5-minute break, repeat — has been taught in productivity circles for decades. But how well does it actually hold up to scrutiny?

The evidence is mixed. For tasks requiring deep focus, fixed-interval interruptions can disrupt flow states that take 15–20 minutes to enter. For repetitive tasks or work that requires sustained but not deep attention, regular breaks genuinely improve output quality.

The real insight Pomodoro offers isn't the specific timing — it's the habit of time-boxing. Knowing you only need to focus for 25 minutes makes starting easier. Procrastination often stems from the perceived infiniteness of a task.

Adapt the technique to your context. If you're writing code that requires 40 minutes to load fully into working memory, use 50/10. If you're doing email triage, 15/5 works perfectly. The timer is a tool, not a rule.`,
  },
  {
    userId: 6, category: 'Science',
    title: 'Large Language Models: What They Can and Cannot Do',
    body: `Large language models have captured public imagination in a way few technologies have. Understanding their actual capabilities — and limits — matters more than ever for people building products with them.

LLMs are fundamentally pattern-completion machines trained on vast text corpora. They are extraordinarily good at fluent text generation, code synthesis, summarization, and translation. They struggle with tasks requiring precise arithmetic, logical deduction across long contexts, and real-world grounding.

Hallucination — generating confident-sounding false information — remains a fundamental challenge. It stems from how these models are trained: optimized to produce plausible text, not accurate facts. Retrieval-augmented generation (RAG) helps ground outputs in verifiable sources but doesn't eliminate the problem.

For builders: LLMs excel as force multipliers for human judgment, not replacements for it. The most successful applications keep a human in the loop for high-stakes decisions.`,
  },
  {
    userId: 7, category: 'Culture',
    title: 'Why Boring Technology Is Usually the Right Choice',
    body: `Every few years, a new framework or database promises to solve all your problems. Teams flock to it, rewrites begin, and two years later the project is halfway done and the original problems remain unsolved.

Boring technology — PostgreSQL, Redis, S3, proven frameworks — wins not because it's technically optimal but because it's understood. When something breaks at 3am, you want to debug code with 15 years of StackOverflow answers, not a technology where you're the fifth person to encounter this specific error.

This doesn't mean never adopt new technology. It means the bar should be high: does this solve a problem boring tech genuinely cannot? Can your team maintain and operate it? Is the community large enough that security patches arrive quickly?

The organizations with the best engineering cultures tend to be radically boring in their infrastructure choices and radically innovative in their product thinking. Separate where you experiment from where you rely.`,
  },
  {
    userId: 8, category: 'Health',
    title: 'Sleep and Cognitive Performance: The Developer's Guide',
    body: `You've pulled an all-nighter to ship a feature. The code compiled, tests passed, you felt fine. But studies show that 24 hours of sleep deprivation produces cognitive impairment equivalent to a blood alcohol concentration of 0.10% — legally drunk in most jurisdictions.

The problem is we're terrible at detecting our own impairment when sleep-deprived. The subjective feeling of alertness decouples from actual cognitive performance after sleep loss.

For developers specifically, sleep deprivation hits hardest on working memory (holding multiple code paths in mind), error detection, and the kind of creative problem-solving that debugging requires. Code written while sleep-deprived has measurably higher defect rates.

Practical changes that research supports: maintain a consistent sleep/wake time even on weekends, keep the bedroom cool (18–20°C), eliminate blue light 90 minutes before bed, and treat 7–9 hours as a non-negotiable business requirement, not a luxury.`,
  },
  {
    userId: 1, category: 'Technology',
    title: 'CSS Grid in 2025: Layout Patterns You Should Know',
    body: `CSS Grid has matured tremendously, and browser support is universal. Yet many developers still reach for flexbox or a CSS framework for layouts that Grid handles more elegantly.

The subgrid feature — now supported in all major browsers — is the one that changes everything for component-based design. It lets grid children participate in the parent grid's tracks, solving the long-standing problem of aligning elements across different components.

Container queries, combined with Grid, enable truly responsive components that respond to their container size rather than the viewport. This unlocks component portability that media queries alone can't provide.

For dashboard layouts, the named grid areas feature reads almost like documentation: define template-areas with semantic names, then place components by name rather than coordinates. The result is layout code that's self-evident and easy to modify.`,
  },
  {
    userId: 2, category: 'Design',
    title: 'Typography Fundamentals Every Developer Should Know',
    body: `Typography is the single most impactful design decision in any text-heavy interface. Yet it's routinely treated as an afterthought — pick a Google Font, set a body size, done.

Line height deserves more attention than font choice. For body text, 1.5–1.7× the font size is the sweet spot for readability. Tighter for headings, looser for small text. Most default browser styles set 1.2, which is too tight for extended reading.

Measure (line length) matters as much as line height. Optimal reading is 60–75 characters per line. Below 45 feels choppy; above 90 causes the eye to lose its place on the next line.

The type scale should be deliberate, not arbitrary. A modular scale — where each step is the previous multiplied by a ratio — creates visual harmony. Common ratios: 1.25 (Major Third), 1.333 (Perfect Fourth), 1.5 (Perfect Fifth). Pick one and stick to it.`,
  },
  {
    userId: 3, category: 'Travel',
    title: 'Working Remotely from Europe: Practical Lessons After One Year',
    body: `I spent the last year working remotely while traveling through twelve European countries. Here's what I wish I'd known before I started.

Internet reliability varies wildly. Portugal and Estonia are excellent; rural areas of beautiful countries are often terrible. Always have a local SIM with data as backup, and test the wifi before committing to accommodation for more than two nights.

Time zones are deceptively manageable from Europe. UTC+1 or UTC+2 gives substantial overlap with both US East Coast mornings and Asia afternoons. Async communication becomes a superpower when you embrace it deliberately rather than trying to replicate synchronous office culture.

The loneliness is real and requires active management. Co-working spaces are worth the cost not for the desk but for the serendipitous conversations. Communities like Nomad List and local tech meetups solve this better than most people expect.`,
  },
  {
    userId: 4, category: 'Technology',
    title: 'API Design Mistakes I Stopped Making',
    body: `After designing APIs for eight years and consuming hundreds more, certain patterns consistently cause pain. Here are the ones I stopped doing — and what I do instead.

Using verbs in REST endpoints. /getUser, /createPost — these fight the entire REST model. Nouns for resources, HTTP verbs for actions. GET /users/:id, POST /posts. When you feel the urge to add a verb, it usually means you need a new resource or a better HTTP method.

Inconsistent naming conventions. Mixing camelCase and snake_case across the same API forces every consumer to handle the inconsistency. Pick one and enforce it at the serializer level.

Returning 200 for errors. A 200 response with { success: false, error: "not found" } in the body breaks every HTTP client, monitoring tool, and mental model. Use 4xx and 5xx status codes correctly.

Not versioning from day one. Adding v1 to your URL path costs nothing on day one and saves enormous pain the moment you need to make a breaking change.`,
  },
];

async function seed() {
  console.log(`Seeding ${POSTS.length} posts to ${MOCKAPI_BASE}/posts ...\n`);

  // Check existing posts
  const checkRes = await fetch(`${MOCKAPI_BASE}/posts`);
  if (!checkRes.ok) {
    console.error(`✗ MockAPI returned ${checkRes.status}. Check your MOCKAPI_BASE URL.`);
    process.exit(1);
  }
  const existing = await checkRes.json();
  if (existing.length > 0) {
    console.log(`ℹ  ${existing.length} posts already exist. Skipping seed.`);
    console.log('   Delete posts manually on mockapi.io if you want to re-seed.\n');
    return;
  }

  let created = 0;
  for (const post of POSTS) {
    const res = await fetch(`${MOCKAPI_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...post,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`✓ Created post ${data.id}: ${post.title.slice(0, 50)}...`);
      created++;
    } else {
      console.error(`✗ Failed to create: ${post.title.slice(0, 50)} (${res.status})`);
    }
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\nDone. Created ${created}/${POSTS.length} posts.`);
}

seed().catch(console.error);
