# Academic Template Architecture

## Overview

This document defines the complete architecture for refactoring the academic template into a modern, config-driven system following industry best practices. The refactor introduces a hybrid configuration approach that leverages both YAML for user settings and Astro Content Collections for structured content.

## Architecture Goals

1. **Config-Driven**: Single source of truth for user settings in `config.yaml`
2. **Type-Safe Content**: TypeScript schemas for all content types
3. **Dynamic Routing**: File-based routing with `[slug].astro` patterns
4. **Auto-Generated Navigation**: Navigation derived from content structure
5. **Preserve Excellence**: Maintain existing typography system and theme capabilities
6. **Developer Experience**: Clear separation of concerns, easy customization

---

## Directory Structure

```
academic-template/
├── config.yaml                          # User configuration (NEW)
├── astro.config.mjs                     # Astro configuration
├── src/
│   ├── config.ts                        # Config loader & types (MODIFIED)
│   ├── content/
│   │   ├── config.ts                    # Content schemas (MODIFIED)
│   │   ├── blog/                        # Blog posts (markdown)
│   │   │   └── [post-slug].md
│   │   ├── publications/                # Publications (markdown) (NEW)
│   │   │   └── [pub-slug].md
│   │   ├── projects/                    # Projects (markdown) (NEW)
│   │   │   └── [project-slug].md
│   │   ├── talks/                       # Talks (markdown) (NEW)
│   │   │   └── [talk-slug].md
│   │   ├── teaching/                    # Courses (markdown) (NEW)
│   │   │   └── [course-slug].md
│   │   ├── pages/                       # Custom pages (markdown) (NEW)
│   │   │   └── [page-slug].md
│   │   └── data/                        # Structured data (ORGANIZED)
│   │       ├── education.json
│   │       ├── repositories.json
│   │       └── papers.bib               # Legacy support
│   ├── pages/
│   │   ├── index.astro                  # Homepage (MODIFIED)
│   │   ├── blog/
│   │   │   ├── index.astro              # Blog index (MODIFIED)
│   │   │   └── [slug].astro             # Blog post (MODIFIED)
│   │   ├── publications/
│   │   │   ├── index.astro              # Publications index (MODIFIED)
│   │   │   └── [slug].astro             # Publication detail (NEW)
│   │   ├── projects/
│   │   │   ├── index.astro              # Projects index (MODIFIED)
│   │   │   └── [slug].astro             # Project detail (NEW)
│   │   ├── talks/
│   │   │   ├── index.astro              # Talks index (NEW)
│   │   │   └── [slug].astro             # Talk detail (NEW)
│   │   ├── teaching/
│   │   │   ├── index.astro              # Teaching index (NEW)
│   │   │   └── [slug].astro             # Course detail (NEW)
│   │   └── [...slug].astro              # Custom pages (NEW)
│   ├── layouts/
│   │   ├── BaseLayout.astro             # Main layout (MODIFIED)
│   │   ├── BlogPost.astro               # Blog layout (MODIFIED)
│   │   ├── PublicationDetail.astro      # Publication layout (NEW)
│   │   └── PageLayout.astro             # Custom page layout (NEW)
│   ├── components/
│   │   ├── Navigation.astro             # Auto-generated nav (NEW)
│   │   ├── blocks/
│   │   │   ├── PublicationCard.astro    # Pub card (MODIFIED)
│   │   │   ├── ProjectCard.astro        # Project card (EXISTS)
│   │   │   └── TalkCard.astro           # Talk card (NEW)
│   │   └── [existing components]
│   ├── lib/
│   │   ├── config-loader.ts             # Config utilities (NEW)
│   │   ├── content-helpers.ts           # Content queries (NEW)
│   │   ├── navigation-builder.ts        # Nav generation (NEW)
│   │   ├── typography-presets.ts        # Typography system (PRESERVED)
│   │   └── [existing helpers]
│   └── styles/
│       └── [existing styles]
└── docs/
    ├── ARCHITECTURE.md                  # This file
    └── MIGRATION.md                     # Migration guide (NEW)
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INPUT LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  config.yaml                 content/*/[slug].md               │
│  ┌──────────┐                ┌────────────────┐               │
│  │ Personal │                │ Blog Posts     │               │
│  │ Site     │                │ Publications   │               │
│  │ Theme    │                │ Projects       │               │
│  │ Features │                │ Talks          │               │
│  │ Social   │                │ Teaching       │               │
│  └────┬─────┘                │ Pages          │               │
│       │                      └────────┬───────┘               │
│       │                               │                        │
└───────┼───────────────────────────────┼────────────────────────┘
        │                               │
        ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  config-loader.ts            Astro Content Collections         │
│  ┌──────────────┐            ┌──────────────────┐            │
│  │ Parse YAML   │            │ Validate Schema  │            │
│  │ Merge with   │            │ Type Generation  │            │
│  │ defaults     │            │ Query API        │            │
│  │ Type export  │            │ Sort/Filter      │            │
│  └──────┬───────┘            └────────┬─────────┘            │
│         │                              │                       │
│         └──────────┬───────────────────┘                       │
│                    │                                           │
└────────────────────┼───────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  navigation-builder.ts       Page Components                   │
│  ┌──────────────────┐        ┌────────────────┐              │
│  │ Read content     │        │ [slug].astro   │              │
│  │ collections      │───────▶│ index.astro    │              │
│  │ Build nav tree   │        │ BaseLayout     │              │
│  │ Apply config     │        │ Components     │              │
│  └──────────────────┘        └────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OUTPUT LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Static HTML + CSS + JS                                         │
│  ┌──────────────────────────────────────────────────┐          │
│  │ /index.html                                      │          │
│  │ /blog/my-post/index.html                         │          │
│  │ /publications/paper-2024/index.html              │          │
│  │ /projects/my-project/index.html                  │          │
│  │ ...                                              │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuration System

### 1. User Configuration (`config.yaml`)

**File**: `/config.yaml`

```yaml
# Personal Information
personal:
  name:
    first: Jane
    middle: M
    last: Smith
  title: Assistant Professor of Computer Science
  email: jane.smith@university.edu

