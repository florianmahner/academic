# Academic Template Documentation

Welcome to the academic template documentation!

## Navigation System

The template features a powerful auto-generated navigation system with support for multiple modes, external links, and smart active state detection.

### Quick Start

1. **Configure navigation** in `src/config.ts`:
   ```typescript
   navigation: [
     { id: "about", label: "About", href: "/" },
     { id: "work", label: "Work", href: "/work" },
   ]
   ```

2. **Choose navigation mode**:
   ```typescript
   navigationMode: "sidebar" // or "floating" or "inline"
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   ```

### Documentation Files

| File | Description | For |
|------|-------------|-----|
| [navigation-quick-reference.md](./navigation-quick-reference.md) | 5-second setup + cheat sheets | Quick lookups |
| [adding-external-links.md](./adding-external-links.md) | How to add GitHub, Scholar, etc. | Common task |
| [navigation-examples.md](./navigation-examples.md) | Practical patterns & examples | Learning |
| [navigation-system.md](./navigation-system.md) | Complete technical docs | Deep dive |
| [NAVIGATION_IMPLEMENTATION.md](./NAVIGATION_IMPLEMENTATION.md) | Implementation summary | Reference |

### Navigation Modes

**Floating** - Safari-style pill at bottom (auto-hides on scroll)
- Best for: Minimal design, long-form content
- Location: Bottom of screen

**Sidebar** - Fixed left sidebar (default)
- Best for: Academic sites, desktop-focused
- Location: Left side, always visible

**Inline** - Traditional header navigation
- Best for: Classic layouts, full-width content
- Location: Top of page

### Features

✅ **Auto-generated** from config
✅ **Smart active states** (highlights current page)
✅ **External link support** (opens in new tab)
✅ **Base path support** (works with subdirectories)
✅ **Mobile-responsive** (slide-out menu)
✅ **Three navigation modes**

### Common Tasks

#### Add a new page
```typescript
{ id: "teaching", label: "Teaching", href: "/teaching" }
```

#### Add external link
```typescript
{ id: "github", label: "GitHub", href: "https://github.com/user" }
```

#### Change navigation mode
```typescript
navigationMode: "floating" // or "sidebar" or "inline"
```

#### Reorder items
Just change the array order in `navigation: [...]`

### External Link Examples

```typescript
// Academic profiles
{ id: "scholar", label: "Scholar", href: "https://scholar.google.com/citations?user=ID" }
{ id: "orcid", label: "ORCID", href: "https://orcid.org/0000-0001-2345-6789" }

// Social & professional
{ id: "github", label: "GitHub", href: "https://github.com/username" }
{ id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/profile" }
{ id: "twitter", label: "Twitter", href: "https://twitter.com/username" }
```

### API Reference

```typescript
// Get navigation with active states
import { getNavigationWithActive } from '../lib/navigation';
const nav = await getNavigationWithActive(Astro.url.pathname);

// Apply base path for subdirectory deployments
import { applyBasePath } from '../lib/navigation';
const navItems = applyBasePath(nav, base);
```

### Testing Checklist

After making navigation changes:

- [ ] Build succeeds (`npm run build`)
- [ ] Current page is highlighted
- [ ] External links open in new tab
- [ ] Internal links stay in same tab
- [ ] Mobile menu works (< 768px)
- [ ] All navigation modes work
- [ ] Base path works (if deployed to subdirectory)

### Troubleshooting

**Navigation not appearing**
- Check `navigationMode` is set in `src/config.ts`
- Verify navigation array has items
- Check browser console for errors

**Active states not working**
- Ensure URLs match exactly (including trailing slashes)
- Check base path configuration in `astro.config.mjs`
- Verify pathname is correct

**External links not opening in new tab**
- URL must start with `http://` or `https://`
- Check link in browser dev tools for `target="_blank"`

### Need Help?

- 📖 [Full documentation](./navigation-system.md)
- 💡 [Examples](./navigation-examples.md)
- 🚀 [Quick reference](./navigation-quick-reference.md)
- 🔗 [Adding external links](./adding-external-links.md)

## Other Documentation

More documentation files will be added here as the template evolves.

## Contributing

When adding new features, please:
1. Update relevant documentation
2. Add examples to examples files
3. Update this README
4. Include testing instructions
