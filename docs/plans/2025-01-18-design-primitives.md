# Design Primitives Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create composable design primitives that specialized content types (Publications, OpenSource, CV) can extend, reducing duplication while maintaining flexibility.

**Architecture:** Extract common UI patterns into slot-based primitives (`TimelineEntry`, `MediaCard`, `StatCard`, `ListItem`). Specialized components like `PaperCard` and `RepoCard` compose these primitives and add domain-specific logic (BibTeX parsing, GitHub API). All primitives use the existing `.hover-item` global pattern.

**Tech Stack:** Astro components with TypeScript, CSS custom properties, slot-based composition.

---

## Phase 1: Core Primitives

### Task 1: Create TimelineEntry Primitive

**Files:**
- Create: `src/components/primitives/TimelineEntry.astro`

**Step 1: Create the TimelineEntry component**

This primitive displays date-aligned content, used by CV, Teaching, Talks, News.

```astro
---
/**
 * TimelineEntry Primitive
 *
 * Date-aligned content display for chronological items.
 * Used by: CV, Teaching, Talks, News, Education
 *
 * @slot date - Date/period display (left column)
 * @slot default - Main content
 * @slot links - Action links (bottom)
 */

interface Props {
  date?: string;
  class?: string;
}

const { date, class: className } = Astro.props;
---

<div class:list={['timeline-entry', 'hover-item', className]}>
  <div class="timeline-entry-date">
    {date ? date : <slot name="date" />}
  </div>
  <div class="timeline-entry-content">
    <slot />
    <div class="timeline-entry-links">
      <slot name="links" />
    </div>
  </div>
</div>

<style>
  .timeline-entry {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: var(--space-5);
  }

  .timeline-entry-date {
    font-size: var(--font-size-sm);
    font-family: var(--font-body);
    color: var(--color-text-muted);
    padding-top: 2px;
  }

  .timeline-entry-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    min-width: 0;
  }

  .timeline-entry-links:empty {
    display: none;
  }

  .timeline-entry-links {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }

  @media (max-width: 600px) {
    .timeline-entry {
      grid-template-columns: 1fr;
      gap: var(--space-2);
    }

    .timeline-entry-date {
      font-size: var(--font-size-xs);
    }
  }
</style>
```

**Step 2: Verify component renders**

Run: `npm run dev`
Expected: Dev server starts without errors

**Step 3: Commit**

```bash
git add src/components/primitives/TimelineEntry.astro
git commit -m "add: TimelineEntry primitive component"
```

---

### Task 2: Create MediaCard Primitive

**Files:**
- Create: `src/components/primitives/MediaCard.astro`

**Step 1: Create the MediaCard component**

This primitive displays content with an optional image/preview, used by Publications, Projects, Blog.

