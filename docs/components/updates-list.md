# UpdatesList Component

A flexible, timeline-style component for displaying recent activity items from multiple content sources (blog posts, publications, talks, teaching, projects).

## Features

- **Unified Display**: Shows different content types with consistent styling
- **Chronological Sorting**: Automatically sorts items by date (newest first)
- **Type Indicators**: Color-coded badges for quick content type identification
- **Flexible Modes**: Compact mode for homepage, detailed mode for standalone pages
- **Month Grouping**: Optional grouping by month for better organization
- **Type Filtering**: Show only specific content types
- **Tufte-Inspired Design**: Clean typography with subtle hover effects
- **Responsive**: Adapts gracefully to mobile screens

## Usage

### Basic Example

```astro
---
import { UpdatesList } from '../components/blocks';
import type { UpdateItem } from '../components/blocks';

const updates: UpdateItem[] = [
  {
    type: 'blog',
    title: 'New Research on Machine Learning',
    date: new Date('2024-01-15'),
    description: 'Exploring novel approaches to neural architecture search.',
    url: '/blog/ml-research',
    tags: ['machine-learning', 'research']
  },
  {
    type: 'publication',
    title: 'Advances in Computer Vision',
    date: new Date('2024-01-10'),
    venue: 'CVPR 2024',
    authors: ['Smith, J.', 'Doe, J.'],
    url: '/publications/cv-advances'
  },
  {
    type: 'talk',
    title: 'Introduction to Deep Learning',
    date: new Date('2024-01-05'),
    event: 'ML Conference 2024',
    location: 'San Francisco, CA',
    url: '/talks/dl-intro'
  }
];
---

<UpdatesList items={updates} />
```

### Compact Mode (Homepage)

```astro
<!-- Show last 5 updates in compact mode -->
<UpdatesList
  items={updates}
  limit={5}
  compact={true}
  showType={true}
/>
```

### Grouped by Month

```astro
<!-- Show all updates grouped by month -->
<UpdatesList
  items={updates}
  groupByMonth={true}
/>
```

### Filtered by Type

```astro
<!-- Show only blog posts and publications -->
<UpdatesList
  items={updates}
  filterTypes={['blog', 'publication']}
/>
```

### Full Standalone Page

```astro
---
// src/pages/updates.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { UpdatesList } from '../components/blocks';
import { getPublishedPosts } from '../lib/blog';
import { getCollection } from 'astro:content';

// Aggregate updates from all sources
const blogPosts = await getPublishedPosts();
const publications = await getCollection('publications');
const talks = await getCollection('talks');

const updates = [
  ...blogPosts.map(post => ({
    type: 'blog' as const,
    title: post.data.title,
    date: post.data.date,
    description: post.data.description,
    url: `/blog/${post.slug}`,
    tags: post.data.tags
  })),
  ...publications.map(pub => ({
    type: 'publication' as const,
    title: pub.data.title,
    date: new Date(pub.data.year, 0),
    venue: pub.data.venue,
    authors: pub.data.authors,
    url: `/publications/${pub.slug}`
  })),
  ...talks.map(talk => ({
    type: 'talk' as const,
    title: talk.data.title,
    date: new Date(talk.data.date),
    event: talk.data.event,
    location: talk.data.location,
    url: `/talks/${talk.slug}`
  }))
];
---

<BaseLayout title="Recent Updates">
  <article class="container">
    <h1>Recent Updates</h1>
    <UpdatesList
      items={updates}
      groupByMonth={true}
      showType={true}
    />
  </article>
</BaseLayout>
```

## Props

### `items` (required)
**Type:** `UpdateItem[]`

Array of update items to display.

### `limit`
**Type:** `number` (optional)
**Default:** `undefined`

Limit the number of items displayed. Useful for "recent updates" sections on the homepage.

### `showType`
**Type:** `boolean` (optional)
**Default:** `true`

Show type badges (Blog, Paper, Talk, etc.) next to each item.

### `compact`
**Type:** `boolean` (optional)
**Default:** `false`

Enable compact mode with tighter spacing and truncated descriptions (max 120 chars).

### `groupByMonth`
**Type:** `boolean` (optional)
**Default:** `false`

Group items by month with month headers.

### `filterTypes`
**Type:** `('blog' | 'publication' | 'talk' | 'teaching' | 'project')[]` (optional)
**Default:** `undefined`

Show only specific content types.

### `class`
**Type:** `string` (optional)

Additional CSS class names.

## UpdateItem Interface

```typescript
interface UpdateItem {
  // Required fields
  type: 'blog' | 'publication' | 'talk' | 'teaching' | 'project';
  title: string;
  date: Date;

  // Optional common fields
  description?: string;
  url?: string;

  // Type-specific metadata
  venue?: string;        // For publications and talks
  event?: string;        // For talks
  location?: string;     // For talks
  tags?: string[];       // For blog posts
  authors?: string[];    // For publications

  // Visual enhancements
  icon?: string;         // Custom icon/emoji
  highlight?: boolean;   // Featured/important items (adds accent border)
}
```

## Type Badge Configuration

Each content type has a predefined badge style:

- **Blog**: Primary (accent color)
- **Paper**: Success (green)
- **Talk**: Warning (amber)
- **Teaching**: Outline (border only)
- **Project**: Default (muted)

## Design Decisions

### 1. **Unified Data Model**
Uses a single `UpdateItem` interface with optional fields rather than separate components for each type. This enables:
- Easy mixing of different content types
- Consistent chronological sorting
- Flexible filtering and grouping

### 2. **Compact Mode**
Two distinct modes for different contexts:
- **Full mode**: For standalone pages with complete information
- **Compact mode**: For homepage sections with tighter spacing and truncated descriptions

### 3. **Type-Specific Metadata**
Conditionally renders relevant metadata based on content type:
- Publications show authors and venue
- Talks show event and location
- Blog posts show tags

### 4. **Tufte-Inspired Typography**
- Monospace font for dates (precise, technical feel)
- Medium weight for titles (clear hierarchy)
- Muted colors for secondary information
- Subtle hover states (no aggressive animations)

### 5. **Flexible Grouping**
Month grouping is optional, allowing both:
- Flat list for small sets
- Grouped timeline for extensive updates

### 6. **Accessibility**
- Semantic HTML (`<article>`, `<time>`)
- Proper datetime attributes
- Hover states without relying solely on color

## Examples in Context

### Homepage "Recent Activity" Section

```astro
<section class="recent-updates">
  <h2>Recent Activity</h2>
  <UpdatesList
    items={recentUpdates}
    limit={5}
    compact={true}
  />
  <a href="/updates" class="view-all">View all updates →</a>
</section>
```

### Filtered Publications Timeline

```astro
<UpdatesList
  items={allUpdates}
  filterTypes={['publication']}
  groupByMonth={true}
/>
```

### Highlighted Items

```astro
const updates = [
  {
    type: 'publication',
    title: 'Award-Winning Paper',
    date: new Date('2024-01-15'),
    venue: 'ICML 2024',
    highlight: true,  // Adds accent border
    icon: '🏆'        // Custom icon
  }
];
```

## Styling Customization

Override CSS variables for custom theming:

```css
.updates-list {
  --update-spacing: var(--space-6);
  --update-bg-hover: var(--color-bg-alt);
}
```

## Related Components

- `BlogList` - Specialized blog post listing
- `PublicationList` - Publication listing with year grouping
- `TalkList` - Talk/presentation listing
- `Badge` - Used for type indicators and tags
