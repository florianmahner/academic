# Dynamic Routing System

## Overview

This document describes the dynamic routing system for the academic template, which automatically generates pages from content collections.

## Current Implementation

### Blog Routes

The following dynamic routes have been implemented for the blog collection:

#### 1. Blog Listing Page
**File:** `/src/pages/blog/index.astro`
- Lists all non-draft blog posts
- Groups posts by year (newest first)
- Shows post title, date, description, and tags
- Responsive card layout with hover effects

**URL:** `/blog/`

#### 2. Individual Blog Posts
**File:** `/src/pages/blog/[slug].astro`
- Displays individual blog post content
- Includes breadcrumb navigation back to blog listing
- Shows publication date, update date, and tags
- Full markdown rendering with styled components
- Narrow reading width for optimal readability

**URLs:** `/blog/[post-slug]/`

Example:
- `/blog/welcome/`
- `/blog/phd-advice/`
- `/blog/efficient-attention/`

## Content Collections

### Blog Collection
Defined in `/src/content/config.ts`:

```typescript
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
```

### Blog Post Format
Blog posts are Markdown files in `/src/content/blog/` with frontmatter:

```markdown
---
title: "Post Title"
description: "Brief description of the post"
date: 2024-01-15
tags: ["tag1", "tag2"]
draft: false
---

# Post Content

Your markdown content here...
```

## Adding Blog to Navigation

To enable the blog link in the site navigation, uncomment the blog section in `config.yaml`:

```yaml
navigation:
  items:
    - id: about
      label: About
      href: /
    - id: publications
      label: Publications
      href: /publications
    - id: open-source
      label: Open Source
      href: /open-source
    - id: blog
      label: Blog
      href: /blog    # <-- Uncomment these lines
    - id: misc
      label: Misc
      href: /misc
```

## Future Extensions

The routing system is designed to be extensible. To add more dynamic routes:

### 1. Define Content Collection
Add to `/src/content/config.ts`:

```typescript
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // ... other fields
  }),
});

export const collections = {
  blog,
  projects,  // Add new collection
};
```

### 2. Create Content Directory
```bash
mkdir -p src/content/projects
```

### 3. Create Dynamic Routes
Create two files:

**Listing page:** `/src/pages/projects/index.astro`
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const projects = await getCollection('projects');
// ... render projects list
---
```

**Detail page:** `/src/pages/projects/[slug].astro`
```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(project => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<BaseLayout>
  <Content />
</BaseLayout>
```

## Potential Collections

The following content types could benefit from dynamic routing:

### Publications
- **URL Pattern:** `/publications/[slug]`
- **Current:** Using BibTeX + JSON (no markdown content)
- **Potential:** Add markdown files for detailed publication pages with:
  - Extended abstract
  - Methodology details
  - Code examples
  - Interactive demos
  - Supplementary materials

### Projects
- **URL Pattern:** `/projects/` and `/projects/[slug]`
- **Content:** Project showcase with:
  - Description and goals
  - Technical details
  - Screenshots/demos
  - Links to code and live demos
  - Related publications

### Talks
- **URL Pattern:** `/talks/` and `/talks/[slug]`
- **Content:** Presentation archives:
  - Talk abstracts
  - Slide embeddings
  - Video recordings
  - Venue and date information

### Teaching
- **URL Pattern:** `/teaching/` and `/teaching/[slug]`
- **Content:** Course materials:
  - Course descriptions
  - Syllabi
  - Lecture notes
  - Assignment descriptions

### Custom Pages
- **URL Pattern:** `/[...slug]` (catch-all)
- **Content:** Any custom markdown pages:
  - Research group information
  - Lab resources
  - Collaboration opportunities

## Style Guide

### Consistent Patterns

All dynamic routes follow these patterns:

1. **Listing pages** (`index.astro`):
   - Use `getCollection()` to fetch all items
   - Filter out drafts
   - Sort by date (newest first)
   - Group by year when appropriate
   - Use card-based layouts

2. **Detail pages** (`[slug].astro`):
   - Implement `getStaticPaths()`
   - Use narrow container (720px max-width)
   - Include breadcrumb navigation
   - Render markdown with `Content` component
   - Style markdown elements consistently

3. **Frontmatter schema**:
   - Always include: `title`, `date`, `draft`
   - Optional: `description`, `updated`, `tags`, `image`
   - Use `z.coerce.date()` for flexible date parsing

## Performance

The routing system uses Astro's static site generation:

- All routes are pre-rendered at build time
- No client-side JavaScript required for navigation
- Optimal performance with instant page loads
- Small bundle sizes

## Build Output

Example build output showing generated routes:

```
generating static routes
▶ src/pages/blog/[slug].astro
  ├─ /blog/phd-advice/index.html (+13ms)
  ├─ /blog/efficient-attention/index.html (+3ms)
  └─ /blog/welcome/index.html (+3ms)
▶ src/pages/blog/index.astro
  └─ /blog/index.html (+3ms)
```

## Testing Routes

To test the routing system:

```bash
# Build the site
npm run build

# Preview the built site
npm run preview

# Visit in browser
open http://localhost:4321/blog/
```

## Troubleshooting

### Posts not appearing
- Check that `draft: false` in frontmatter
- Verify files are in `/src/content/blog/` directory
- Ensure frontmatter matches schema in `config.ts`

### 404 errors
- Rebuild the site after adding new posts
- Check that collection is exported in `config.ts`
- Verify `getStaticPaths()` is implemented correctly

### Styling issues
- Check that BaseLayout is imported correctly
- Verify CSS custom properties are defined
- Test in both light and dark modes

## Related Files

- `/src/content/config.ts` - Collection definitions
- `/src/pages/blog/index.astro` - Blog listing page
- `/src/pages/blog/[slug].astro` - Individual blog posts
- `/src/lib/navigation.ts` - Navigation system
- `/config.yaml` - Site configuration
- `/src/layouts/BaseLayout.astro` - Base page layout
