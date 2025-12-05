# Layout System Architecture: Frontmatter-Based Configuration

**Version:** 2.0
**Status:** Design Document
**Author:** System Architect
**Date:** 2025-12-05

---

## 1. Executive Summary

This document outlines the architecture for migrating layout configurations from the centralized `config.yaml` to **frontmatter-based** definitions in markdown files. This design achieves:

- **Content-driven layouts**: Each collection index defines its own presentation
- **Content ownership**: Layout logic lives with the content, not global config
- **Individual overrides**: Single entries can customize their display
- **Simplified config.yaml**: Focus on site-level concerns only

---

## 2. Current System vs. Proposed System

### 2.1 Current Architecture (Centralized)

```
config.yaml
  ├── layouts.default: "list"
  ├── layouts.list: { groupBy, showThumbnail, ... }
  ├── layouts.cards: { style, columns, ... }
  └── collections.blog: { layout, config }
           ↓
    [Index Page Logic]
           ↓
    Hardcoded rendering
```

**Problems:**
- Layout config separated from content
- Collection owners can't control presentation without editing global config
- No per-entry customization
- config.yaml becomes bloated with display logic

### 2.2 Proposed Architecture (Frontmatter-Based)

```
src/content/pages/blog.md
  └── frontmatter:
        ├── layout: "list"
        ├── collection: "blog"
        └── layoutConfig: { groupBy: "year", ... }
           ↓
    [Dynamic Index Page]
           ↓
    LayoutDispatcher.astro
           ↓
    ListLayout / CardsLayout / TimelineLayout
```

**Benefits:**
- Self-contained: Each collection defines its presentation
- Portable: Move content collection → layout definition moves with it
- Override-friendly: Individual entries can customize display
- Clean separation: config.yaml only handles site-level concerns

---

## 3. Architecture Overview

### 3.1 Component Layers

```
┌─────────────────────────────────────────────────┐
│  config.yaml (Site-Level Only)                  │
│  - Navigation structure                         │
│  - Site metadata (URL, title, description)      │
│  - Theme preset                                 │
│  - Feature toggles (dark mode, animations)      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  src/content/pages/ (Collection Index Config)   │
│  - blog.md: { layout, layoutConfig, sortBy }    │
│  - projects.md: { layout, layoutConfig }        │
│  - talks.md: { layout, layoutConfig }           │
│  - teaching.md: { layout, layoutConfig }        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  src/pages/[collection]/index.astro              │
│  - Reads pages collection frontmatter           │
│  - Fetches collection entries                   │
│  - Passes config to LayoutDispatcher            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  src/components/LayoutDispatcher.astro           │
│  - Routes to appropriate layout component       │
│  - Handles layout fallbacks                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  src/components/layouts/                         │
│  - ListLayout.astro                             │
│  - CardsLayout.astro                            │
│  - TimelineLayout.astro                         │
│  - NodeLayout.astro (graph view)                │
│  - MasonryLayout.astro                          │
│  - AccordionLayout.astro                        │
│  - MinimalLayout.astro                          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Individual Content Entries (Optional Override) │
│  - src/content/blog/post.md                     │
│    frontmatter: { layoutConfig: {...} }         │
└─────────────────────────────────────────────────┘
```

---

## 4. Data Models & Schemas

### 4.1 Collection Index Page Schema

**File:** `src/content/pages/blog.md`, `projects.md`, etc.

```yaml
---
title: "Blog"                              # Page title
description: "Thoughts on research..."     # Page meta description
collection: "blog"                         # Which collection to render
layout: "list"                             # Layout type

# Sort configuration
sortBy: "date"                             # Field to sort by
sortOrder: "desc"                          # "asc" or "desc"

# Layout-specific configuration
layoutConfig:
  # LIST layout options
  groupBy: "year"                          # "year" | "month" | "category" | "none"
  showThumbnail: true
  thumbnailSize: "small"                   # "small" | "medium" | "large"
  compact: false
  fields: ["description", "tags", "links"]

  # CARDS layout options
  style: "text"                            # "text" | "image" | "mixed"
  columns: 3                               # Number or "auto"
  aspectRatio: "16:9"                      # "16:9" | "4:3" | "1:1" | "auto"
  showDescription: true
  showTags: true
  gap: "medium"                            # "small" | "medium" | "large"

  # TIMELINE layout options
  style: "left"                            # "left" | "center" | "alternating"
  showThumbnails: false
  expandable: false
  showMilestones: true

  # NODE layout options (graph view)
  connectionBy: "tags"                     # "tags" | "category" | "date"
  nodeSize: "medium"                       # "small" | "medium" | "large"
  showLabels: true
  interactive: true
  physics: true                            # Enable force-directed layout
  maxNodes: 50

  # MASONRY layout options
  gap: "medium"

  # ACCORDION layout options
  allowMultiple: true                      # Allow multiple open sections
  defaultOpen: "first"                     # "first" | "all" | "none"

  # MINIMAL layout options
  showDate: false
  showStatus: false

# Optional: Filter configuration
filters:
  - field: "featured"
    value: true
  - field: "status"
    value: "active"

# Optional: Custom page header
header:
  showDescription: true
  showFilters: false                       # Show filter UI
  showSearch: false                        # Show search bar
---

Markdown content here serves as the page introduction.
This text appears above the collection listing.
```

