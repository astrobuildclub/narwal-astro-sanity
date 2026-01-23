import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Orderable Projects List
      orderableDocumentListDeskItem({
        type: 'work',
        title: 'Projects',
        id: 'orderable-projects',
        S,
        context,
      }),

      // Divider
      S.divider(),

      // Other document types
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('client').title('Clients'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.documentTypeListItem('career').title('Careers'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
    ]);
