# Astro Content Collections - Quick Reference Guide

## 1. Setup: Create Your Configuration

**File:** `src/content.config.ts`

```typescript
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

export const collections = {
  // Directory of Markdown files
  blog: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      author: reference('authors'), // Reference another collection
      tags: z.array(z.string()),
      draft: z.boolean().default(false),
    }),
  }),

  // Single JSON file with multiple entries
  authors: defineCollection({
    loader: file('src/content/authors.json'),
    schema: z.object({
      name: z.string(),
      email: z.string().email(),
      bio: z.string(),
    }),
  }),
};
```

---

## 2. Dynamic Routes: Create Route Files

### Pattern A: Single-level routes `/blog/:slug`

**File:** `src/pages/blog/[slug].astro`

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

### Pattern B: Nested routes `/docs/guide/intro`

**File:** `src/pages/docs/[...slug].astro`

```astro
---
import { getCollection, getEntry, render } from 'astro:content';

export async function getStaticPaths() {
  const docs = await getCollection('docs');
  return docs.map(doc => ({
    params: { slug: doc.id },
    props: { doc },
  }));
}

const { slug } = Astro.params;
const doc = await getEntry('docs', slug!);
if (!doc) return Astro.redirect('/404');

const { Content, headings } = await render(doc);
---
```

---

## 3. Query Collections

### Get all entries (with filtering)

```typescript
// All posts, excluding drafts
const posts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});

// Filter by specific field
const published = await getCollection('blog', ({ data }) => {
  return data.pubDate < new Date();
});

// Filter by directory
const englishDocs = await getCollection('docs', ({ id }) => {
  return id.startsWith('en/');
});
```

### Get single entry

```typescript
const post = await getEntry('blog', 'my-post-id');
const author = await getEntry('authors', 'john-doe');
```

### Resolve references

```typescript
const post = await getEntry('blog', 'my-post');

// Single reference
const author = await getEntry(post.data.author);
// Result: { name: "John", email: "..." }

// Array of references
const tags = await getEntries(post.data.tags);
// Result: [{ name: "astro" }, { name: "web-dev" }]
```

---

## 4. Render Content to HTML

```typescript
const { Content, headings } = await render(entry);
```

Use in your template:
```astro
<Content />

<aside>
  <h3>Table of Contents</h3>
  <ul>
    {headings.map(h => (
      <li style={{ marginLeft: `${h.depth * 1rem}` }}>
        <a href={`#${h.slug}`}>{h.text}</a>
      </li>
    ))}
  </ul>
</aside>
```

---

## 5. Common Patterns

### List Page with Featured Items

```astro
---
const all = await getCollection('blog', ({ data }) => !data.draft);
const featured = all.filter(p => p.data.featured).slice(0, 3);
const recent = all.sort((a, b) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
).slice(0, 5);
---

<section>
  <h2>Featured</h2>
  {featured.map(post => <a href={`/blog/${post.id}`}>{post.data.title}</a>)}
</section>

<section>
  <h2>Recent</h2>
  {recent.map(post => <a href={`/blog/${post.id}`}>{post.data.title}</a>)}
</section>
```

### Filter by Category

```typescript
const tutorials = await getCollection('blog', ({ data }) => {
  return data.category === 'tutorial' && !data.draft;
});

const guides = await getCollection('blog', ({ data }) => {
  return data.category === 'guide' && !data.draft;
});
```

### Environment-Specific Filtering

```typescript
const posts = import.meta.env.PROD
  ? await getCollection('blog', ({ data }) => !data.draft)
  : await getCollection('blog'); // Show drafts in dev mode
```

### Batch Resolve References

```typescript
// Resolve author for each post efficiently
const postsWithAuthors = await Promise.all(
  posts.map(async (post) => {
    const author = await getEntry(post.data.author);
    return { ...post, author };
  })
);
```

---

## 6. Schema Types Reference

```typescript
const schema = z.object({
  // Strings
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),

  // Numbers
  order: z.number(),
  rating: z.number().min(1).max(5),

  // Dates
  pubDate: z.coerce.date(),
  created: z.date(),

  // Booleans
  draft: z.boolean().default(false),
  featured: z.boolean(),

  // Enums (limited choices)
  status: z.enum(['draft', 'published', 'archived']),
  category: z.enum(['blog', 'tutorial', 'guide']),

  // Arrays
  tags: z.array(z.string()),
  technologies: z.array(z.string()),

  // Objects
  author: z.object({
    name: z.string(),
    email: z.string().email(),
  }),

  // Records (key-value pairs)
  metadata: z.record(z.string()),

  // URLs
  url: z.string().url(),
  link: z.string().url(),

  // References to other collections
  author: reference('authors'),
  relatedPosts: z.array(reference('blog')),
});
```

---

## 7. File Organization

```
src/content/
├── blog/                    # Blog posts
│   ├── post-1.md
│   ├── post-2.md
│   └── drafts/
│       └── post-3.md
├── authors.json             # Author profiles
├── projects/                # Project entries
│   ├── project-a.md
│   └── project-b.md
├── testimonials.json        # Reviews
└── docs/                    # Nested docs
    ├── intro.md
    ├── guides/
    │   ├── getting-started.md
    │   └── advanced.md
    └── api/
        └── reference.md