### 4.2 Individual Entry Override Schema

**Files:** `src/content/blog/*.md`, `src/content/projects/*.md`, etc.

```yaml
---
title: "My Research Project"
description: "A groundbreaking study..."
date: 2024-01-15
tags: ["machine-learning", "pytorch"]

# Optional: Override layout for this specific entry when displayed in lists
displayConfig:
  thumbnail: "/images/custom-thumb.jpg"    # Custom thumbnail
  featured: true                           # Highlight this entry
  order: 1                                 # Override default sort order

# Optional: Override individual rendering (when viewed as single page)
layoutConfig:
  showToc: true                            # Table of contents
  showRelated: true                        # Related entries
  layout: "wide"                           # "default" | "wide" | "minimal"
---

Entry content...
```

### 4.3 TypeScript Types

```typescript
// src/lib/types/layout.ts

export type LayoutType =
  | 'list'
  | 'cards'
  | 'timeline'
  | 'node'
  | 'masonry'
  | 'accordion'
  | 'minimal';

export type GroupBy = 'year' | 'month' | 'category' | 'tag' | 'none';
export type SortOrder = 'asc' | 'desc';
export type ThumbnailSize = 'small' | 'medium' | 'large';
export type GapSize = 'small' | 'medium' | 'large';
export type CardStyle = 'text' | 'image' | 'mixed';
export type TimelineStyle = 'left' | 'center' | 'alternating';
export type NodeSize = 'small' | 'medium' | 'large';

export interface BaseLayoutConfig {
  showThumbnail?: boolean;
  thumbnailSize?: ThumbnailSize;
  groupBy?: GroupBy;
  compact?: boolean;
}

export interface ListLayoutConfig extends BaseLayoutConfig {
  fields?: string[];
}

export interface CardsLayoutConfig extends BaseLayoutConfig {
  style?: CardStyle;
  columns?: number | 'auto';
  aspectRatio?: string;
  showDescription?: boolean;
  showTags?: boolean;
  gap?: GapSize;
}

export interface TimelineLayoutConfig extends BaseLayoutConfig {
  style?: TimelineStyle;
  showThumbnails?: boolean;
  expandable?: boolean;
  showMilestones?: boolean;
}

export interface NodeLayoutConfig {
  connectionBy?: 'tags' | 'category' | 'date';
  nodeSize?: NodeSize;
  showLabels?: boolean;
  interactive?: boolean;
  physics?: boolean;
  maxNodes?: number;
}

export interface MasonryLayoutConfig extends BaseLayoutConfig {
  gap?: GapSize;
}

export interface AccordionLayoutConfig extends BaseLayoutConfig {
  allowMultiple?: boolean;
  defaultOpen?: 'first' | 'all' | 'none';
}

export interface MinimalLayoutConfig {
  showDate?: boolean;
  showStatus?: boolean;
}

export type LayoutConfig =
  | ListLayoutConfig
  | CardsLayoutConfig
  | TimelineLayoutConfig
  | NodeLayoutConfig
  | MasonryLayoutConfig
  | AccordionLayoutConfig
  | MinimalLayoutConfig;

export interface PageLayoutDefinition {
  title: string;
  description?: string;
  collection: string;
  layout: LayoutType;
  sortBy?: string;
  sortOrder?: SortOrder;
  layoutConfig?: LayoutConfig;
  filters?: Array<{
    field: string;
    value: any;
  }>;
  header?: {
    showDescription?: boolean;
    showFilters?: boolean;
    showSearch?: boolean;
  };
}
```

### 4.4 Zod Schema for Validation