# Site Metadata
site:
  url: https://example.com
  title: Jane Smith
  description: Research in machine learning and NLP
  language: en

# Social Links
social:
  github: janesmith
  scholar: SCHOLAR_ID
  linkedin: janesmith
  twitter: janesmith_cs
  orcid: 0000-0001-2345-6789

# Theme Configuration
theme:
  preset: editorial-newsreader
  accentLight: "#c41e3a"
  accentDark: "#ff4d6a"
  navigationMode: sidebar  # floating | sidebar | inline

# Feature Flags
features:
  blog: true
  publications: true
  projects: true
  talks: true
  teaching: true
  darkMode: true
  animations: true
  settingsPanel: true

# Homepage Settings
homepage:
  showSelectedPublications: true
  showEducation: true
  showRecentPosts: true
  maxRecentPosts: 3

# About Page
about:
  bio: |
    I am a researcher exploring the fascinating intersection of
    computational neuroscience and interpretable machine learning...
  researchInterests: |
    My research interests span representation learning...
  affiliation:
    name: Center for Advanced Computational Research
    url: https://research.university.edu
```

**Rationale**:
- YAML is more user-friendly than TypeScript for non-developers
- Clear hierarchical structure
- Easy to comment and document
- Standard format across many static site generators

### 2. Config Loader (`src/config.ts`)

**File**: `/Users/florianmahner/academic-template/src/config.ts`

```typescript
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml'; // Use js-yaml or yaml package
import path from 'node:path';

// Type Definitions
export interface PersonalConfig {
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  title: string;
  email: string;
}

export interface SiteConfig {
  url: string;
  title: string;
  description: string;
  language: string;
}

export interface SocialConfig {
  github?: string;
  scholar?: string;
  linkedin?: string;
  twitter?: string;
  orcid?: string;
  researchgate?: string;
}

export interface ThemeConfig {
  preset: string;
  accentLight?: string;
  accentDark?: string;
  navigationMode: 'floating' | 'sidebar' | 'inline';
}

export interface FeaturesConfig {
  blog: boolean;
  publications: boolean;
  projects: boolean;
  talks: boolean;
  teaching: boolean;
  darkMode: boolean;
  animations: boolean;
  settingsPanel: boolean;
}