```astro
---
/**
 * MediaCard Primitive
 *
 * Card with optional media (image/gif) and structured content slots.
 * Used by: Publications, Projects, Blog posts with images
 *
 * @prop image - Optional image URL
 * @prop imageAlt - Alt text for image
 * @prop title - Card title (required)
 * @prop href - Optional link URL
 * @prop external - Open link in new tab
 * @slot meta - Metadata line (venue, date, tags)
 * @slot subtitle - Below title (authors, description)
 * @slot description - Main description
 * @slot links - Action links
 */

interface Props {
  image?: string;
  imageAlt?: string;
  title: string;
  href?: string;
  external?: boolean;
  class?: string;
}

const {
  image,
  imageAlt = '',
  title,
  href,
  external = false,
  class: className
} = Astro.props;
---

<article class:list={['media-card', 'hover-item', { 'media-card--has-image': !!image }, className]}>
  {image && (
    <div class="media-card-image">
      <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
    </div>
  )}
  <div class="media-card-content">
    <div class="media-card-meta">
      <slot name="meta" />
    </div>
    <h3 class="media-card-title hover-title">
      {href ? (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {title}
        </a>
      ) : title}
    </h3>
    <div class="media-card-subtitle">
      <slot name="subtitle" />
    </div>
    <div class="media-card-description">
      <slot name="description" />
    </div>
    <div class="media-card-links">
      <slot name="links" />
    </div>
  </div>
</article>

<style>
  .media-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .media-card--has-image {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: var(--space-5);
  }

  .media-card-image {
    width: 140px;
    height: 90px;
    overflow: hidden;
    border-radius: var(--radius-md);
    flex-shrink: 0;
  }

  .media-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .media-card-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .media-card-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .media-card-meta:empty {
    display: none;
  }

  .media-card-title {
    font-size: var(--font-size-base);
    font-family: var(--font-body);
    font-weight: var(--font-weight-semibold);
    margin: 0 0 var(--space-2);
    line-height: var(--line-height-snug);
  }

  .media-card-title a {
    color: var(--color-text);
    background: none;
    transition: color var(--transition-fast);
  }

  .media-card-title a:hover {
    color: var(--color-accent);
  }

  .media-card-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .media-card-subtitle:empty {
    display: none;
  }

  .media-card-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: var(--line-height-normal);
  }

  .media-card-description:empty {
    display: none;
  }

  .media-card-links {
    display: flex;
    gap: var(--space-3);
    margin-top: auto;
    padding-top: var(--space-2);
  }

  .media-card-links:empty {
    display: none;
  }

  @media (max-width: 600px) {
    .media-card--has-image {
      grid-template-columns: 1fr;
      gap: var(--space-3);
    }

    .media-card-image {
      width: 100%;
      max-width: 200px;
      height: auto;
      aspect-ratio: 16 / 10;
    }
  }
</style>
```

**Step 2: Verify component renders**

Run: `npm run dev`
Expected: Dev server starts without errors

**Step 3: Commit**

```bash
git add src/components/primitives/MediaCard.astro
git commit -m "add: MediaCard primitive component"
```

---

### Task 3: Create StatCard Primitive

**Files:**
- Create: `src/components/primitives/StatCard.astro`

**Step 1: Create the StatCard component**

This primitive displays items with stats/metrics, used by Repos, metrics displays.

```astro
---
/**
 * StatCard Primitive
 *
 * Card optimized for displaying items with statistics.
 * Used by: Repos, metrics, items with counts
 *
 * @prop title - Card title
 * @prop href - Optional link URL
 * @prop external - Open link in new tab
 * @slot subtitle - Description below title
 * @slot stats - Statistics display (stars, forks, etc.)
 */

interface Props {
  title: string;
  href?: string;
  external?: boolean;
  class?: string;
}

const {
  title,
  href,
  external = false,
  class: className
} = Astro.props;
---

<article class:list={['stat-card', 'hover-item', className]}>
  {href && (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      class="stat-card-link"
      aria-hidden="true"
      tabindex="-1"
    />
  )}
  <h3 class="stat-card-title hover-title">{title}</h3>
  <div class="stat-card-subtitle">
    <slot name="subtitle" />
  </div>
  <div class="stat-card-footer">
    <slot name="stats" />
  </div>
</article>

<style>
  .stat-card {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .stat-card-link {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .stat-card-title {
    font-family: var(--font-body);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    margin: 0 0 var(--space-1);
  }

  .stat-card-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    line-height: var(--line-height-normal);
    margin-bottom: var(--space-3);
    flex: 1;
  }

  .stat-card-subtitle:empty {
    display: none;
  }

  .stat-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    margin-top: auto;
  }

  .stat-card-footer:empty {
    display: none;
  }

  /* Allow nested interactive elements */
  .stat-card :global(a),
  .stat-card :global(button) {
    position: relative;
    z-index: 2;
  }
</style>
```

**Step 2: Verify component renders**

Run: `npm run dev`
Expected: Dev server starts without errors

**Step 3: Commit**

