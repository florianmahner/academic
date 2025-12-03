/**
 * Theme Preset Definitions
 *
 * Each preset defines a complete visual identity including colors,
 * typography, spacing, and component styling.
 */

export interface PresetColors {
  bg: string;
  bgAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  border: string;
  borderLight: string;
}

export interface PresetFonts {
  heading: string;
  body: string;
  ui: string;
  mono: string;
  weights: string; // Google Fonts weights to load
}

export interface PresetSpacing {
  rhythm: 'tight' | 'normal' | 'generous';
  section: string;
  element: string;
  component: string;
}

export interface PresetComponents {
  cardBorder: string;
  cardRadius: string;
  cardShadow: string;
  cardHoverBg: string;
  cardHoverTransform: string;
  buttonRadius: string;
  buttonWeight: string;
  linkDecoration: string;
  badgeStyle: 'pill' | 'square' | 'minimal';
}

export interface PresetNavigation {
  preferredMode: 'inline' | 'minimal' | 'floating-icon' | 'sidebar';
  weight: string;
  case: 'none' | 'lowercase' | 'uppercase';
  tracking: string;
  activeIndicator: 'underline' | 'background' | 'weight' | 'accent';
}

export interface PresetMotion {
  pageLoad: 'fade' | 'slide-up' | 'scale' | 'none';
  staggerDelay: string;
  hoverTransition: string;
}

export interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  fonts: PresetFonts;
  colors: {
    light: PresetColors;
    dark: PresetColors;
  };
  spacing: PresetSpacing;
  components: PresetComponents;
  navigation: PresetNavigation;
  motion: PresetMotion;
}

/**
 * Monograph - Scholarly Elegance
 *
 * Inspired by Edward Tufte books, academic monographs, and classical typography.
 * Warm, sophisticated, timeless.
 */
export const monograph: PresetDefinition = {
  id: 'monograph',
  name: 'Monograph',
  description: 'Scholarly elegance with warm cream tones and classic serif typography',
  fonts: {
    heading: "'Crimson Pro', Georgia, serif",
    body: "'Crimson Pro', Georgia, serif",
    ui: "'Space Grotesk', system-ui, sans-serif",
    mono: "'JetBrains Mono', Consolas, monospace",
    weights: '400;500;600;700',
  },
  colors: {
    light: {
      bg: '#FFFDF7',
      bgAlt: '#F9F6EE',
      text: '#2D2A24',
      textSecondary: '#5C5750',
      textMuted: '#8A857C',
      accent: '#8B2332',
      accentHover: '#6E1C28',
      border: '#E8E4DA',
      borderLight: '#F0EDE5',
    },
    dark: {
      bg: '#1A1917',
      bgAlt: '#252320',
      text: '#E8E4DA',
      textSecondary: '#B5B0A6',
      textMuted: '#7A756C',
      accent: '#D94F5C',
      accentHover: '#E87580',
      border: '#3A3833',
      borderLight: '#2D2B28',
    },
  },
  spacing: {
    rhythm: 'generous',
    section: '5rem',
    element: '1.5rem',
    component: '1.25rem',
  },
  components: {
    cardBorder: 'none',
    cardRadius: '4px',
    cardShadow: 'none',
    cardHoverBg: 'var(--color-bg-alt)',
    cardHoverTransform: 'none',
    buttonRadius: '4px',
    buttonWeight: '400',
    linkDecoration: 'underline',
    badgeStyle: 'minimal',
  },
  navigation: {
    preferredMode: 'inline',
    weight: '400',
    case: 'none',
    tracking: '0',
    activeIndicator: 'accent',
  },
  motion: {
    pageLoad: 'fade',
    staggerDelay: '80ms',
    hoverTransition: '200ms ease-out',
  },
};

/**
 * Brutalist - Bold & Raw
 *
 * Inspired by Bloomberg Businessweek, concrete architecture, and bold editorial design.
 * High-impact, structural, unapologetic.
 */
export const brutalist: PresetDefinition = {
  id: 'brutalist',
  name: 'Brutalist',
  description: 'Bold, raw design with extreme typographic contrast and hard edges',
  fonts: {
    heading: "'Bricolage Grotesque', system-ui, sans-serif",
    body: "'IBM Plex Sans', system-ui, sans-serif",
    ui: "'Bricolage Grotesque', system-ui, sans-serif",
    mono: "'IBM Plex Mono', Consolas, monospace",
    weights: '200;400;500;800',
  },
  colors: {
    light: {
      bg: '#FFFFFF',
      bgAlt: '#F5F5F5',
      text: '#000000',
      textSecondary: '#333333',
      textMuted: '#666666',
      accent: '#FF3E00',
      accentHover: '#CC3200',
      border: '#000000',
      borderLight: '#CCCCCC',
    },
    dark: {
      bg: '#000000',
      bgAlt: '#111111',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      textMuted: '#888888',
      accent: '#FF5722',
      accentHover: '#FF7A4D',
      border: '#FFFFFF',
      borderLight: '#333333',
    },
  },
  spacing: {
    rhythm: 'tight',
    section: '4rem',
    element: '0.75rem',
    component: '1rem',
  },
  components: {
    cardBorder: '2px solid var(--color-border)',
    cardRadius: '0',
    cardShadow: 'none',
    cardHoverBg: 'var(--color-bg-alt)',
    cardHoverTransform: 'none',
    buttonRadius: '0',
    buttonWeight: '800',
    linkDecoration: 'underline 2px',
    badgeStyle: 'square',
  },
  navigation: {
    preferredMode: 'minimal',
    weight: '800',
    case: 'uppercase',
    tracking: '0.1em',
    activeIndicator: 'underline',
  },
  motion: {
    pageLoad: 'slide-up',
    staggerDelay: '50ms',
    hoverTransition: '100ms linear',
  },
};