export interface HomepageConfig {
  showSelectedPublications: boolean;
  showEducation: boolean;
  showRecentPosts: boolean;
  maxRecentPosts: number;
}

export interface AboutConfig {
  bio: string;
  researchInterests: string;
  affiliation?: {
    name: string;
    url: string;
  };
}

export interface Config {
  personal: PersonalConfig;
  site: SiteConfig;
  social: SocialConfig;
  theme: ThemeConfig;
  features: FeaturesConfig;
  homepage: HomepageConfig;
  about: AboutConfig;
}

// Default Configuration
const defaultConfig: Config = {
  personal: {
    name: { first: 'Your', last: 'Name' },
    title: 'Researcher',
    email: 'you@example.com',
  },
  site: {
    url: 'https://example.com',
    title: 'Academic Website',
    description: 'Personal academic website',
    language: 'en',
  },
  social: {},
  theme: {
    preset: 'editorial-newsreader',
    navigationMode: 'sidebar',
  },
  features: {
    blog: true,
    publications: true,
    projects: true,
    talks: false,
    teaching: false,
    darkMode: true,
    animations: true,
    settingsPanel: true,
  },
  homepage: {
    showSelectedPublications: true,
    showEducation: true,
    showRecentPosts: false,
    maxRecentPosts: 3,
  },
  about: {
    bio: '',
    researchInterests: '',
  },
};

// Load and Parse Config
function loadConfig(): Config {
  try {
    const configPath = path.join(process.cwd(), 'config.yaml');
    const configFile = readFileSync(configPath, 'utf-8');
    const userConfig = parseYaml(configFile);

    // Deep merge with defaults
    return deepMerge(defaultConfig, userConfig);
  } catch (error) {
    console.warn('config.yaml not found, using defaults');
    return defaultConfig;
  }
}

// Deep merge utility
function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key] as any;
    }
  }
  return output;
}

// Export singleton config
export const config = loadConfig();

// Helper Functions
export function getFullName(separator = ' '): string {
  const { first, middle, last } = config.personal.name;
  return [first, middle, last].filter(Boolean).join(separator);
}

export function getSocialLinks() {
  return Object.entries(config.social)
    .filter(([_, value]) => value)
    .map(([platform, handle]) => ({
      platform,
      handle,
      url: getSocialUrl(platform, handle),
    }));
}

function getSocialUrl(platform: string, handle: string): string {
  const urls: Record<string, string> = {
    github: `https://github.com/${handle}`,
    scholar: `https://scholar.google.com/citations?user=${handle}`,
    linkedin: `https://linkedin.com/in/${handle}`,
    twitter: `https://twitter.com/${handle}`,
    orcid: `https://orcid.org/${handle}`,
    researchgate: `https://researchgate.net/profile/${handle}`,
  };
  return urls[platform] || '#';
}
```

---

## Content Collections Architecture

### 1. Content Schema (`src/content/config.ts`)

**File**: `/Users/florianmahner/academic-template/src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

// =============================================================================
// BLOG COLLECTION
// =============================================================================
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

// =============================================================================
// PUBLICATIONS COLLECTION
// =============================================================================
const publications = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    venue: z.string(), // Conference or journal name

    // Optional metadata
    venueType: z.enum(['conference', 'journal', 'workshop', 'preprint']).optional(),
    abstract: z.string().optional(),
    date: z.coerce.date().optional(),

    // Links
    pdf: z.string().url().optional(),
    html: z.string().url().optional(),
    slides: z.string().url().optional(),
    code: z.string().url().optional(),
    video: z.string().url().optional(),
    doi: z.string().optional(),
    arxiv: z.string().optional(),

    // Display options
    selected: z.boolean().default(false),
    featured: z.boolean().default(false),
    preview: z.string().optional(), // Path to preview image/gif

    // Metadata
    tags: z.array(z.string()).default([]),
    bibtex: z.string().optional(),
    award: z.string().optional(), // e.g., "Best Paper Award"
  }),
});

// =============================================================================
// PROJECTS COLLECTION
// =============================================================================
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),

    // Project metadata
    status: z.enum(['active', 'completed', 'archived']).default('active'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),

    // Links
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    website: z.string().url().optional(),
    paper: z.string().url().optional(),

    // Display
    image: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),

    // Team
    collaborators: z.array(z.object({
      name: z.string(),
      url: z.string().url().optional(),
    })).optional(),
  }),
});

