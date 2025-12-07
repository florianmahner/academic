/**
 * Dynamic Font Loader
 *
 * Loads fonts on-demand for typography presets instead of loading all fonts upfront.
 * This reduces initial page load by ~400KB.
 *
 * Features:
 * - Lazy loading: Only loads fonts when preset is activated
 * - Deduplication: Tracks loaded fonts to prevent duplicate requests
 * - FOIT prevention: Uses display=swap parameter
 * - Promise-based: Async loading with error handling
 */

// Track which presets have already loaded their fonts
const loadedFonts = new Set<string>();

/**
 * Font URLs for each typography preset
 * Each URL includes display=swap to prevent FOIT (Flash of Invisible Text)
 */
const PRESET_FONT_URLS: Record<string, string> = {
  'crimson-classic': 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',

  'editorial-newsreader': 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400;1,6..72,500&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',

  'modern-geist': 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500;600;700&display=swap',

  'classic-playfair': 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',

  'brutalist-space': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap',

  'humanist-inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',

  'elegant-josefin': 'https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',

  'clean-roboto': 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Roboto+Mono:wght@300;400;500;600;700&display=swap',

  'refined-jost': 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',

  'editorial-instrument': 'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
};

/**
 * Dynamically load fonts for a typography preset
 *
 * @param presetId - The ID of the typography preset
 * @returns Promise that resolves when fonts are loaded
 *
 * @example
 * ```typescript
 * // Load fonts when user switches preset
 * await loadPresetFonts('modern-geist');
 * ```
 */
export async function loadPresetFonts(presetId: string): Promise<void> {
  // Skip if already loaded
  if (loadedFonts.has(presetId)) {
    return;
  }

  const url = PRESET_FONT_URLS[presetId];
  if (!url) {
    console.warn(`No font URL found for preset: ${presetId}`);
    return;
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    link.onload = () => {
      loadedFonts.add(presetId);
      resolve();
    };

    link.onerror = () => {
      reject(new Error(`Failed to load fonts for preset: ${presetId}`));
    };

    document.head.appendChild(link);
  });
}

/**
 * Get the default font URL for server-side rendering
 * This is used to load only the default preset fonts initially
 *
 * @param presetId - The ID of the default typography preset
 * @returns Google Fonts URL for the default preset
 *
 * @example
 * ```astro
 * ---
 * const fontUrl = getDefaultFontUrl('editorial-newsreader');
 * ---
 * <link href={fontUrl} rel="stylesheet" />
 * ```
 */
export function getDefaultFontUrl(presetId: string = 'editorial-newsreader'): string {
  return PRESET_FONT_URLS[presetId] || PRESET_FONT_URLS['editorial-newsreader'];
}

/**
 * Preload fonts for a preset (optional optimization)
 * This creates a preload hint but doesn't block rendering
 *
 * @param presetId - The ID of the typography preset
 */
export function preloadPresetFonts(presetId: string): void {
  const url = PRESET_FONT_URLS[presetId];
  if (!url || loadedFonts.has(presetId)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Check if fonts for a preset are already loaded
 *
 * @param presetId - The ID of the typography preset
 * @returns true if fonts are loaded, false otherwise
 */
export function arePresetFontsLoaded(presetId: string): boolean {
  return loadedFonts.has(presetId);
}

/**
 * Clear the loaded fonts cache (useful for testing)
 */
export function clearFontCache(): void {
  loadedFonts.clear();
}
