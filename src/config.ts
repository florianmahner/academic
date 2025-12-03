/**
 * Site Configuration
 * Edit this file to customize your website
 */

import type { ThemePreset } from './lib/presets';

export const config = {
  // ==========================================================================
  // PERSONAL INFORMATION
  // ==========================================================================

  name: {
    first: "Jane",
    middle: "M",
    last: "Smith",
  },

  // Professional title/tagline
  title: "Assistant Professor of Computer Science",

  // Contact & Social Links (leave empty string to hide)
  email: "jane.smith@university.edu",
  social: {
    github: "janesmith",
    scholar: "EXAMPLE_ID",
    linkedin: "janesmith",
    twitter: "janesmith_cs",
    orcid: "0000-0001-2345-6789",
    researchgate: "",
  },

  // ==========================================================================
  // SITE METADATA
  // ==========================================================================

  site: {
    url: "https://janesmith.github.io",
    title: "Jane Smith",
    description: "Personal academic website of Jane Smith - Research in machine learning, natural language processing, and computational linguistics",
    language: "en",
  },

  // ==========================================================================
  // SECTIONS
  // Enable/disable site sections (pages)
  // ==========================================================================

  sections: {
    publications: true,
    opensource: true,
    misc: true,
    cv: true,
    projects: true,
    teaching: true,
    blog: true,
  },

  // ==========================================================================
  // NAVIGATION
  // ==========================================================================

  navigation: {
    // Navigation display mode
    // "inline" - Horizontal nav at top
    // "minimal" - Compact fixed top bar, hides on scroll
    // "floating-icon" - Fixed circular button bottom-right
    // "sidebar" - Vertical nav on left side
    mode: "inline" as const,

    // Navigation items (order matters)
    // Items are automatically filtered based on sections config
    items: [
      { id: "about", label: "About", href: "/" },
      { id: "publications", label: "Publications", href: "/publications" },
      { id: "open-source", label: "Open Source", href: "/open-source" },
      { id: "cv", label: "CV", href: "/cv" },
      { id: "projects", label: "Projects", href: "/projects" },
      { id: "teaching", label: "Teaching", href: "/teaching" },
      { id: "blog", label: "Blog", href: "/blog" },
      { id: "misc", label: "Misc", href: "/misc" },
    ],

    // Optional style overrides (uses preset defaults if not set)
    style: {
      case: undefined as "none" | "lowercase" | "uppercase" | undefined,
      weight: undefined as string | undefined,
    },
  },

  // ==========================================================================
  // THEME SYSTEM
  // ==========================================================================

  theme: {
    // Theme preset selection
    // "monograph" - Scholarly elegance, warm cream tones, Crimson Pro
    // "brutalist" - Bold & raw, black/white/orange, extreme contrast
    // "softwave" - Modern & calm, soft violet-blue, rounded elements
    // "terminal" - Hacker aesthetic, IDE colors, monospace
    preset: "monograph" as ThemePreset,

    // Color mode settings
    colorMode: {
      default: "system" as const, // "light" | "dark" | "system"
      enableToggle: true,
    },

    // Override preset values (optional - merged with preset defaults)
    overrides: {
      // Font overrides
      fonts: {
        heading: undefined as string | undefined,
        body: undefined as string | undefined,
        ui: undefined as string | undefined,
        mono: undefined as string | undefined,
      },

      // Color overrides
      colors: {
        accent: undefined as string | undefined,
        accentDark: undefined as string | undefined,
      },

      // Layout overrides
      layout: {
        contentWidth: "750px",
      },
    },
  },

  // ==========================================================================
  // MOTION & ANIMATIONS
  // ==========================================================================

  motion: {
    enabled: true,
    reduceMotion: "respect-system" as const, // "respect-system" | "reduce" | "none"
    pageTransitions: true,
    staggerAnimations: true,
  },

  // ==========================================================================
  // FEATURES
  // ==========================================================================

  features: {
    selectedPublications: true, // Show selected papers on homepage
    education: true, // Show education section on homepage
    darkMode: true, // Enable dark mode toggle
  },

  // ==========================================================================
  // FOOTER
  // ==========================================================================

  footer: {
    copyright: true,
    links: [
      { label: "Email", href: "mailto:jane.smith@university.edu" },
    ],
  },

  // ==========================================================================
  // BLOG SETTINGS
  // ==========================================================================

  blog: {
    postsPerPage: 10,
    showDrafts: false,
    dateFormat: "MMMM D, YYYY",
  },
};

// Type exports
export type SiteConfig = typeof config;
export type SectionKey = keyof typeof config.sections;
export type NavigationMode = typeof config.navigation.mode;
export type ColorMode = typeof config.theme.colorMode.default;
