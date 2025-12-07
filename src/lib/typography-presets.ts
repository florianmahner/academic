/**
 * Typography Presets
 *
 * Central configuration for typography themes.
 * Each preset defines fonts, colors, and typographic properties.
 *
 * Usage:
 * - Presets are applied via data-typography="preset-id" on <html>
 * - CSS custom properties are set based on the active preset
 * - Use SettingsPanel component to switch presets
 */

export interface TypographyPreset {
  id: string;
  name: string;
  description: string;
  fonts: {
    body: string;
    heading: string;
    ui: string;
    mono: string;
  };
  // Google Fonts URL parameters (for special loading like italic, optical sizing)
  fontParams?: Record<string, string>;
  colors: {
    accentLight: string;
    accentDark: string;
  };
  styles: {
    headingStyle: 'normal' | 'italic';
    headingWeight: number;
    bodyWeight: number;
    letterSpacing: 'tight' | 'normal' | 'wide';
  };
}

export const typographyPresets: TypographyPreset[] = [
  // ============================================
  // PRESET 1: Current Default (Crimson Pro)
  // ============================================
  {
    id: 'crimson-classic',
    name: 'Crimson Classic',
    description: 'Current default - traditional academic serif throughout',
    fonts: {
      body: 'Crimson Pro',
      heading: 'Crimson Pro',
      ui: 'Crimson Pro',
      mono: 'JetBrains Mono',
    },
    colors: {
      accentLight: '#c41e3a',
      accentDark: '#ff4d6a',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 400,
      bodyWeight: 400,
      letterSpacing: 'normal',
    },
  },

  // ============================================
  // PRESET 2: Editorial Newsreader (luxeyahtzee inspired)
  // ============================================
  {
    id: 'editorial-newsreader',
    name: 'Editorial Newsreader',
    description: 'Magazine-style with italic headings + mono labels',
    fonts: {
      body: 'Newsreader',
      heading: 'Newsreader',
      ui: 'JetBrains Mono',
      mono: 'JetBrains Mono',
    },
    fontParams: {
      'Newsreader': 'ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400;1,6..72,500',
    },
    colors: {
      accentLight: '#44403c',
      accentDark: '#d6d3d1',
    },
    styles: {
      headingStyle: 'italic',
      headingWeight: 400,
      bodyWeight: 400,
      letterSpacing: 'normal',
    },
  },

  // ============================================
  // PRESET 3: Modern Geist (Vercel-style)
  // ============================================
  {
    id: 'modern-geist',
    name: 'Modern Geist',
    description: 'Clean tech aesthetic inspired by Vercel',
    fonts: {
      body: 'Geist',
      heading: 'Geist',
      ui: 'Geist',
      mono: 'Geist Mono',
    },
    colors: {
      accentLight: '#000000',
      accentDark: '#ffffff',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: 'tight',
    },
  },

  // ============================================
  // PRESET 4: Classic Playfair
  // ============================================
  {
    id: 'classic-playfair',
    name: 'Classic Playfair',
    description: 'Traditional elegance with high-contrast serif',
    fonts: {
      body: 'Lora',
      heading: 'Playfair Display',
      ui: 'Lora',
      mono: 'JetBrains Mono',
    },
    colors: {
      accentLight: '#1a365d',
      accentDark: '#90cdf4',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: 'normal',
    },
  },

  // ============================================
  // PRESET 5: Brutalist Space
  // ============================================
  {
    id: 'brutalist-space',
    name: 'Brutalist Space',
    description: 'Bold contemporary with geometric sans',
    fonts: {
      body: 'Space Grotesk',
      heading: 'Space Grotesk',
      ui: 'Space Grotesk',
      mono: 'Space Mono',
    },
    colors: {
      accentLight: '#18181b',
      accentDark: '#fafafa',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: 'wide',
    },
  },

  // ============================================
  // PRESET 6: Humanist Inter
  // ============================================
  {
    id: 'humanist-inter',
    name: 'Humanist Inter',
    description: 'Warm, friendly sans-serif for readability',
    fonts: {
      body: 'Inter',
      heading: 'Inter',
      ui: 'Inter',
      mono: 'JetBrains Mono',
    },
    colors: {
      accentLight: '#2563eb',
      accentDark: '#60a5fa',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: 'normal',
    },
  },

  // ============================================
  // PRESET 7: Elegant Josefin
  // ============================================
  {
    id: 'elegant-josefin',
    name: 'Elegant Josefin',
    description: 'Geometric elegance with vintage charm',
    fonts: {
      body: 'Josefin Sans',
      heading: 'Josefin Sans',
      ui: 'Josefin Sans',
      mono: 'JetBrains Mono',
    },
    fontParams: {
      'Josefin Sans': 'ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400',
    },
    colors: {
      accentLight: '#9333ea',
      accentDark: '#c084fc',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 600,
      bodyWeight: 300,
      letterSpacing: 'wide',
    },
  },

  // ============================================
  // PRESET 8: Clean Roboto
  // ============================================
  {
    id: 'clean-roboto',
    name: 'Clean Roboto',
    description: 'Google\'s versatile workhorse typeface',
    fonts: {
      body: 'Roboto',
      heading: 'Roboto',
      ui: 'Roboto',
      mono: 'Roboto Mono',
    },
    colors: {
      accentLight: '#0891b2',
      accentDark: '#22d3ee',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: 'normal',
    },
  },

  // ============================================
  // PRESET 9: Refined Jost
  // ============================================
  {
    id: 'refined-jost',
    name: 'Refined Jost',
    description: 'Bauhaus-inspired geometric elegance',
    fonts: {
      body: 'Jost',
      heading: 'Jost',
      ui: 'Jost',
      mono: 'JetBrains Mono',
    },
    fontParams: {
      'Jost': 'ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,400',
    },
    colors: {
      accentLight: '#7c3aed',
      accentDark: '#a78bfa',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: 'normal',
    },
  },

  // ============================================
  // PRESET 10: Editorial Instrument
  // ============================================
  {
    id: 'editorial-instrument',
    name: 'Editorial Instrument',
    description: 'Refined condensed sans for editorial elegance',
    fonts: {
      body: 'Instrument Sans',
      heading: 'Instrument Sans',
      ui: 'Instrument Sans',
      mono: 'JetBrains Mono',
    },
    fontParams: {
      'Instrument Sans': 'ital,wght@0,400;0,500;0,600;0,700;1,400;1,500',
    },
    colors: {
      accentLight: '#0f172a',
      accentDark: '#e2e8f0',
    },
    styles: {
      headingStyle: 'normal',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: 'tight',
    },
  },
];

// Default preset ID
export const DEFAULT_PRESET_ID = 'editorial-newsreader';

// Get preset by ID
export function getPreset(id: string): TypographyPreset {
  return typographyPresets.find(p => p.id === id) ?? typographyPresets[0];
}

// Type export
export type { TypographyPreset as Preset };
