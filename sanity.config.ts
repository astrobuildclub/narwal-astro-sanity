import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { linkField } from 'sanity-plugin-link-field';
// Import schema types from studio directory
import { schemaTypes } from './studio/schemas';

export default defineConfig({
  name: 'narwal-creative',
  title: 'Narwal Creative',
  projectId: 'q178y836',
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool(),
    linkField({
      linkableSchemaTypes: ['page', 'work'],
    }),
  ],
  schema: {
    types: schemaTypes as any,
  },
});

