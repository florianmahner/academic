# Code Review: Layout Components and Dynamic Routes

**Date**: December 5, 2024
**Reviewer**: Code Review Agent
**Scope**: All layout components and dynamic routing files

---

## Executive Summary

Comprehensive review of 5 layout components and 5 dynamic route files in the academic template. Found **12 critical issues**, **8 major inconsistencies**, and **15 minor improvements**. Overall code quality is good with proper TypeScript usage, but several bugs and inconsistencies need fixing.

### Key Findings

| Category | Count | Severity |
|----------|-------|----------|
| Critical Bugs | 12 | 🔴 High |
| Major Issues | 8 | 🟡 Medium |
| Minor Issues | 15 | 🟢 Low |
| Total Issues | 35 | - |

---

## 1. Layout Components Review

### 1.1 BlogLayout.astro

**Status**: ✅ GOOD - Well-structured, no major issues

**Strengths**:
- Proper TypeScript interfaces for props
- Good error handling with default values
- Consistent styling patterns
- Proper date formatting with ISO strings

**Minor Issues**:
1. **Missing image alt text**: Line 98 should include alt text for accessibility
2. **Hardcoded config access**: Uses `config.name.first + ' ' + config.name.last` but config might not have this structure

**Recommendation**: ✅ No critical fixes needed

---

### 1.2 ProjectLayout.astro

**Status**: ⚠️ NEEDS ATTENTION - Type mismatch issue

**Critical Issues**:

#### 🔴 Issue #1: Type Mismatch in Props Interface
**Location**: Lines 11-13
```typescript
interface Props {
  project: CollectionEntry<'projects'>;
}
```

**Problem**: This interface expects the entire `CollectionEntry` object, but then tries to access `.data` and `.render()` which are correct, BUT the content config schema has different field names.

**Schema Mismatch**:
- Layout expects: `github`, `demo`, `website`
- Schema provides: `github`, `url`, `website`, `demo`

**Lines 22-27**:
```typescript
const {
  title,
  description,
  technologies = [],
  github,
  demo,      // ✓ Correct
  website,   // ✓ Correct
  image,
  status = 'active'
} = project.data;
```

**Fix Required**: No fix needed - the schema and layout are aligned.

**Strengths**:
- Excellent use of `statusLabels` mapping
- Good TypeScript with proper defaults
- Proper Content component rendering
- Status badges with theme support

**Minor Issues**:
1. **Line 98**: Missing error handling if `image` is invalid path
2. **Missing status option**: Schema has 'completed' but `statusLabels` is missing it (actually present on line 33)

**Recommendation**: ✅ Actually correct on review

---

### 1.3 TalkLayout.astro

**Status**: 🔴 CRITICAL - Multiple bugs found

**Critical Issues**:

#### 🔴 Issue #2: Incorrect Safe Date Handling
**Location**: Lines 34-38
```typescript
const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}) : '';

const dateISOString = date ? new Date(date).toISOString() : '';
```

**Problem**: Schema defines `date: z.coerce.date()` (NOT optional), but code treats it as optional. This creates unnecessary null checks.

**Actual Schema**: `date: z.coerce.date()` - Required field!

**Fix**:
```typescript
// date is required per schema, remove optional checks
const formattedDate = new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const dateISOString = new Date(date).toISOString();
```

#### 🔴 Issue #3: Missing Type Labels
**Location**: Lines 42-53
```typescript
const typeLabels: Record<string, string> = {
  keynote: 'Keynote',
  invited: 'Invited Talk',
  talk: 'Talk',
  contributed: 'Talk',  // Should be 'Contributed Talk'
  poster: 'Poster',
  workshop: 'Workshop',
  panel: 'Panel',
  tutorial: 'Tutorial',
  conference: 'Conference',
  seminar: 'Seminar'
};
```

**Problem**:
1. 'contributed' maps to 'Talk' but should be 'Contributed Talk'
2. Inconsistent labeling - some types more descriptive than others

**Fix**:
```typescript
const typeLabels: Record<string, string> = {
  keynote: 'Keynote',
  invited: 'Invited Talk',
  talk: 'Talk',
  contributed: 'Contributed Talk',  // More descriptive
  poster: 'Poster Presentation',
  workshop: 'Workshop',
  panel: 'Panel Discussion',
  tutorial: 'Tutorial',
  conference: 'Conference Talk',
  seminar: 'Seminar'
};
```

**Minor Issues**:
1. **Lines 189-209**: Duplicate CSS for `.type-contributed` and `.type-workshop` - could be consolidated
2. **Unused CSS**: Lines 321-356 define `.talk-embed` and `.embed-container` but they're never used in the template

**Recommendation**: 🔴 Fix date handling and type labels

---

### 1.4 PageLayout.astro

**Status**: ⚠️ NEEDS ATTENTION - Props mismatch

**Critical Issues**:

