// ./sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { presentationTool } from 'sanity/presentation';
import { resolve } from './src/sanity/lib/resolve';
// plug-ins
import { linkField } from 'sanity-plugin-link-field';
import seofields from 'sanity-plugin-seofields';

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: location.origin,
    }),
    // Zet deze plugins NA presentationTool
    linkField({
      linkableSchemaTypes: ['page', 'work'],
    }),
    seofields({
      seofields: {
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
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
