import { defineType, defineField } from 'sanity';
import { UsersIcon } from '@sanity/icons';

export default defineType({
  name: 'clientsBlock',
  title: 'Clients Block',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Block Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clients',
      type: 'array',
      title: 'Clients',
      description: 'Al gekozen clients staan in de lijst en kunnen niet nog eens worden toegevoegd.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'client' }],
          options: {
            filter: ({ parent }) => {
              const refs = Array.isArray(parent) ? parent : [];
              const selectedIds = refs
                .map((item: { _ref?: string }) => item?._ref)
                .filter((id: string | undefined): id is string => Boolean(id))
                .flatMap((id: string) =>
                  id.startsWith('drafts.')
                    ? [id, id.replace(/^drafts\./, '')]
                    : [id, `drafts.${id}`],
                );

              if (selectedIds.length === 0) {
                return { filter: '_type == "client"' };
              }

              return {
                filter: '_type == "client" && !(_id in $selectedIds)',
                params: { selectedIds },
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).unique(),
    }),
    defineField({
      name: 'layout',
      type: 'string',
      title: 'Layout',
      options: {
        list: [
          { title: 'List', value: 'list' },
          { title: 'Grid', value: 'grid' },
          { title: 'Logos', value: 'logos' },
        ],
      },
      initialValue: 'list',
    }),
    defineField({
      name: 'showLogos',
      type: 'boolean',
      title: 'Show Logos',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      clients: 'clients',
      layout: 'layout',
    },
    prepare({ title, clients, layout }) {
      return {
        title: title || 'Clients Block',
        subtitle: `Clients Block • ${layout || 'list'} • ${clients?.length || 0} clients`,
        media: 'Clients',
      };
    },
  },
});