```typescript
// src/content/config.ts - Add to pages collection

import { z } from 'zod';

const LayoutTypeEnum = z.enum([
  'list',
  'cards',
  'timeline',
  'node',
  'masonry',
  'accordion',
  'minimal'
]);

const BaseLayoutConfigSchema = z.object({
  showThumbnail: z.boolean().optional(),
  thumbnailSize: z.enum(['small', 'medium', 'large']).optional(),
  groupBy: z.enum(['year', 'month', 'category', 'tag', 'none']).optional(),
  compact: z.boolean().optional(),
});

const LayoutConfigSchema = z.union([
  BaseLayoutConfigSchema.extend({
    fields: z.array(z.string()).optional(),
  }),
  BaseLayoutConfigSchema.extend({
    style: z.enum(['text', 'image', 'mixed']).optional(),
    columns: z.union([z.number(), z.literal('auto')]).optional(),
    aspectRatio: z.string().optional(),
    showDescription: z.boolean().optional(),
    showTags: z.boolean().optional(),
    gap: z.enum(['small', 'medium', 'large']).optional(),
  }),
  // ... other layout-specific schemas
]);

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    collection: z.string().optional(),
    layout: LayoutTypeEnum.optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    layoutConfig: LayoutConfigSchema.optional(),
    filters: z.array(z.object({
      field: z.string(),
      value: z.any(),
    })).optional(),
    header: z.object({
      showDescription: z.boolean().optional(),
      showFilters: z.boolean().optional(),
      showSearch: z.boolean().optional(),
    }).optional(),
    draft: z.boolean().default(false),
    nav: z.boolean().default(true),
    nav_order: z.number().default(999),
  }),
});
```

---

## 5. Data Flow

### 5.1 Collection Index Page Rendering

```
┌─────────────────────────────────────────────────┐
│ 1. User navigates to /blog                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. src/pages/blog/index.astro                   │
│    - getEntry('pages', 'blog')                  │
│    - Extract: { layout, layoutConfig, sortBy }  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. Fetch collection entries                     │
│    - getCollection('blog')                      │
│    - Apply filters from frontmatter             │
│    - Apply sorting (sortBy, sortOrder)          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. Pass to LayoutDispatcher                     │
│    <LayoutDispatcher                            │
│      layout="list"                              │
│      items={blogPosts}                          │
│      config={layoutConfig}                      │
│    />                                           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 5. LayoutDispatcher routes to component         │
│    - Switch on layout type                      │
│    - Import ListLayout.astro                    │
│    - Pass items + config                        │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 6. ListLayout renders                           │
│    - Group by year (from config)                │
│    - Render BlogCard for each item              │
│    - Apply thumbnail settings                   │
└─────────────────────────────────────────────────┘
```

### 5.2 Example Implementation

**File:** `src/pages/blog/index.astro`

```astro
---
import { getCollection, getEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import LayoutDispatcher from '../../components/LayoutDispatcher.astro';
import { config } from '../../config';

// Read layout configuration from pages collection
const pageConfig = await getEntry('pages', 'blog');

if (!pageConfig) {
  throw new Error('Blog page configuration not found at src/content/pages/blog.md');
}

const {
  layout = 'list',
  layoutConfig = {},
  collection = 'blog',
  sortBy = 'date',
  sortOrder = 'desc',
  filters = []
} = pageConfig.data;

// Fetch collection entries
let entries = await getCollection(collection, ({ data }) => {
  // Apply filters from frontmatter
  if (data.draft) return false;

  for (const filter of filters) {
    if (data[filter.field] !== filter.value) return false;
  }

  return true;
});

// Apply sorting
entries = entries.sort((a, b) => {
  const aVal = a.data[sortBy];
  const bVal = b.data[sortBy];

  if (sortOrder === 'desc') {
    return bVal > aVal ? 1 : -1;
  }
  return aVal > bVal ? 1 : -1;
});

const title = `${pageConfig.data.title} | ${config.site.title}`;
const { Content } = await pageConfig.render();
---

<BaseLayout title={title} description={pageConfig.data.description}>
  <article class="collection-page">
    <div class="container">
      <header class="page-header" data-animate="fade-up">
        <h1>{pageConfig.data.title}</h1>
        {pageConfig.data.description && (
          <p class="page-description">{pageConfig.data.description}</p>
        )}
      </header>

      {/* Render page introduction content */}
      <div class="page-intro">
        <Content />
      </div>

      {/* Dispatch to appropriate layout */}
      <LayoutDispatcher
        layout={layout}
        items={entries}
        config={layoutConfig}
      />
    </div>
  </article>
</BaseLayout>
```

**File:** `src/components/LayoutDispatcher.astro`

