# Astro Content Collections: Multi-Type Content Research

## 1. Overview: How Content Collections Work

Astro's Content Collections system provides a type-safe way to organize and manage structured data. Key features:

- **Multiple Collections**: Define different content types with unique schemas
- **Type Safety**: Zod-based validation with TypeScript autocompletion
- **Flexible Loaders**: Support for Markdown, MDX, JSON, YAML, TOML, and custom sources
- **References**: Link entries across collections (blog post → author)
- **Dynamic Routing**: Auto-generate pages per collection type

---

## 2. Architecture: How Multiple Content Types Are Organized

### Collection Definition Pattern

Each collection consists of:

1. **Loader**: How content is fetched (glob pattern, file path, or custom function)
2. **Schema**: Validation and TypeScript types (using Zod)
3. **Route Pattern**: How the collection maps to URL structure

### File Organization

```
src/
├── content/
│   ├── blog/              # Collection: blog posts
│   │   ├── post-1.md
│   │   ├── post-2.md
│   │   └── drafts/
│   │       └── post-3.md
│   │
│   ├── projects/          # Collection: project portfolio items
│   │   ├── project-a.md
│   │   ├── project-b.md
│   │   └── project-c.md
│   │
│   ├── testimonials/      # Collection: single-file JSON entries
│   │   └── testimonials.json
│   │
│   └── authors.json       # Collection: author profiles (single file)
│
├── content.config.ts      # Collection configuration
│
├── pages/
│   ├── blog/
│   │   └── [slug].astro   # Dynamic route for blog posts
│   ├── projects/
│   │   └── [slug].astro   # Dynamic route for projects
│   └── testimonials/
│       └── [...slug].astro # Rest parameter route
│
└── layouts/
    ├── BlogLayout.astro      # Blog-specific layout
    ├── ProjectLayout.astro   # Project-specific layout
    └── TestimonialLayout.astro # Testimonial layout
```

---

## 3. Complete Content Configuration Example

### File: `src/content.config.ts`

```typescript
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ============================================
// COLLECTION 1: Blog Posts (Directory of Markdown files)
// ============================================
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: reference('authors'),           // Reference to authors collection
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    category: z.enum(['tutorial', 'guide', 'news', 'opinion']),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),     // Calculated by remark plugin
    relatedPosts: z.array(reference('blog')).optional(), // Self-references
  }),
});

// ============================================
// COLLECTION 2: Projects (Directory of Markdown files)
// ============================================
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    image: z.string(),
    image_alt: z.string(),
    technologies: z.array(z.string()),      // Tech stack tags
    liveUrl: z.string().url(),
    githubUrl: z.string().url(),
    status: z.enum(['completed', 'in-progress', 'archived']),
    featured: z.boolean().default(false),
    order: z.number().default(999),         // For manual sorting
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
  }),
});

// ============================================
// COLLECTION 3: Authors (Single JSON file with multiple entries)
// ============================================
const authors = defineCollection({
  loader: file('src/content/authors.json'),
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    portfolio: z.string().url(),
    bio: z.string(),
    avatar: z.string(),
    socialLinks: z.object({
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    }).optional(),
  }),
});

// ============================================
// COLLECTION 4: Testimonials (Single JSON file)
// ============================================
const testimonials = defineCollection({
  loader: file('src/content/testimonials.json'),
  schema: z.object({
    author: z.string(),
    role: z.string(),
    company: z.string(),
    quote: z.string(),
    image: z.string(),
  }),
});

// ============================================
// COLLECTION 5: Docs/Pages (Nested markdown structure)
// ============================================
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar_order: z.number().optional(),
    toc: z.boolean().default(true),
    search: z.boolean().default(true),
  }),
});

// Export all collections
export const collections = {
  blog,
  projects,
  authors,
  testimonials,
  docs,
};
```

### Key Patterns Demonstrated

| Feature | Example |
|---------|---------|
| **Multiple Loaders** | `glob()` for blog/projects, `file()` for authors/testimonials |
| **Different Schemas** | Blog has tags/category, Projects have techs/urls, Authors have bio/social |
| **References** | Blog references authors; Blog can reference other blog posts |
| **Optional Fields** | `optional()` for optional metadata like `updatedDate`, `readingTime` |
| **Enums** | Blog category, Project status limited to specific values |
| **Nested Objects** | Author's `socialLinks` is an object with optional nested fields |
| **Arrays** | Blog tags, Project technologies, related blog posts |

