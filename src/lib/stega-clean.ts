// Utility functies voor het verwijderen van stega encoding characters uit Sanity strings
// Stega characters worden toegevoegd voor Visual Editing maar breken classnamen en string vergelijkingen

import { stegaClean } from '@sanity/client/stega';

/**
 * Clean een string van stega encoding characters
 * @param str - De string om te cleanen
 * @returns De schone string, of de originele waarde als het geen string is
 */
export function cleanString(str: unknown): string | undefined {
  if (typeof str !== 'string') {
    return str as string | undefined;
  }
  return stegaClean(str);
}

const SIZE_TOKENS = [
  'content',
  'popout',
  'feature',
  'page',
  'full',
  'inherit',
  'inline',
] as const;

export type SizeToken = (typeof SIZE_TOKENS)[number];

/**
 * Clean een size enum waarde (gebruikt voor grid positioning)
 * @param size - De size waarde om te cleanen
 * @param allowed - Optionele subset die dit blok accepteert
 */
export function cleanSize(size?: string | null): SizeToken | undefined;
export function cleanSize<T extends SizeToken>(
  size: string | null | undefined,
  allowed: readonly T[],
): T | undefined;
export function cleanSize<T extends SizeToken>(
  size?: string | null,
  allowed?: readonly T[],
): T | undefined {
  if (!size || typeof size !== 'string') {
    return undefined;
  }
  const cleaned = stegaClean(size);
  const valid = allowed ?? (SIZE_TOKENS as unknown as readonly T[]);
  if (valid.includes(cleaned as T)) {
    return cleaned as T;
  }
  return undefined;
}

const LAYOUT_TOKENS = ['grid', 'masonry', 'list', 'cards'] as const;

export type LayoutToken = (typeof LAYOUT_TOKENS)[number];

/**
 * Clean een layout enum waarde (gebruikt voor conditionele rendering)
 * @param layout - De layout waarde om te cleanen
 * @param allowed - Optionele subset die dit blok accepteert
 */
export function cleanLayout(layout?: string | null): LayoutToken | undefined;
export function cleanLayout<T extends LayoutToken>(
  layout: string | null | undefined,
  allowed: readonly T[],
): T | undefined;
export function cleanLayout<T extends LayoutToken>(
  layout?: string | null,
  allowed?: readonly T[],
): T | undefined {
  if (!layout || typeof layout !== 'string') {
    return undefined;
  }
  const cleaned = stegaClean(layout);
  const valid = allowed ?? (LAYOUT_TOKENS as unknown as readonly T[]);
  if (valid.includes(cleaned as T)) {
    return cleaned as T;
  }
  return undefined;
}

/**
 * Clean een imagePosition waarde (gebruikt voor classname generatie)
 * @param position - De position waarde om te cleanen
 * @returns De schone position waarde, of undefined als het geen string is
 */
export function cleanImagePosition(
  position?: string | null,
): 'left' | 'right' | undefined {
  if (!position || typeof position !== 'string') {
    return undefined;
  }
  const cleaned = stegaClean(position);
  // Type guard voor geldige position waarden
  const validPositions = ['left', 'right'] as const;
  if (validPositions.includes(cleaned as any)) {
    return cleaned as typeof validPositions[number];
  }
  return undefined;
}







