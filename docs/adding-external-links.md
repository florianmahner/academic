# Adding External Links to Navigation

## Quick Guide

External links in navigation are automatically detected and handled properly. Just add them to your config!

## Step 1: Edit Config

Open `src/config.ts` and add external links to the navigation array:

```typescript
export const config = {
  navigation: [
    // Internal pages (relative URLs)
    { id: "about", label: "About", href: "/" },
    { id: "publications", label: "Publications", href: "/publications" },

    // External links (absolute URLs starting with http:// or https://)
    { id: "github", label: "GitHub", href: "https://github.com/yourusername" },
    { id: "scholar", label: "Google Scholar", href: "https://scholar.google.com/citations?user=YOUR_ID" },
    { id: "orcid", label: "ORCID", href: "https://orcid.org/YOUR-ORCID-ID" },
  ],
};
```

## Step 2: Build and Test

```bash
npm run build
# or
npm run dev
```

That's it! The navigation system automatically:
- ✅ Opens external links in a new tab
- ✅ Adds `rel="noopener noreferrer"` for security
- ✅ Keeps internal links in the same tab
- ✅ Highlights current page correctly

## Common External Links

### Academic Profiles

```typescript
navigation: [
  { id: "scholar", label: "Google Scholar", href: "https://scholar.google.com/citations?user=YOUR_ID" },
  { id: "orcid", label: "ORCID", href: "https://orcid.org/0000-0001-2345-6789" },
  { id: "researchgate", label: "ResearchGate", href: "https://www.researchgate.net/profile/Your-Name" },
  { id: "arxiv", label: "arXiv", href: "https://arxiv.org/a/lastname_f_1" },
  { id: "dblp", label: "DBLP", href: "https://dblp.org/pid/123/4567.html" },
]
```

### Social & Professional

```typescript
navigation: [
  { id: "github", label: "GitHub", href: "https://github.com/yourusername" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/yourprofile" },
  { id: "twitter", label: "Twitter", href: "https://twitter.com/yourusername" },
  { id: "mastodon", label: "Mastodon", href: "https://mastodon.social/@yourusername" },
]
```

### Institution & Lab

```typescript
navigation: [
  { id: "lab", label: "Lab Website", href: "https://lab.university.edu" },
  { id: "dept", label: "Department", href: "https://cs.university.edu" },
  { id: "institute", label: "Research Institute", href: "https://institute.org" },
]
```

## How It Works

The navigation system uses a simple rule:

**If `href` starts with `http://` or `https://` → External link**

This means:
- `/about` → Internal (same tab)
- `https://github.com/user` → External (new tab)
- `http://example.com` → External (new tab)

## Technical Details

### Automatic Rendering

External links are rendered as:

```html
<a
  href="https://github.com/yourusername"
  target="_blank"
  rel="noopener noreferrer"
  class="nav-link"
>
  GitHub
</a>
```

Internal links are rendered as:

```html
<a
  href="/publications"
  class="nav-link active"
>
  Publications
</a>
```

### Security

The `rel="noopener noreferrer"` attribute:
- **`noopener`**: Prevents the new page from accessing `window.opener`
- **`noreferrer`**: Prevents the browser from sending the referrer header

This protects against:
- Tabnabbing attacks
- Privacy leaks
- Performance issues

## Mixed Navigation Example

A complete example mixing internal and external links:

```typescript
export const config = {
  navigation: [
    // 1. Home (internal)
    { id: "home", label: "Home", href: "/" },

    // 2. Research pages (internal)
    { id: "publications", label: "Publications", href: "/publications" },
    { id: "projects", label: "Projects", href: "/projects" },

    // 3. External profiles
    { id: "github", label: "GitHub", href: "https://github.com/yourusername" },
    { id: "scholar", label: "Scholar", href: "https://scholar.google.com/citations?user=YOUR_ID" },

    // 4. More internal pages
    { id: "blog", label: "Blog", href: "/blog" },
    { id: "cv", label: "CV", href: "/cv" },
  ],
};
```

## Ordering Tips

### Pattern 1: External Links at End
```typescript
navigation: [
  { id: "about", label: "About", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  { id: "blog", label: "Blog", href: "/blog" },
  // External links at the end
  { id: "github", label: "GitHub", href: "https://github.com/..." },
  { id: "scholar", label: "Scholar", href: "https://scholar.google.com/..." },
]
```

### Pattern 2: Mixed Throughout
```typescript
navigation: [
  { id: "home", label: "Home", href: "/" },
  { id: "github", label: "GitHub", href: "https://github.com/..." },  // External
  { id: "publications", label: "Papers", href: "/publications" },
  { id: "scholar", label: "Scholar", href: "https://scholar.google.com/..." },  // External
  { id: "blog", label: "Blog", href: "/blog" },
]
```

### Pattern 3: Grouped Sections
```typescript
navigation: [
  // Site pages
  { id: "about", label: "About", href: "/" },
  { id: "work", label: "Work", href: "/work" },

  // Academic profiles
  { id: "scholar", label: "Scholar", href: "https://scholar.google.com/..." },
  { id: "orcid", label: "ORCID", href: "https://orcid.org/..." },

  // Social
  { id: "github", label: "GitHub", href: "https://github.com/..." },
  { id: "twitter", label: "Twitter", href: "https://twitter.com/..." },
]
```

## Label Customization

Use friendly, short labels:

```typescript
// ✅ Good - concise
{ id: "gh", label: "GitHub", href: "https://github.com/..." }

// ❌ Avoid - too long
{ id: "github-profile", label: "My GitHub Profile Page", href: "https://github.com/..." }

// ✅ Good - recognizable
{ id: "scholar", label: "Scholar", href: "https://scholar.google.com/..." }

// ❌ Avoid - unclear
{ id: "gcs", label: "GCS", href: "https://scholar.google.com/..." }
```

## Testing External Links

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Test locally:**
   ```bash
   npm run preview
   ```

3. **Verify in browser:**
   - Click external links → Should open in new tab
   - Click internal links → Should stay in same tab
   - Check that internal pages highlight correctly
   - Verify no security warnings in console

## Troubleshooting

### External link opens in same tab

**Problem:** Link doesn't have `http://` or `https://` prefix

**Solution:**
```typescript
// ❌ Wrong
{ id: "github", label: "GitHub", href: "github.com/user" }

// ✅ Correct
{ id: "github", label: "GitHub", href: "https://github.com/user" }
```

### Link doesn't appear in navigation

**Problem:** Syntax error or missing required fields

**Solution:** Check all required fields are present:
```typescript
{
  id: "unique-id",      // Required
  label: "Display Text", // Required
  href: "https://..."    // Required
}
```

### Active state shows on external link

**Problem:** This shouldn't happen, but if it does, check the URL format

**Solution:** External links should never show active state since they navigate away from your site. If you see this, verify the URL starts with `http://` or `https://`.

## Best Practices

1. **Use HTTPS**: Always use `https://` instead of `http://` when possible
2. **Keep labels short**: 1-2 words ideal for navigation
3. **Consistent ordering**: Group similar link types together
4. **Test on mobile**: Verify navigation works on small screens
5. **Verify URLs**: Check that all external URLs work before deploying

## Summary

Adding external links to navigation is as simple as:

1. Add URL with `https://` prefix to `config.ts`
2. Build and deploy
3. System automatically handles new tab behavior and security

No special configuration or attributes needed!
