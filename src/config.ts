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
    scholar: "EXAMPLE_ID", // Google Scholar ID
    linkedin: "janesmith",
    twitter: "janesmith_cs",
    orcid: "0000-0001-2345-6789",
    researchgate: "",
  },

  // ==========================================================================
  // SITE METADATA
  // ==========================================================================

  site: {
    url: "https://florianmahner.github.io/academic",
    title: "Jane Smith",
    description: "Personal academic website of Jane Smith - Research in machine learning, natural language processing, and computational linguistics",
    language: "en",
  },

  // ==========================================================================
  // NAVIGATION
  // ==========================================================================

  // Navigation items (order matters!)
  navigation: [
    { id: "about", label: "About", href: "/" },
    { id: "publications", label: "Publications", href: "/publications" },
    { id: "open-source", label: "Open Source", href: "/open-source" },
    { id: "misc", label: "Misc", href: "/misc" },
    // Add more pages here:
    // { id: "cv", label: "CV", href: "/cv" },
    // { id: "blog", label: "Blog", href: "/blog" },
  ],

  // Navigation display mode
  // "floating" - Safari-style pill at bottom (auto-hides on scroll)
  // "sidebar" - Fixed left sidebar navigation
  // "inline" - Traditional header navigation
  navigationMode: "sidebar" as const,

  // ==========================================================================
  // THEME SYSTEM
  // ==========================================================================

  theme: {
    // Default typography preset
    // Options: "crimson-classic", "editorial-newsreader", "modern-geist",
    //          "classic-playfair", "brutalist-space", "humanist-inter"
    defaultPreset: "editorial-newsreader",

    // Optional: Override preset accent colors
    accentLight: undefined as string | undefined, // e.g., "#c41e3a"
    accentDark: undefined as string | undefined,  // e.g., "#ff4d6a"
  },

  // ==========================================================================
  // FEATURES
  // ==========================================================================

  features: {
    selectedPublications: true,  // Show selected papers on homepage
    education: true,             // Show academic background on homepage
    darkMode: true,              // Enable dark/light mode toggle
    animations: true,            // Enable GSAP scroll animations
    settingsPanel: true,         // Show settings gear icon for customization
  },

  // ==========================================================================
  // ABOUT PAGE CONTENT
  // ==========================================================================

  about: {
    // Main bio paragraph
    bio: "I am an Assistant Professor of Computer Science at University Name. My research focuses on machine learning, natural language processing, and their applications to real-world problems.",

    // Research interests section
    researchInterests: "My research interests include deep learning, computational linguistics, and neural machine translation.",

    // Current affiliation
    affiliation: {
      name: "AI Research Lab",
      url: "https://ai-lab.university.edu",
    },
  },

  // ==========================================================================
  // FOOTER
  // ==========================================================================

  footer: {
    copyright: true, // Show copyright with current year
    links: [
      { label: "Email", href: "mailto:jane.smith@university.edu" },
    ],
  },
};

// Type exports
export type SiteConfig = typeof config;