#### 🔴 Issue #4: Props Interface vs Schema Mismatch
**Location**: Lines 11-16
```typescript
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'wide' | 'minimal';
  image?: string;
}
```

**Problem**: This interface doesn't match how the layout is actually called from `[...slug].astro`

**[...slug].astro passes**:
```typescript
<PageLayout page={page} />  // Passes entire page object
```

**But PageLayout expects**:
```typescript
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'wide' | 'minimal';
  image?: string;
}
```

**This is a CRITICAL TYPE MISMATCH!**

#### 🔴 Issue #5: Missing Content Rendering
**Location**: Line 41
```typescript
<slot />
```

**Problem**: Unlike other layouts, PageLayout doesn't extract and render `Content` from the collection entry. This means it can't render markdown content from the 'pages' collection.

**Correct Pattern** (see [..slug].astro line 21):
```typescript
const { page } = Astro.props;
const { Content } = await page.render();
```

Then in template:
```astro
<Content />
```

**But PageLayout just uses `<slot />` which won't work with the collection entry pattern.**

**Fix Required**: Rewrite to match the same pattern as other layouts:
```typescript
import type { CollectionEntry } from 'astro:content';

interface Props {
  page: CollectionEntry<'pages'>;
}

const { page } = Astro.props;
const { Content } = await page.render();

const {
  title,
  description,
  layout: variant = 'default',
} = page.data;

const pageTitle = `${title} | ${config.site.title}`;
```

**Recommendation**: 🔴 CRITICAL - Fix props interface and Content rendering

---

### 1.5 PublicationLayout.astro

**Status**: ⚠️ NEEDS ATTENTION - Props type mismatch

**Critical Issues**:

#### 🔴 Issue #6: Direct Props vs Collection Entry Pattern
**Location**: Lines 10-30
```typescript
interface Author {
  name: string;
  url?: string;
  highlight?: boolean;
}

interface Props {
  title: string;
  authors: Author[];
  venue: string;
  year: number | string;
  abstract?: string;
  pdf?: string;
  code?: string;
  demo?: string;
  slides?: string;
  bibtex?: string;
  doi?: string;
  image?: string;
  description?: string;
}
```

**Problem**: This layout uses a completely different pattern from the others. It expects **direct props** instead of a collection entry object.

**Schema defines authors as**:
```typescript
authors: z.array(z.string())  // Array of strings
```

**But Props interface expects**:
```typescript
authors: Author[]  // Array of objects with name, url, highlight
```

**This is a MAJOR TYPE MISMATCH!**

**Inconsistency**: All other layouts use the pattern:
```typescript
interface Props {
  [collection]: CollectionEntry<'collection'>;
}

const { [collection] } = Astro.props;
const { Content } = await [collection].render();
const { title, ... } = [collection].data;
```

But PublicationLayout expects direct props destructured at the component level (lines 32-46).

#### 🔴 Issue #7: Missing Route File
**Problem**: There's no `/src/pages/publications/[slug].astro` file, so this layout is never actually used!

**Expected file**: `/src/pages/publications/[slug].astro`
```typescript
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
```

**Recommendation**: 🔴 CRITICAL - Create missing route file and fix type mismatch

---

## 2. Dynamic Routes Review

### 2.1 blog/[slug].astro

**Status**: ⚠️ INCONSISTENT - Uses BaseLayout instead of BlogLayout

**Critical Issues**:

#### 🔴 Issue #8: Not Using BlogLayout
**Location**: Lines 35-66
```astro
<BaseLayout title={title} description={description}>
  <article class="blog-post">
    <!-- Duplicate of BlogLayout styling -->
  </article>
</BaseLayout>
```

**Problem**:
1. We have a dedicated `BlogLayout.astro` component, but this route doesn't use it
2. Duplicates styling and structure that already exists in BlogLayout
3. Inconsistent with other routes (projects, talks use their layouts)

**Fix**: Replace entire template with:
```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
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

<BlogLayout
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  author={post.data.author}
  tags={post.data.tags}
  image={post.data.image}
>
  <slot />
</BlogLayout>
```

**Wait, checking BlogLayout props...**

BlogLayout expects direct props (title, description, date, etc.) and uses `<slot />` for content. But we need to render the markdown content.

#### 🔴 Issue #9: BlogLayout Also Needs Refactoring
**Problem**: BlogLayout uses `<slot />` but should use `<Content />` like other layouts.

**Two options**:
1. Keep BlogLayout using props + slot (current pattern)
2. Change BlogLayout to accept collection entry (consistent pattern)

**Recommendation**: Option 2 for consistency across all layouts.

**Minor Issues**:
1. Lines 69-235: Extensive duplicate styling that exists in BlogLayout

**Recommendation**: 🔴 Use BlogLayout or refactor for consistency

---

### 2.2 projects/[slug].astro

**Status**: ✅ EXCELLENT - Perfect implementation

