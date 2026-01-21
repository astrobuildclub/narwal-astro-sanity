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
      linkType: 'link.linkType',
      url: 'link.url',
      internalTitle: 'link.internalLink.title',
      email: 'link.email',
      phone: 'link.phone',
    },
    prepare({ linkType, url, internalTitle, email, phone }) {
      let title = 'Link';
      if (linkType === 'internal' && internalTitle) {
        title = internalTitle;
      } else if (linkType === 'external' && url) {
        title = url;
      } else if (linkType === 'email' && email) {
        title = `mailto:${email}`;
      } else if (linkType === 'phone' && phone) {
        title = `tel:${phone}`;
      }
      return {
        title,
        subtitle: 'Intro Link',
      };
    },
  },
});