```bash
git add src/components/primitives/StatCard.astro
git commit -m "add: StatCard primitive component"
```

---

### Task 4: Create ListItem Primitive

**Files:**
- Create: `src/components/primitives/ListItem.astro`

**Step 1: Create the ListItem component**

Simple list item for minimal displays.

```astro
---
/**
 * ListItem Primitive
 *
 * Simple list item with optional marker.
 * Used by: Awards, simple lists, minimal views
 *
 * @prop marker - Optional marker (bullet, icon, date)
 * @slot default - Main content
 */

interface Props {
  marker?: string;
  class?: string;
}

const { marker, class: className } = Astro.props;
---

<li class:list={['list-item', 'hover-item', className]}>
  {marker && <span class="list-item-marker">{marker}</span>}
  <div class="list-item-content">
    <slot />
  </div>
</li>

<style>
  .list-item {
    display: flex;
    gap: var(--space-3);
    list-style: none;
  }

  .list-item-marker {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    flex-shrink: 0;
    min-width: 80px;
  }

  .list-item-content {
    flex: 1;
    min-width: 0;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/primitives/ListItem.astro
git commit -m "add: ListItem primitive component"
```

---

### Task 5: Create Helper Primitives

**Files:**
- Create: `src/components/primitives/AuthorList.astro`
- Create: `src/components/primitives/LanguageDot.astro`

**Step 1: Create AuthorList helper**

```astro
---
/**
 * AuthorList Primitive
 *
 * Displays author names with optional highlighting.
 * Used by: Publications
 */

interface Props {
  authors: string[];
  highlight?: string;
  class?: string;
}

const { authors, highlight = '', class: className } = Astro.props;
---

<p class:list={['author-list', className]}>
  {authors.map((author, i) => (
    <>
      <span class:list={{ 'author-highlight': highlight && author.includes(highlight) }}>
        {author}
      </span>
      {i < authors.length - 1 && ', '}
    </>
  ))}
</p>

<style>
  .author-list {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
    line-height: var(--line-height-normal);
  }

  .author-highlight {
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }
</style>
```

**Step 2: Create LanguageDot helper**

```astro
---
/**
 * LanguageDot Primitive
 *
 * Displays programming language with colored dot.
 * Used by: RepoCard, code-related cards
 */

interface Props {
  language: string;
  class?: string;
}

const { language, class: className } = Astro.props;

// Language colors mapped to CSS variables
const langVars: Record<string, string> = {
  python: 'var(--lang-python)',
  javascript: 'var(--lang-javascript)',
  typescript: 'var(--lang-typescript)',
  rust: 'var(--lang-rust)',
  go: 'var(--lang-go)',
  java: 'var(--lang-java)',
  html: 'var(--lang-html)',
  css: 'var(--lang-css)',
  shell: 'var(--lang-shell)',
  default: 'var(--lang-default)',
};

const color = langVars[language?.toLowerCase() || 'default'] || langVars.default;
---

<span class:list={['language-dot', className]}>
  <span class="dot" style={`background-color: ${color}`}></span>
  {language}
</span>

<style>
  .language-dot {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
</style>
```

**Step 3: Commit**

```bash
git add src/components/primitives/AuthorList.astro src/components/primitives/LanguageDot.astro
git commit -m "add: AuthorList and LanguageDot helper primitives"
```

---

## Phase 2: Refactor Specialized Components

### Task 6: Refactor PaperCard to use MediaCard

**Files:**
- Modify: `src/components/blocks/PaperCard.astro`

**Step 1: Refactor PaperCard to compose MediaCard**

