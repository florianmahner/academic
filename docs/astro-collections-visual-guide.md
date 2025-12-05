# Astro Content Collections - Visual Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ASTRO CONTENT COLLECTIONS                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  src/content.config.ts  (Define Collections)                 │   │
│  │  ├─ blog: glob() loader + Zod schema                         │   │
│  │  ├─ projects: glob() loader + Zod schema                     │   │
│  │  ├─ authors: file() loader + Zod schema                      │   │
│  │  └─ testimonials: file() loader + Zod schema                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  src/content/  (Store Content Files)                          │   │
│  │  ├─ blog/           (Markdown files)                          │   │
│  │  ├─ projects/       (Markdown files)                          │   │
│  │  ├─ authors.json    (JSON array/objects)                      │   │
│  │  └─ testimonials.json (JSON array/objects)                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Query Functions (In .astro files)                            │   │
│  │  ├─ getCollection('blog')           → all entries             │   │
│  │  ├─ getEntry('blog', 'post-1')      → single entry            │   │
│  │  ├─ getEntries(references)          → resolve references      │   │
│  │  └─ render(entry)                   → HTML content            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  src/pages/  (Dynamic Routes)                                 │   │
│  │  ├─ blog/[slug].astro    → /blog/post-1                       │   │
│  │  ├─ blog/index.astro     → /blog                              │   │
│  │  ├─ projects/[slug].astro → /projects/project-a               │   │
│  │  └─ docs/[...slug].astro  → /docs/guides/intro                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  HTML Output (Static or SSR)                                  │   │
│  │  ├─ /blog/ (listing)                                          │   │
│  │  ├─ /blog/post-1 (individual)                                 │   │
│  │  ├─ /projects/ (listing)                                      │   │
│  │  └─ /docs/guides/intro (nested)                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Configuration Flow

```
STEP 1: Define Schema
┌─────────────────────────────────────────┐
│ defineCollection({                       │
│   loader: glob/file/custom              │
│   schema: z.object({                    │
│     title: z.string()                   │
│     pubDate: z.coerce.date()            │
│     author: reference('authors')        │
│     tags: z.array(z.string())           │
│   })                                    │
│ })                                      │
└─────────────────────────────────────────┘
                ↓
STEP 2: Export Collections
┌─────────────────────────────────────────┐
│ export const collections = {             │
│   blog: blogCollection,                 │
│   projects: projectsCollection,         │
│   authors: authorsCollection            │
│ }                                       │
└─────────────────────────────────────────┘
                ↓
STEP 3: Astro Validates at Build Time
┌─────────────────────────────────────────┐
│ Reads all content files                 │
│ Validates against schemas               │
│ Generates TypeScript types              │
│ Caches for fast queries                 │
└─────────────────────────────────────────┘
                ↓
STEP 4: Query in Pages and Routes
┌─────────────────────────────────────────┐
│ const posts = getCollection('blog')     │
│ const post = getEntry('blog', 'id')     │
│ const author = getEntry(post.author)    │
└─────────────────────────────────────────┘
                ↓
STEP 5: Render HTML
┌─────────────────────────────────────────┐
│ const { Content } = render(entry)       │
│ <Content /> component in Astro files    │
└─────────────────────────────────────────┘
```

---

## Data Flow: Blog Post Example

```
Content File                    Schema Definition          Query Function
┌──────────────┐               ┌──────────────┐          ┌──────────────┐
│ post.md      │               │ z.object({   │          │ getCollection│
│              │               │   title: ... │          │   ('blog')   │
│ ---          │   Validate    │   author:    │  Query   │              │
│ title: "..." ├──────────────→│     ref()    ├─────────→│ Returns:     │
│ pubDate: ... │    Against    │   draft: ... │          │ [            │
│ author: ...  │    Schema     │ })           │          │   {          │
│ ---          │               │              │          │     id: ..., │
│              │               │              │          │     data: {} │
│ # Content    │               │              │          │   }, ...     │
│              │               │              │          │ ]            │
└──────────────┘               └──────────────┘          └──────────────┘
```

---

## Reference Resolution Pattern

```
Blog Post Entry
├─ id: "post-1"
├─ data:
│  ├─ title: "My Post"
│  ├─ author: ───────┐
│  │                  │  Reference Object
│  │                  ├─ collection: "authors"
│  │                  └─ id: "sarah"
│  │                      │
│  └─ relatedPosts:      │
│     ├─ id: "post-2"    │  Array of References
│     └─ id: "post-3"    │
│
  Query Functions
  │
  ├─ getEntry(post.author)  ──→ Author Object
  │  ├─ name: "Sarah"
  │  ├─ email: "sarah@..."
  │  └─ bio: "..."
  │
  └─ getEntries(post.relatedPosts) ──→ Array of Post Objects
     ├─ [0] Post {title: "..."}
     └─ [1] Post {title: "..."}
```

---

## Route Generation Patterns

### Pattern 1: Single Parameter `[slug].astro`