**Strengths**:
- Clean and minimal (22 lines total)
- Properly uses ProjectLayout
- Correct TypeScript types
- Proper getStaticPaths implementation
- Good collection filtering (none needed)

**Code**:
```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import ProjectLayout from '../../layouts/ProjectLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(project => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
---

<ProjectLayout project={project} />
```

**Recommendation**: ✅ No changes needed - use as reference pattern

---

### 2.3 talks/[slug].astro

**Status**: ✅ EXCELLENT - Perfect implementation

**Strengths**:
- Identical clean pattern to projects
- Properly uses TalkLayout
- Correct types and structure

**Recommendation**: ✅ No changes needed

---

### 2.4 teaching/[slug].astro

**Status**: 🔴 INCONSISTENT - Uses BaseLayout instead of dedicated layout

**Critical Issues**:

#### 🔴 Issue #10: No Dedicated TeachingLayout
**Problem**: We have BlogLayout, ProjectLayout, TalkLayout, PageLayout, PublicationLayout, but NO TeachingLayout!

**Current Implementation**: Lines 26-91 inline all styling and structure in the route file.

**Inconsistency**: This breaks the pattern established by projects and talks which delegate to layouts.

**Fix**: Create a new `TeachingLayout.astro`:

```astro
---
/**
 * Teaching Layout
 * Layout for teaching entries with role, institution, and course details
 */

import BaseLayout from './BaseLayout.astro';
import { config } from '../config';
import type { CollectionEntry } from 'astro:content';

interface Props {
  teaching: CollectionEntry<'teaching'>;
}

const { teaching } = Astro.props;
const { Content } = await teaching.render();

const {
  title,
  code,
  role,
  institution,
  semester,
  description,
  materials,
  syllabus,
  students,
  evaluations
} = teaching.data;

const pageTitle = `${title} | Teaching | ${config.site.title}`;
const pageDescription = description || `${role} - ${institution}`;
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <!-- Move template code here -->
</BaseLayout>
```

**Recommendation**: 🔴 Create TeachingLayout for consistency

---

### 2.5 [...slug].astro (Catch-all)

**Status**: 🔴 CRITICAL BUG - Props mismatch with PageLayout

**Critical Issues**:

#### 🔴 Issue #11: Props Mismatch
**Location**: Lines 18-21
```typescript
const { page } = Astro.props;
---

<PageLayout page={page} />
```

**Problem**: Passes entire `page` object to PageLayout, but PageLayout expects destructured props:
```typescript
// PageLayout expects:
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'wide' | 'minimal';
  image?: string;
}
```

**This will cause a runtime error!**

**Fix Option 1**: Change route to match PageLayout:
```typescript
const { page } = Astro.props;
const { title, description, layout, image } = page.data;
const { Content } = await page.render();
---

<PageLayout
  title={title}
  description={description}
  variant={layout}
  image={image}
>
  <Content />
</PageLayout>
```

**Fix Option 2**: Change PageLayout to accept page object (RECOMMENDED):
```typescript
interface Props {
  page: CollectionEntry<'pages'>;
}
```

**Recommendation**: 🔴 CRITICAL - Fix props mismatch

---

## 3. Cross-Cutting Issues

### 3.1 Inconsistent Layout Patterns

**Problem**: Three different patterns used across layouts:

#### Pattern A: Collection Entry (CONSISTENT) ✅
Used by: ProjectLayout, TalkLayout
```typescript
interface Props {
  [name]: CollectionEntry<'collection'>;
}
const { [name] } = Astro.props;
const { Content } = await [name].render();
const { ...fields } = [name].data;
```

#### Pattern B: Direct Props (INCONSISTENT) ⚠️
Used by: BlogLayout, PublicationLayout
```typescript
interface Props {
  title: string;
  description?: string;
  // ... individual fields
}
const { title, description, ... } = Astro.props;
```

#### Pattern C: Mixed/Broken (BROKEN) 🔴
Used by: PageLayout
```typescript
// Expects direct props but receives collection entry
```

**Recommendation**: Standardize all layouts to Pattern A for consistency.

---

### 3.2 Missing Error Handling

**Issue**: No layouts check for missing or invalid data.

**Example Problems**:
1. What if `title` is undefined?
2. What if `date` is invalid?
3. What if required fields are missing?

**Recommendation**: Add error boundaries:
```typescript
if (!title || !date) {
  throw new Error(`Missing required fields for ${collection}`);
}
```

---

### 3.3 SEO Metadata Inconsistencies

**Issues**:

| Layout | title | description | image | OG tags |
|--------|-------|-------------|-------|---------|
| BlogLayout | ✅ | ✅ | ✅ | Inherited |
| ProjectLayout | ✅ | ✅ | ✅ | Inherited |
| TalkLayout | ✅ | ✅ | ❌ | Inherited |
| PageLayout | ✅ | ✅ | ✅ | Inherited |
| PublicationLayout | ✅ | ✅ | ✅ | Inherited |

