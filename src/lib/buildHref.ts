/**
 * Converts params object to query string
 */
function toQueryString(params: unknown): string {
  if (!params || typeof params !== 'object') return '';

  const entries = Object.entries(params as Record<string, unknown>)
    .filter(([, v]) => v != null && `${v}`.length > 0)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);

  return entries.length ? `?${entries.join('&')}` : '';
}

/**
 * Builds final href by appending query params and anchor to base URL
 * @param base - Base URL/path
 * @param opts - Options with params (object) and/or anchor (string)
 * @returns Final href with query string and anchor
 */
export function buildHref(
  base: string,
  opts?: { params?: unknown; anchor?: string | null },
): string {
  const qs = toQueryString(opts?.params);
  const anchor = opts?.anchor ? `#${opts.anchor.replace(/^#/, '')}` : '';
  return `${base}${qs}${anchor}`;
}
