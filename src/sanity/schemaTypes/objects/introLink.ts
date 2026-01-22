import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'introLink',
  type: 'object',
  title: 'Intro Link',
  groups: [
    { name: 'link', title: 'Link', default: true },
    { name: 'advanced', title: 'Video' },
  ],
  fields: [
    defineField({
      name: 'link',
      type: 'link',
      title: 'Link',
      group: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'Video URL (Hover)',
      description: 'MP4 video URL die getoond wordt bij hover over de link',
      group: 'advanced',
    }),
  ],
  preview: {
    select: {
      type: 'link.type',
      value: 'link.value',
      internalTitle: 'link.internalLink.title',
      email: 'link.email',
      phone: 'link.phone',
    },
    prepare({ type, value, internalTitle, email, phone }) {
      let title = 'Link';
      if (type === 'internal' && internalTitle) {
        title = internalTitle;
      } else if (type === 'external' && value) {
        title = value;
      } else if (type === 'email' && email) {
        title = `mailto:${email}`;
      } else if (type === 'phone' && phone) {
        title = `tel:${phone}`;
      }
      return {
        title,
        subtitle: 'Intro Link',
      };
    },
  },
});