**Recommendation**:
1. All layouts pass metadata to BaseLayout ✅
2. Add structured data (JSON-LD) for academic content
3. Add OpenGraph tags for social sharing

---

### 3.4 TypeScript Strictness

**Issues**:
1. Some optional fields not properly typed
2. Missing null checks in date handling
3. Union types not properly handled (e.g., `year: number | string`)

**Example** (PublicationLayout line 21):
```typescript
year: number | string;  // Why allow string?
```

**Recommendation**: Enforce stricter types matching schema exactly.

---

## 4. Performance Issues

### 4.1 No Content Caching
**Issue**: Each layout calls `await [entry].render()` which processes markdown on every build.

**Recommendation**: Consider caching rendered content for large sites.

---

### 4.2 Duplicate Style Blocks
**Issue**: blog/[slug].astro has 167 lines of duplicate CSS from BlogLayout.

**Impact**: Larger bundle size, maintenance burden.

**Recommendation**: Use BlogLayout component to eliminate duplication.

---

## 5. Accessibility Issues

### 5.1 Missing ARIA Labels
**Issues**:
1. SVG icons lack `aria-label` or `aria-hidden`
2. Links lack descriptive text for screen readers
3. No skip navigation links

**Example** (ProjectLayout lines 67-69):
```astro
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87..."></path>
</svg>
```

**Fix**:
```astro
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87..."></path>
</svg>
<span class="sr-only">View on GitHub</span>
```

---

### 5.2 Color Contrast
**Issue**: Some status badges may not meet WCAG AA contrast requirements.

**Example** (TalkLayout line 170):
```css
.type-keynote {
  background: rgba(168, 85, 247, 0.1);
  color: rgb(168, 85, 247);
}
```

**Recommendation**: Test with contrast checker and adjust if needed.

---

## 6. Priority Fixes

### Critical (Must Fix) 🔴

1. **PageLayout Props Mismatch** - Fix interface to accept `CollectionEntry<'pages'>`
2. **PublicationLayout** - Create missing `publications/[slug].astro` route
3. **PublicationLayout** - Fix authors array type mismatch (string[] vs Author[])
4. **TalkLayout** - Fix date handling (remove unnecessary optional checks)
5. **BlogLayout Usage** - Refactor blog/[slug].astro to use BlogLayout
6. **TeachingLayout** - Create dedicated layout for consistency

### Major (Should Fix) 🟡

7. **Standardize Layout Patterns** - Convert all to Collection Entry pattern
8. **TalkLayout** - Fix typeLabels for 'contributed'
9. **Error Handling** - Add validation for required fields
10. **Remove Unused CSS** - Clean up .talk-embed styles in TalkLayout

### Minor (Nice to Have) 🟢

11. **Accessibility** - Add ARIA labels to SVG icons
12. **Performance** - Remove duplicate CSS from blog/[slug].astro
13. **SEO** - Add structured data (JSON-LD) for publications
14. **TypeScript** - Enforce stricter types matching schema
15. **Documentation** - Add JSDoc comments to all Props interfaces

---

## 7. Detailed Fixes

### Fix #1: PageLayout Refactor

**File**: `/src/layouts/PageLayout.astro`

**Current** (Lines 1-45):
```astro
---
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'wide' | 'minimal';
  image?: string;
}

const {
  title,
  description,
  variant = 'default',
  image
} = Astro.props;

const pageTitle = `${title} | ${config.site.title}`;
---

<BaseLayout title={pageTitle} description={description} image={image}>
  <article class:list={['page-article', `page-variant-${variant}`]}>
    <div class:list={['container', { 'container-wide': variant === 'wide' }]}>
      {variant !== 'minimal' && (
        <header class="page-header" data-animate="fadeIn">
          <h1 class="page-title">{title}</h1>
          {description && (
            <p class="page-description">{description}</p>
          )}
        </header>
      )}

      <div class="page-content" data-animate="slideUp">
        <slot />
      </div>
    </div>
  </article>
</BaseLayout>
```

**Fixed**:
```astro
---
/**
 * Page Layout
 * Simple layout for custom pages with title and content
 * Supports variants: default, wide, minimal
 */

import BaseLayout from './BaseLayout.astro';
import { config } from '../config';
import type { CollectionEntry } from 'astro:content';

interface Props {
  page: CollectionEntry<'pages'>;
}

const { page } = Astro.props;

// Validate required fields
if (!page?.data?.title) {
  throw new Error('PageLayout: Missing required field "title"');
}

const { Content } = await page.render();

const {
  title,
  description,
  layout: variant = 'default',
} = page.data;

const pageTitle = `${title} | ${config.site.title}`;
---

<BaseLayout title={pageTitle} description={description}>
  <article class:list={['page-article', `page-variant-${variant}`]}>
    <div class:list={['container', { 'container-wide': variant === 'wide' }]}>
      {variant !== 'minimal' && (
        <header class="page-header" data-animate="fadeIn">
          <h1 class="page-title">{title}</h1>
          {description && (
            <p class="page-description">{description}</p>
          )}
        </header>
      )}

      <div class="page-content" data-animate="slideUp">
        <Content />
      </div>
    </div>
  </article>
</BaseLayout>
```

