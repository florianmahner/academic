# Navigation System

The academic template features an auto-generated navigation system that intelligently manages site navigation across all three navigation modes (floating, sidebar, inline).

## Features

- **Auto-generated**: Navigation items are defined in `src/config.ts`
- **Smart active states**: Automatically highlights current page
- **External link support**: Handles external links with proper attributes
- **Base path support**: Works with subdirectory deployments
- **Three navigation modes**: Floating, sidebar, and inline
- **Mobile-responsive**: Automatic mobile navigation panel

## Configuration

Navigation is configured in `src/config.ts`:

```typescript
export const config = {
  navigation: [
    { id: "about", label: "About", href: "/" },
    { id: "publications", label: "Publications", href: "/publications" },
    { id: "github", label: "GitHub", href: "https://github.com/username" }, // External link
  ],

  navigationMode: "sidebar" as const, // "floating" | "sidebar" | "inline"
};
```

## Navigation Item Properties

Each navigation item supports:

- **id**: Unique identifier (used for targeting and tracking)
- **label**: Display text
- **href**: Link destination (internal or external)
- **order**: Sort order (implicit from array position)

## How It Works

### 1. Navigation Generation (`src/lib/navigation.ts`)

The `getNavigation()` function:
- Reads navigation items from config
- Assigns order based on array position
- Detects external links (starting with `http`)
- Prepares items for rendering

```typescript
import { getNavigationWithActive } from '../lib/navigation';

// Get navigation with active states
const navigation = await getNavigationWithActive(Astro.url.pathname);
```

### 2. Active State Detection

The system intelligently determines which navigation item is active:

```typescript
// Exact match: /publications === /publications ✓
// Prefix match: /publications/paper-1 starts with /publications ✓
// Home exception: / doesn't match /publications ✓
```

### 3. Base Path Support

For subdirectory deployments (e.g., `https://user.github.io/academic`):

```typescript
import { applyBasePath } from '../lib/navigation';

const navItems = applyBasePath(navigation, base);
// Input:  href: "/publications"
// Output: href: "/academic/publications"
```

### 4. External Links

External links are automatically detected and rendered with proper attributes:

```html
<a
  href="https://github.com/username"
  target="_blank"
  rel="noopener noreferrer"
>
  GitHub
</a>
```

## Usage in Components

### Basic Usage

```astro
---
import { getNavigationWithActive, applyBasePath } from '../lib/navigation';

const base = import.meta.env.BASE_URL;
const navigation = await getNavigationWithActive(Astro.url.pathname);
const navItems = applyBasePath(navigation, base);
---

<nav>
  {navItems.map(item => (
    <a
      href={item.href}
      class:list={{ active: item.active }}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      {item.label}
    </a>
  ))}
</nav>
```

### Get Breadcrumbs

```astro
---
import { getBreadcrumbs } from '../lib/navigation';

const breadcrumbs = await getBreadcrumbs(Astro.url.pathname);
---

<nav aria-label="Breadcrumb">
  {breadcrumbs.map(crumb => (
    <a href={crumb.href}>{crumb.label}</a>
  ))}
</nav>
```

## Navigation Modes

### Floating Mode
Safari-style pill at the bottom of the screen that auto-hides on scroll:

```typescript
navigationMode: "floating"
```

### Sidebar Mode
Fixed left sidebar navigation (default):

```typescript
navigationMode: "sidebar"
```

### Inline Mode
Traditional header navigation:

```typescript
navigationMode: "inline"
```

## Future Enhancements

The navigation system is designed to support future auto-discovery from page frontmatter:

```yaml
---
# In any content/pages/*.md
title: "My Research"
nav: true
nav_label: "Research"  # Optional override
nav_order: 2            # Optional explicit order
---
```

This would enable:
- Automatic navigation generation from content
- Dynamic page discovery at build time
- Reduced configuration maintenance

Implementation placeholder exists in `scanPagesForNavigation()` function.

## API Reference

### `getNavigation(): Promise<NavItem[]>`
Returns all navigation items from config.

### `getNavigationWithActive(currentPath: string): Promise<NavItem[]>`
Returns navigation items with active states based on current path.

### `applyBasePath(items: NavItem[], base: string): NavItem[]`
Applies base path to navigation items for subdirectory deployments.

### `getBreadcrumbs(currentPath: string): Promise<NavItem[]>`
Returns breadcrumb trail for current page.

### `isPathActive(currentPath: string, itemHref: string): boolean`
Determines if a navigation item should be marked as active.

## NavItem Interface

```typescript
interface NavItem {
  id: string;           // Unique identifier
  label: string;        // Display text
  href: string;         // Link destination
  order: number;        // Sort order
  external?: boolean;   // Is external link
  active?: boolean;     // Is currently active page
}
```

## Styling

Navigation styles are defined in `BaseLayout.astro` and respond to the navigation mode:

```css
/* Floating nav only visible in floating mode */
[data-nav-mode="floating"] .floating-nav { display: block; }

/* Sidebar nav only visible in sidebar mode */
[data-nav-mode="sidebar"] .sidebar-nav { display: block; }

/* Inline nav only visible in inline mode */
[data-nav-mode="inline"] .inline-nav { display: block; }
```

Active states are applied via the `.active` class:

```css
.nav-link.active {
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}
```

## Mobile Navigation

All navigation modes automatically switch to a mobile-friendly slide-out panel on screens < 768px wide. The mobile navigation:

- Appears as a hamburger icon in the top-right
- Slides in from the right side
- Includes backdrop overlay
- Closes on click outside or ESC key
- Maintains active states

No configuration needed - it works automatically!