```astro
---
import ListLayout from './layouts/ListLayout.astro';
import CardsLayout from './layouts/CardsLayout.astro';
import TimelineLayout from './layouts/TimelineLayout.astro';
import NodeLayout from './layouts/NodeLayout.astro';
import MasonryLayout from './layouts/MasonryLayout.astro';
import AccordionLayout from './layouts/AccordionLayout.astro';
import MinimalLayout from './layouts/MinimalLayout.astro';

import type { LayoutType, LayoutConfig } from '../lib/types/layout';
import type { CollectionEntry } from 'astro:content';

interface Props {
  layout: LayoutType;
  items: CollectionEntry<any>[];
  config?: LayoutConfig;
}

const { layout, items, config = {} } = Astro.props;
---

{layout === 'list' && <ListLayout items={items} config={config} />}
{layout === 'cards' && <CardsLayout items={items} config={config} />}
{layout === 'timeline' && <TimelineLayout items={items} config={config} />}
{layout === 'node' && <NodeLayout items={items} config={config} />}
{layout === 'masonry' && <MasonryLayout items={items} config={config} />}
{layout === 'accordion' && <AccordionLayout items={items} config={config} />}
{layout === 'minimal' && <MinimalLayout items={items} config={config} />}
```

---

## 6. File Structure

```
academic-template/
├── config.yaml                           # Site-level config only
│   ├── navigation
│   ├── site metadata
│   ├── theme preset
│   └── feature toggles
│
├── src/
│   ├── content/
│   │   ├── pages/                        # Collection index definitions
│   │   │   ├── blog.md                   # Blog page config
│   │   │   ├── projects.md               # Projects page config
│   │   │   ├── talks.md                  # Talks page config
│   │   │   ├── teaching.md               # Teaching page config
│   │   │   └── about.md                  # Static pages
│   │   │
│   │   ├── blog/                         # Blog entries
│   │   │   └── *.md
│   │   ├── projects/                     # Project entries
│   │   │   └── *.md
│   │   ├── talks/                        # Talk entries
│   │   │   └── *.md
│   │   └── teaching/                     # Teaching entries
│   │       └── *.md
│   │
│   ├── pages/
│   │   ├── blog/
│   │   │   └── index.astro               # Reads pages/blog.md
│   │   ├── projects/
│   │   │   └── index.astro               # Reads pages/projects.md
│   │   ├── talks/
│   │   │   └── index.astro               # Reads pages/talks.md
│   │   └── teaching/
│   │       └── index.astro               # Reads pages/teaching.md
│   │
│   ├── components/
│   │   ├── LayoutDispatcher.astro        # Routes to layouts
│   │   └── layouts/                      # Layout components
│   │       ├── ListLayout.astro
│   │       ├── CardsLayout.astro
│   │       ├── TimelineLayout.astro
│   │       ├── NodeLayout.astro
│   │       ├── MasonryLayout.astro
│   │       ├── AccordionLayout.astro
│   │       └── MinimalLayout.astro
│   │
│   └── lib/
│       ├── types/
│       │   └── layout.ts                 # TypeScript types
│       └── utils/
│           ├── layout-defaults.ts        # Default configs per layout
│           └── sort-helpers.ts           # Sorting utilities
│
└── docs/
    └── layout-architecture.md            # This document
```

---

## 7. Simplified config.yaml

After migration, `config.yaml` should ONLY contain:

```yaml
# =============================================================================
# PERSONAL INFORMATION
# =============================================================================

name:
  first: Jane
  middle: M
  last: Smith

title: Assistant Professor of Computer Science

institution:
  name: Center for Advanced Computational Research
  url: https://research.university.edu

email: jane.smith@university.edu
avatar: /avatar.jpg

# =============================================================================
# SOCIAL LINKS
# =============================================================================

social:
  github: janesmith
  scholar: EXAMPLE_ID
  linkedin: janesmith
  twitter: janesmith_cs
  orcid: 0000-0001-2345-6789
  researchgate: ""

# =============================================================================
# SITE METADATA
# =============================================================================

site:
  url: https://florianmahner.github.io/academic
  title: Jane Smith
  description: Personal academic website
  language: en
  base: /

# =============================================================================
# NAVIGATION
# =============================================================================

navigation:
  mode: sidebar  # "floating", "sidebar", or "inline"
  items:
    - id: about
      label: About
      href: /
    - id: publications
      label: Publications
      href: /publications
    - id: projects
      label: Projects
      href: /projects
    - id: blog
      label: Blog
      href: /blog

# =============================================================================
# THEME SYSTEM
# =============================================================================

theme:
  preset: editorial-newsreader
  accent_light: ""
  accent_dark: ""

# =============================================================================
# FEATURES
# =============================================================================

features:
  selected_publications: true
  education: true
  dark_mode: true
  animations: true
  settings_panel: true

# =============================================================================
# ABOUT PAGE CONTENT
# =============================================================================

about:
  bio: |
    I am a researcher exploring...

  research_interests: |
    My research interests span...

# =============================================================================
# FOOTER
# =============================================================================

footer:
  copyright: true
  links:
    - label: Email
      href: mailto:jane.smith@university.edu
```

**What's REMOVED:**
- `layouts.*` - All layout configurations
- `collections.*` - All collection-specific settings

