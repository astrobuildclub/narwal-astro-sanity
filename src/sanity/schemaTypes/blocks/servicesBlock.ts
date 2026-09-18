import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';

export default defineType({
  name: 'servicesBlock',
  title: 'Services Block',
  type: 'object',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Block Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      type: 'array',
      title: 'Services',
      description:
        'Al gekozen services staan in de lijst en kunnen niet nog eens worden toegevoegd.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'service' }],
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
                return { filter: '_type == "service"' };
              }

              return {
                filter: '_type == "service" && !(_id in $selectedIds)',
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
          { title: 'Cards', value: 'cards' },
        ],
      },
      initialValue: 'list',
    }),
    defineField({
      name: 'columns',
      type: 'number',
      title: 'Columns (desktop)',
      description: 'Aantal kolommen op desktop voor Grid en Cards.',
      options: {
        list: [
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
        ],
        layout: 'radio',
      },
      initialValue: 2,
      hidden: ({ parent }) =>
        parent?.layout !== 'grid' && parent?.layout !== 'cards',
    }),
    defineField({
      name: 'showDescriptions',
      type: 'boolean',
      title: 'Show Descriptions',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      services: 'services',
      layout: 'layout',
      columns: 'columns',
    },
    prepare({ title, services, layout, columns }) {
      const layoutLabel = layout || 'list';
      const colsLabel =
        layoutLabel === 'grid' || layoutLabel === 'cards'
          ? ` • ${columns || 2} cols`
          : '';
      return {
        title: title || 'Services Block',
        subtitle: `Services Block • ${layoutLabel}${colsLabel} • ${services?.length || 0} services`,
        media: 'Services',
      };
    },
  },
});
