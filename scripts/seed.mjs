import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const POSTS = require('../data/posts.json');

const MOCKAPI_BASE = process.env.NEXT_PUBLIC_MOCKAPI_URL ?? '';

async function seed() {
  console.log(`Seeding ${POSTS.length} posts to ${MOCKAPI_BASE}/posts ...\n`);

  const checkRes = await fetch(`${MOCKAPI_BASE}/posts`);
  if (!checkRes.ok) {
    console.error(`✗ MockAPI returned ${checkRes.status}. Check your NEXT_PUBLIC_MOCKAPI_URL.`);
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
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\nDone. Created ${created}/${POSTS.length} posts.`);
}

seed().catch(console.error);