src/pages/
├── blog/
│   ├── index.astro         # List all blog posts
│   ├── [slug].astro        # Single blog post
│   └── tag/[tag].astro     # Posts by tag
├── projects/
│   ├── index.astro         # Project gallery
│   └── [slug].astro        # Single project
└── docs/
    ├── index.astro         # Doc index
    └── [...slug].astro     # Doc pages (nested routes)
```

---

## 8. Real Example: Full Blog Setup

### 1. Define Collections

**`src/content.config.ts`**
```typescript
const authors = defineCollection({
  loader: file('src/content/authors.json'),
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: reference('authors'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, authors };
```

### 2. Create Content

**`src/content/blog/hello-world.md`**
```markdown
---
title: "Hello World"
pubDate: 2024-01-15
author: sarah-chen
---

# Content here...
```

**`src/content/authors.json`**
```json
{
  "sarah-chen": {
    "name": "Sarah Chen",
    "avatar": "/avatars/sarah.jpg"
  }
}
```

### 3. Create Blog Index

**`src/pages/blog/index.astro`**
```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => !data.draft);
const sorted = posts.sort((a, b) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<h1>Blog</h1>
<ul>
  {sorted.map(post => (
    <li>
      <a href={`/blog/${post.id}`}>{post.data.title}</a>
    </li>
  ))}
</ul>
```

### 4. Create Blog Post Route

**`src/pages/blog/[slug].astro`**
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

<article>
  <h1>{post.data.title}</h1>
  <p>By {author?.data.name}</p>
  <Content />
</article>
```

---

## 9. TypeScript Types

```typescript
import type { CollectionEntry, InferEntryType } from 'astro:content';

// Get type of a collection entry
type BlogPost = CollectionEntry<'blog'>;
// Properties: id, slug, collection, data, body

// Type of just the data
type BlogPostData = InferEntryType<'blog'>;
// Has all your schema properties

// Working with fetched data
async function getBlogData() {
  const posts = await getCollection('blog');
  const post: CollectionEntry<'blog'> = posts[0];

  // Type-safe access
  const title: string = post.data.title;
  const date: Date = post.data.pubDate;
}
```

---

## 10. Troubleshooting

| Problem | Solution |
|---------|----------|
| "Unknown collection" error | Make sure collection name in `getEntry()` matches your config |
| Reference not resolving | Use `getEntry()` or `getEntries()` to resolve references |
| Drafts showing in production | Filter with `({ data }) => !data.draft` |
| Content not rendering | Call `render(entry)` to get `<Content />` component |
| Routes not generating | Verify `getStaticPaths()` returns `{ params, props }` objects |
| Type errors | Import `CollectionEntry` and `InferEntryType` types |
| Slow builds | Filter collections early, avoid unnecessary queries |

---

## 11. Performance Tips

1. **Memoize queries** - Cache collection results in variables
2. **Filter early** - Filter in `getCollection()` callback, not after
3. **Sort once** - Sort before mapping/slicing
4. **Batch references** - Use `Promise.all()` for multiple `getEntry()` calls
5. **Use selective loading** - Only load data you need
6. **Cache in memory** - Store results if querying same collection multiple times

---

## 12. Advanced: Custom Loaders

For remote data (APIs, CMS, databases):

```typescript
const externalBlog = defineCollection({
  loader: async () => {
    const res = await fetch('https://api.example.com/posts');
    const data = await res.json();

    return data.map(post => ({
      id: post.slug,
      data: {
        title: post.title,
        pubDate: new Date(post.date),
      },
    }));
  },
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});
```

---

## Summary: The Flow

```
1. Define Collections (src/content.config.ts)
                ↓
2. Create Content Files (src/content/blog/*.md)
                ↓
3. Query Collections (getCollection, getEntry)
                ↓
4. Render to HTML (render() function)
                ↓
5. Display in Routes (src/pages/[slug].astro)
```

**Key Files to Remember:**
- `src/content.config.ts` - Collection definitions
- `src/content/` - Your content files
- `src/pages/[slug].astro` - Dynamic routes
- Use `getCollection()`, `getEntry()`, `render()` - Main APIs