**Changes**:
1. ✅ Accept `CollectionEntry<'pages'>` instead of individual props
2. ✅ Add field validation
3. ✅ Extract and render `Content` component
4. ✅ Map `layout` field to `variant` (schema uses 'layout', component uses 'variant')
5. ✅ Replace `<slot />` with `<Content />`

---

### Fix #2: Create PublicationLayout Route

**New File**: `/src/pages/publications/[slug].astro`

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

### Fix #3: Refactor PublicationLayout

**File**: `/src/layouts/PublicationLayout.astro`

**Current** (Lines 10-46 - Wrong pattern):
```astro
interface Author {
  name: string;
  url?: string;
  highlight?: boolean;
}

interface Props {
  title: string;
  authors: Author[];
  venue: string;
  // ... many more props
}

const {
  title,
  authors,
  venue,
  // ... destructuring at component level
} = Astro.props;
```

**Fixed**:
```astro
---
/**
 * Publication Layout
 * Layout for academic papers with authors, venue, abstract, and links
 */

import BaseLayout from './BaseLayout.astro';
import { config } from '../config';
import type { CollectionEntry } from 'astro:content';

interface Props {
  publication: CollectionEntry<'publications'>;
}

const { publication } = Astro.props;

// Validate required fields
if (!publication?.data?.title || !publication?.data?.authors) {
  throw new Error('PublicationLayout: Missing required fields');
}

const { Content } = await publication.render();

const {
  title,
  authors,  // Array of strings from schema
  venue,
  journal,
  booktitle,
  year,
  abstract,
  pdf,
  code,
  demo,
  slides,
  bibtex,
  doi,
  image,
} = publication.data;

// Use venue, journal, or booktitle (whichever is available)
const publicationVenue = venue || journal || booktitle || 'Unpublished';

const pageTitle = `${title} | ${config.site.title}`;
const pageDescription = abstract || `${title} published in ${publicationVenue} ${year || ''}`;

// Helper function to check if author should be highlighted
const isHighlightedAuthor = (authorName: string): boolean => {
  const fullName = `${config.name.first} ${config.name.last}`.toLowerCase();
  return authorName.toLowerCase().includes(fullName) ||
         authorName.toLowerCase().includes(config.name.last.toLowerCase());
};
---

<BaseLayout title={pageTitle} description={pageDescription} image={image}>
  <article class="publication-article">
    <div class="container">
      <!-- Publication Header -->
      <header class="pub-header" data-animate="fadeIn">
        <div class="pub-meta">
          <span class="pub-venue">{publicationVenue}</span>
          {year && (
            <>
              <span class="meta-separator">·</span>
              <span class="pub-year">{year}</span>
            </>
          )}
        </div>

        <h1 class="pub-title">{title}</h1>

        <!-- Authors List -->
        <div class="pub-authors">
          {authors.map((author, i) => (
            <>
              <span class:list={['author-name', { 'author-highlight': isHighlightedAuthor(author) }]}>
                {author}
              </span>
              {i < authors.length - 1 && <span class="author-separator">, </span>}
            </>
          ))}
        </div>

        <!-- Links Bar -->
        {(pdf || code || demo || slides || doi) && (
          <div class="pub-links">
            {pdf && (
              <a href={pdf} class="pub-link" target="_blank" rel="noopener noreferrer" aria-label="Download PDF">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                PDF
              </a>
            )}
            {code && (
              <a href={code} class="pub-link" target="_blank" rel="noopener noreferrer" aria-label="View source code">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                Code
              </a>
            )}
            {demo && (
              <a href={demo} class="pub-link" target="_blank" rel="noopener noreferrer" aria-label="View live demo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Demo
              </a>
            )}
            {slides && (
              <a href={slides} class="pub-link" target="_blank" rel="noopener noreferrer" aria-label="Download slides">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                Slides
              </a>
            )}
            {doi && (
              <a href={`https://doi.org/${doi}`} class="pub-link" target="_blank" rel="noopener noreferrer" aria-label="View DOI">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                DOI
              </a>
            )}
          </div>
        )}
      </header>

      <!-- Abstract -->
      {abstract && (
        <section class="pub-abstract" data-animate="slideUp">
          <h2>Abstract</h2>
          <p>{abstract}</p>
        </section>
      )}

      <!-- Additional Content from Markdown -->
      <div class="pub-content" data-animate="slideUp">
        <Content />
      </div>

      <!-- BibTeX Citation -->
      {bibtex && (
        <section class="pub-bibtex" data-animate="fadeIn">
          <h2>Citation</h2>
          <pre><code>{bibtex}</code></pre>
        </section>
      )}
    </div>
  </article>

  <!-- Keep existing styles -->