```astro
---
/**
 * PaperCard Component
 *
 * Display academic publication with preview, metadata, and links.
 * Composes MediaCard primitive with publication-specific additions.
 */
import MediaCard from '../primitives/MediaCard.astro';
import AuthorList from '../primitives/AuthorList.astro';
import ActionLink from '../primitives/ActionLink.astro';

interface Props {
  title: string;
  authors: string[];
  venue?: string;
  year?: number;
  preview?: string;
  pdf?: string;
  html?: string;
  code?: string;
  abbr?: string;
  highlightAuthor?: string;
  compact?: boolean;
  class?: string;
}

const {
  title,
  authors,
  venue,
  year,
  preview,
  pdf,
  html,
  code,
  abbr,
  highlightAuthor = 'Mahner',
  compact = false,
  class: className,
} = Astro.props;

const primaryLink = pdf || html;
---

<MediaCard
  image={compact ? undefined : preview}
  imageAlt={title}
  title={title}
  href={primaryLink}
  external={true}
  class:list={['paper-card', { 'paper-card--compact': compact }, className]}
>
  <Fragment slot="meta">
    {venue && <span class="paper-venue">{venue}</span>}
    {venue && year && <span class="paper-sep">·</span>}
    {year && <span class="paper-year">{year}</span>}
    {abbr && <span class="paper-abbr">{abbr}</span>}
  </Fragment>

  <Fragment slot="subtitle">
    <AuthorList authors={authors} highlight={highlightAuthor} />
  </Fragment>

  <Fragment slot="links">
    {pdf && <ActionLink href={pdf} label="PDF" icon="external" />}
    {html && <ActionLink href={html} label="Web" icon="globe" />}
    {code && <ActionLink href={code} label="Code" icon="code" />}
  </Fragment>
</MediaCard>

<style>
  /* Publication-specific styling only */
  .paper-venue {
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
  }

  .paper-year {
    color: var(--color-text-muted);
  }

  .paper-sep {
    color: var(--color-text-muted);
    opacity: 0.5;
  }

  .paper-abbr {
    padding: 2px 6px;
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }

  /* Compact mode */
  .paper-card--compact {
    padding: var(--space-3);
  }
</style>
```

**Step 2: Test publications page renders correctly**

Run: `npm run dev`
Navigate to: `/publications` and homepage (selected publications)
Expected: Publications display correctly with same visual appearance

**Step 3: Commit**

```bash
git add src/components/blocks/PaperCard.astro
git commit -m "refactor: PaperCard to compose MediaCard primitive"
```

---

### Task 7: Refactor RepoCard to use StatCard

**Files:**
- Modify: `src/components/blocks/RepoCard.astro`

**Step 1: Refactor RepoCard to compose StatCard**

```astro
---
/**
 * RepoCard Component
 *
 * Display GitHub repository with stats.
 * Composes StatCard primitive with GitHub-specific additions.
 */
import StatCard from '../primitives/StatCard.astro';
import LanguageDot from '../primitives/LanguageDot.astro';

interface Props {
  name: string;
  description?: string;
  url: string;
  language?: string;
  stars?: number;
  forks?: number;
  class?: string;
}

const {
  name,
  description,
  url,
  language,
  stars = 0,
  forks = 0,
  class: className,
} = Astro.props;
---

<StatCard
  title={name}
  href={url}
  external={true}
  class:list={['repo-card', className]}
>
  <Fragment slot="subtitle">
    {description}
  </Fragment>

  <Fragment slot="stats">
    {language && <LanguageDot language={language} />}
    <span class="repo-stats">
      {stars > 0 && (
        <span class="stat">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
          </svg>
          {stars}
        </span>
      )}
      {forks > 0 && (
        <span class="stat">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
          </svg>
          {forks}
        </span>
      )}
    </span>
  </Fragment>
</StatCard>

<style>
  .repo-stats {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .stat svg {
    opacity: 0.5;
  }
</style>
```

**Step 2: Test open-source page renders correctly**

Run: `npm run dev`
Navigate to: `/open-source`
Expected: Repos display correctly with same visual appearance

**Step 3: Commit**

```bash
git add src/components/blocks/RepoCard.astro
git commit -m "refactor: RepoCard to compose StatCard primitive"
```

---

### Task 8: Refactor EducationCard to use TimelineEntry