---

## 4. Content Files Examples

### Blog Post: `src/content/blog/getting-started.md`

```markdown
---
title: "Getting Started with Astro Content Collections"
description: "A comprehensive guide to organizing multi-type content"
pubDate: 2024-01-15
author: sarah-chen
tags: ["astro", "content-collections", "tutorial"]
category: "tutorial"
featured: true
relatedPosts:
  - advanced-collections
  - content-modeling
---

# Getting Started...

Content goes here in Markdown format.
```

### Project: `src/content/projects/portfolio-site.md`

```markdown
---
title: "Personal Portfolio Site"
description: "A modern portfolio showcasing my work and skills"
shortDescription: "Modern portfolio with Astro & TailwindCSS"
image: "/images/portfolio-hero.jpg"
image_alt: "Portfolio website hero section"
technologies: ["Astro", "React", "TailwindCSS", "TypeScript"]
liveUrl: "https://example.com"
githubUrl: "https://github.com/user/portfolio"
status: "completed"
featured: true
order: 1
startDate: 2024-01-01
endDate: 2024-03-15
---

## Overview

Full project description...
```

### Authors: `src/content/authors.json`

```json
{
  "sarah-chen": {
    "name": "Sarah Chen",
    "email": "sarah@example.com",
    "portfolio": "https://sarahchen.dev",
    "bio": "Full-stack developer passionate about web performance",
    "avatar": "/avatars/sarah.jpg",
    "socialLinks": {
      "twitter": "https://twitter.com/sarahchen",
      "github": "https://github.com/sarahchen",
      "linkedin": "https://linkedin.com/in/sarahchen"
    }
  },
  "alex-johnson": {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "portfolio": "https://alexjohnson.dev",
    "bio": "Designer and developer focused on accessibility",
    "avatar": "/avatars/alex.jpg",
    "socialLinks": {
      "twitter": "https://twitter.com/alexjohnson"
    }
  }
}
```

### Testimonials: `src/content/testimonials.json`

```json
{
  "client-1": {
    "author": "Jane Smith",
    "role": "CEO",
    "company": "Tech Startup Inc",
    "quote": "Amazing work and incredible attention to detail!",
    "image": "/testimonials/jane.jpg"
  },
  "client-2": {
    "author": "John Doe",
    "role": "Product Manager",
    "company": "Design Agency Co",
    "quote": "Best developer we've worked with",
    "image": "/testimonials/john.jpg"
  }
}
```

---

## 5. Dynamic Route Patterns

### Pattern 1: Single Parameter - Blog Posts

**File:** `src/pages/blog/[slug].astro`

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import BlogLayout from '@/layouts/BlogLayout.astro';

// Generate static paths for all blog posts
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => {
    return !data.draft; // Exclude drafts from build
  });

  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

interface Props {
  post: Awaited<ReturnType<typeof getCollection<'blog'>>>[number];
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
const author = await getEntry(post.data.author);
const relatedPosts = post.data.relatedPosts
  ? await getEntries(post.data.relatedPosts)
  : [];
---

<BlogLayout post={post} author={author} headings={headings}>
  <Content />
  {relatedPosts.length > 0 && (
    <aside class="related-posts">
      <h3>Related Posts</h3>
      <ul>
        {relatedPosts.map(related => (
          <li>
            <a href={`/blog/${related.id}`}>{related.data.title}</a>
          </li>
        ))}
      </ul>
    </aside>
  )}
</BlogLayout>
```

### Pattern 2: Single Parameter - Projects

**File:** `src/pages/projects/[slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import ProjectLayout from '@/layouts/ProjectLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) => {
    return data.status !== 'archived';
  });

  return projects.map(project => ({
    params: { slug: project.id },
    props: { project },
  }));
}

interface Props {
  project: Awaited<ReturnType<typeof getCollection<'projects'>>>[number];
}

const { project } = Astro.props;
const { Content } = await render(project);
---

