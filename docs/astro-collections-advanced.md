# Astro Content Collections - Advanced Patterns

## 1. Complex Reference Relationships

### Pattern: Multi-level References (Author → Posts → Tags)

**Schema:**
```typescript
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const authors = defineCollection({
  loader: file('src/content/authors.json'),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
  }),
});

const tags = defineCollection({
  loader: file('src/content/tags.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    color: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    author: reference('authors'),
    tags: z.array(reference('tags')),
    relatedPosts: z.array(reference('blog')).optional(),
    featuredImage: z.string().optional(),
  }),
});

export const collections = { authors, tags, blog };
```

**Content File:**
```yaml
---
title: "Getting Started with Astro"
author: sarah-chen
tags:
  - astro
  - tutorial
  - javascript
relatedPosts:
  - advanced-astro
  - astro-components
---
```

**Query with Full Resolution:**
```astro
---
import { getCollection, getEntry, getEntries } from 'astro:content';

const post = await getEntry('blog', 'getting-started');

// Resolve author
const author = await getEntry(post.data.author);
// Result: { name: "Sarah Chen", bio: "..." }

// Resolve tags (array of references)
const tags = await getEntries(post.data.tags);
// Result: [
//   { name: "Astro", description: "..." },
//   { name: "Tutorial", description: "..." },
// ]

// Resolve related posts
const related = post.data.relatedPosts
  ? await getEntries(post.data.relatedPosts)
  : [];

// Build complete object with all resolved references
const enrichedPost = {
  ...post,
  author,
  tags,
  relatedPosts: related,
};
---

<article>
  <h1>{enrichedPost.data.title}</h1>
  <p>By {enrichedPost.author.data.name}</p>

  <div class="tags">
    {enrichedPost.tags.map(tag => (
      <a href={`/tags/${tag.id}`} style={{ background: tag.data.color }}>
        {tag.data.name}
      </a>
    ))}
  </div>

  {enrichedPost.relatedPosts.length > 0 && (
    <section class="related">
      <h3>Related Articles</h3>
      <ul>
        {enrichedPost.relatedPosts.map(p => (
          <li><a href={`/blog/${p.id}`}>{p.data.title}</a></li>
        ))}
      </ul>
    </section>
  )}
</article>
```

---

## 2. Computed Fields and Transformations

### Pattern: Calculated Properties

**Configuration with Computed Fields:**
```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    content: z.string(),
    author: reference('authors'),
  }).transform((entry) => {
    // Add computed fields
    return {
      ...entry,
      // These will be available on entry.data
      readingTime: Math.ceil(entry.content.split(/\s+/).length / 200),
      slug: entry.title.toLowerCase().replace(/\s+/g, '-'),
      isFuture: entry.pubDate > new Date(),
    };
  }),
});
```

**Using Computed Fields:**
```astro
---
const post = await getEntry('blog', 'my-post');

console.log(post.data.readingTime); // e.g., 5
console.log(post.data.slug);        // e.g., "my-post-title"
console.log(post.data.isFuture);    // boolean
---

<article>
  <h1>{post.data.title}</h1>
  <meta name="slug" content={post.data.slug} />
  <p>~{post.data.readingTime} min read</p>
</article>
```

---

## 3. Advanced Filtering and Grouping

### Pattern: Complex Query Logic

