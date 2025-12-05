# Navigation Quick Reference

## 5-Second Setup

1. **Edit `src/config.ts`:**
```typescript
navigation: [
  { id: "about", label: "About", href: "/" },
  { id: "work", label: "Work", href: "/work" },
]
```

2. **Choose navigation mode:**
```typescript
navigationMode: "sidebar" // or "floating" or "inline"
```

3. **Done!** Navigation auto-generates everywhere.

## Quick Reference Table

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `id` | string | Unique identifier | `"about"` |
| `label` | string | Display text | `"About Me"` |
| `href` | string | Link destination | `"/about"` or `"https://github.com"` |

## External Link Detection

- ✅ `href: "https://github.com/user"` → Opens in new tab
- ✅ `href: "/about"` → Internal navigation
- ✅ Automatic `target="_blank"` and `rel="noopener noreferrer"`

## Navigation Modes

| Mode | Best For | Location |
|------|----------|----------|
| `floating` | Minimal design | Bottom (auto-hide) |
| `sidebar` | Academic sites | Left sidebar |
| `inline` | Traditional | Top header |

## Active State Detection

✅ **Automatic highlighting:**
- `/publications` → Highlights "Publications" link
- `/publications/paper-1` → Also highlights "Publications" link
- `/` → Only highlights "Home" link

## Mobile Behavior

- **< 768px**: Auto-switches to slide-out menu
- **Hamburger icon**: Top-right corner
- **Close**: Click outside, ESC key, or X button

## API Cheat Sheet

```typescript
// Get navigation with active states
import { getNavigationWithActive } from '../lib/navigation';
const nav = await getNavigationWithActive(Astro.url.pathname);

// Apply base path
import { applyBasePath } from '../lib/navigation';
const navItems = applyBasePath(nav, base);

// Get breadcrumbs
import { getBreadcrumbs } from '../lib/navigation';
const breadcrumbs = await getBreadcrumbs(Astro.url.pathname);
```

## NavItem Interface

```typescript
interface NavItem {
  id: string;        // Unique ID
  label: string;     // Display text
  href: string;      // URL
  order: number;     // Sort order (auto-assigned)
  external?: boolean; // Is external link (auto-detected)
  active?: boolean;   // Is current page (auto-computed)
}
```

## Common Tasks

### Add New Page
```typescript
{ id: "blog", label: "Blog", href: "/blog" }
```

### Add External Link
```typescript
{ id: "github", label: "GitHub", href: "https://github.com/user" }
```

### Reorder Items
Move item in array:
```typescript
navigation: [
  { id: "home", ... },    // Position 0
  { id: "about", ... },   // Position 1
  { id: "work", ... },    // Position 2
]
```

### Change Mode
```typescript
navigationMode: "floating" // or "sidebar" or "inline"
```

## File Locations

| File | Purpose |
|------|---------|
| `src/config.ts` | Configure navigation |
| `src/lib/navigation.ts` | Navigation logic |
| `src/layouts/BaseLayout.astro` | Navigation rendering |
| `docs/navigation-system.md` | Full documentation |
| `docs/navigation-examples.md` | Examples & patterns |

## Testing Checklist

- [ ] All pages have navigation
- [ ] Current page is highlighted
- [ ] External links open in new tab
- [ ] Mobile menu works (< 768px)
- [ ] All three modes work
- [ ] Base path works for GitHub Pages

## Need Help?

- 📖 Full docs: `docs/navigation-system.md`
- 💡 Examples: `docs/navigation-examples.md`
- 🔧 Source: `src/lib/navigation.ts`
