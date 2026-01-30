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

  // Vite configuratie voor Sanity dependencies
  vite: {
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@sanity/astro',
        'sanity',
        '@sanity/client',
      ],
      exclude: [
        '@sanity/astro/dist/studio',
        '@sanity/visual-editing',
        '@sanity/presentation-comlink',
        '@sanity/preview-url-secret',
      ],
    },
    ssr: {
      noExternal: ['@sanity/astro'],
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    plugins: [{
      name: 'sanity-studio-loader',
      resolveId(id) {
        return null;
      },
      load(id) {
        return null;
      },
      transform(code, id) {
        return null;
      }
    }]
  },

  adapter: netlify(),
  image: {
    domains: ['cdn.sanity.io'],
  },
});