<ProjectLayout project={project}>
  <Content />
</ProjectLayout>
```

### Pattern 3: Nested Routes with Rest Parameters - Documentation

**File:** `src/pages/docs/[...slug].astro`

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import DocsLayout from '@/layouts/DocsLayout.astro';

export async function getStaticPaths() {
  const docs = await getCollection('docs');

  return docs.map(doc => ({
    params: { slug: doc.id },
    props: { doc },
  }));
}

interface Props {
  doc: Awaited<ReturnType<typeof getCollection<'docs'>>>[number];
}

const { slug } = Astro.params;
const doc = await getEntry('docs', slug);

if (!doc) {
  return Astro.redirect('/404');
}

const { Content, headings } = await render(doc);
---

<DocsLayout doc={doc} headings={headings}>
  <Content />
</DocsLayout>
```

### Key Pattern Differences

| Pattern | Use Case | Route Example | File Pattern |
|---------|----------|---------------|--------------|
| `[slug].astro` | Single-level routes | `/blog/post-1` | One parameter |
| `[...slug].astro` | Nested routes | `/docs/guides/getting-started` | Multiple levels |
| Multiple `[id].astro` | Different collections | `/blog/[slug]`, `/projects/[slug]` | Collection per folder |

---

## 6. Collection-Specific Layouts

### Pattern: Dynamic Layout Selection

**File:** `src/layouts/BaseLayout.astro`

```astro
---
import type { CollectionEntry } from 'astro:content';
import BlogLayout from './BlogLayout.astro';
import ProjectLayout from './ProjectLayout.astro';
import DocsLayout from './DocsLayout.astro';

type AnyCollection =
  | CollectionEntry<'blog'>
  | CollectionEntry<'projects'>
  | CollectionEntry<'docs'>;

interface Props {
  entry: AnyCollection;
  children?: any;
}

const { entry, children } = Astro.props;

// Map collection names to layouts
const layouts: Record<string, any> = {
  blog: BlogLayout,
  projects: ProjectLayout,
  docs: DocsLayout,
};

const SelectedLayout = layouts[entry.collection] || BlogLayout;
---

<SelectedLayout entry={entry}>
  <slot />
</SelectedLayout>
```

### Blog Layout: `src/layouts/BlogLayout.astro`

```astro
---
import type { CollectionEntry, InferEntryType } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import Container from '@/components/Container.astro';

interface Props {
  post: CollectionEntry<'blog'>;
  author: CollectionEntry<'authors'>;
  headings: MarkdownHeading[];
  children: any;
}

const { post, author, headings, children } = Astro.props;
const { data } = post;
---

<article class="blog-post">
  <Container>
    <header class="post-header">
      <h1>{data.title}</h1>
      <p class="description">{data.description}</p>

      <div class="metadata">
        <div class="author-info">
          <img src={author.data.avatar} alt={author.data.name} />
          <div>
            <p class="author-name">{author.data.name}</p>
            <a href={author.data.portfolio} class="author-link">
              Visit Portfolio
            </a>
          </div>
        </div>

        <time datetime={data.pubDate.toISOString()}>
          {data.pubDate.toLocaleDateString()}
        </time>

        {data.readingTime && (
          <span class="reading-time">
            {Math.ceil(data.readingTime)} min read
          </span>
        )}
      </div>

      {data.tags && (
        <div class="tags">
          {data.tags.map(tag => (
            <a href={`/blog/tag/${tag}`} class="tag">
              #{tag}
            </a>
          ))}
        </div>
      )}
    </header>

    <aside class="table-of-contents">
      <nav>
        <h3>Contents</h3>
        <ul>
          {headings.map(heading => (
            <li style={{ marginLeft: `${(heading.depth - 2) * 1.5}rem` }}>
              <a href={`#${heading.slug}`}>
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>

    <div class="content">
      {children}
    </div>
  </Container>
</article>
```

### Project Layout: `src/layouts/ProjectLayout.astro`

```astro
---
import type { CollectionEntry } from 'astro:content';
import Container from '@/components/Container.astro';

interface Props {
  project: CollectionEntry<'projects'>;
  children: any;
}

const { project, children } = Astro.props;
const { data } = project;
---

