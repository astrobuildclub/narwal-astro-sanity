import { defineType, defineField } from 'sanity';
import { CaseIcon } from '@sanity/icons';

export default defineType({
  name: 'industry',
  title: 'Industries',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required';
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return 'Slug can only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled Industry',
      };
    },
  },
});