```astro
---
import { getCollection } from 'astro:content';

// Get all published blog posts
const allPosts = await getCollection('blog', ({ data }) => {
  return !data.draft && data.pubDate <= new Date();
});

// GROUP BY CATEGORY
const postsByCategory = allPosts.reduce((acc, post) => {
  const category = post.data.category || 'Uncategorized';
  if (!acc[category]) acc[category] = [];
  acc[category].push(post);
  return acc;
}, {} as Record<string, typeof allPosts>);

// GROUP AND SORT BY DATE
const postsByMonth = allPosts.reduce((acc, post) => {
  const month = post.data.pubDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  if (!acc[month]) acc[month] = [];
  acc[month].push(post);
  return acc;
}, {} as Record<string, typeof allPosts>);

// FILTER AND PAGINATE
const postsPerPage = 10;
const totalPages = Math.ceil(allPosts.length / postsPerPage);
const currentPage = 1;
const paginatedPosts = allPosts.slice(
  (currentPage - 1) * postsPerPage,
  currentPage * postsPerPage
);

// SEARCH AND FILTER
const searchTerm = 'astro';
const searchResults = allPosts.filter(post => {
  return (
    post.data.title.toLowerCase().includes(searchTerm) ||
    post.data.description.toLowerCase().includes(searchTerm)
  );
});

// FEATURED AND SORTED
const featuredPosts = allPosts
  .filter(p => p.data.featured)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 5);
---

<!-- Render posts grouped by category -->
{Object.entries(postsByCategory).map(([category, posts]) => (
  <section>
    <h2>{category}</h2>
    <ul>
      {posts.map(post => (
        <li><a href={`/blog/${post.id}`}>{post.data.title}</a></li>
      ))}
    </ul>
  </section>
))}
```

---

## 4. Bidirectional Relationships

### Pattern: Reverse References (Find all posts by an author)

**Situation:** You want to display all posts by an author on their author page.

```astro
---
import { getCollection, getEntries } from 'astro:content';

// Get author from URL parameter
const { id } = Astro.params;
const author = await getEntry('authors', id!);

if (!author) {
  return Astro.redirect('/404');
}

// Find all posts that reference this author
const authorPosts = (await getCollection('blog')).filter(post => {
  return post.data.author.id === author.id;
});

// Sort by date
const sorted = authorPosts.sort((a, b) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<article class="author-page">
  <h1>{author.data.name}</h1>
  <p>{author.data.bio}</p>

  <section class="author-posts">
    <h2>Articles by {author.data.name} ({sorted.length})</h2>
    <ul>
      {sorted.map(post => (
        <li>
          <a href={`/blog/${post.id}`}>{post.data.title}</a>
          <time>{post.data.pubDate.toLocaleDateString()}</time>
        </li>
      ))}
    </ul>
  </section>
</article>
```

---

## 5. Cross-Collection Queries

### Pattern: Multiple Content Types on Homepage

```astro
---
import { getCollection, getEntries } from 'astro:content';

// Fetch from 4 different collections in parallel
const [
  recentBlogPosts,
  featuredProjects,
  testimonials,
  upcomingEvents,
] = await Promise.all([
  getCollection('blog', ({ data }) => !data.draft),
  getCollection('projects'),
  getCollection('testimonials'),
  getCollection('events'),
]);

// Sort and filter
const blogs = recentBlogPosts
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);

const projects = featuredProjects
  .filter(p => p.data.featured)
  .slice(0, 3);

const reviews = testimonials
  .filter(t => t.data.featured)
  .slice(0, 3);

const events = upcomingEvents
  .filter(e => e.data.date > new Date())
  .slice(0, 3);

// Resolve author references for blogs
const blogsWithAuthors = await Promise.all(
  blogs.map(async (blog) => {
    const author = await getEntries([blog.data.author]).then(a => a[0]);
    return { ...blog, author };
  })
);
---

<html>
  <head><title>Home</title></head>
  <body>
    <section class="featured-blogs">
      <h2>Latest Articles</h2>
      {blogsWithAuthors.map(blog => (
        <article>
          <h3><a href={`/blog/${blog.id}`}>{blog.data.title}</a></h3>
          <p>By {blog.author.data.name}</p>
        </article>
      ))}
    </section>

    <section class="featured-projects">
      <h2>Featured Work</h2>
      {projects.map(project => (
        <a href={`/projects/${project.id}`}>
          {project.data.title}
        </a>
      ))}
    </section>

    <section class="testimonials">
      <h2>What People Say</h2>
      {reviews.map(review => (
        <blockquote>{review.data.quote}</blockquote>
      ))}
    </section>

    <section class="upcoming">
      <h2>Upcoming Events</h2>
      {events.map(event => (
        <div>
          <h3>{event.data.title}</h3>
          <time>{event.data.date.toLocaleDateString()}</time>
        </div>
      ))}
    </section>
  </body>
</html>
```