<article class="project-showcase">
  <Container>
    <header class="project-header">
      <div class="hero-image">
        <img src={data.image} alt={data.image_alt} />
      </div>

      <div class="project-info">
        <h1>{data.title}</h1>
        <p class="description">{data.description}</p>

        <div class="tech-stack">
          <h3>Technologies Used</h3>
          <ul class="tech-list">
            {data.technologies.map(tech => (
              <li class="tech-badge">{tech}</li>
            ))}
          </ul>
        </div>

        <div class="project-links">
          <a href={data.liveUrl} class="btn btn-primary" target="_blank">
            View Live Project
          </a>
          <a href={data.githubUrl} class="btn btn-secondary" target="_blank">
            View on GitHub
          </a>
        </div>

        <div class="timeline">
          <p>
            <strong>Timeline:</strong>
            {data.startDate.toLocaleDateString()}
            {data.endDate && `- ${data.endDate.toLocaleDateString()}`}
          </p>
          <p>
            <strong>Status:</strong>
            <span class={`status status-${data.status}`}>
              {data.status}
            </span>
          </p>
        </div>
      </div>
    </header>

    <section class="project-details">
      {children}
    </section>
  </Container>
</article>
```

---

## 7. Querying Collections

### Pattern 1: Query Single Collection with Filtering

```astro
---
import { getCollection } from 'astro:content';

// Get all published blog posts, sorted by date
const blogPosts = (await getCollection('blog', ({ data }) => {
  return data.draft !== true; // Filter out drafts
})).sort((a, b) => {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
});

// Get featured blog posts only
const featuredPosts = await getCollection('blog', ({ data }) => {
  return data.featured === true && data.draft !== true;
});

// Get posts by category
const tutorials = await getCollection('blog', ({ data }) => {
  return data.category === 'tutorial' && data.draft !== true;
});

// Get posts by specific author
const sarahPosts = await getCollection('blog', ({ data }) => {
  return data.author.id === 'sarah-chen' && data.draft !== true;
});

// Get posts with specific tag
const astroTaggedPosts = await getCollection('blog', ({ data }) => {
  return data.tags.includes('astro') && data.draft !== true;
});
---

<h2>All Posts ({blogPosts.length})</h2>
<ul>
  {blogPosts.map(post => (
    <li>
      <a href={`/blog/${post.id}`}>{post.data.title}</a>
    </li>
  ))}
</ul>
```

### Pattern 2: Query Multiple Collections

```astro
---
import { getCollection, getEntries } from 'astro:content';

// Get featured content from multiple collections
const featuredBlogs = await getCollection('blog', ({ data }) => {
  return data.featured === true && data.draft !== true;
});

const featuredProjects = await getCollection('projects', ({ data }) => {
  return data.featured === true;
});

const testimonials = await getCollection('testimonials');

// Create combined featured content array
interface FeaturedContent {
  type: 'blog' | 'project';
  id: string;
  title: string;
  description: string;
}

const featuredContent: FeaturedContent[] = [
  ...featuredBlogs.map(blog => ({
    type: 'blog' as const,
    id: blog.id,
    title: blog.data.title,
    description: blog.data.description,
  })),
  ...featuredProjects.map(project => ({
    type: 'project' as const,
    id: project.id,
    title: project.data.title,
    description: project.data.description,
  })),
];
---

<section class="featured">
  <h2>Featured Work</h2>
  {featuredContent.map(content => (
    <article>
      <h3>{content.title}</h3>
      <p>{content.description}</p>
      <a href={content.type === 'blog' ? `/blog/${content.id}` : `/projects/${content.id}`}>
        Read More →
      </a>
    </article>
  ))}
</section>
```

### Pattern 3: Resolve References

```astro
---
import { getCollection, getEntry, getEntries } from 'astro:content';

// Get a specific blog post
const blogPost = await getEntry('blog', 'getting-started');

// Resolve the author reference
const author = await getEntry(blogPost.data.author);

// Resolve array of related posts
const relatedPosts = blogPost.data.relatedPosts
  ? await getEntries(blogPost.data.relatedPosts)
  : [];