**Files:**
- Modify: `src/components/blocks/EducationCard.astro`

**Step 1: Refactor EducationCard to compose TimelineEntry**

```astro
---
/**
 * EducationCard Component
 *
 * Display education entry with dates and details.
 * Composes TimelineEntry primitive.
 */
import TimelineEntry from '../primitives/TimelineEntry.astro';

interface Supervisor {
  name: string;
  url?: string;
}

interface Thesis {
  title: string;
  url?: string;
}

interface Props {
  startYear: string | number;
  endYear: string | number;
  degree: string;
  field: string;
  institution: string;
  institutionUrl?: string;
  supervisors?: Supervisor[];
  grade?: string;
  thesis?: Thesis;
}

const {
  startYear,
  endYear,
  degree,
  field,
  institution,
  institutionUrl,
  supervisors,
  grade,
  thesis
} = Astro.props;

const dateRange = `${startYear} – ${endYear}`;
---

<TimelineEntry date={dateRange} class="education-card">
  <p class="education-title"><strong>{degree} in {field}</strong></p>
  <p class="education-institution">
    {institutionUrl ? (
      <a href={institutionUrl}>{institution}</a>
    ) : (
      institution
    )}
  </p>
  {supervisors && supervisors.length > 0 && (
    <p class="education-details">
      Supervisors: {supervisors.map((sup, i) => (
        <>
          {sup.url ? <a href={sup.url}>{sup.name}</a> : sup.name}
          {i < supervisors.length - 1 && ', '}
        </>
      ))}
    </p>
  )}
  {grade && (
    <p class="education-details">Grade: {grade}</p>
  )}
  {thesis && (
    <a href={thesis.url} class="thesis-link">Thesis: {thesis.title}</a>
  )}
</TimelineEntry>

<style>
  .education-title {
    margin: 0 0 var(--space-1);
    font-size: var(--font-size-base);
  }

  .education-institution {
    font-size: var(--font-size-sm);
    margin: 0 0 var(--space-1);
  }

  .education-institution a {
    color: var(--color-text-secondary);
    background: none;
  }

  .education-institution a:hover {
    color: var(--color-accent);
  }

  .education-details {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin: var(--space-1) 0 0;
  }

  .thesis-link {
    display: inline-block;
    font-size: var(--font-size-sm);
    color: var(--color-accent);
    background: none;
    margin-top: var(--space-1);
  }
</style>
```

**Step 2: Test homepage education section**

Run: `npm run dev`
Navigate to: `/` (homepage)
Expected: Education section displays correctly

**Step 3: Commit**

```bash
git add src/components/blocks/EducationCard.astro
git commit -m "refactor: EducationCard to compose TimelineEntry primitive"
```

---

### Task 9: Refactor TeachingCard to use TimelineEntry

**Files:**
- Modify: `src/components/blocks/TeachingCard.astro`

**Step 1: Refactor TeachingCard to compose TimelineEntry**

```astro
---
/**
 * TeachingCard Component
 *
 * Display course/teaching information.
 * Composes TimelineEntry primitive.
 */
import TimelineEntry from '../primitives/TimelineEntry.astro';
import ActionLink from '../primitives/ActionLink.astro';

interface Props {
  title: string;
  role: string;
  institution: string;
  semester: string;
  year?: string | number;
  description?: string;
  materials?: string;
  class?: string;
}

const {
  title,
  role,
  institution,
  semester,
  year,
  description,
  materials,
  class: className,
} = Astro.props;

const displaySemester = year ? `${semester} ${year}` : semester;
---

<TimelineEntry date={displaySemester} class:list={['teaching-card', className]}>
  <h3 class="teaching-title hover-title">{title}</h3>
  <div class="teaching-meta">
    <span class="teaching-role">{role}</span>
    <span class="teaching-institution">{institution}</span>
  </div>
  {description && <p class="teaching-description">{description}</p>}

  <Fragment slot="links">
    {materials && <ActionLink href={materials} label="Materials" icon="external" />}
  </Fragment>
</TimelineEntry>

<style>
  .teaching-title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    margin: 0 0 var(--space-2);
  }

  .teaching-meta {
    display: flex;
    gap: var(--space-2);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2);
  }

  .teaching-role {
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
  }

  .teaching-role::after {
    content: '·';
    margin-left: var(--space-2);
    color: var(--color-text-muted);
  }

  .teaching-description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
    line-height: var(--line-height-normal);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/blocks/TeachingCard.astro
git commit -m "refactor: TeachingCard to compose TimelineEntry primitive"
```