**Total lines:** ~150 (down from ~224)

---

## 8. Migration Strategy

### 8.1 Phase 1: Create Pages Collection Files

**Action:** Create frontmatter files for each collection index.

**Files to create:**
1. `src/content/pages/blog.md`
2. `src/content/pages/projects.md`
3. `src/content/pages/talks.md`
4. `src/content/pages/teaching.md`

**Example:** `src/content/pages/blog.md`

```yaml
---
title: "Blog"
description: "Thoughts on research, machine learning, and academia."
collection: "blog"
layout: "list"
sortBy: "date"
sortOrder: "desc"
layoutConfig:
  groupBy: "year"
  showThumbnail: true
  thumbnailSize: "small"
  compact: false
  fields: ["description", "tags", "links"]
---

Welcome to my blog where I share insights about my research.
```

### 8.2 Phase 2: Update Content Schema

**Action:** Add layout-related fields to `src/content/config.ts`.

**Changes:**
- Add `collection` field to `pages` schema
- Add `layout` enum
- Add `sortBy`, `sortOrder` fields
- Add `layoutConfig` object schema
- Add `filters` array schema

### 8.3 Phase 3: Create LayoutDispatcher

**Action:** Build the routing component that selects the appropriate layout.

**File:** `src/components/LayoutDispatcher.astro`

**Logic:**
- Accept `layout`, `items`, `config` props
- Switch on layout type
- Import and render corresponding layout component

### 8.4 Phase 4: Build Layout Components

**Action:** Create standalone layout components for each type.

**Components:**
1. `ListLayout.astro` - Chronological list with optional grouping
2. `CardsLayout.astro` - Grid of cards with various styles
3. `TimelineLayout.astro` - Visual timeline with connectors
4. `NodeLayout.astro` - Interactive graph view
5. `MasonryLayout.astro` - Pinterest-style masonry grid
6. `AccordionLayout.astro` - Collapsible grouped sections
7. `MinimalLayout.astro` - Minimal text-only list

### 8.5 Phase 5: Update Index Pages

**Action:** Refactor collection index pages to read from pages collection.

**Pattern for each index:**
```astro
---
import { getEntry, getCollection } from 'astro:content';
import LayoutDispatcher from '../../components/LayoutDispatcher.astro';

const pageConfig = await getEntry('pages', 'blog');
const { layout, layoutConfig, sortBy, sortOrder } = pageConfig.data;
const entries = await getCollection('blog');
// ... sorting logic
---

<LayoutDispatcher
  layout={layout}
  items={entries}
  config={layoutConfig}
/>
```

### 8.6 Phase 6: Remove from config.yaml

**Action:** Delete layout-related sections from `config.yaml`.

**Sections to remove:**
- `layouts.*`
- `collections.*`

### 8.7 Phase 7: Testing & Validation

**Test cases:**
1. Each collection index renders correctly
2. Layout configs are respected
3. Sorting works as expected
4. Individual entry overrides work
5. Build passes with no errors
6. Hot reload works in dev mode

---

## 9. Advanced Features

### 9.1 Layout Defaults System

**File:** `src/lib/utils/layout-defaults.ts`

```typescript
import type { LayoutType, LayoutConfig } from '../types/layout';

export const LAYOUT_DEFAULTS: Record<LayoutType, LayoutConfig> = {
  list: {
    showThumbnail: true,
    thumbnailSize: 'small',
    groupBy: 'year',
    compact: false,
    fields: ['description', 'tags', 'links'],
  },
  cards: {
    style: 'text',
    columns: 'auto',
    aspectRatio: '16:9',
    showDescription: true,
    showTags: true,
    gap: 'medium',
  },
  timeline: {
    style: 'left',
    groupBy: 'year',
    showThumbnails: false,
    expandable: false,
    showMilestones: true,
  },
  node: {
    connectionBy: 'tags',
    nodeSize: 'medium',
    showLabels: true,
    interactive: true,
    physics: true,
    maxNodes: 50,
  },
  masonry: {
    columns: 'auto',
    gap: 'medium',
    showDescription: true,
  },
  accordion: {
    groupBy: 'year',
    allowMultiple: true,
    defaultOpen: 'first',
  },
  minimal: {
    showDate: false,
    showStatus: false,
  },
};

export function mergeLayoutConfig<T extends LayoutConfig>(
  layout: LayoutType,
  customConfig?: Partial<T>
): T {
  const defaults = LAYOUT_DEFAULTS[layout] as T;
  return { ...defaults, ...customConfig };
}
```

### 9.2 Individual Entry Overrides

**Use case:** Feature a specific project with custom thumbnail in cards layout.

**File:** `src/content/projects/featured-project.md`

