// src/lib/sanity.ts
import { loadQuery } from '../sanity/lib/load-query';
import {
  ALL_SLUGS_QUERY,
  HOME_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PAGE_BY_SLUG_QUERY,
  ALL_PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from '../sanity/lib/queries';
import type {
  SanityHome,
  SanityProject,
  SanityPage,
  SanitySiteSettings,
  SanityAllSlugs,
} from '../sanity/types';

/**
 * Haal alle URIs op voor static path generatie
 */
export async function getAllUris() {
  try {
    const { data } = await loadQuery<SanityAllSlugs>({
      query: ALL_SLUGS_QUERY,
    });

    if (!data) {
      throw new Error('No data returned from Sanity');
    }

    const uris = [];

    // Add homepage
    if (data.homepage) {
      uris.push({ params: { uri: undefined } }); // Homepage heeft undefined URI
    }

    // Add pages
    if (data.pages) {
      uris.push(
        ...data.pages.map((slug: string) => ({ params: { uri: slug } })),
      );
    }

    // Add projects with project/ prefix
    if (data.projects) {
      uris.push(
        ...data.projects.map((slug: string) => ({
          params: { uri: `project/${slug}` },
        })),
      );
    }

    return uris;
  } catch (error) {
    console.error('❌ Failed to load Sanity slugs:', error);
    throw error;
  }
}

/**
 * Haal homepage data op
 */
export async function getHomeData(
  searchParams?: URLSearchParams,
): Promise<SanityHome> {
  try {
    const { data } = await loadQuery<SanityHome>({
      query: HOME_QUERY,
      searchParams,
    });

    if (!data) {
      throw new Error('No homepage data found');
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to load homepage data:', error);
    throw error;
  }
}

/**
 * Haal page data op by slug - met pagina type ondersteuning
 */
export async function getPageData(
  slug: string,
  searchParams?: URLSearchParams,
): Promise<SanityPage> {
  try {
    const { data } = await loadQuery<SanityPage>({
      query: PAGE_BY_SLUG_QUERY,
      params: { slug },
      searchParams,
    });

    if (!data) {
      throw new Error(`Page with slug "${slug}" not found`);
    }

    // Speciale logica per pagina type
    switch (data.pageType) {
      case 'work':
        // WorkOverview pagina - voeg projecten toe
        const { data: projects } = await loadQuery<SanityProject[]>({
          query: ALL_PROJECTS_QUERY,
          searchParams,
        });
        return {
          ...data,
          work: { nodes: projects || [] },
        } as SanityPage & { work: { nodes: SanityProject[] } };

      case 'about':
      case 'services':
      case 'contact':
      case 'default':
        // Standaard pagina's - geen extra data nodig
        return data;

      default:
        // Onbekend pagina type - log warning maar return data
        if (import.meta.env.DEV) {
          console.warn(
            `⚠️ Unknown pageType "${data.pageType}" for page "${slug}"`,
          );
        }
        return data;
    }
  } catch (error) {
    console.error(`❌ Failed to load page "${slug}":`, error);
    throw error;
  }
}

/**
 * Haal site settings op
 */
export async function getSiteSettings(): Promise<SanitySiteSettings> {
  try {
    const { data } = await loadQuery<SanitySiteSettings>({
      query: SITE_SETTINGS_QUERY,
    });

    if (!data) {
      throw new Error('No site settings found');
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to load site settings:', error);
    throw error;
  }
}

/**
 * Haal project data op by slug
 */
export async function getProjectData(
  slug: string,
  searchParams?: URLSearchParams,
): Promise<SanityProject> {
  try {
    const { data } = await loadQuery<SanityProject>({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      searchParams,
    });

    if (!data) {
      throw new Error(`Project with slug "${slug}" not found`);
    }

    return data;
  } catch (error) {
    console.error(`❌ Failed to load project "${slug}":`, error);
    throw error;
  }
}

/**
 * Haal alle projecten op
 */
export async function getAllProjects() {
  try {
    const { data } = await loadQuery({ query: ALL_PROJECTS_QUERY });
    return data || [];
  } catch (error) {
    console.error('❌ Failed to load projects:', error);
    throw error;
  }
}

/**
 * Haal navigation data op (compatibele structuur voor DefaultLayout)
 * Retourneert menus en generalSettings zoals verwacht door de layout
 */
export async function getNavigation() {
  try {
    const siteSettings = await getSiteSettings();

    // Transformeer naar compatibele structuur
    const menus = {
      nodes: [
        {
          menuItems: {
            nodes: (siteSettings.navigation?.menuItems || []).map((item) => {
              // Haal slug op (kan string zijn vanwege query aliasing, of object met current)
              const slug =
                typeof item.link?.internalLink?.slug === 'string'
                  ? item.link.internalLink.slug
                  : item.link?.internalLink?.slug?.current || '';

              // Bepaal URI en URL
              const uri =
                slug || item.link?.url?.replace(/^https?:\/\//, '') || '';
              const url =
                item.link?.linkType === 'external' && item.link.url
                  ? item.link.url
                  : slug
                    ? `/${slug}`
                    : '';

              return {
                label: item.label,
                uri,
                url,
                order: item.order || 0,
              };
            }),
          },
        },
      ],
    };

    const generalSettings = {
      title: siteSettings.title,
      url: siteSettings.url,
      description: siteSettings.description,
    };

    return {
      menus,
      generalSettings,
    };
  } catch (error) {
    console.error('❌ Failed to load navigation:', error);
    throw error;
  }
}
