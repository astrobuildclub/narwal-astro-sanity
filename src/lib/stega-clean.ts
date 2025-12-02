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

/**
 * Clean een size enum waarde (gebruikt voor grid positioning)
 * @param size - De size waarde om te cleanen
 * @returns De schone size waarde, of undefined als het geen string is
 */
export function cleanSize(
  size?: string | null,
): 'content' | 'popout' | 'feature' | 'page' | 'full' | 'inherit' | 'inline' | undefined {
  if (!size || typeof size !== 'string') {
    return undefined;
  }
  const cleaned = stegaClean(size);
  // Type guard voor geldige size waarden
  const validSizes = [
    'content',
    'popout',
    'feature',
    'page',
    'full',
    'inherit',
    'inline',
  ] as const;
  if (validSizes.includes(cleaned as any)) {
    return cleaned as typeof validSizes[number];
  }
  return undefined;
}

/**
 * Clean een layout enum waarde (gebruikt voor conditionele rendering)
 * @param layout - De layout waarde om te cleanen
 * @returns De schone layout waarde, of undefined als het geen string is
 */
export function cleanLayout(
  layout?: string | null,
): 'grid' | 'masonry' | 'list' | 'cards' | undefined {
  if (!layout || typeof layout !== 'string') {
    return undefined;
  }
  const cleaned = stegaClean(layout);
  // Type guard voor geldige layout waarden
  const validLayouts = ['grid', 'masonry', 'list', 'cards'] as const;
  if (validLayouts.includes(cleaned as any)) {
    return cleaned as typeof validLayouts[number];
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