---

## 6. Error Handling and Validation

### Pattern: Safe Reference Resolution

```astro
---
import { getCollection, getEntry } from 'astro:content';

const post = await getEntry('blog', 'my-post');

if (!post) {
  return Astro.redirect('/404');
}

// Safely resolve references with fallback
let author = null;
try {
  author = await getEntry(post.data.author);
} catch (e) {
  console.error('Failed to load author:', post.data.author);
  // author remains null, handle in template
}

// Safely resolve array of references
let relatedPosts: typeof post[] = [];
if (post.data.relatedPosts && post.data.relatedPosts.length > 0) {
  try {
    relatedPosts = await getEntries(post.data.relatedPosts);
  } catch (e) {
    console.error('Failed to load related posts:', e);
  }
}
---

<article>
  <h1>{post.data.title}</h1>

  {author ? (
    <p>By {author.data.name}</p>
  ) : (
    <p>Author information unavailable</p>
  )}

  {relatedPosts.length > 0 && (
    <section>
      <h3>Related</h3>
      <ul>
        {relatedPosts.map(p => (
          <li><a href={`/blog/${p.id}`}>{p.data.title}</a></li>
        ))}
      </ul>
    </section>
  )}
</article>
```

---

## 7. Dynamic Navigation and Breadcrumbs

### Pattern: Build Navigation from Collections

```astro
---
import { getCollection } from 'astro:content';

// Build site navigation from docs
const docs = (await getCollection('docs'))
  .sort((a, b) => (a.data.sidebar_order ?? 999) - (b.data.sidebar_order ?? 999));

// Group by category
const docNav = docs.reduce((acc, doc) => {
  const cat = doc.data.category || 'Other';
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(doc);
  return acc;
}, {} as Record<string, typeof docs>);

// For breadcrumbs, get parent category
const getParentCategory = (docId: string) => {
  for (const [cat, items] of Object.entries(docNav)) {
    if (items.some(item => item.id === docId)) {
      return cat;
    }
  }
  return null;
};
---

<!-- Side navigation -->
<nav class="sidebar">
  {Object.entries(docNav).map(([category, items]) => (
    <div class="nav-section">
      <h3>{category}</h3>
      <ul>
        {items.map(doc => (
          <li>
            <a href={`/docs/${doc.id}`}
               class={Astro.url.pathname === `/docs/${doc.id}` ? 'active' : ''}>
              {doc.data.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ))}
</nav>

<!-- Breadcrumbs (on individual doc page) -->
<nav class="breadcrumbs" aria-label="breadcrumb">
  <a href="/">Home</a>
  <a href="/docs">Docs</a>
  {Astro.url.pathname !== '/docs' && (
    <>
      <span>/</span>
      <span>{getParentCategory(Astro.url.pathname.split('/')[2])}</span>
    </>
  )}
</nav>
```

---

## 8. Syncing Related Collections

### Pattern: Keep Referenced Data in Sync

**Problem:** You have projects that reference team members. When you list projects, you need to show team member info.

**Solution:**
```astro
---
import { getCollection, getEntries } from 'astro:content';

// Get projects with full team details
const projects = await getCollection('projects');

// Resolve team members for each project
const projectsWithTeams = await Promise.all(
  projects.map(async (project) => {
    const teamMembers = project.data.teamIds
      ? await getEntries(project.data.teamIds)
      : [];

    return {
      ...project,
      team: teamMembers,
    };
  })
);

// Sort by team size
const byTeamSize = [...projectsWithTeams].sort(
  (a, b) => b.team.length - a.team.length
);
---

<div class="projects">
  {projectsWithTeams.map(project => (
    <article>
      <h2>{project.data.title}</h2>
      <p>Team: {project.team.length} people</p>
      <div class="team-avatars">
        {project.team.map(member => (
          <img src={member.data.avatar} alt={member.data.name} />
        ))}
      </div>
    </article>
  ))}
</div>
```

---

## 9. Caching and Performance Optimization

### Pattern: Memoized Queries