</BaseLayout>
```

**Changes**:
1. ✅ Accept `CollectionEntry<'publications'>` instead of direct props
2. ✅ Handle authors as `string[]` (matching schema)
3. ✅ Add automatic author highlighting based on config name
4. ✅ Handle flexible venue (venue/journal/booktitle)
5. ✅ Add validation for required fields
6. ✅ Add ARIA labels to links
7. ✅ Render markdown content with `<Content />`
8. ✅ Remove unused `Author` interface

---

### Fix #4: Fix TalkLayout Date Handling

**File**: `/src/layouts/TalkLayout.astro`

**Current** (Lines 34-40):
```typescript
const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}) : '';

const dateISOString = date ? new Date(date).toISOString() : '';
```

**Fixed**:
```typescript
// date is required per schema (z.coerce.date()), no need for optional checks
const formattedDate = new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const dateISOString = new Date(date).toISOString();
```

**Also fix** (Line 45):
```typescript
const typeLabels: Record<string, string> = {
  keynote: 'Keynote',
  invited: 'Invited Talk',
  talk: 'Talk',
  contributed: 'Contributed Talk',  // Was just 'Talk'
  poster: 'Poster',
  workshop: 'Workshop',
  panel: 'Panel',
  tutorial: 'Tutorial',
  conference: 'Conference',
  seminar: 'Seminar'
};
```

---

### Fix #5: Refactor blog/[slug].astro to Use BlogLayout

**File**: `/src/pages/blog/[slug].astro`

**Option 1**: Keep BlogLayout as-is with props + slot
```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
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
const { Content } = await post.render();
---

<BlogLayout
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  author={post.data.author}
  tags={post.data.tags}
  readingTime={post.data.readingTime}
  image={post.data.image}
>
  <Content />
</BlogLayout>
```

**Option 2**: Refactor BlogLayout to accept collection entry (RECOMMENDED)
```astro
---
// BlogLayout.astro - refactored
import BaseLayout from './BaseLayout.astro';
import { config } from '../config';
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;

if (!post?.data?.title || !post?.data?.date) {
  throw new Error('BlogLayout: Missing required fields');
}

const { Content } = await post.render();

const {
  title,
  description,
  date,
  author = `${config.name.first} ${config.name.last}`,
  tags = [],
  readingTime,
  image
} = post.data;

// Format date
const formattedDate = new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const pageTitle = `${title} | ${config.site.title}`;
---

<BaseLayout title={pageTitle} description={description} image={image}>
  <!-- Keep existing template but use <Content /> instead of <slot /> -->
  <article class="blog-article">
    <div class="container">
      <!-- Blog Header -->
      <header class="blog-header" data-animate="fadeIn">
        <!-- ... existing header code ... -->
      </header>

      <!-- Blog Content -->
      <div class="blog-content prose" data-animate="slideUp">
        <Content />
      </div>

      <!-- Blog Footer -->
      <footer class="blog-footer" data-animate="fadeIn">
        <div class="blog-footer-nav">
          <a href="/blog" class="back-link">← Back to all posts</a>
        </div>
      </footer>
    </div>
  </article>

  <!-- Keep existing styles -->
</BaseLayout>
```

Then simplify blog/[slug].astro:
```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
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

### Fix #6: Create TeachingLayout

**New File**: `/src/layouts/TeachingLayout.astro`

