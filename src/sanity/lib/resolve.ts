// ./src/sanity/lib/resolve.ts
import { defineLocations } from 'sanity/presentation';
import type { PresentationPluginOptions } from 'sanity/presentation';

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    // Page document type - kan homepage zijn of gewone pagina
    page: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
        pageType: 'pageType',
      },
      resolve: (doc) => {
        // Homepage heeft geen slug of slug is leeg, route naar root
        if (doc?.pageType === 'homepage' || !doc?.slug) {
          return {
            locations: [
              {
                title: doc?.title || 'Homepage',
                href: '/?preview=true',
              },
            ],
          };
        }
        // Gewone pagina's route naar /{slug}
        return {
          locations: [
            {
              title: doc?.title || 'Untitled',
              href: `/${doc?.slug}?preview=true`,
            },
          ],
        };
      },
    }),
    // Work (project) document type - route naar /project/{slug}
    work: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled Project',
            href: `/project/${doc?.slug}?preview=true`,
          },
        ],
      }),
    }),
  },
};