```
File Structure              URL Pattern         Generated Routes
┌─────────────────┐
│ pages/blog/     │         /blog/:slug        /blog/post-1
├─ index.astro   ├────────────────────────→   /blog/post-2
├─ [slug].astro  │                            /blog/post-3
└─────────────────┘         Special Cases:
                            index.astro → /blog
                            [slug].astro → /blog/ID
```

### Pattern 2: Rest Parameters `[...slug].astro`

```
File Structure              URL Pattern         Generated Routes
┌─────────────────┐
│ pages/docs/     │         /docs/...path      /docs/intro
├─ index.astro   ├────────────────────────→   /docs/guides/start
└─ [...slug].astro│                           /docs/api/reference
└─────────────────┘         Works with:
                            - Nested directories
                            - Any depth
                            - Slash in slug
```

### Pattern 3: Multiple Collections

```
File Structure              URL Pattern         Generated Routes
┌─────────────────┐
│ pages/          │         /blog/:slug        /blog/post-1
├─ blog/         │                            /blog/post-2
│  └─ [slug].astro├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─→
├─ projects/     │                           /projects/proj-1
│  └─ [slug].astro├─ /projects/:slug─ ─ ─ →   /projects/proj-2
└─────────────────┘
```

---

## Query and Filter Patterns

```
PATTERN 1: Get All Entries
┌──────────────────────────────┐
│ const posts = await          │
│   getCollection('blog')      │
└──────────────────────────────┘
         Returns all entries


PATTERN 2: Filter Entries
┌──────────────────────────────┐
│ const published = await      │
│   getCollection('blog',      │
│     ({ data }) =>            │
│       !data.draft            │
│   )                          │
└──────────────────────────────┘
    Returns entries matching condition


PATTERN 3: Resolve References
┌──────────────────────────────┐
│ const author =               │
│   getEntry(post.author)      │
│                              │
│ const relatedPosts =         │
│   getEntries(post.related)   │
└──────────────────────────────┘
    Returns referenced entries


PATTERN 4: Sort and Slice
┌──────────────────────────────┐
│ const recent = posts         │
│   .sort((a, b) =>            │
│     b.data.date - a.date)    │
│   .slice(0, 5)               │
└──────────────────────────────┘
    Returns 5 most recent
```

---

## Type Safety

```
DECLARATION PHASE
┌─────────────────────────────────────┐
│ defineCollection({                   │
│   schema: z.object({                │
│     title: z.string(),              │
│     pubDate: z.coerce.date(),       │
│     author: reference('authors')    │
│   })                                │
│ })                                  │
└─────────────────────────────────────┘
              ↓ Generates TypeScript Types ↓
USAGE PHASE
┌─────────────────────────────────────┐
│ const post: CollectionEntry<'blog'> │
│                                     │
│ post.data.title     // ✓ string     │
│ post.data.pubDate   // ✓ Date       │
│ post.data.unknown   // ✗ Type Error │
│ post.data.title()   // ✗ Type Error │
└─────────────────────────────────────┘
```

---

## Content Organization

```
SINGLE FILE COLLECTIONS              DIRECTORY COLLECTIONS
(authors.json)                       (blog/)

authors.json                         blog/
├─ sarah-chen                        ├─ post-1.md
│  ├─ name: "Sarah Chen"             ├─ post-2.md
│  ├─ bio: "Developer"               ├─ post-3.md
│  └─ avatar: "/..."                 ├─ drafts/
├─ john-doe                          │  └─ future-post.md
│  ├─ name: "John Doe"               └─ featured/
│  └─ ...                               └─ showcase.md

loaded as:                          loaded as:
- ID = "sarah-chen"                - ID = "post-1"
- ID = "john-doe"                  - ID = "drafts/future-post"
                                    - ID = "featured/showcase"
```

---

## Rendering Flow

```
INPUT                           PROCESSING               OUTPUT
┌──────────────┐               ┌──────────────┐        ┌──────────┐
│ Markdown     │               │ Parse YAML   │        │ HTML     │
│ or JSON      ├──────────────→├ Validate     ├───────→├ Content  │
│ File         │               │ Transform    │        │ Component│
└──────────────┘               └──────────────┘        └──────────┘
                                      ↓
                               Metadata + Content

                               Then in Template:
                               const { Content } =
                                 render(entry)

                               <Content /> renders HTML
```

---

## Complete Request-to-Response Flow

```
User Request
     │
     ↓
GET /blog/my-post
     │
     ↓
Astro Routes to: pages/blog/[slug].astro
     │
     ↓
getStaticPaths() or getEntry() with slug="my-post"
     │
     ├─ Load: src/content/blog/my-post.md
     │
     ├─ Validate: Against blog collection schema
     │
     ├─ Return: CollectionEntry { id, data, body }
     │
     ↓
Resolve References:
     │
     ├─ getEntry('authors', post.data.author.id)
     │
     ├─ getEntries(post.data.relatedPosts)
     │
     ↓
Render Content:
     │
     ├─ render(post) → { Content, headings }
     │
     ↓
Template Interpolation:
     │
     ├─ <h1>{post.data.title}</h1>
     │
     ├─ <p>By {author.data.name}</p>
     │
     ├─ <Content />
     │
     ↓
HTML Response:
     │
     ├─ <!DOCTYPE html>
     │  <html>
     │   <body>
     │    <h1>My Post Title</h1>
     │    <p>By Sarah Chen</p>
     │    <article>... rendered markdown ...</article>
     │   </body>
     │  </html>
     │
     ↓
Browser Displays
```