// Get all blog posts by a specific author
const allPostsByAuthor = (await getCollection('blog')).filter(post => {
  return post.data.author.id === author.id;
});
---

<article>
  <h1>{blogPost.data.title}</h1>

  <div class="author">
    <img src={author.data.avatar} alt={author.data.name} />
    <div>
      <p>{author.data.name}</p>
      <p>{author.data.bio}</p>
    </div>
  </div>

  {relatedPosts.length > 0 && (
    <section class="related">
      <h3>Related Articles</h3>
      <ul>
        {relatedPosts.map(post => (
          <li>
            <a href={`/blog/${post.id}`}>{post.data.title}</a>
          </li>
        ))}
      </ul>
    </section>
  )}

  <section class="more-by-author">
    <h3>More by {author.data.name}</h3>
    <ul>
      {allPostsByAuthor.map(post => (
        <li>
          <a href={`/blog/${post.id}`}>{post.data.title}</a>
        </li>
      ))}
    </ul>
  </section>
</article>
```

---

## 8. Real-World Example: Homepage with Multiple Collections

**File:** `src/pages/index.astro`

```astro
---
import { getCollection, getEntries } from 'astro:content';
import Container from '@/components/Container.astro';
import BlogCard from '@/components/BlogCard.astro';
import ProjectCard from '@/components/ProjectCard.astro';
import TestimonialCard from '@/components/TestimonialCard.astro';

// Fetch data from multiple collections
const [
  allBlogPosts,
  allProjects,
  testimonials,
] = await Promise.all([
  getCollection('blog', ({ data }) => !data.draft),
  getCollection('projects', ({ data }) => data.status !== 'archived'),
  getCollection('testimonials'),
]);

// Get featured/sorted data
const featuredBlogs = allBlogPosts
  .filter(post => post.data.featured)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);

const featuredProjects = allProjects
  .filter(project => project.data.featured)
  .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  .slice(0, 3);

const recentBlogs = allBlogPosts
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 5);

// Resolve author references for featured blog posts
const featuredBlogsWithAuthors = await Promise.all(
  featuredBlogs.map(async (blog) => ({
    ...blog,
    author: await getEntries([blog.data.author]).then(a => a[0]),
  }))
);
---

<html lang="en">
  <head>
    <title>My Portfolio - Web Developer & Designer</title>
  </head>
  <body>
    <Container>
      <!-- Hero Section -->
      <section class="hero">
        <h1>Welcome to My Portfolio</h1>
        <p>Web Developer | Content Creator | Open Source Enthusiast</p>
      </section>

      <!-- Featured Blog Posts -->
      <section class="featured-blogs">
        <h2>Featured Articles</h2>
        <div class="blog-grid">
          {featuredBlogsWithAuthors.map(blog => (
            <BlogCard blog={blog} author={blog.author} />
          ))}
        </div>
        <a href="/blog" class="view-all">View All Articles →</a>
      </section>

      <!-- Featured Projects -->
      <section class="featured-projects">
        <h2>Featured Projects</h2>
        <div class="project-grid">
          {featuredProjects.map(project => (
            <ProjectCard project={project} />
          ))}
        </div>
        <a href="/projects" class="view-all">View All Projects →</a>
      </section>

      <!-- Recent Blog Posts -->
      <section class="recent-blogs">
        <h2>Latest Articles</h2>
        <ul>
          {recentBlogs.slice(0, 5).map(blog => (
            <li>
              <a href={`/blog/${blog.id}`}>{blog.data.title}</a>
              <time>{blog.data.pubDate.toLocaleDateString()}</time>
            </li>
          ))}
        </ul>
      </section>

      <!-- Testimonials -->
      <section class="testimonials">
        <h2>What People Say</h2>
        <div class="testimonial-carousel">
          {testimonials.slice(0, 4).map(testimonial => (
            <TestimonialCard testimonial={testimonial} />
          ))}
        </div>
      </section>
    </Container>
  </body>
</html>
```

---

## 9. Reference Fields: Deep Dive

### How References Work

**Schema Definition:**
```typescript
const blog = defineCollection({
  schema: z.object({
    author: reference('authors'),           // Single reference
    relatedPosts: z.array(reference('blog')), // Array of references
  })
});
```

**Content File (YAML):**
```yaml
---
title: "My Post"
author: sarah-chen           # References ID from authors.json
relatedPosts:
  - post-1
  - post-2
  - post-3
