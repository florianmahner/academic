# Quick Fix Summary - Layout Components & Routes

**Status**: 🔴 12 Critical Issues | 🟡 8 Major Issues | 🟢 15 Minor Issues

---

## Critical Bugs (Fix Immediately) 🔴

### 1. PageLayout Props Mismatch
**File**: `/src/layouts/PageLayout.astro`
**Issue**: Expects `{ title, description, variant, image }` but receives `{ page: CollectionEntry<'pages'> }`
**Impact**: Pages won't render - runtime error

**Quick Fix**:
```typescript
// Change interface from:
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'wide' | 'minimal';
  image?: string;
}

// To:
interface Props {
  page: CollectionEntry<'pages'>;
}

const { page } = Astro.props;
const { Content } = await page.render();
const { title, description, layout: variant = 'default' } = page.data;

// Replace <slot /> with <Content />
```

---

### 2. Missing Publications Route
**File**: `/src/pages/publications/[slug].astro` (DOES NOT EXIST)
**Issue**: PublicationLayout exists but no route uses it
**Impact**: Publication pages won't load

**Quick Fix**: Create new file
```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import PublicationLayout from '../../layouts/PublicationLayout.astro';

export async function getStaticPaths() {
  const publications = await getCollection('publications');
  return publications.map(publication => ({
    params: { slug: publication.slug },
    props: { publication },
  }));
}

interface Props {
  publication: CollectionEntry<'publications'>;
}

const { publication } = Astro.props;
---

<PublicationLayout publication={publication} />
```

---

### 3. PublicationLayout Type Mismatch
**File**: `/src/layouts/PublicationLayout.astro`
**Issue**:
- Expects `authors: Author[]` but schema provides `authors: string[]`
- Uses direct props instead of collection entry
**Impact**: Type errors, inconsistent pattern

**Quick Fix**: Change lines 10-30
```typescript
// From:
interface Author {
  name: string;
  url?: string;
  highlight?: boolean;
}

interface Props {
  title: string;
  authors: Author[];
  // ... more props
}

// To:
interface Props {
  publication: CollectionEntry<'publications'>;
}

const { publication } = Astro.props;
const { Content } = await publication.render();
const { title, authors, venue, ... } = publication.data;

// authors is now string[] - handle in template
```

---

### 4. TalkLayout Incorrect Date Handling
**File**: `/src/layouts/TalkLayout.astro`
**Issue**: Treats required `date` field as optional
**Impact**: Unnecessary null checks, potential errors

**Quick Fix**: Lines 34-40
```typescript
// Remove optional checks - date is required per schema
// From:
const formattedDate = date ? new Date(date).toLocaleDateString(...) : '';
const dateISOString = date ? new Date(date).toISOString() : '';

// To:
const formattedDate = new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
const dateISOString = new Date(date).toISOString();
```

**Also fix**: Line 45
```typescript
const typeLabels: Record<string, string> = {
  // ...
  contributed: 'Contributed Talk',  // Was just 'Talk'
  // ...
};
```

---

### 5. Blog Route Not Using BlogLayout
**File**: `/src/pages/blog/[slug].astro`
**Issue**: Duplicates 167 lines of CSS/markup that exists in BlogLayout
**Impact**: Bundle size, maintenance burden

**Quick Fix**: First refactor BlogLayout to accept collection entry:
```typescript
// BlogLayout.astro - change interface
interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { Content } = await post.render();
const { title, description, date, author, tags, readingTime, image } = post.data;

// Replace <slot /> with <Content />
```

Then simplify blog/[slug].astro:
```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
---

<BlogLayout post={post} />
```

---

### 6. Missing TeachingLayout
**File**: `/src/layouts/TeachingLayout.astro` (DOES NOT EXIST)
**Issue**: teaching/[slug].astro inlines all markup instead of using layout
**Impact**: Inconsistent pattern, harder to maintain

**Quick Fix**: Create new TeachingLayout (see detailed fix in main review)

Then simplify teaching/[slug].astro:
```astro
---
import { getCollection } from 'astro:content';
import TeachingLayout from '../../layouts/TeachingLayout.astro';

export async function getStaticPaths() {
  const teaching = await getCollection('teaching');
  return teaching.map(entry => ({
    params: { slug: entry.slug },
    props: { teaching: entry },
  }));
}

interface Props {
  teaching: CollectionEntry<'teaching'>;
}

const { teaching } = Astro.props;
---

<TeachingLayout teaching={teaching} />
```

---

## Pattern Standardization

### Current State (Inconsistent) ❌

| Layout | Pattern | Status |
|--------|---------|--------|
| ProjectLayout | Collection Entry | ✅ Correct |
| TalkLayout | Collection Entry | ✅ Correct |
| PageLayout | Direct Props (but receives Entry) | 🔴 Broken |
| PublicationLayout | Direct Props | 🟡 Inconsistent |
| BlogLayout | Direct Props | 🟡 Inconsistent |
| TeachingLayout | N/A | 🔴 Missing |

