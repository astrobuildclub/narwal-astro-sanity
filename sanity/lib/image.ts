import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from 'sanity:client';
import type { SanityImage } from '../../src/sanity/types';

const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimized image URL from Sanity image source
 * Automatically applies format optimization and prevents upscaling
 * @param source - Sanity image source
 * @param quality - Optional quality setting (0-100, default: 95)
 */
export function urlForImage(
  source: SanityImage | null | undefined,
  quality?: number,
) {
  if (!source?.asset) return null;
  const q =
    quality !== undefined && quality >= 0 && quality <= 100 ? quality : 95;
  return builder
    .image(source)
    .auto('format') // Automatische format selectie (WebP/AVIF wanneer ondersteund)
    .fit('max') // Voorkomt opschalen van kleine afbeeldingen
    .quality(q);
}
