const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Generate an optimized thumbnail URL using Supabase image transforms.
 * Falls back to original URL if transforms aren't available.
 */
export function getOptimizedUrl(
  originalUrl: string,
  width: number,
  quality = 75
): string {
  // Transform /storage/v1/object/public/... → /storage/v1/render/image/public/...
  if (originalUrl.includes('/storage/v1/object/public/')) {
    return originalUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    ) + `?width=${width}&quality=${quality}&resize=contain`;
  }
  return originalUrl;
}

/**
 * Get thumbnail URL for grid display (small)
 */
export function getThumbnailUrl(originalUrl: string, isLarge = false): string {
  return getOptimizedUrl(originalUrl, isLarge ? 800 : 400, 70);
}

/**
 * Get lightbox URL (medium-high quality, capped at 1200px)
 */
export function getLightboxUrl(originalUrl: string): string {
  return getOptimizedUrl(originalUrl, 1200, 85);
}