---
```

**Querying:**
```astro
---
const post = await getEntry('blog', 'my-post');

// Author is a reference object
console.log(post.data.author);
// Output: { collection: 'authors', id: 'sarah-chen' }

// Resolve it to get actual author data
const author = await getEntry(post.data.author);
console.log(author.data.name); // "Sarah Chen"

// Resolve array of references
const related = await getEntries(post.data.relatedPosts);
related.forEach(post => console.log(post.data.title));
---
```

### Type Safety with References

```typescript
import type { CollectionEntry, InferEntryType } from 'astro:content';

// Fully typed blog entry with resolved references
async function getBlogWithAuthor(id: string) {
  const post = await getEntry('blog', id);
  const author = await getEntry(post.data.author);
  const related = await getEntries(post.data.relatedPosts ?? []);

  return {
    post,
    author,
    related,
  };
}

// Type inference works automatically
type BlogPost = InferEntryType<'blog'>;
// BlogPost.author is { collection: 'authors'; id: string }
```

---

## 10. Environment-Specific Filtering

### Pattern: Hide Drafts in Production

```typescript
// In getStaticPaths() or getCollection()
export async function getStaticPaths() {
  const isDraft = (post) => post.data.draft === true;

  const posts = import.meta.env.PROD
    ? await getCollection('blog', ({ data }) => !isDraft(data))
    : await getCollection('blog');

  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}
```

### Pattern: Filter by Directory

```typescript
const englishDocs = await getCollection('docs', ({ id }) => {
  return id.startsWith('en/');
});

const spanishDocs = await getCollection('docs', ({ id }) => {
  return id.startsWith('es/');
});
```

---

## 11. Key Takeaways & Best Practices

### Design Patterns

1. **One Collection per Content Type**: Blog posts, projects, testimonials are separate collections
2. **Shared References**: Blog → Authors, Projects → Technologies, etc.
3. **Flexible Loaders**: Use `glob()` for file-based content, `file()` for single data sources
4. **Per-Collection Routes**: Each collection gets dedicated page templates
5. **Type Safety**: Zod schemas provide TypeScript autocompletion

### Route Patterns

| Scenario | Pattern | File |
|----------|---------|------|
| Simple blog | `/blog/:slug` | `src/pages/blog/[slug].astro` |
| Nested docs | `/docs/guide/intro` | `src/pages/docs/[...slug].astro` |
| Multiple types | `/blog/:slug`, `/projects/:slug` | Separate `[slug].astro` per type |

### Collection Queries

| Task | Function |
|------|----------|
| Get all entries | `getCollection('blog')` |
| Single entry | `getEntry('blog', 'id')` |
| Filter results | `getCollection('blog', ({ data }) => data.draft !== true)` |
| Resolve references | `getEntry(post.data.author)` or `getEntries(post.data.related)` |

### Performance Tips

1. **Cache queries**: Store collection results in variables to avoid repeated queries
2. **Filter early**: Filter in `getCollection()` callback, not after
3. **Sort once**: Sort collection results before mapping
4. **Batch resolve references**: Use `Promise.all()` for multiple `getEntry()` calls
5. **Exclude drafts**: Filter by `!data.draft` in production

---

## 12. Advanced: Custom Loaders (Optional)

For remote data (CMS, API, Database):

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: async () => {
    // Fetch from external API
    const response = await fetch('https://api.example.com/posts');
    const data = await response.json();

    return data.map(post => ({
      id: post.slug,
      data: {
        title: post.title,
        pubDate: new Date(post.publishedAt),
        // ... more fields
      },
    }));
  },
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    // ...
  }),
});

export const collections = { blog };
```

---

## Summary

Astro Content Collections enable:

✅ **Multiple content types** with distinct schemas
✅ **Type-safe references** between collections
✅ **Dynamic routing** per collection type
✅ **Flexible data sources** (files, APIs, CMSs)
✅ **Powerful querying** with filtering and sorting
✅ **Different layouts** for each content type
✅ **Production-ready** with draft filtering
