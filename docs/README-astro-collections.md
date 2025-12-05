# Astro Content Collections - Complete Research Guide

## Overview

This folder contains comprehensive research and examples for implementing Astro's Content Collections system, which handles multiple content types with type safety, references between collections, and flexible routing.

## Documents in This Research

### 1. **astro-content-collections-research.md** - Foundation & Concepts
The primary reference document covering:
- How Content Collections work architecturally
- Multi-collection organization patterns
- Complete configuration example with 5 collection types
- Content file examples (Markdown, JSON)
- Dynamic routing patterns (`[slug].astro` vs `[...slug].astro`)
- Reference fields and relationships
- Query patterns (filtering, sorting, resolving references)
- Real-world homepage example
- Best practices and performance tips

**Start here if:** You're new to Content Collections or want a complete overview.

### 2. **astro-collections-quick-reference.md** - Quick Lookup
Fast reference guide with:
- Setup (5-minute configuration)
- All major query functions
- Common patterns (featured items, filtering by category)
- Schema type reference
- Environment-specific filtering
- TypeScript types
- Troubleshooting
- File organization
- Full minimal example

**Use this when:** You need quick syntax or patterns you've forgotten.

### 3. **content-config-examples.ts** - Configuration Templates
Production-ready collection configurations including:
- Blog with authors and tags (10 examples)
- Projects with metadata
- Case studies with metrics
- Product catalog with variants
- Nested documentation
- Team members
- Testimonials
- FAQs
- Events
- Podcast episodes

**Copy from here:** When setting up a new collection type.

### 4. **dynamic-routes-examples.astro** - Route Files
Complete route implementations showing:
- Blog post page with author and related posts
- Project detail with gallery and links
- Nested documentation routes
- Product detail with pricing and variants
- Case study with before/after metrics
- FAQ with related topics

**Copy from here:** When creating `src/pages/[slug].astro` files.

### 5. **collection-page-templates.astro** - Listing Pages
Full-page templates for displaying collections:
- Blog archive with category grouping
- Project portfolio grid with filters
- Documentation with sidebar navigation
- Team directory with filtering
- Testimonials showcase
- Events calendar (upcoming/past)

**Copy from here:** When creating `src/pages/index.astro` listing pages.

### 6. **astro-collections-advanced.md** - Advanced Patterns
Complex implementations including:
- Multi-level references
- Computed fields and transformations
- Advanced filtering, grouping, pagination
- Bidirectional relationships (reverse queries)
- Cross-collection queries
- Error handling and validation
- Dynamic navigation and breadcrumbs
- Caching and performance
- Dynamic metadata/SEO
- Internationalization (i18n)

**Use when:** You need patterns beyond the basics.

---

## Quick Start: 5-Minute Setup

### Step 1: Define Collections

Create `src/content.config.ts`:

```typescript
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: reference('authors'),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: file('src/content/authors.json'),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
  }),
});

export const collections = { blog, authors };
```

### Step 2: Create Content

**`src/content/blog/hello-world.md`:**
```markdown
---
title: "Hello World"
pubDate: 2024-01-15
author: john-doe
---

Content here...
```

**`src/content/authors.json`:**
```json
{
  "john-doe": {
    "name": "John Doe",
    "bio": "Web Developer"
  }
}
```

### Step 3: Create Route

**`src/pages/blog/[slug].astro`:**
```astro
---
import { getCollection, getEntry, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const author = await getEntry(post.data.author);
---

<h1>{post.data.title}</h1>
<p>By {author?.data.name}</p>
<Content />
```

### Step 4: Create Index Page

**`src/pages/blog/index.astro`:**
```astro
---
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<h1>Blog</h1>
<ul>
  {posts.map(post => (
    <li><a href={`/blog/${post.id}`}>{post.data.title}</a></li>
  ))}
</ul>
```

---

## Key Concepts

### Collections
- **Organized sets of content** with shared structure
- Each collection has a **loader** (where data comes from) and **schema** (validation)
- Types: Markdown directory, single JSON file, remote API

### Schemas
- **Zod validation** ensures data is correct before use
- **TypeScript types** generated automatically
- Support for references to other collections

### References
- **Link collections together** (blog post → author)
- **Type-safe relationships** with automatic validation
- **Lazy resolved** using `getEntry()` and `getEntries()`

### Routes
- **`[slug].astro`** for single items → `/blog/my-post`
- **`[...slug].astro`** for nested routes → `/docs/guides/intro`
- **`index.astro`** for listing all items → `/blog`

### Querying
- **`getCollection('name')`** - fetch all entries
- **`.filter()`** - filter by any criteria
- **`getEntry('name', 'id')`** - get single entry
- **`getEntries(references)`** - resolve references
- **`render(entry)`** - convert to HTML

---

## File Organization Best Practice

```
src/
├── content/
│   ├── config.ts                    # Collection definitions
│   ├── blog/                        # Collection 1
│   │   ├── post-1.md
│   │   ├── post-2.md
│   │   └── drafts/
│   ├── projects/                    # Collection 2
│   │   ├── project-a.md
│   │   └── project-b.md
│   ├── authors.json                 # Collection 3
│   └── testimonials.json            # Collection 4
│
├── pages/
│   ├── index.astro                  # Homepage
│   ├── blog/
│   │   ├── index.astro              # Blog listing
│   │   └── [slug].astro             # Blog post
│   ├── projects/
│   │   ├── index.astro              # Projects listing
│   │   └── [slug].astro             # Project detail
│   └── docs/
│       ├── index.astro              # Docs home
│       └── [...slug].astro          # Nested docs
│
├── layouts/
│   ├── BlogLayout.astro
│   ├── ProjectLayout.astro
│   └── DocsLayout.astro
│
└── components/
    ├── BlogCard.astro
    ├── ProjectCard.astro
    └── ...
```