---

## Comparison: Different Loaders

```
GLOB LOADER (Directory of Files)
┌─────────────────────────────┐
│ loader: glob({              │
│   pattern: '**/*.md',       │
│   base: './src/content/...' │
│ })                          │
│                             │
│ Loads: Multiple files       │
│ One ID per file             │
│ Used for: Blog, Projects    │
└─────────────────────────────┘


FILE LOADER (Single File)
┌─────────────────────────────┐
│ loader: file(               │
│   'src/content/authors.json'│
│ )                           │
│                             │
│ Loads: One file             │
│ Multiple entries per file   │
│ Used for: Authors, Teams    │
└─────────────────────────────┘


CUSTOM LOADER (Remote Data)
┌─────────────────────────────┐
│ loader: async () => {       │
│   const res =               │
│     fetch('https://api...')│
│   return data.map(...)      │
│ }                           │
│                             │
│ Loads: External sources     │
│ Used for: CMS, APIs         │
└─────────────────────────────┘
```

---

## Schema Type Hierarchy

```
z.object() - Root container
├─ z.string() - Text
├─ z.number() - Integer/Float
├─ z.boolean() - True/False
├─ z.date() / z.coerce.date() - Dates
├─ z.enum(['a', 'b']) - Limited choices
├─ z.array() - Lists
│  └─ z.array(z.string()) - List of strings
├─ z.record() - Key-value pairs
├─ reference('collection') - Link to other collection
├─ z.string().url() - Validated URL
├─ z.string().email() - Validated email
└─ Modifiers:
   ├─ .optional() - Can be missing
   ├─ .default() - Default value
   └─ .transform() - Compute value
```

---

## File Creation Decision Tree

```
                    Need a page?
                          │
                    ┌─────┴─────┐
                    │           │
                 Single       Multiple
                  Page        Related Items
                    │           │
                    ↓           ↓
              Use .astro    Need shared
              file in       structure?
              pages/             │
                                 │
                            ┌────┴─────┐
                            │          │
                          Yes          No
                            │          │
                            ↓          ↓
                        Use Content   Hardcode
                        Collections  in .astro
                            │
                    ┌───────┴───────┐
                    │               │
                Related Items    Shared
                (Many files)    Schema?
                    │               │
                    │               │
                ┌───┴─────┐    ┌────┴─────┐
                │         │    │          │
             Markdown   JSON  Yes          No
             files      file   │           │
                │         │    ↓           ↓
                ├────→   Use  Use JSON
             glob()   reference( in .astro
             loader   'auth')   file()
                           │    loader
                           ↓
                        Route via
                     [slug].astro
```

---

## Common Workflow

```
DEVELOPMENT WORKFLOW
│
├─ 1. Create content/config.ts
│    └─ Define collections and schemas
│
├─ 2. Create content files
│    └─ Follow frontmatter structure
│
├─ 3. Create src/pages/[collection]/
│    ├─ index.astro (listing page)
│    └─ [slug].astro (detail page)
│
├─ 4. Query and render
│    ├─ getCollection() for listing
│    ├─ getEntry() for detail
│    ├─ render() for HTML
│    └─ getEntries() for references
│
├─ 5. Test locally
│    └─ npm run dev
│
└─ 6. Build and deploy
       └─ npm run build

CONTENT ADDITION WORKFLOW
│
├─ 1. Create new .md file in content/
│
├─ 2. Add frontmatter matching schema
│
├─ 3. Write content
│
├─ 4. Save file
│
├─ 5. Routes auto-generate
│
└─ 6. No code changes needed!
```

---

## Decision Matrix

```
Content Type    | Loader | Schema Fields | Routes | References
────────────────┼────────┼───────────────┼────────┼─────────────
Blog Post       | glob   | title, date   | [slug] | author
Project         | glob   | title, techs  | [slug] | none
Author          | file   | name, bio     | none   | none
Testimonial     | file   | author, quote | none   | none
Case Study      | glob   | title, metrics| [slug] | none
Product         | glob   | name, price   | [slug] | category
Documentation   | glob   | title, order  | [...slug] | none
Team Member     | file   | name, skills  | [id]   | none
Event           | glob   | title, date   | [slug] | location
FAQ             | glob   | question      | [slug] | none
```

---

This visual guide complements the detailed research documents. Use these diagrams when:
- Explaining architecture to others
- Debugging routing issues
- Deciding on collection structure
- Understanding data flow
- Training new developers