/**
 * Softwave - Modern & Approachable
 *
 * Inspired by Linear, Raycast, Vercel, and Arc browser.
 * Calm, contemporary, polished.
 */
export const softwave: PresetDefinition = {
  id: 'softwave',
  name: 'Softwave',
  description: 'Modern, approachable design with soft shadows and rounded elements',
  fonts: {
    heading: "'Plus Jakarta Sans', system-ui, sans-serif",
    body: "'Plus Jakarta Sans', system-ui, sans-serif",
    ui: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'Fira Code', Consolas, monospace",
    weights: '400;500;600;700',
  },
  colors: {
    light: {
      bg: '#FAFBFD',
      bgAlt: '#F3F5F8',
      text: '#1A1D23',
      textSecondary: '#4A5067',
      textMuted: '#8891A5',
      accent: '#5B5CFF',
      accentHover: '#4747E5',
      border: '#E5E8EE',
      borderLight: '#EFF1F5',
    },
    dark: {
      bg: '#0D0F14',
      bgAlt: '#181B24',
      text: '#ECEEF3',
      textSecondary: '#A5ABB8',
      textMuted: '#6B7280',
      accent: '#7B7CFF',
      accentHover: '#9B9CFF',
      border: '#2D3142',
      borderLight: '#1F222D',
    },
  },
  spacing: {
    rhythm: 'normal',
    section: '5rem',
    element: '1.25rem',
    component: '1.5rem',
  },
  components: {
    cardBorder: '1px solid var(--color-border-light)',
    cardRadius: '12px',
    cardShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
    cardHoverBg: 'var(--color-bg)',
    cardHoverTransform: 'translateY(-2px)',
    buttonRadius: '8px',
    buttonWeight: '500',
    linkDecoration: 'none',
    badgeStyle: 'pill',
  },
  navigation: {
    preferredMode: 'floating-icon',
    weight: '500',
    case: 'none',
    tracking: '0',
    activeIndicator: 'background',
  },
  motion: {
    pageLoad: 'scale',
    staggerDelay: '100ms',
    hoverTransition: '250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

/**
 * Terminal - Hacker Aesthetic
 *
 * Inspired by Dracula theme, Tokyo Night, VS Code, and terminal interfaces.
 * Technical, high-density, for the command-line devotee.
 */
export const terminal: PresetDefinition = {
  id: 'terminal',
  name: 'Terminal',
  description: 'Hacker aesthetic with monospace typography and IDE-inspired colors',
  fonts: {
    heading: "'Space Grotesk', system-ui, sans-serif",
    body: "'Space Grotesk', system-ui, sans-serif",
    ui: "'JetBrains Mono', Consolas, monospace",
    mono: "'JetBrains Mono', Consolas, monospace",
    weights: '400;500;700',
  },
  colors: {
    light: {
      bg: '#F7F7F9',
      bgAlt: '#EEEEF2',
      text: '#2D2E3A',
      textSecondary: '#555566',
      textMuted: '#888899',
      accent: '#22AA44',
      accentHover: '#119933',
      border: '#D4D4DC',
      borderLight: '#E8E8ED',
    },
    dark: {
      bg: '#0F111A',
      bgAlt: '#1A1D2E',
      text: '#A9B7C6',
      textSecondary: '#6B7894',
      textMuted: '#464E5E',
      accent: '#89DDFF',
      accentHover: '#B8E8FF',
      border: '#2D3548',
      borderLight: '#232736',
    },
  },
  spacing: {
    rhythm: 'tight',
    section: '3rem',
    element: '0.75rem',
    component: '0.75rem',
  },
  components: {
    cardBorder: '1px solid var(--color-border)',
    cardRadius: '4px',
    cardShadow: 'none',
    cardHoverBg: 'var(--color-bg-alt)',
    cardHoverTransform: 'none',
    buttonRadius: '4px',
    buttonWeight: '500',
    linkDecoration: 'none',
    badgeStyle: 'square',
  },
  navigation: {
    preferredMode: 'sidebar',
    weight: '400',
    case: 'lowercase',
    tracking: '0.02em',
    activeIndicator: 'accent',
  },
  motion: {
    pageLoad: 'fade',
    staggerDelay: '30ms',
    hoverTransition: '150ms linear',
  },
};

/**
 * All available presets
 */
export const presets: Record<string, PresetDefinition> = {
  monograph,
  brutalist,
  softwave,
  terminal,
};

/**
 * Get a preset by ID with fallback to monograph
 */
export function getPreset(id: string): PresetDefinition {
  return presets[id] || presets.monograph;
}

/**
 * Get all preset IDs
 */
export function getPresetIds(): string[] {
  return Object.keys(presets);
}

/**
 * Build Google Fonts URL for a preset
 */
export function buildGoogleFontsUrl(preset: PresetDefinition): string {
  const fontFamilies = new Set<string>();

  // Extract font family names (first part before comma)
  [preset.fonts.heading, preset.fonts.body, preset.fonts.ui, preset.fonts.mono].forEach(font => {
    const family = font.split(',')[0].replace(/'/g, '').trim();
    // Skip system fonts
    if (!['system-ui', 'Georgia', 'Consolas', 'monospace', 'sans-serif', 'serif'].includes(family)) {
      fontFamilies.add(family);
    }
  });

  if (fontFamilies.size === 0) return '';

  const families = Array.from(fontFamilies)
    .map(f => `family=${f.replace(/ /g, '+')}:wght@${preset.fonts.weights}`)
    .join('&');

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export type ThemePreset = keyof typeof presets;
