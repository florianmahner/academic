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
    bio: "I am a researcher exploring the fascinating intersection of <a href='https://en.wikipedia.org/wiki/Computational_neuroscience' target='_blank'>computational neuroscience</a> and <a href='https://distill.pub' target='_blank'>interpretable machine learning</a>. My work investigates how artificial systems can learn, reason, and adapt in ways that mirror—and sometimes surpass—biological intelligence. I'm particularly drawn to questions that bridge theory and practice, from <a href='https://colah.github.io/posts/2015-08-Understanding-LSTMs/' target='_blank'>understanding neural architectures</a> to building tools that democratize access to <a href='https://huggingface.co' target='_blank'>state-of-the-art AI</a>.",

    // Research interests section
    researchInterests: "My research interests span representation learning, computational cognitive modeling, and the philosophical implications of artificial intelligence. I believe the most interesting questions emerge at disciplinary boundaries—where computer science meets neuroscience, where statistics meets epistemology, and where <a href='https://arxiv.org/abs/1706.03762' target='_blank'>engineering breakthroughs</a> inspire new scientific hypotheses. I'm also fascinated by <a href='https://www.lesswrong.com' target='_blank'>AI alignment</a>, open science, and finding elegant solutions to problems that seem impossibly complex. When I'm not writing code or reading papers, you'll find me contributing to <a href='https://github.com/pytorch/pytorch' target='_blank'>open-source projects</a>, exploring <a href='https://www.kaggle.com' target='_blank'>interesting datasets</a>, or pondering whether <a href='https://xkcd.com/1425/' target='_blank'>my model is actually learning anything meaningful</a>. Always happy to collaborate on ambitious research ideas or discuss the latest developments in the field over coffee (virtual or otherwise).",

    // Current affiliation
    affiliation: {
      name: "Center for Advanced Computational Research",
      url: "https://research.university.edu",
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