```astro
---
import { getCollection } from 'astro:content';

// If this page queries the same collection multiple times,
// store the result to avoid repeated queries

// AVOID: Querying multiple times
// const posts1 = await getCollection('blog');
// const posts2 = await getCollection('blog'); // Duplicate query!

// CORRECT: Query once, reuse
const allPosts = await getCollection('blog');
const featured = allPosts.filter(p => p.data.featured);
const recent = allPosts.slice(0, 5);
const total = allPosts.length;

// For parallel queries across collections, use Promise.all()
const [blogs, projects, testimonials] = await Promise.all([
  getCollection('blog'),
  getCollection('projects'),
  getCollection('testimonials'),
]);
---
```

---

## 10. Dynamic Metadata and SEO

### Pattern: Generate Open Graph and Meta Tags

```astro
---
import { getCollection, getEntry, render } from 'astro:content';

const post = await getEntry('blog', Astro.params.slug!);
const { Content } = await render(post);

// Generate metadata
const seoMetadata = {
  title: post.data.title,
  description: post.data.description,
  image: post.data.og_image || '/default-og-image.jpg',
  url: `https://example.com/blog/${post.id}`,
  type: 'article',
  publishedAt: post.data.pubDate.toISOString(),
  author: post.data.author,
};

// For Twitter Card
const twitterMetadata = {
  card: 'summary_large_image',
  creator: '@yourhandle',
  ...seoMetadata,
};
---

<head>
  <!-- Standard Meta Tags -->
  <title>{seoMetadata.title}</title>
  <meta name="description" content={seoMetadata.description} />
  <link rel="canonical" href={seoMetadata.url} />

  <!-- Open Graph -->
  <meta property="og:type" content={seoMetadata.type} />
  <meta property="og:title" content={seoMetadata.title} />
  <meta property="og:description" content={seoMetadata.description} />
  <meta property="og:image" content={seoMetadata.image} />
  <meta property="og:url" content={seoMetadata.url} />
  <meta property="article:published_time" content={seoMetadata.publishedAt} />

  <!-- Twitter Card -->
  <meta name="twitter:card" content={twitterMetadata.card} />
  <meta name="twitter:creator" content={twitterMetadata.creator} />
  <meta name="twitter:title" content={seoMetadata.title} />
  <meta name="twitter:description" content={seoMetadata.description} />
  <meta name="twitter:image" content={seoMetadata.image} />

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json" set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seoMetadata.title,
    description: seoMetadata.description,
    image: seoMetadata.image,
    datePublished: seoMetadata.publishedAt,
    author: {
      '@type': 'Person',
      name: post.data.author.data?.name || 'Unknown',
    },
  })} />
</head>
```

---

## 11. Internationalization (i18n)

### Pattern: Multi-language Collections

**Structure:**
```
src/content/
├── blog/
│   ├── en/
│   │   ├── post-1.md
│   │   └── post-2.md
│   └── es/
│       ├── post-1.md
│       └── post-2.md
```

**Query by Language:**
```typescript
const currentLang = Astro.currentLocale || 'en';

const translatedPosts = await getCollection('blog', ({ id }) => {
  return id.startsWith(`${currentLang}/`);
});
```

**Or with metadata:**
```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    language: z.enum(['en', 'es', 'fr']),
    translationOf: z.string().optional(),
  }),
});

// Get all translations of a post
const getTranslations = async (postId: string) => {
  const allPosts = await getCollection('blog');
  return allPosts.filter(post =>
    post.data.translationOf === postId
  );
};
```

---

## Summary of Advanced Patterns

| Pattern | Use Case |
|---------|----------|
| Multi-level References | Complex relationships (author → posts → tags) |
| Computed Fields | Calculate values from content (reading time, slugs) |
| Complex Filtering | Group, sort, paginate, search across collections |
| Bidirectional Relationships | Find all items referencing a parent (author's posts) |
| Cross-Collection Queries | Homepage with multiple content types |
| Error Handling | Safely handle missing references |
| Dynamic Navigation | Build menus from collection data |
| Caching | Memoize queries for performance |
| SEO Metadata | Generate dynamic meta tags per entry |
| i18n | Support multiple languages per collection |