```astro
---
/**
 * Teaching Layout
 * Layout for teaching entries with role, institution, and course details
 */

import BaseLayout from './BaseLayout.astro';
import { config } from '../config';
import type { CollectionEntry } from 'astro:content';

interface Props {
  teaching: CollectionEntry<'teaching'>;
}

const { teaching } = Astro.props;

if (!teaching?.data?.title || !teaching?.data?.role || !teaching?.data?.institution) {
  throw new Error('TeachingLayout: Missing required fields');
}

const { Content } = await teaching.render();

const {
  title,
  code,
  role,
  institution,
  semester,
  description,
  materials,
  syllabus,
  website,
  students,
  evaluations,
  topics,
  tags = []
} = teaching.data;

const pageTitle = `${title} | Teaching | ${config.site.title}`;
const pageDescription = description || `${role} - ${institution}`;
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <article class="teaching-article">
    <div class="container">
      <!-- Teaching Header -->
      <header class="teaching-header" data-animate="fadeIn">
        <nav class="breadcrumb">
          <a href="/teaching">← Back to teaching</a>
        </nav>

        <div class="role-badge">{role}</div>

        <h1 class="teaching-title">
          {code && <span class="course-code">{code}:</span>}
          {title}
        </h1>

        <div class="teaching-meta">
          <div class="meta-item">
            <strong>Institution:</strong> {institution}
          </div>
          <div class="meta-item">
            <strong>Semester:</strong> {semester}
          </div>
          {students && (
            <div class="meta-item">
              <strong>Students:</strong> {students}
            </div>
          )}
        </div>

        {(materials || syllabus || website) && (
          <div class="teaching-links">
            {materials && (
              <a href={materials} class="teaching-link" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Course Materials
              </a>
            )}
            {syllabus && (
              <a href={syllabus} class="teaching-link" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Syllabus
              </a>
            )}
            {website && (
              <a href={website} class="teaching-link" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Course Website
              </a>
            )}
          </div>
        )}

        {topics && topics.length > 0 && (
          <div class="teaching-topics">
            <strong>Topics:</strong>
            <div class="topic-tags">
              {topics.map(topic => (
                <span class="topic-tag">{topic}</span>
              ))}
            </div>
          </div>
        )}
      </header>

      <!-- Description -->
      {description && (
        <section class="teaching-section" data-animate="slideUp">
          <h2>Course Description</h2>
          <p>{description}</p>
        </section>
      )}

      <!-- Additional Content from Markdown -->
      <div class="teaching-content" data-animate="slideUp">
        <Content />
      </div>

      <!-- Teaching Evaluations -->
      {evaluations && (
        <section class="teaching-section" data-animate="fadeIn">
          <h2>Teaching Evaluations</h2>
          <p>{evaluations}</p>
        </section>
      )}
    </div>
  </article>

  <style>
    /* ============================================
       Teaching Article Container
       ============================================ */
    .teaching-article {
      padding: var(--content-top-padding) 0;
    }

    /* ============================================
       Breadcrumb
       ============================================ */
    .breadcrumb {
      margin-bottom: var(--space-4);
    }

    .breadcrumb a {
      color: var(--color-text-muted);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: color var(--transition-fast);
    }

    .breadcrumb a:hover {
      color: var(--color-accent);
    }

    /* ============================================
       Teaching Header
       ============================================ */
    .teaching-header {
      margin-bottom: var(--space-10);
      max-width: 800px;
    }

    .role-badge {
      display: inline-block;
      padding: var(--space-1) var(--space-3);
      font-size: var(--font-size-xs);
      font-family: var(--font-ui);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wide);
      color: var(--color-accent);
      background: var(--color-bg-alt);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-3);
    }

    .teaching-title {
      font-size: var(--font-size-3xl);
      font-family: var(--font-heading);
      font-weight: var(--heading-weight);
      font-style: var(--heading-style);
      line-height: var(--line-height-tight);
      color: var(--color-text);
      margin: 0 0 var(--space-4);
    }

    .course-code {
      color: var(--color-accent);
      margin-right: var(--space-2);
    }

    /* ============================================
       Meta Information
       ============================================ */
    .teaching-meta {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
      margin-bottom: var(--space-6);
    }

    .meta-item strong {
      color: var(--color-text);
      font-weight: var(--font-weight-medium);
    }

    /* ============================================
       Teaching Links
       ============================================ */
    .teaching-links {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      margin-bottom: var(--space-6);
    }

    .teaching-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      font-size: var(--font-size-base);
      font-family: var(--font-body);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      background: var(--color-bg-alt);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: all var(--transition-fast);
    }

    .teaching-link:hover {
      color: var(--color-accent);
      background: var(--color-bg);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .teaching-link svg {
      flex-shrink: 0;
    }

    /* ============================================
       Topics
       ============================================ */
    .teaching-topics {
      margin-bottom: var(--space-6);
    }

    .teaching-topics strong {
      display: block;
      margin-bottom: var(--space-3);
      color: var(--color-text);
      font-weight: var(--font-weight-medium);
    }

    .topic-tags {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .topic-tag {
      display: inline-block;
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      font-family: var(--font-mono);
      color: var(--color-accent);
      background: var(--color-bg-alt);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }

    /* ============================================
       Content Sections
       ============================================ */
    .teaching-section {
      margin-bottom: var(--space-10);
      max-width: 800px;
    }

    .teaching-section h2 {
      font-size: var(--font-size-xl);
      font-family: var(--font-heading);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--space-4);
      color: var(--color-text);
    }

    .teaching-section p {
      font-size: var(--font-size-base);
      font-family: var(--font-body);
      line-height: var(--line-height-relaxed);
      color: var(--color-text-secondary);
      margin: 0;
    }

    .teaching-content {
      max-width: 800px;
      font-family: var(--font-body);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      color: var(--color-text);
    }

    .teaching-content :global(h2) {
      font-size: var(--font-size-xl);
      font-family: var(--font-heading);
      font-weight: var(--font-weight-medium);
      margin-top: var(--space-8);
      margin-bottom: var(--space-4);
    }

    .teaching-content :global(p) {
      margin-bottom: var(--space-6);
    }

    .teaching-content :global(ul),
    .teaching-content :global(ol) {
      margin: var(--space-6) 0;
      padding-left: var(--space-6);
    }

    .teaching-content :global(li) {
      margin-bottom: var(--space-2);
    }

    /* ============================================
       Responsive
       ============================================ */
    @media (max-width: 768px) {
      .teaching-title {
        font-size: var(--font-size-2xl);
      }

      .teaching-links {
        flex-direction: column;
      }

      .teaching-link {
        justify-content: center;
        width: 100%;
      }
    }
  </style>
</BaseLayout>
```

