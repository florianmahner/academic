/**
 * Site Configuration
 * Edit this file to customize your website
 */

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

  // Pages to show in nav bar (order matters)
  // Items are automatically filtered based on sections config above
  navigation: [
    { id: "about", label: "About", href: "/" },
    { id: "publications", label: "Publications", href: "/publications" },
    { id: "open-source", label: "Open Source", href: "/open-source" },
    { id: "cv", label: "CV", href: "/cv" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "teaching", label: "Teaching", href: "/teaching" },
    { id: "blog", label: "Blog", href: "/blog" },
    { id: "misc", label: "Misc", href: "/misc" },
  ],

  // Navigation style: "inline" | "floating-icon" | "minimal"
  navigationMode: "inline" as const,

  // ==========================================================================
  // THEME CUSTOMIZATION
  // ==========================================================================

  theme: {
    // Accent color (used for links, highlights)
    accentLight: "#2563eb", // Blue
    accentDark: "#60a5fa",

    // Font families (loaded from Google Fonts)
    fonts: {
      body: "Source Sans 3",
      heading: "Source Sans 3",
      ui: "Inter",
      mono: "JetBrains Mono",
    },

    // Content width (max-width of main content)
    contentWidth: "750px",
  },

  // Feature toggles
  features: {
    selectedPublications: true,
    education: true,
    darkMode: true,
    animations: true,
  },

  // Footer links (in addition to social)
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

// Type exports for use in components
export type SiteConfig = typeof config;
export type SectionKey = keyof typeof config.sections;