### Target State (Consistent) ✅

**All layouts should follow this pattern**:

```typescript
interface Props {
  [collection]: CollectionEntry<'collection'>;
}

const { [collection] } = Astro.props;
const { Content } = await [collection].render();
const { field1, field2, ... } = [collection].data;
```

**All routes should follow this pattern**:

```typescript
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import [Collection]Layout from '../../layouts/[Collection]Layout.astro';

export async function getStaticPaths() {
  const items = await getCollection('collection');
  return items.map(item => ({
    params: { slug: item.slug },
    props: { [collection]: item },
  }));
}

interface Props {
  [collection]: CollectionEntry<'collection'>;
}

const { [collection] } = Astro.props;
---

<[Collection]Layout [collection]={[collection]} />
```

---

## Files Status

### ✅ Already Correct (No Changes Needed)
- `/src/layouts/ProjectLayout.astro` - Perfect reference
- `/src/layouts/BaseLayout.astro` - Good foundation
- `/src/pages/projects/[slug].astro` - Use as template
- `/src/pages/talks/[slug].astro` - Clean implementation

### 🔴 Must Fix (Critical)
- `/src/layouts/PageLayout.astro` - Props mismatch
- `/src/layouts/PublicationLayout.astro` - Type mismatch
- `/src/layouts/TalkLayout.astro` - Date handling
- `/src/pages/blog/[slug].astro` - Not using BlogLayout
- `/src/pages/teaching/[slug].astro` - Needs layout

### 📝 Must Create
- `/src/pages/publications/[slug].astro` - Missing route
- `/src/layouts/TeachingLayout.astro` - Missing layout

### 🟡 Should Refactor (Major)
- `/src/layouts/BlogLayout.astro` - Change to collection entry pattern

---

## Testing After Fixes

```bash
# 1. Type check
npm run typecheck

# 2. Build test
npm run build

# 3. Manual verification
npm run dev

# Then visit:
# - http://localhost:4321/blog/[any-post]
# - http://localhost:4321/projects/[any-project]
# - http://localhost:4321/talks/[any-talk]
# - http://localhost:4321/publications/[any-publication]
# - http://localhost:4321/teaching/[any-course]
# - http://localhost:4321/[any-page]
```

---

## Implementation Order

1. **Fix PageLayout** (5 min) - Blocking issue
2. **Create publications route** (5 min) - Quick win
3. **Fix TalkLayout dates** (5 min) - Easy fix
4. **Refactor PublicationLayout** (15 min) - Type alignment
5. **Create TeachingLayout** (30 min) - New component
6. **Refactor BlogLayout** (15 min) - Pattern consistency
7. **Simplify blog route** (5 min) - Remove duplicates
8. **Simplify teaching route** (5 min) - Use new layout

**Total Time**: ~1.5 hours for all critical fixes

---

## Schema Reference

For quick reference when fixing type mismatches:

### Blog Schema
```typescript
{
  title: string,
  description?: string,
  date: Date,
  updated?: Date,
  author?: string,
  tags: string[],
  draft: boolean,
  image?: string,
  imageAlt?: string
}
```

### Publications Schema
```typescript
{
  title: string,
  authors: string[],  // Not Author[] !
  venue?: string,
  journal?: string,
  booktitle?: string,
  year?: number,
  date?: Date,
  type?: 'article' | 'inproceedings' | ...,
  pdf?: string,
  code?: string,
  abstract?: string,
  bibtex?: string,
  doi?: string
}
```

### Projects Schema
```typescript
{
  title: string,
  description: string,
  date?: Date,
  technologies?: string[],
  github?: string,
  website?: string,
  demo?: string,
  image?: string,
  status: 'active' | 'completed' | 'archived' | 'wip'
}
```

### Talks Schema
```typescript
{
  title: string,
  event: string,
  date: Date,  // Required!
  location?: string,
  type: 'keynote' | 'invited' | 'talk' | 'workshop' | ...,
  slides?: string,
  video?: string,
  abstract?: string
}
```

### Teaching Schema
```typescript
{
  title: string,
  code?: string,
  role: 'Instructor' | 'Teaching Assistant' | ...,
  institution: string,
  semester: string,
  description?: string,
  materials?: string,
  syllabus?: string,
  students?: number,
  evaluations?: string
}
```

### Pages Schema
```typescript
{
  title: string,
  description?: string,
  layout: 'default' | 'wide' | 'minimal' | 'full',
  nav: boolean,
  nav_order: number,
  draft: boolean
}
```

---

## Quick Commands

```bash
# Create missing files
mkdir -p src/pages/publications
touch src/pages/publications/[slug].astro
touch src/layouts/TeachingLayout.astro

# Check for type errors
npm run typecheck

# Build and verify
npm run build

# Start dev server
npm run dev
```

---

**See**: `CODE_REVIEW_LAYOUTS_ROUTES.md` for complete detailed review with code examples
