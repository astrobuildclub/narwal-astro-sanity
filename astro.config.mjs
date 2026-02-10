// astro.config.mjs
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

import { loadEnv } from 'vite';
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV || 'production',
  process.cwd(),
  '',
);

export default defineConfig({
  site: 'https://narwal.netlify.app',

  // Prefetch: with ClientRouter, prefetch is on by default. Use viewport strategy
  // so links are prefetched when visible (nav links = immediately), making clicks feel instant.
  prefetch: {
    defaultStrategy: 'viewport',
  },

  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
      apiVersion: '2025-01-28',
      studioBasePath: '/studio',
      stega: {
        studioUrl: '/studio',
      },
    }),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },

  adapter: netlify(),
  image: {
    domains: ['cdn.sanity.io'],
  },
});