```yaml
---
title: "Featured Research Project"
description: "Our groundbreaking ML framework"
date: 2024-01-15
tags: ["machine-learning", "pytorch"]

# Override display config for this entry
displayConfig:
  thumbnail: "/images/featured-project-hero.jpg"
  featured: true
  order: 1  # Pin to top

# ... other fields
---
```

**Implementation in `CardsLayout.astro`:**

```astro
---
const { items, config } = Astro.props;

// Apply individual overrides
const processedItems = items.map(item => ({
  ...item,
  display: {
    ...config,
    ...item.data.displayConfig // Override with entry-specific config
  }
}));

// Sort by order if present
processedItems.sort((a, b) => {
  const orderA = a.display.order ?? 999;
  const orderB = b.display.order ?? 999;
  return orderA - orderB;
});
---
```

### 9.3 Dynamic Layout Switching

**Use case:** Allow users to toggle between list and cards views.

**Implementation:**

```astro
---
// src/pages/projects/index.astro
const layoutParam = Astro.url.searchParams.get('layout');
const defaultLayout = pageConfig.data.layout;
const selectedLayout = layoutParam || defaultLayout;
---

<div class="layout-switcher">
  <a href="?layout=list">List</a>
  <a href="?layout=cards">Cards</a>
  <a href="?layout=timeline">Timeline</a>
</div>

<LayoutDispatcher
  layout={selectedLayout}
  items={projects}
  config={pageConfig.data.layoutConfig}
/>
```

### 9.4 Collection Composition

**Use case:** Create a "Highlights" page that combines multiple collections.

**File:** `src/content/pages/highlights.md`

```yaml
---
title: "Highlights"
description: "Featured work across all areas"
layout: "cards"
collections:
  - name: "projects"
    filter:
      featured: true
    limit: 3
  - name: "blog"
    filter:
      featured: true
    limit: 2
  - name: "talks"
    filter:
      type: "keynote"
    limit: 2
layoutConfig:
  style: "mixed"
  columns: 3
  gap: "large"
---

A curated selection of my most significant work.
```

---

## 10. Performance Considerations

### 10.1 Build-Time Optimization

- **Static generation**: All layouts are pre-rendered at build time
- **No runtime config loading**: Frontmatter parsed during build
- **Tree shaking**: Unused layout components are excluded from bundle

### 10.2 Bundle Size

**Before (centralized config):**
- All layout logic in index pages: ~15KB per page

**After (component-based):**
- LayoutDispatcher: ~2KB
- Individual layouts: 3-5KB each (loaded on demand)
- Total reduction: ~40% smaller bundles

### 10.3 Development Experience

- **Hot reload**: Changes to `*.md` files trigger instant reload
- **Type safety**: Full autocomplete in frontmatter
- **Validation**: Zod catches errors at build time
- **Portability**: Move collection → config moves automatically

---

## 11. Edge Cases & Error Handling

### 11.1 Missing Page Configuration

**Scenario:** No `pages/blog.md` file exists.

**Solution:**
```typescript
const pageConfig = await getEntry('pages', 'blog');

if (!pageConfig) {
  // Fallback to sensible defaults
  const defaultConfig = {
    layout: 'list',
    sortBy: 'date',
    sortOrder: 'desc',
    layoutConfig: LAYOUT_DEFAULTS.list,
  };
}
```

### 11.2 Invalid Layout Type

**Scenario:** Typo in layout name (`layuot: "lst"`).

**Solution:** Zod schema validation catches at build time:
```
❌ Invalid enum value. Expected 'list' | 'cards' | 'timeline' | ...
```

### 11.3 Missing Collection

**Scenario:** `collection: "talks"` but no talks collection exists.

**Solution:**
```typescript
try {
  const entries = await getCollection(collection);
} catch (error) {
  console.error(`Collection "${collection}" not found`);
  return []; // Render empty state
}
```

### 11.4 Conflicting Overrides

**Scenario:** Entry specifies `displayConfig.order` but page has custom sort logic.

**Priority order:**
1. Entry-level `displayConfig` (highest)
2. Page-level `layoutConfig`
3. Global defaults (lowest)

---

## 12. Future Enhancements

### 12.1 Visual Layout Editor

**Concept:** Web UI for editing layout configs without touching markdown.

**Implementation:**
- Admin panel at `/admin/layouts`
- WYSIWYG preview of changes
- Generates frontmatter YAML
- Commits to `src/content/pages/`

### 12.2 Layout Templates Library

**Concept:** Pre-built layout configs for common academic use cases.

**Templates:**
- "Research Lab" - Projects grid + publications list
- "Personal Blog" - Timeline with featured posts
- "Course Website" - Accordion by semester
- "Conference Site" - Timeline of talks + node graph

