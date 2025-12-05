# UpdatesList - Quick Reference Card

## Import

```astro
import { UpdatesList } from '../components/blocks';
import type { UpdateItem } from '../components/blocks';
import { getAllUpdates, getRecentUpdates } from '../lib/updates';
```

## Basic Usage

```astro
<!-- Get recent updates -->
const updates = await getRecentUpdates(5);

<!-- Render -->
<UpdatesList items={updates} />
```

## Props Cheat Sheet

| Prop | Values | Use Case |
|------|--------|----------|
| `items` | `UpdateItem[]` | **Required** - Your update data |
| `limit` | `number` | Show first N items |
| `showType` | `true`/`false` | Toggle type badges (default: `true`) |
| `compact` | `true`/`false` | Homepage sections (default: `false`) |
| `groupByMonth` | `true`/`false` | Timeline views (default: `false`) |
| `filterTypes` | `['blog', ...]` | Filtered views |
| `class` | `string` | Custom CSS |

## UpdateItem Interface

```typescript
{
  // Required
  type: 'blog' | 'publication' | 'talk' | 'teaching' | 'project',
  title: string,
  date: Date,

  // Optional
  description?: string,
  url?: string,
  venue?: string,      // For pubs/talks
  event?: string,      // For talks
  location?: string,   // For talks
  tags?: string[],     // For blog
  authors?: string[],  // For pubs
  icon?: string,       // Emoji/icon
  highlight?: boolean  // Featured item
}
```

## Common Patterns

### Homepage Recent Activity
```astro
<UpdatesList
  items={await getRecentUpdates(5)}
  compact={true}
/>
```

### Full Timeline Page
```astro
<UpdatesList
  items={await getAllUpdates()}
  groupByMonth={true}
/>
```

### Research Only
```astro
<UpdatesList
  items={await getUpdatesByType(['publication', 'talk'])}
  groupByMonth={true}
/>
```

### Blog Archive
```astro
<UpdatesList
  items={await getUpdatesByType(['blog'])}
/>
```

## Utility Functions

```typescript
// Get all updates from all sources
getAllUpdates() → UpdateItem[]

// Get N most recent
getRecentUpdates(5) → UpdateItem[]

// Filter by type
getUpdatesByType(['blog', 'publication']) → UpdateItem[]

// Filter by year
getUpdatesByYear(2024) → UpdateItem[]

// Date range
getUpdatesInRange(startDate, endDate) → UpdateItem[]

// Group by year
groupUpdatesByYear(updates) → Map<number, UpdateItem[]>

// Group by month
groupUpdatesByMonth(updates) → Map<string, UpdateItem[]>
```

## Type Badge Colors

| Type | Badge | Color |
|------|-------|--------|
| Blog | Primary | Red accent |
| Paper | Success | Green |
| Talk | Warning | Amber |
| Teaching | Outline | Border |
| Project | Default | Gray |

## Display Modes

### Compact Mode
- Tight spacing (3rem)
- Truncated descriptions (120 chars)
- Smaller text
- **Use for**: Homepage, sidebars

### Full Mode (default)
- Generous spacing (4rem)
- Complete descriptions
- Standard text
- **Use for**: Standalone pages

## CSS Variables

```css
--color-accent          /* Type badge colors */
--color-text            /* Title color */
--color-text-secondary  /* Description color */
--color-text-muted      /* Date color */
--color-bg-alt          /* Hover background */
--space-3, --space-4    /* Spacing */
--font-body, --font-mono /* Fonts */
```

## File Locations

```
src/
├── components/blocks/
│   ├── UpdatesList.astro         # Main component
│   └── index.ts                  # Exports
├── lib/
│   └── updates.ts                # Utility functions
docs/
├── components/
│   ├── updates-list.md           # API docs
│   ├── UpdatesList-README.md     # Full guide
│   └── UpdatesList-QuickRef.md   # This file
└── examples/
    ├── updates-homepage-section.astro
    ├── updates-standalone-page.astro
    └── updates-filtered-view.astro
```

## Complete Example

```astro
---
// src/pages/updates.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { UpdatesList } from '../components/blocks';
import { getAllUpdates } from '../lib/updates';

const updates = await getAllUpdates();
---

<BaseLayout title="Updates">
  <article class="container">
    <h1>Recent Activity</h1>

    <UpdatesList
      items={updates}
      groupByMonth={true}
      showType={true}
    />
  </article>
</BaseLayout>
```

## Custom Update Item

```typescript
const custom: UpdateItem = {
  type: 'publication',
  title: 'Award-Winning Paper',
  date: new Date('2024-01-15'),
  venue: 'ICML 2024',
  authors: ['You', 'Collaborator'],
  description: 'Novel approach to...',
  url: '/publications/paper',
  highlight: true,  // Accent border
  icon: '🏆'        // Custom icon
};
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Not sorting | Use `Date` objects, not strings |
| No badges | Check `showType={true}` and valid types |
| Long descriptions | Auto-truncates in compact mode |
| Build error | Ensure collections exist or catch errors |

## Performance

- ⚡ **Build-time**: Static generation
- 🎯 **Zero JS**: Pure HTML/CSS
- 📦 **Bundle**: No runtime overhead
- 🚀 **Fast**: No client-side processing

## Accessibility

- ✅ Semantic HTML (`<article>`, `<time>`)
- ✅ Proper datetime attributes
- ✅ Keyboard navigation
- ✅ Color + text for type indicators
- ✅ ARIA labels where needed

---

**Need more help?** See `UpdatesList-README.md` for complete documentation.