// =============================================================================
// TALKS COLLECTION
// =============================================================================
const talks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),

    // Type
    type: z.enum(['keynote', 'invited', 'contributed', 'poster', 'seminar']).default('contributed'),

    // Links
    slides: z.string().url().optional(),
    video: z.string().url().optional(),
    abstract: z.string().optional(),

    // Display
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

// =============================================================================
// TEACHING COLLECTION
// =============================================================================
const teaching = defineCollection({
  type: 'content',
  schema: z.object({
    // Course info
    code: z.string(), // e.g., "CS 229"
    title: z.string(),
    semester: z.string(), // e.g., "Fall 2024"
    year: z.number(),

    // Details
    institution: z.string().optional(),
    role: z.enum(['instructor', 'co-instructor', 'teaching-assistant']).default('instructor'),
    level: z.enum(['undergraduate', 'graduate', 'phd']).optional(),

    // Links
    website: z.string().url().optional(),
    syllabus: z.string().url().optional(),

    // Stats
    enrollment: z.number().optional(),
    rating: z.number().min(0).max(5).optional(),

    // Display
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

// =============================================================================
// PAGES COLLECTION (Custom Pages)
// =============================================================================
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),

    // Navigation
    showInNav: z.boolean().default(true),
    navOrder: z.number().optional(),
    navLabel: z.string().optional(),

    // Layout
    layout: z.enum(['default', 'wide', 'minimal']).default('default'),

    // Metadata
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

// Export collections
export const collections = {
  blog,
  publications,
  projects,
  talks,
  teaching,
  pages,
};
```

### 2. Content Organization

Each content type lives in its own directory with markdown files:

```
src/content/
├── blog/
│   ├── my-first-post.md
│   └── understanding-transformers.md
├── publications/
│   ├── attention-is-all-you-need.md
│   └── bert-pretraining.md
├── projects/
│   ├── neural-summarizer.md
│   └── attention-visualizer.md
├── talks/
│   ├── neurips-2024-keynote.md
│   └── stanford-seminar.md
├── teaching/
│   ├── cs229-fall-2024.md
│   └── cs224n-winter-2024.md
└── pages/
    ├── cv.md
    └── resources.md
```

**Example Publication** (`src/content/publications/attention-is-all-you-need.md`):

```markdown
---
title: "Attention Is All You Need"
authors:
  - Ashish Vaswani
  - Noam Shazeer
  - Niki Parmar
year: 2017
venue: NeurIPS 2017
venueType: conference
abstract: "The dominant sequence transduction models..."
pdf: https://arxiv.org/pdf/1706.03762
code: https://github.com/tensorflow/tensor2tensor
selected: true
featured: true
preview: /img/papers/attention-preview.gif
tags:
  - transformers
  - attention
  - neural-networks
award: "Oral Presentation"
---

# Detailed Content (Optional)

Additional details, notes, or extended abstract can go here.
The content body is optional for publications.
```

---

## Dynamic Routing System

### 1. Route Structure

```
URL Pattern                     File                                      Purpose
─────────────────────────────────────────────────────────────────────────────────
/                              pages/index.astro                          Homepage
/blog                          pages/blog/index.astro                     Blog index
/blog/my-post                  pages/blog/[slug].astro                    Blog post
/publications                  pages/publications/index.astro             Publications index
/publications/paper-2024       pages/publications/[slug].astro            Publication detail
/projects                      pages/projects/index.astro                 Projects index
/projects/my-project           pages/projects/[slug].astro                Project detail
/talks                         pages/talks/index.astro                    Talks index
/talks/talk-2024               pages/talks/[slug].astro                   Talk detail
/teaching                      pages/teaching/index.astro                 Teaching index
/teaching/cs229-fall-2024      pages/teaching/[slug].astro                Course detail
/cv                            pages/[...slug].astro                      Custom page
```

### 2. Index Page Pattern

**File**: `/Users/florianmahner/academic-template/src/pages/publications/index.astro`

```typescript
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PublicationCard from '../../components/blocks/PublicationCard.astro';
import { config } from '../../config';

// Fetch all publications
const publications = await getCollection('publications', ({ data }) => {
  return !data.draft;
});

// Sort by year (descending) and group
const sorted = publications.sort((a, b) => b.data.year - a.data.year);
const byYear = Object.groupBy(sorted, (pub) => pub.data.year);

const title = `Publications | ${config.site.title}`;
---

<BaseLayout title={title} description={`Academic publications by ${config.personal.name.first}`}>
  <article class="publications-page">
    <div class="container">
      <h1>Publications</h1>

      {Object.entries(byYear).map(([year, pubs]) => (
        <section class="year-section" data-animate="fade-up">
          <h2 class="year-label">{year}</h2>
          <div class="publications-list" data-animate="stagger">
            {pubs.map(pub => (
              <PublicationCard publication={pub} />
            ))}
          </div>
        </section>
      ))}
    </div>
  </article>
</BaseLayout>
```

### 3. Detail Page Pattern

**File**: `/Users/florianmahner/academic-template/src/pages/publications/[slug].astro`

```typescript
---
import { getCollection, type CollectionEntry } from 'astro:content';
import PublicationDetail from '../../layouts/PublicationDetail.astro';

// Generate static paths for all publications
export async function getStaticPaths() {
  const publications = await getCollection('publications');
  return publications.map(pub => ({
    params: { slug: pub.slug },
    props: { publication: pub },
  }));
}

type Props = {
  publication: CollectionEntry<'publications'>;
};

const { publication } = Astro.props;
const { Content } = await publication.render();
---

<PublicationDetail publication={publication}>
  <Content />
</PublicationDetail>
```

### 4. Custom Pages Pattern

**File**: `/Users/florianmahner/academic-template/src/pages/[...slug].astro`

```typescript
---
import { getCollection, type CollectionEntry } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';

export async function getStaticPaths() {
  const pages = await getCollection('pages', ({ data }) => !data.draft);
  return pages.map(page => ({
    params: { slug: page.slug },
    props: { page },
  }));
}

type Props = {
  page: CollectionEntry<'pages'>;
};

const { page } = Astro.props;
const { Content } = await page.render();
---

<PageLayout page={page}>
  <Content />
</PageLayout>
```

---

## Navigation System

### 1. Auto-Generated Navigation

**File**: `/Users/florianmahner/academic-template/src/lib/navigation-builder.ts`

```typescript
import { getCollection } from 'astro:content';
import { config } from '../config';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

/**
 * Build navigation from config and content collections
 */
export async function buildNavigation(): Promise<NavItem[]> {
  const navItems: NavItem[] = [];

  // Always include homepage
  navItems.push({
    id: 'home',
    label: 'About',
    href: '/',
    order: 0,
  });

  // Add enabled feature sections
  let order = 1;

  if (config.features.blog) {
    navItems.push({
      id: 'blog',
      label: 'Blog',
      href: '/blog',
      order: order++,
    });
  }

  if (config.features.publications) {
    navItems.push({
      id: 'publications',
      label: 'Publications',
      href: '/publications',
      order: order++,
    });
  }

  if (config.features.projects) {
    navItems.push({
      id: 'projects',
      label: 'Projects',
      href: '/projects',
      order: order++,
    });
  }

  if (config.features.talks) {
    navItems.push({
      id: 'talks',
      label: 'Talks',
      href: '/talks',
      order: order++,
    });
  }

  if (config.features.teaching) {
    navItems.push({
      id: 'teaching',
      label: 'Teaching',
      href: '/teaching',
      order: order++,
    });
  }

  // Add custom pages from pages collection
  const customPages = await getCollection('pages', ({ data }) => {
    return !data.draft && data.showInNav;
  });

  customPages
    .sort((a, b) => (a.data.navOrder ?? 999) - (b.data.navOrder ?? 999))
    .forEach(page => {
      navItems.push({
        id: page.slug,
        label: page.data.navLabel || page.data.title,
        href: `/${page.slug}`,
        order: page.data.navOrder ?? order++,
      });
    });

  return navItems.sort((a, b) => a.order - b.order);
}
```

### 2. Navigation Component

**File**: `/Users/florianmahner/academic-template/src/components/Navigation.astro`

```typescript
---
import { buildNavigation } from '../lib/navigation-builder';

const navItems = await buildNavigation();
const currentPath = Astro.url.pathname;

// Apply base path
const base = import.meta.env.BASE_URL;
const itemsWithBase = navItems.map(item => ({
  ...item,
  href: base === '/' ? item.href : `${base}${item.href}`,
}));
---

<nav aria-label="Main navigation">
  <ul class="nav-list">
    {itemsWithBase.map(item => (
      <li>
        <a
          href={item.href}
          class:list={['nav-link', {
            active: currentPath === item.href ||
                    (item.href !== '/' && currentPath.startsWith(item.href))
          }]}
        >
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

---

## Layout Architecture

### 1. Base Layout (Modified)

**File**: `/Users/florianmahner/academic-template/src/layouts/BaseLayout.astro`

Key changes:
- Import Navigation component instead of hardcoded nav items
- Remove config.navigation array dependency
- Dynamic navigation based on enabled features

```typescript
---
import Navigation from '../components/Navigation.astro';
import ThemeStyles from '../components/ThemeStyles.astro';
import { config } from '../config';

interface Props {
  title: string;
  description?: string;
}

const { title, description = config.site.description } = Astro.props;
---

<!DOCTYPE html>
<html lang={config.site.language}>
  <head>
    <!-- metadata -->
    <ThemeStyles />
  </head>
  <body>
    <div class="layout-wrapper">
      <Navigation />
      <main class="main-content">
        <slot />
      </main>
      <footer>
        <!-- footer -->
      </footer>
    </div>
  </body>
</html>
```

### 2. Publication Detail Layout (New)

**File**: `/Users/florianmahner/academic-template/src/layouts/PublicationDetail.astro`

```typescript
---
import type { CollectionEntry } from 'astro:content';
import BaseLayout from './BaseLayout.astro';

interface Props {
  publication: CollectionEntry<'publications'>;
}

const { publication } = Astro.props;
const { title, authors, year, venue, abstract, pdf, code, slides, award } = publication.data;
---

<BaseLayout title={`${title} | Publications`}>
  <article class="publication-detail">
    <div class="container">
      {award && <div class="award-badge">{award}</div>}

      <h1>{title}</h1>

      <div class="meta">
        <p class="authors">{authors.join(', ')}</p>
        <p class="venue">{venue}, {year}</p>
      </div>

      {abstract && (
        <section class="abstract">
          <h2>Abstract</h2>
          <p>{abstract}</p>
        </section>
      )}

      <div class="links">
        {pdf && <a href={pdf} class="btn">PDF</a>}
        {code && <a href={code} class="btn">Code</a>}
        {slides && <a href={slides} class="btn">Slides</a>}
      </div>

      <section class="content">
        <slot />
      </section>
    </div>
  </article>
</BaseLayout>
```

### 3. Page Layout (New)

**File**: `/Users/florianmahner/academic-template/src/layouts/PageLayout.astro`

```typescript
---
import type { CollectionEntry } from 'astro:content';
import BaseLayout from './BaseLayout.astro';

interface Props {
  page: CollectionEntry<'pages'>;
}

const { page } = Astro.props;
const { title, description, layout } = page.data;
---

<BaseLayout title={title} description={description}>
  <article class:list={['custom-page', `layout-${layout}`]}>
    <div class="container">
      <h1>{title}</h1>
      <slot />
    </div>
  </article>
</BaseLayout>
```

---

## Component Architecture

### 1. Component Hierarchy

```
BaseLayout.astro
├── Navigation.astro (auto-generated)
├── ThemeStyles.astro (preserved)
├── SettingsPanel.astro (preserved)
└── Content Components
    ├── PublicationCard.astro (modified)
    ├── ProjectCard.astro (exists)
    ├── TalkCard.astro (new)
    ├── CourseCard.astro (exists)
    └── BlogPostCard.astro (exists)
```

### 2. Publication Card (Modified)

**File**: `/Users/florianmahner/academic-template/src/components/blocks/PublicationCard.astro`

```typescript
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  publication: CollectionEntry<'publications'>;
  showAbstract?: boolean;
  detailLink?: boolean;
}

const { publication, showAbstract = false, detailLink = false } = Astro.props;
const { title, authors, year, venue, preview, pdf, code, award } = publication.data;
const detailUrl = `/publications/${publication.slug}`;
---

<article class:list={['paper-card', preview && 'paper-card--with-preview']}>
  {preview && (
    <div class="paper-preview">
      <img src={preview} alt={title} loading="lazy" />
    </div>
  )}

  <div class="paper-content">
    {award && <span class="award-badge">{award}</span>}

    <div class="paper-meta">
      <span class="paper-venue">{venue}</span>
      <span class="paper-year">{year}</span>
    </div>

    <h3 class="paper-title">
      {detailLink ? (
        <a href={detailUrl}>{title}</a>
      ) : pdf ? (
        <a href={pdf} target="_blank" rel="noopener">{title}</a>
      ) : (
        title
      )}
    </h3>

    <p class="paper-authors">{authors.join(', ')}</p>

    <div class="paper-links">
      {pdf && <a href={pdf} class="paper-link">PDF</a>}
      {code && <a href={code} class="paper-link">Code</a>}
      {detailLink && <a href={detailUrl} class="paper-link">Details</a>}
    </div>
  </div>
</article>
```

---

## Content Helpers

**File**: `/Users/florianmahner/academic-template/src/lib/content-helpers.ts`

```typescript
import { getCollection, type CollectionEntry } from 'astro:content';

// =============================================================================
// PUBLICATIONS
// =============================================================================

export async function getAllPublications() {
  return await getCollection('publications', ({ data }) => !data.draft);
}

export async function getSelectedPublications() {
  const pubs = await getAllPublications();
  return pubs
    .filter(pub => pub.data.selected)
    .sort((a, b) => b.data.year - a.data.year);
}

export async function getFeaturedPublications() {
  const pubs = await getAllPublications();
  return pubs
    .filter(pub => pub.data.featured)
    .sort((a, b) => b.data.year - a.data.year);
}

export function groupPublicationsByYear(publications: CollectionEntry<'publications'>[]) {
  return publications.reduce((acc, pub) => {
    const year = pub.data.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {} as Record<number, CollectionEntry<'publications'>[]>);
}

// =============================================================================
// BLOG
// =============================================================================

export async function getAllBlogPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getRecentBlogPosts(limit = 3) {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

// =============================================================================
// PROJECTS
// =============================================================================

export async function getAllProjects() {
  return await getCollection('projects');
}

export async function getFeaturedProjects() {
  const projects = await getAllProjects();
  return projects.filter(proj => proj.data.featured);
}

// =============================================================================
// TALKS
// =============================================================================

export async function getAllTalks() {
  const talks = await getCollection('talks');
  return talks.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getFeaturedTalks() {
  const talks = await getAllTalks();
  return talks.filter(talk => talk.data.featured);
}

// =============================================================================
// TEACHING
// =============================================================================

export async function getAllCourses() {
  const courses = await getCollection('teaching');
  return courses.sort((a, b) => b.data.year - a.data.year);
}

export async function getRecentCourses(limit = 3) {
  const courses = await getAllCourses();
  return courses.slice(0, limit);
}
```

---

## File Naming Conventions

### Content Files
- **Slugs**: Use kebab-case for all content file names
  - ✅ `attention-is-all-you-need.md`
  - ✅ `neurips-2024-keynote.md`
  - ❌ `AttentionIsAllYouNeed.md`
  - ❌ `NeurIPS_2024_Keynote.md`

### Component Files
- **Astro Components**: PascalCase
  - ✅ `PublicationCard.astro`
  - ✅ `NavigationMenu.astro`

### Utility Files
- **TypeScript Utilities**: kebab-case
  - ✅ `content-helpers.ts`
  - ✅ `navigation-builder.ts`

### Page Files
- **Static Pages**: kebab-case or index
  - ✅ `index.astro`
  - ✅ `[slug].astro`

---

## API & Interface Definitions

### 1. Config API

```typescript
// Global config access
import { config } from '@/config';

// Config sections
config.personal      // Personal information
config.site          // Site metadata
config.social        // Social links
config.theme         // Theme settings
config.features      // Feature flags
config.homepage      // Homepage settings
config.about         // About page content

// Helper functions
import { getFullName, getSocialLinks } from '@/config';

const name = getFullName();
const socials = getSocialLinks();
```

### 2. Content Collections API

```typescript
import { getCollection, getEntry } from 'astro:content';

// Fetch all items in a collection
const publications = await getCollection('publications');
const blogPosts = await getCollection('blog');

// Fetch single item by slug
const pub = await getEntry('publications', 'my-paper-2024');

// Filter collection
const published = await getCollection('blog', ({ data }) => {
  return !data.draft;
});

// Render content
const { Content } = await pub.render();
```

### 3. Navigation API

```typescript
import { buildNavigation } from '@/lib/navigation-builder';

// Get navigation items
const navItems = await buildNavigation();
// Returns: NavItem[]
```

### 4. Content Helpers API

```typescript
import {
  getAllPublications,
  getSelectedPublications,
  getFeaturedPublications,
  groupPublicationsByYear,
  getAllBlogPosts,
  getRecentBlogPosts,
} from '@/lib/content-helpers';

// Usage
const selected = await getSelectedPublications();
const recent = await getRecentBlogPosts(5);
```

---

## Migration Strategy

### Phase 1: Config System
1. Create `config.yaml` with default values
2. Implement config loader in `src/config.ts`
3. Update existing components to use new config
4. Test backward compatibility

### Phase 2: Content Collections
1. Define schemas in `src/content/config.ts`
2. Create content directories
3. Migrate existing JSON data to markdown files
4. Create helper functions

### Phase 3: Dynamic Routing
1. Create `[slug].astro` pages for each collection
2. Implement detail layouts
3. Update index pages to use collections
4. Test all routes

### Phase 4: Navigation
1. Implement navigation builder
2. Create Navigation component
3. Update BaseLayout to use auto-navigation
4. Remove hardcoded nav arrays

### Phase 5: Testing & Polish
1. Test all routes and links
2. Verify theme system still works
3. Check mobile responsiveness
4. Performance audit

---

## Backward Compatibility

### Legacy Support
- Keep `src/content/data/papers.bib` support via bibtex loader
- Support both JSON and markdown for publications
- Maintain existing component APIs
- Preserve all theme presets and styles

### Migration Path
- Provide migration scripts for JSON → Markdown
- Document manual migration steps
- Support gradual migration (both systems work)

---

## Performance Considerations

1. **Static Generation**: All routes pre-rendered at build time
2. **Type Safety**: Full TypeScript support via Astro Content Collections
3. **Bundle Size**: No runtime config parsing (YAML parsed at build time)
4. **SEO**: Structured data and metadata from content frontmatter

---

## Testing Requirements

### Unit Tests
- Config loader with various YAML inputs
- Navigation builder with different feature flags
- Content helpers filtering and sorting

### Integration Tests
- Route generation for all content types
- Navigation updates when features disabled
- Theme system with new config format

### E2E Tests
- Homepage loads with config
- All index pages render
- Detail pages accessible
- Navigation links work

---

## Documentation Deliverables

1. **ARCHITECTURE.md** (this file)
2. **MIGRATION.md** - Step-by-step migration guide
3. **CONFIG_REFERENCE.md** - Complete config.yaml documentation
4. **CONTENT_GUIDE.md** - How to create content
5. **THEMING_GUIDE.md** - Typography and theme system (preserved)

---

## Success Criteria

- ✅ Single `config.yaml` file for all settings
- ✅ Type-safe content schemas for all collections
- ✅ Dynamic routing with `[slug].astro` patterns
- ✅ Auto-generated navigation from content
- ✅ All typography presets preserved
- ✅ Theme system fully functional
- ✅ Backward compatible with existing data
- ✅ Clear documentation for users

---

## Next Steps for Implementation

1. **Architect** (this document) defines structure
2. **Coder Agent** implements config system and schemas
3. **Coder Agent** implements routing and layouts
4. **Coder Agent** implements navigation builder
5. **Tester Agent** validates all functionality
6. **Reviewer Agent** ensures code quality
7. **Documentation Agent** writes user guides

---

**Document Version**: 1.0
**Last Updated**: 2025-12-04
**Status**: Architecture Complete - Ready for Implementation