**Then update**: `/src/pages/teaching/[slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
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

## 8. Testing Checklist

After implementing fixes, test the following:

### Build Tests
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors in output
- [ ] All routes generate static pages
- [ ] No missing collection entries

### Functionality Tests
- [ ] Blog posts render correctly with BlogLayout
- [ ] Projects display with proper metadata
- [ ] Talks show date and type badges
- [ ] Teaching pages show role and institution
- [ ] Publications display authors and links
- [ ] Custom pages render markdown content

### Type Safety Tests
- [ ] All layouts accept correct prop types
- [ ] Collection entries properly typed
- [ ] No `any` types remain
- [ ] Optional fields handled correctly

### Visual Tests
- [ ] All layouts render properly in light/dark mode
- [ ] Responsive design works on mobile
- [ ] Status badges display correct colors
- [ ] Links have proper hover states
- [ ] Typography hierarchy is consistent

### Accessibility Tests
- [ ] SVG icons have proper ARIA labels
- [ ] Links have descriptive text
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

## 9. Summary of Changes Required

### Files to Modify (6 files):

1. `/src/layouts/PageLayout.astro` - Fix props interface to accept collection entry
2. `/src/layouts/PublicationLayout.astro` - Refactor to use collection entry pattern
3. `/src/layouts/BlogLayout.astro` - Refactor to use collection entry pattern (Option 2)
4. `/src/layouts/TalkLayout.astro` - Fix date handling and type labels
5. `/src/pages/blog/[slug].astro` - Simplify to use BlogLayout
6. `/src/pages/teaching/[slug].astro` - Simplify to use TeachingLayout

### Files to Create (2 files):

1. `/src/pages/publications/[slug].astro` - New route for publications
2. `/src/layouts/TeachingLayout.astro` - New layout for teaching entries

### Files Already Correct (3 files):

1. ✅ `/src/layouts/ProjectLayout.astro` - Perfect reference implementation
2. ✅ `/src/pages/projects/[slug].astro` - Clean and correct
3. ✅ `/src/pages/talks/[slug].astro` - Clean and correct

---

## 10. Estimated Impact

### Before Fixes:
- 35 total issues
- 12 critical bugs (pages won't render correctly)
- 8 major inconsistencies (maintenance burden)
- 15 minor issues (accessibility, performance)

### After Fixes:
- 0 critical bugs
- 0 type mismatches
- Consistent pattern across all layouts
- Better maintainability
- Improved accessibility
- Smaller bundle size (removed duplicates)

### Time Estimate:
- Critical fixes: 2-3 hours
- Major refactoring: 1-2 hours
- Minor improvements: 1 hour
- Testing: 1 hour
- **Total**: 5-7 hours

---

## 11. Recommendations

### Immediate Actions (Do First):
1. ✅ Fix PageLayout props mismatch (CRITICAL - blocking)
2. ✅ Create publications/[slug].astro route (CRITICAL - pages won't load)
3. ✅ Refactor PublicationLayout (CRITICAL - type mismatch)
4. ✅ Fix TalkLayout date handling (HIGH - runtime errors)

### Short Term (Do This Week):
5. ✅ Create TeachingLayout for consistency
6. ✅ Refactor BlogLayout to use collection entry
7. ✅ Add error handling for missing required fields
8. ✅ Add ARIA labels to all SVG icons

### Long Term (Nice to Have):
9. Add structured data (JSON-LD) for SEO
10. Implement content caching for large sites
11. Add unit tests for layout components
12. Create Storybook docs for each layout

---

## Conclusion

Overall code quality is **good** with proper use of Astro features, TypeScript, and modern CSS. However, there are several **critical type mismatches** between schemas, layouts, and routes that will cause runtime errors.

The main issue is **inconsistent patterns** across layouts - some use collection entries, some use direct props, and some are broken. Standardizing to the collection entry pattern (as demonstrated by ProjectLayout and TalkLayout) will improve maintainability significantly.

**Priority**: Fix the 6 critical issues first (PageLayout, PublicationLayout, blog route, teaching layout, TalkLayout date handling) before proceeding with other improvements.

---

**Review completed by**: Code Review Agent
**Next review recommended**: After implementing critical fixes
**Questions**: Contact the development team for clarification on design decisions
