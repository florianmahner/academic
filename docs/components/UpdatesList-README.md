# UpdatesList Component - Complete Guide

A flexible, timeline-style component designed for academic websites to display recent activity from multiple content sources in a unified, chronologically-sorted view.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Component API](#component-api)
- [Design Decisions](#design-decisions)
- [Usage Examples](#usage-examples)
- [Utility Functions](#utility-functions)
- [Styling & Customization](#styling--customization)
- [Best Practices](#best-practices)

## Overview

### What Problem Does It Solve?

Academic websites typically have multiple types of content (blog posts, publications, talks, teaching) scattered across different pages. The UpdatesList component:

1. **Unifies Display**: Shows all activity types in a single, consistent format
2. **Chronological Ordering**: Automatically sorts by date regardless of content type
3. **Flexible Views**: Adapts from compact homepage sections to detailed standalone pages
4. **Type Awareness**: Conditionally renders type-specific metadata
5. **Easy Integration**: Works with Astro's content collections out of the box

### Key Features

✨ **Multiple content types** (blog, publication, talk, teaching, project)
📅 **Automatic date sorting** (newest first)
🏷️ **Color-coded type badges** for quick scanning
📦 **Compact & detailed modes** for different contexts
📊 **Optional month grouping** for timeline views
🎯 **Type filtering** to show specific content
🎨 **Tufte-inspired design** with clean typography
♿ **Accessible** with semantic HTML and proper ARIA

## Quick Start

### Installation

The component is already included in the template. Import it from the blocks module:

```astro
---
import { UpdatesList } from '../components/blocks';
import type { UpdateItem } from '../components/blocks';
---
```

### Basic Usage

```astro
---
import { UpdatesList } from '../components/blocks';
import { getRecentUpdates } from '../lib/updates';

const updates = await getRecentUpdates(5);
---

<UpdatesList items={updates} />
```

## Component API

### Props

#### `items` (required)
**Type:** `UpdateItem[]`

Array of update items to display. Each item must conform to the `UpdateItem` interface.

```typescript
const items: UpdateItem[] = [
  {
    type: 'blog',
    title: 'My Blog Post',
    date: new Date('2024-01-15'),
    url: '/blog/my-post'
  }
];
```

#### `limit`
**Type:** `number`
**Default:** `undefined`

Limit the number of items displayed. Useful for "recent updates" sections.

```astro
<UpdatesList items={updates} limit={5} />
```

#### `showType`
**Type:** `boolean`
**Default:** `true`

Show type badges (Blog, Paper, Talk, etc.) next to each item.

```astro
<UpdatesList items={updates} showType={false} />
```

#### `compact`
**Type:** `boolean`
**Default:** `false`

Enable compact mode with tighter spacing and truncated descriptions (max 120 chars).

```astro
<!-- Perfect for homepage sections -->
<UpdatesList items={updates} compact={true} />
```

#### `groupByMonth`
**Type:** `boolean`
**Default:** `false`

Group items by month with month headers (e.g., "January 2024").

```astro
<!-- Great for timeline views -->
<UpdatesList items={updates} groupByMonth={true} />
```

#### `filterTypes`
**Type:** `('blog' | 'publication' | 'talk' | 'teaching' | 'project')[]`
**Default:** `undefined`

Show only specific content types.

```astro
<!-- Show only research-related updates -->
<UpdatesList
  items={updates}
  filterTypes={['publication', 'talk']}
/>
```

#### `class`
**Type:** `string`
**Default:** `undefined`

Additional CSS class names for custom styling.

```astro
<UpdatesList items={updates} class="my-custom-class" />
```

### UpdateItem Interface

```typescript
interface UpdateItem {
  // Required fields
  type: 'blog' | 'publication' | 'talk' | 'teaching' | 'project';
  title: string;
  date: Date;

  // Optional common fields
  description?: string;    // Item description/abstract
  url?: string;           // Link to full item

  // Type-specific metadata
  venue?: string;         // For publications and talks
  event?: string;         // For talks
  location?: string;      // For talks
  tags?: string[];        // For blog posts
  authors?: string[];     // For publications

  // Visual enhancements
  icon?: string;          // Custom icon/emoji (e.g., "🏆")
  highlight?: boolean;    // Adds accent border for featured items
}
```

## Design Decisions

### 1. **Unified Data Model**

Instead of separate components for each content type, UpdatesList uses a single interface with optional fields. This enables:

- **Easy mixing**: Combine different content types seamlessly
- **Consistent sorting**: All items sorted chronologically
- **Flexible filtering**: Filter by type without changing components

### 2. **Two Display Modes**

**Compact Mode** (`compact={true}`)
- Tighter spacing (3rem gap vs 4rem)
- Truncated descriptions (120 chars max)
- Smaller text sizes
- Perfect for: Homepage sections, sidebars

**Full Mode** (`compact={false}`, default)
- Generous spacing for readability
- Complete descriptions
- Standard text sizes
- Perfect for: Standalone pages, detailed timelines

### 3. **Conditional Metadata Rendering**

The component intelligently shows type-specific metadata:

```astro
<!-- Publications show authors and venue -->
{item.authors && <div class="update-authors">{item.authors.join(', ')}</div>}
{item.venue && <div class="update-venue">{item.venue}</div>}

<!-- Talks show event and location -->
{item.event && <div class="update-venue">{item.event}</div>}
{item.location && <span class="update-location">· {item.location}</span>}

<!-- Blog posts show tags -->
{item.tags && <div class="update-tags">...</div>}
```

### 4. **Type Badge System**

Each content type has a predefined badge color scheme:

| Type | Badge Variant | Color |
|------|--------------|--------|
| Blog | Primary | Accent (red) |
| Publication | Success | Green |
| Talk | Warning | Amber |
| Teaching | Outline | Border only |
| Project | Default | Muted gray |

### 5. **Tufte-Inspired Typography**

Following Edward Tufte's principles:

- **Monospace dates**: Technical precision (e.g., `January 15, 2024`)
- **Medium-weight titles**: Clear hierarchy without aggression
- **Muted secondary text**: Visual hierarchy through color
- **Subtle hover states**: No jarring animations
- **Generous whitespace**: Breathing room for content

## Usage Examples

### Example 1: Homepage Recent Activity

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { UpdatesList } from '../components/blocks';
import { getRecentUpdates } from '../lib/updates';

const recentUpdates = await getRecentUpdates(5);
---

<BaseLayout title="Home">
  <article class="container">
    <section class="hero">
      <h1>Your Name</h1>
      <p class="lead">Assistant Professor of Computer Science</p>
    </section>

    <section class="recent-updates">
      <div class="section-header">
        <h2>Recent Activity</h2>
        <a href="/updates">View all →</a>
      </div>

      <UpdatesList
        items={recentUpdates}
        compact={true}
        showType={true}
      />
    </section>
  </article>
</BaseLayout>
```

### Example 2: Standalone Updates Page

```astro
---
// src/pages/updates.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { UpdatesList } from '../components/blocks';
import { getAllUpdates } from '../lib/updates';

const allUpdates = await getAllUpdates();
---

<BaseLayout title="Updates & Activity">
  <article class="container">
    <h1>Updates & Activity</h1>
    <p class="lead">
      A chronological timeline of publications, talks, and blog posts.
    </p>

    <UpdatesList
      items={allUpdates}
      groupByMonth={true}
      showType={true}
    />
  </article>
</BaseLayout>
```

### Example 3: Research Timeline (Filtered)

```astro
---
// src/pages/research-timeline.astro
import { UpdatesList } from '../components/blocks';
import { getUpdatesByType } from '../lib/updates';

// Show only publications and talks
const researchUpdates = await getUpdatesByType(['publication', 'talk']);
---

<UpdatesList
  items={researchUpdates}
  groupByMonth={true}
  filterTypes={['publication', 'talk']}
/>
```

### Example 4: Custom Update Items

```astro
---
import { UpdatesList } from '../components/blocks';
import type { UpdateItem } from '../components/blocks';

const customUpdates: UpdateItem[] = [
  {
    type: 'publication',
    title: 'Award-Winning Paper on Neural Networks',
    date: new Date('2024-01-15'),
    venue: 'ICML 2024',
    authors: ['You', 'Collaborator A', 'Collaborator B'],
    url: '/publications/neural-networks',
    description: 'Novel approach to neural architecture search...',
    highlight: true,  // Adds accent border
    icon: '🏆'        // Custom icon
  },
  {
    type: 'talk',
    title: 'Keynote: Future of AI',
    date: new Date('2024-01-10'),
    event: 'AI Conference 2024',
    location: 'San Francisco, CA',
    url: '/talks/future-of-ai'
  },
  {
    type: 'blog',
    title: 'Understanding Transformers',
    date: new Date('2024-01-05'),
    description: 'A deep dive into attention mechanisms...',
    url: '/blog/transformers',
    tags: ['machine-learning', 'deep-learning']
  }
];
---

<UpdatesList items={customUpdates} />
```

## Utility Functions

The `src/lib/updates.ts` module provides helper functions for aggregating updates:

### `getAllUpdates()`

Get all updates from all content sources.

```typescript
const updates = await getAllUpdates();
// Returns: UpdateItem[] sorted by date (newest first)
```

### `getRecentUpdates(limit)`

Get the N most recent updates.

```typescript
const recent = await getRecentUpdates(5);
// Returns: UpdateItem[] with max 5 items
```

### `getUpdatesByType(types)`

Filter updates by content type.

```typescript
const research = await getUpdatesByType(['publication', 'talk']);
// Returns: Only publications and talks
```

### `getUpdatesByYear(year)`

Get all updates from a specific year.

```typescript
const updates2024 = await getUpdatesByYear(2024);
```

### `getUpdatesInRange(startDate, endDate)`

Get updates within a date range.

```typescript
const q1Updates = await getUpdatesInRange(
  new Date('2024-01-01'),
  new Date('2024-03-31')
);
```

### `groupUpdatesByYear(updates)`

Group an array of updates by year.

```typescript
const byYear = groupUpdatesByYear(updates);
// Returns: Map<number, UpdateItem[]>

for (const [year, items] of byYear) {
  console.log(`${year}: ${items.length} updates`);
}
```

### `groupUpdatesByMonth(updates)`

Group an array of updates by month (YYYY-MM format).

```typescript
const byMonth = groupUpdatesByMonth(updates);
// Returns: Map<string, UpdateItem[]>
```

## Styling & Customization

### CSS Variables

Override these CSS custom properties for theming:

```css
.updates-list {
  /* Spacing */
  --update-spacing: var(--space-6);
  --update-padding: var(--space-4);

  /* Colors */
  --update-bg-hover: var(--color-bg-alt);
  --update-date-color: var(--color-text-muted);
  --update-title-color: var(--color-text);

  /* Typography */
  --update-title-size: var(--font-size-base);
  --update-description-size: var(--font-size-sm);
}
```

### Custom Styling

Add custom classes for specific contexts:

```astro
<UpdatesList
  items={updates}
  class="homepage-updates"
/>

<style>
  .homepage-updates {
    background: var(--color-bg-alt);
    padding: var(--space-6);
    border-radius: var(--radius-lg);
  }

  /* Target update items */
  .homepage-updates .update-item {
    border-bottom: 1px solid var(--color-border);
  }

  .homepage-updates .update-item:last-child {
    border-bottom: none;
  }
</style>
```

## Best Practices

### 1. **Use Appropriate Modes**

```astro
<!-- ✅ Good: Compact mode on homepage -->
<UpdatesList items={updates} limit={5} compact={true} />

<!-- ❌ Bad: Full mode with limit on homepage -->
<UpdatesList items={updates} limit={5} />
```

### 2. **Provide Descriptions**

```typescript
// ✅ Good: Include descriptions for better context
{
  type: 'publication',
  title: 'Neural Architecture Search',
  description: 'Novel approach to automatic neural network design...',
  // ...
}

// ⚠️ OK but less informative: No description
{
  type: 'publication',
  title: 'Neural Architecture Search',
  // ...
}
```

### 3. **Use Highlighting Sparingly**

```typescript
// ✅ Good: Highlight truly special items
{
  title: 'Best Paper Award at CVPR',
  highlight: true,
  icon: '🏆'
}

// ❌ Bad: Highlighting everything defeats the purpose
```

### 4. **Choose Appropriate Grouping**

```astro
<!-- ✅ Good: Group by month for extensive timelines -->
<UpdatesList items={allUpdates} groupByMonth={true} />

<!-- ✅ Good: Flat list for small sets -->
<UpdatesList items={recentUpdates} limit={5} />

<!-- ⚠️ Questionable: Month grouping with very few items -->
<UpdatesList items={updates} limit={3} groupByMonth={true} />
```

### 5. **Provide Clear URLs**

```typescript
// ✅ Good: Include URLs for all items
{
  title: 'My Blog Post',
  url: '/blog/my-post',
  // ...
}

// ⚠️ Less useful: No URL (title won't be clickable)
{
  title: 'My Blog Post',
  // ...
}
```

## Advanced Usage

### Client-Side Filtering

Add interactive filtering to a standalone page:

```astro
<div class="filters">
  <button data-filter="all" class="active">All</button>
  <button data-filter="blog">Blog</button>
  <button data-filter="publication">Papers</button>
</div>

<UpdatesList items={updates} />

<script>
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      const items = document.querySelectorAll('.update-item');

      items.forEach(item => {
        const badge = item.querySelector('.badge');
        const show = filter === 'all' ||
          badge?.textContent?.toLowerCase() === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
</script>
```

### RSS Feed Integration

Generate an RSS feed from your updates:

```typescript
// src/pages/updates.xml.ts
import rss from '@astrojs/rss';
import { getAllUpdates } from '../lib/updates';

export async function GET() {
  const updates = await getAllUpdates();

  return rss({
    title: 'My Updates',
    description: 'Recent academic activity',
    site: import.meta.env.SITE,
    items: updates.map(update => ({
      title: update.title,
      description: update.description,
      link: update.url,
      pubDate: update.date,
    })),
  });
}
```

## Troubleshooting

### Issue: Items not sorting correctly

**Solution:** Ensure dates are proper `Date` objects:

```typescript
// ✅ Correct
date: new Date('2024-01-15')

// ❌ Wrong (will be treated as string)
date: '2024-01-15'
```

### Issue: Type badges not showing

**Solution:** Check that `showType` prop is `true` (default) and types are valid:

```typescript
// ✅ Valid types
type: 'blog' | 'publication' | 'talk' | 'teaching' | 'project'
```

### Issue: Descriptions too long in compact mode

**Solution:** The component automatically truncates to 120 chars in compact mode. You can pre-truncate if needed:

```typescript
description: longText.slice(0, 100) + '...'
```

## Related Components

- **BlogList**: Specialized blog post listing with cards
- **PublicationList**: Publication listing with year grouping
- **TalkList**: Talk/presentation listing
- **Badge**: Type indicator badges

---

**Need help?** Check the example files in `docs/examples/` or review the component source at `src/components/blocks/UpdatesList.astro`.