### 12.3 A/B Testing Layouts

**Concept:** Test different layouts with users to optimize engagement.

**Implementation:**
```yaml
layoutConfig:
  experiments:
    - variant: "cards"
      traffic: 50%
    - variant: "list"
      traffic: 50%
```

### 12.4 Responsive Layout Switching

**Concept:** Different layouts for mobile vs desktop.

**Implementation:**
```yaml
layoutConfig:
  desktop:
    layout: "cards"
    columns: 3
  mobile:
    layout: "list"
    compact: true
```

---

## 13. Testing Strategy

### 13.1 Unit Tests

**File:** `src/components/__tests__/LayoutDispatcher.test.ts`

```typescript
describe('LayoutDispatcher', () => {
  test('routes to ListLayout for "list" type', () => {
    const result = render(LayoutDispatcher, {
      layout: 'list',
      items: mockItems,
      config: {},
    });
    expect(result.html).toContain('list-layout');
  });

  test('applies config to layout component', () => {
    const config = { groupBy: 'year' };
    const result = render(LayoutDispatcher, {
      layout: 'list',
      items: mockItems,
      config,
    });
    expect(result.html).toContain('year-section');
  });
});
```

### 13.2 Integration Tests

**File:** `tests/integration/layouts.spec.ts`

```typescript
test('blog index renders with list layout', async ({ page }) => {
  await page.goto('/blog');

  await expect(page.locator('.list-layout')).toBeVisible();
  await expect(page.locator('.year-label')).toHaveCount(3);
  await expect(page.locator('.post-card')).toHaveCount(12);
});

test('projects index renders with cards layout', async ({ page }) => {
  await page.goto('/projects');

  await expect(page.locator('.cards-layout')).toBeVisible();
  await expect(page.locator('.card-grid')).toHaveCSS('grid-template-columns', /repeat\(3,/);
});
```

### 13.3 Visual Regression Tests

**Tool:** Playwright + Percy

```typescript
test('blog list layout matches snapshot', async ({ page }) => {
  await page.goto('/blog');
  await percySnapshot(page, 'Blog - List Layout');
});

test('projects cards layout matches snapshot', async ({ page }) => {
  await page.goto('/projects');
  await percySnapshot(page, 'Projects - Cards Layout');
});
```

---

## 14. Documentation Requirements

### 14.1 User-Facing Documentation

**File:** `docs/LAYOUTS.md`

**Contents:**
- Overview of 7 layout types with screenshots
- Frontmatter schema reference
- Examples for each layout
- Common patterns and recipes
- Troubleshooting guide

### 14.2 Developer Documentation

**File:** `docs/LAYOUT-API.md`

**Contents:**
- LayoutDispatcher API
- Creating custom layouts
- TypeScript type reference
- Testing layouts
- Performance optimization

### 14.3 Migration Guide

**File:** `docs/MIGRATION-LAYOUTS.md`

**Contents:**
- Step-by-step migration from config.yaml
- Before/after examples
- Common pitfalls
- Rollback instructions

---

## 15. Security Considerations

### 15.1 Content Injection

**Risk:** Malicious markdown in `layoutConfig` could inject scripts.

**Mitigation:**
- Zod schema validates all config values
- No `dangerouslySetInnerHTML` in layout components
- Astro auto-escapes all dynamic content

### 15.2 Path Traversal

**Risk:** User-supplied collection name could access arbitrary files.

**Mitigation:**
```typescript
const ALLOWED_COLLECTIONS = ['blog', 'projects', 'talks', 'teaching'];

if (!ALLOWED_COLLECTIONS.includes(collection)) {
  throw new Error(`Invalid collection: ${collection}`);
}
```

### 15.3 YAML Parsing

**Risk:** Malformed YAML could crash build.

**Mitigation:**
- Astro handles YAML parsing with error boundaries
- Zod validation catches invalid structures
- Build fails gracefully with clear error messages

---

## 16. Conclusion

### 16.1 Benefits Summary

✅ **Content Ownership**: Layout config lives with content
✅ **Portability**: Move collection = move config
✅ **Flexibility**: Per-entry overrides
✅ **Simplicity**: Cleaner config.yaml
✅ **Type Safety**: Full TypeScript + Zod validation
✅ **Performance**: No runtime config parsing
✅ **Maintainability**: Easier to reason about

### 16.2 Migration Effort

**Estimated time:** 2-3 days

**Breakdown:**
- Phase 1 (Pages creation): 2 hours
- Phase 2 (Schema updates): 1 hour
- Phase 3 (LayoutDispatcher): 2 hours
- Phase 4 (Layout components): 8 hours
- Phase 5 (Index pages): 4 hours
- Phase 6 (config.yaml cleanup): 30 minutes
- Phase 7 (Testing): 4 hours

