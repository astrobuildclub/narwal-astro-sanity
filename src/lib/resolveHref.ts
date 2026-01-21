/**
 * Resolves internal Sanity document links to URLs
 * @param doc - Sanity document with _type and slug
 * @returns Resolved URL path or null if invalid
 */
export function resolveHref(
  doc?: {
    _type?: string;
    slug?: { current?: string } | string;
  } | null,
): string | null {
  if (!doc?._type) return null;

  // Handle both {current: string} and string slug formats
  const slug =
    typeof doc.slug === 'string'
      ? doc.slug
      : doc.slug?.current;

  if (!slug) return null;

  switch (doc._type) {
    case 'work':
      return `/project/${slug}`;
    case 'page':
      return `/${slug}`;
    default:
      return `/${slug}`;
  }
}
