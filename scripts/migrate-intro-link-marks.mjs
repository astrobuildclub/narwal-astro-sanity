import { createClient } from '@sanity/client';

const projectId =
  process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    'Missing env vars. Set PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN.',
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2023-10-15',
  useCdn: false,
});

const dryRun = process.argv.includes('--dry-run');

const query = `*[_type == "page" && defined(introCols)]{
  _id,
  introCols
}`;

function migrateIntroCols(introCols) {
  let changed = false;
  const next = (introCols || []).map((col) => {
    if (!col?.content) return col;

    const nextContent = col.content.map((block) => {
      if (!block?.markDefs?.length) return block;

      let blockChanged = false;
      const nextMarkDefs = block.markDefs.map((def) => {
        if (def?._type !== 'link') return def;
        if (def.link || !def.href) return def;

        blockChanged = true;
        const { href, blank, ...rest } = def;
        const link = {
          _type: 'link',
          type: 'external',
          url: href,
          ...(typeof blank === 'boolean' ? { blank } : {}),
        };

        return {
          ...rest,
          link,
        };
      });

      if (!blockChanged) return block;
      changed = true;
      return { ...block, markDefs: nextMarkDefs };
    });

    return { ...col, content: nextContent };
  });

  return { next, changed };
}

async function run() {
  const pages = await client.fetch(query);
  if (!pages.length) {
    console.log('No pages with introCols found.');
    return;
  }

  let changedCount = 0;

  for (const page of pages) {
    const { next, changed } = migrateIntroCols(page.introCols);
    if (!changed) continue;

    changedCount += 1;
    if (dryRun) {
      console.log(`[dry-run] would update ${page._id}`);
      continue;
    }

    await client.patch(page._id).set({ introCols: next }).commit();
    console.log(`updated ${page._id}`);
  }

  if (changedCount === 0) {
    console.log('No introCols needed migration.');
  } else if (dryRun) {
    console.log(`Dry-run complete. ${changedCount} page(s) need updates.`);
  } else {
    console.log(`Migration complete. Updated ${changedCount} page(s).`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