---

### Task 10: Update Primitives Index Export

**Files:**
- Modify: `src/components/primitives/index.ts` (create if doesn't exist)

**Step 1: Create or update primitives index**

Check if file exists first, then create:

```typescript
// Primitives - reusable building blocks
export { default as TimelineEntry } from './TimelineEntry.astro';
export { default as MediaCard } from './MediaCard.astro';
export { default as StatCard } from './StatCard.astro';
export { default as ListItem } from './ListItem.astro';
export { default as AuthorList } from './AuthorList.astro';
export { default as LanguageDot } from './LanguageDot.astro';

// Existing primitives
export { default as ActionLink } from './ActionLink.astro';
export { default as Card } from './Card.astro';
export { default as ViewDate } from './ViewDate.astro';
export { default as ViewDot } from './ViewDot.astro';
export { default as ViewLinks } from './ViewLinks.astro';
export { default as ViewTags } from './ViewTags.astro';
export { default as ViewYearHeader } from './ViewYearHeader.astro';
```

**Step 2: Commit**

```bash
git add src/components/primitives/index.ts
git commit -m "add: primitives index export"
```

---

## Phase 3: Cleanup and Documentation

### Task 11: Remove Duplicate Code from Old Card Primitive

**Files:**
- Review: `src/components/primitives/Card.astro`

**Step 1: Check if Card.astro is still needed**

The existing `Card.astro` may now be redundant since `StatCard` provides similar functionality. Review usage and either:
- Keep it if still used by other components
- Deprecate it with a comment pointing to new primitives

**Step 2: Add deprecation comment if appropriate**

If Card.astro is only used by RepoCard (which now uses StatCard), add:

```astro
---
/**
 * @deprecated Use StatCard or MediaCard primitives instead.
 * This component is kept for backwards compatibility.
 */
// ... rest of component
```

**Step 3: Commit**

```bash
git add src/components/primitives/Card.astro
git commit -m "docs: mark Card primitive as deprecated"
```

---

### Task 12: Final Build and Test

**Step 1: Run full build**

```bash
npm run build
```

Expected: Build completes without errors

**Step 2: Run dev server and test all pages**

```bash
npm run dev
```

Test pages:
- `/` - Homepage (publications, education)
- `/publications` - Publications page
- `/open-source` - Repos page
- `/cv` - CV page

Expected: All pages render correctly with same visual appearance as before

**Step 3: Final commit**

```bash
git add -A
git commit -m "refactor: complete design primitives migration"
```

---

## Summary

**Created Primitives:**
1. `TimelineEntry` - Date-aligned content
2. `MediaCard` - Card with optional image
3. `StatCard` - Card with stats
4. `ListItem` - Simple list item
5. `AuthorList` - Author names with highlighting
6. `LanguageDot` - Language indicator with color

**Refactored Components:**
1. `PaperCard` → uses `MediaCard`
2. `RepoCard` → uses `StatCard`
3. `EducationCard` → uses `TimelineEntry`
4. `TeachingCard` → uses `TimelineEntry`

**Benefits:**
- DRY: Common patterns extracted to primitives
- Composable: Specialized components extend primitives
- Consistent: All use `.hover-item` global pattern
- Maintainable: Changes to primitives cascade to all users
