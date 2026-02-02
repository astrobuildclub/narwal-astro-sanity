import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? 'q178y836',
    dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  },
  deployment: {
    appId: 'fpi67i8hrs4jxvz9cte2xcvo',
  },
});
