import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { linkField } from 'sanity-plugin-link-field';
import { schemaTypes } from './schemas';

// Load environment variables
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing Sanity project ID. Please set SANITY_STUDIO_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID environment variable.'
  );
}

export default defineConfig({
  name: 'narwal-creative',
  title: 'Narwal Creative',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool(),
    linkField({
      linkableSchemaTypes: ['page', 'work'],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