**Total:** ~22 hours

### 16.3 Success Metrics

**Goals:**
- [ ] All collections render with frontmatter configs
- [ ] config.yaml reduced to < 150 lines
- [ ] Build time < 10 seconds for 100 entries
- [ ] Zero TypeScript errors
- [ ] All tests passing
- [ ] Documentation complete

---

## Appendix A: Complete Example - Blog Configuration

**File:** `src/content/pages/blog.md`

```yaml
---
title: "Blog"
description: "Thoughts on research, machine learning, and academia."
collection: "blog"
layout: "list"
sortBy: "date"
sortOrder: "desc"
layoutConfig:
  groupBy: "year"
  showThumbnail: true
  thumbnailSize: "small"
  compact: false
  fields: ["description", "tags", "links"]
filters:
  - field: "draft"
    value: false
header:
  showDescription: true
  showFilters: false
  showSearch: false
---

Welcome to my blog where I share insights about my research, thoughts on machine learning, and reflections on academic life. Here you'll find tutorials, paper summaries, and musings on the intersection of AI and neuroscience.
```

**Rendered Output:**
```
┌─────────────────────────────────────┐
│ Blog                                │
│ Thoughts on research, ML, academia  │
├─────────────────────────────────────┤
│ Welcome to my blog where...         │
├─────────────────────────────────────┤
│ 2024                                │
│   Dec 5  │ Research Update          │
│          │ Latest findings from...  │
│          │ [machine-learning] [ai]  │
│   Nov 12 │ Tutorial: Transformers   │
│          │ Deep dive into...        │
├─────────────────────────────────────┤
│ 2023                                │
│   Aug 3  │ Conference Recap         │
│          │ Highlights from...       │
└─────────────────────────────────────┘
```

---

## Appendix B: Layout Component Template

**File:** `src/components/layouts/ListLayout.astro`

```astro
---
import type { CollectionEntry } from 'astro:content';
import type { ListLayoutConfig } from '../../lib/types/layout';
import { mergeLayoutConfig } from '../../lib/utils/layout-defaults';

interface Props {
  items: CollectionEntry<any>[];
  config?: Partial<ListLayoutConfig>;
}

const { items, config: customConfig = {} } = Astro.props;
const config = mergeLayoutConfig<ListLayoutConfig>('list', customConfig);

// Group items if requested
const grouped = config.groupBy !== 'none'
  ? groupItems(items, config.groupBy)
  : { 'All': items };

function groupItems(items: any[], groupBy: string) {
  return items.reduce((acc, item) => {
    const key = extractGroupKey(item, groupBy);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

function extractGroupKey(item: any, groupBy: string) {
  if (groupBy === 'year') {
    return item.data.date?.getFullYear() ?? 'Unknown';
  }
  if (groupBy === 'category') {
    return item.data.category ?? 'Uncategorized';
  }
  return 'All';
}
---

<div class="list-layout" data-compact={config.compact}>
  {Object.entries(grouped).map(([group, groupItems]) => (
    <section class="group-section">
      {config.groupBy !== 'none' && (
        <h2 class="group-label">{group}</h2>
      )}
      <ul class="items-list">
        {groupItems.map(item => (
          <li class="item-card">
            {config.showThumbnail && item.data.image && (
              <img
                src={item.data.image}
                alt={item.data.title}
                class={`thumbnail thumbnail-${config.thumbnailSize}`}
              />
            )}
            <div class="item-content">
              <h3><a href={`/${item.collection}/${item.slug}`}>{item.data.title}</a></h3>
              {config.fields?.includes('description') && (
                <p class="description">{item.data.description}</p>
              )}
              {config.fields?.includes('tags') && item.data.tags?.length > 0 && (
                <div class="tags">
                  {item.data.tags.map(tag => (
                    <span class="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  ))}
</div>

<style>
  .list-layout {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .group-section {
    margin-bottom: var(--space-6);
  }

  .group-label {
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    margin-bottom: var(--space-4);
  }

  .items-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .item-card {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);
  }

  .item-card:hover {
    background-color: var(--color-bg-alt);
  }

  .thumbnail {
    border-radius: var(--radius-sm);
    object-fit: cover;
  }

  .thumbnail-small {
    width: 80px;
    height: 80px;
  }

  .thumbnail-medium {
    width: 120px;
    height: 120px;
  }

  .thumbnail-large {
    width: 200px;
    height: 200px;
  }

  [data-compact="true"] .item-card {
    padding: var(--space-2);
  }

  [data-compact="true"] .description {
    display: none;
  }
</style>
```

---

**End of Architecture Document**
