import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { presentationTool } from 'sanity/presentation';
import { resolve } from './src/sanity/lib/resolve';
import { linkField } from 'sanity-plugin-link-field';
import seofields from 'sanity-plugin-seofields';
import { loadEnv } from 'vite';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  '',
);

export default defineConfig({
  projectId:
    PUBLIC_SANITY_PROJECT_ID || import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET || import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: location.origin,
    }),

    linkField({
      linkableSchemaTypes: ['page', 'work'],
    }),
    seofields({
      seoPreview: true,
      fieldVisibility: {
        page: {
          hiddenFields: ['openGraphSiteName', 'twitterSite'],
        },
        work: {
          hiddenFields: ['openGraphSiteName', 'twitterSite'],
        },
        career: {
          hiddenFields: ['openGraphSiteName', 'twitterSite'],
        },
        siteSettings: {
          hiddenFields: [
            'title',
            'description',
            'canonicalUrl',
            'metaImage',
            'keywords',
            'openGraphUrl',
            'openGraphTitle',
            'openGraphDescription',
            'openGraphType',
            'openGraphImageType',
            'openGraphImage',
            'openGraphImageUrl',
            'twitterCard',
            'twitterCreator',
            'twitterTitle',
            'twitterDescription',
            'twitterImageType',
            'twitterImage',
            'twitterImageUrl',
            'robots',
            'metaAttributes',
          ],
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