---

## Common Patterns Reference

### Pattern 1: Blog with Multiple Authors

**Config:** Define authors as separate collection
**Reference:** Blog post references author by ID
**Query:** Resolve author via `getEntry(post.data.author)`

See: `content-config-examples.ts` → Example 1

### Pattern 2: Portfolio with Projects

**Config:** Projects collection with status, tech stack, links
**Route:** Individual `/projects/[slug].astro` page
**List:** Gallery view with filtering by tech/status

See: `collection-page-templates.astro` → Example 2

### Pattern 3: Nested Documentation

**Config:** Docs collection with category and sidebar_order
**Route:** Nested route `src/pages/docs/[...slug].astro`
**List:** Sidebar navigation by category

See: `collection-page-templates.astro` → Example 3

### Pattern 4: Complex References

**Config:** Multi-level references (author → posts → tags)
**Query:** Resolve all references with `Promise.all()`
**Result:** Fully enriched object ready to render

See: `astro-collections-advanced.md` → Section 1

### Pattern 5: Computed Fields

**Config:** Transform schema to add calculated properties
**Use:** Reading time, slugs, boolean flags
**Benefit:** Computed at build time, available on entry.data

See: `astro-collections-advanced.md` → Section 2

---

## When to Use Content Collections

✅ **Use when:**
- You have multiple related content pieces
- They share a common structure/schema
- You want type safety and validation
- You need dynamic routing per item
- Content is stored locally or in CMS

❌ **Skip when:**
- Single static pages (just use `.astro` files)
- Real-time data that updates frequently
- Tiny amount of content (hardcode instead)
- Dynamic data without a schema

---

## Common Questions

### Q: How do I create a blog?
A: See `astro-content-collections-research.md` → Section 5-7 or Quick Start above.

### Q: How do I handle multiple content types?
A: Define separate collections in `config.ts`. Create separate route files in `src/pages/[type]/[slug].astro`.

### Q: How do I filter posts by category?
A: Use `getCollection('blog', ({ data }) => data.category === 'tutorial')`.

### Q: How do I show related posts?
A: Use array reference field `relatedPosts: z.array(reference('blog'))` and resolve with `getEntries()`.

### Q: How do I exclude drafts in production?
A: Use `import.meta.env.PROD` check in your filter: `data.draft !== true || !import.meta.env.PROD`.

### Q: How do I get all posts by an author?
A: Filter collection by author ID: `getCollection('blog', ({ data }) => data.author.id === 'john-doe')`.

### Q: How do I render Markdown to HTML?
A: Use `const { Content } = await render(entry)` then render `<Content />` component.

### Q: How do I add custom computed fields?
A: Use `.transform()` in schema to add properties based on content. See Advanced Patterns Section 2.

---

## Performance Tips

1. **Memoize queries** - Store results in variables, don't query same collection multiple times
2. **Filter early** - Filter in `getCollection()` callback, not after fetching
3. **Use `Promise.all()`** - Resolve multiple references in parallel
4. **Batch operations** - Combine related queries
5. **Sort once** - Sort before mapping/slicing
6. **Avoid N+1** - Don't resolve references in loops

Example:
```astro
---
// ✅ GOOD
const posts = await getCollection('blog', ({ data }) => !data.draft);
const featured = posts.filter(p => p.data.featured);

// ❌ BAD
const all = await getCollection('blog');
const filtered = all.filter(({ data }) => !data.draft);
const featured = filtered.filter(p => p.data.featured);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| TypeScript errors in config | Check schema types, ensure all required fields present |
| Route not generating | Verify `getStaticPaths()` returns objects with `params` and `props` |
| Reference not resolving | Make sure collection name matches exactly, use `getEntry()` |
| Drafts showing in prod | Add `!data.draft` to collection filter |
| Slow builds | Reduce number of reference resolves, memoize queries |
| Content not rendering | Use `render(entry)` to get `<Content />` component |

---

## Resources

- **Astro Docs:** https://docs.astro.build/en/guides/content-collections/
- **Astro GitHub:** https://github.com/withastro/astro/tree/main/examples/blog
- **Zod Docs:** https://zod.dev (for schema validation)

---

## Navigation

- Start learning: Read `astro-content-collections-research.md`
- Need quick answer: Check `astro-collections-quick-reference.md`
- Need code examples: Copy from `content-config-examples.ts` or `dynamic-routes-examples.astro`
- Need listing pages: See `collection-page-templates.astro`
- Advanced patterns: Study `astro-collections-advanced.md`

---

## Summary

Astro Content Collections provide:

1. **Type-safe structure** via Zod schemas
2. **Multiple content types** with different structures
3. **Relationships** between collections via references
4. **Flexible routing** with dynamic pages
5. **Powerful queries** with filtering and sorting
6. **Best in class** developer experience

Start with the research document, refer to quick-reference when needed, and copy code examples for your specific use case.
