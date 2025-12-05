# Navigation Examples

Practical examples for customizing your site navigation.

## Basic Configuration

Edit `src/config.ts` to customize your navigation:

```typescript
export const config = {
  navigation: [
    { id: "about", label: "About", href: "/" },
    { id: "publications", label: "Publications", href: "/publications" },
    { id: "open-source", label: "Open Source", href: "/open-source" },
    { id: "misc", label: "Misc", href: "/misc" },
  ],
  navigationMode: "sidebar", // "floating" | "sidebar" | "inline"
};
```

## Adding External Links

### Example 1: Link to GitHub Profile

```typescript
navigation: [
  { id: "about", label: "About", href: "/" },
  { id: "publications", label: "Publications", href: "/publications" },
  { id: "github", label: "GitHub", href: "https://github.com/yourusername" },
  { id: "scholar", label: "Scholar", href: "https://scholar.google.com/citations?user=YOUR_ID" },
]
```

External links (starting with `http://` or `https://`) automatically:
- Open in new tab (`target="_blank"`)
- Include security attributes (`rel="noopener noreferrer"`)

### Example 2: Mixed Internal and External Navigation

```typescript
navigation: [
  // Internal pages
  { id: "home", label: "Home", href: "/" },
  { id: "research", label: "Research", href: "/research" },

  // External profiles
  { id: "github", label: "GitHub", href: "https://github.com/yourusername" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/yourprofile" },

  // More internal pages
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "cv", label: "CV", href: "/cv.pdf" }, // PDF in public folder
]
```

## Changing Navigation Mode

Try all three modes to find your preference:

### Floating Mode (Safari-style)

```typescript
navigationMode: "floating"
```

**Best for:**
- Minimal, distraction-free reading
- Mobile-first designs
- Long-form content

**Features:**
- Floating pill at bottom
- Auto-hides on scroll
- Reappears on scroll up or hover

### Sidebar Mode (Default)

```typescript
navigationMode: "sidebar"
```

**Best for:**
- Academic/professional sites
- Consistent navigation presence
- Desktop-focused designs

**Features:**
- Fixed left sidebar
- Always visible
- Aligns with content

### Inline Mode (Traditional)

```typescript
navigationMode: "inline"
```

**Best for:**
- Traditional website layouts
- Maximizing content width
- Header-focused designs

**Features:**
- Header-style navigation
- Top of page
- Full-width content area

## Reordering Navigation Items

Navigation order follows array position:

```typescript
// This order determines the navigation display
navigation: [
  { id: "home", label: "Home", href: "/" },           // First
  { id: "about", label: "About", href: "/about" },    // Second
  { id: "work", label: "Work", href: "/work" },       // Third
  { id: "contact", label: "Contact", href: "/contact" }, // Fourth
]
```

## Custom Labels

Use different labels than page titles:

```typescript
navigation: [
  { id: "home", label: "🏠 Home", href: "/" },
  { id: "pubs", label: "Papers", href: "/publications" },  // Shorter label
  { id: "oss", label: "Projects", href: "/open-source" },  // Friendlier name
  { id: "misc", label: "Other", href: "/misc" },           // Simplified
]
```

## Testing Navigation

### 1. Check Active States

Navigate to each page and verify:
- Current page is highlighted in navigation
- Active state styling is visible
- All navigation modes show correct highlighting

### 2. Test External Links

- Click external links
- Verify they open in new tabs
- Check that internal links stay in same tab

### 3. Test Mobile Navigation

- Resize browser to mobile width (< 768px)
- Hamburger menu should appear
- Navigation should slide in from right
- Clicking outside should close menu
- ESC key should close menu

### 4. Test All Navigation Modes

Change `navigationMode` in config and test each:

```bash
# After changing navigationMode in config:
npm run dev

# Navigate to http://localhost:4321/academic
# Verify navigation displays correctly
```

## Advanced: Programmatic Navigation

For custom components that need navigation data:

```astro
---
import { getNavigationWithActive } from '../lib/navigation';

// Get current navigation
const navItems = await getNavigationWithActive(Astro.url.pathname);

// Find specific item
const homeItem = navItems.find(item => item.id === 'home');

// Filter by type
const internalLinks = navItems.filter(item => !item.external);
const externalLinks = navItems.filter(item => item.external);

// Get active item
const activeItem = navItems.find(item => item.active);
---

<div class="custom-nav">
  <!-- Internal navigation -->
  <nav class="internal">
    {internalLinks.map(item => (
      <a href={item.href}>{item.label}</a>
    ))}
  </nav>

  <!-- External links -->
  <nav class="external">
    {externalLinks.map(item => (
      <a href={item.href} target="_blank">{item.label}</a>
    ))}
  </nav>
</div>
```

## Common Patterns

### Academic Profile Navigation

```typescript
navigation: [
  { id: "about", label: "About", href: "/" },
  { id: "publications", label: "Publications", href: "/publications" },
  { id: "teaching", label: "Teaching", href: "/teaching" },
  { id: "cv", label: "CV", href: "/cv" },
  { id: "scholar", label: "Google Scholar", href: "https://scholar.google.com/citations?user=YOUR_ID" },
]
```

### Developer Portfolio Navigation

```typescript
navigation: [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "github", label: "GitHub", href: "https://github.com/yourusername" },
  { id: "contact", label: "Contact", href: "/contact" },
]
```

### Researcher Navigation

```typescript
navigation: [
  { id: "home", label: "Home", href: "/" },
  { id: "publications", label: "Publications", href: "/publications" },
  { id: "talks", label: "Talks", href: "/talks" },
  { id: "lab", label: "Lab", href: "/lab" },
  { id: "orcid", label: "ORCID", href: "https://orcid.org/YOUR-ORCID-ID" },
  { id: "scholar", label: "Scholar", href: "https://scholar.google.com/citations?user=YOUR_ID" },
]
```

## Troubleshooting

### Navigation not appearing
- Check `navigationMode` is set in `src/config.ts`
- Verify navigation array has items
- Check browser console for errors

### Active states not working
- Ensure URLs match exactly (including trailing slashes)
- Check base path configuration in `astro.config.mjs`

### External links not opening in new tab
- Verify URL starts with `http://` or `https://`
- Check link in browser dev tools for `target="_blank"` attribute

### Mobile nav not showing
- Test at width < 768px
- Check if hamburger icon appears
- Verify no CSS overrides hiding mobile nav
