# Academic Template Cleanup Plan

## Overview

This document outlines the recommended cleanup steps based on a comprehensive code review. The goal is to reduce complexity while maintaining all current functionality.

**Current State:**
- node_modules: 628MB
- Security vulnerabilities: 22
- Unused functions: 17
- Config complexity: High (dual YAML/TS system)

**Target State:**
- node_modules: ~350MB (-44%)
- Security vulnerabilities: 0
- Unused functions: 0
- Config complexity: Simplified

---

## Configuration Approach Decision

### Option A: Keep YAML (Recommended for Non-Technical Users)

**Pros:**
- YAML is more readable for academics unfamiliar with code
- No semicolons, brackets, or syntax errors to worry about
- Already working, just needs documentation fix

**Cons:**
- No IDE autocomplete
- Requires js-yaml dependency
- 300+ lines of transformation code

**Example:**
```yaml
name:
  first: Jane
  last: Doe

email: jane@university.edu
avatar: /photo.jpg

social:
  github: janesmith
  scholar: SCHOLAR_ID
```

### Option B: TypeScript Config (Recommended for Developers)

**Pros:**
- Full IDE autocomplete and type checking
- Compile-time error detection
- No transformation layer needed
- Follows Astro conventions

**Cons:**
- Requires basic TypeScript knowledge
- Syntax errors possible (missing commas, quotes)

**Example:**
```typescript
export const config = {
  name: {
    first: "Jane",
    last: "Doe",
  },

  email: "jane@university.edu",
  avatar: "/photo.jpg",

  social: {
    github: "janesmith",
    scholar: "SCHOLAR_ID",
  },
} as const;
```

### Recommendation: Keep YAML for Now

The target audience is academics, not developers. YAML is more approachable. Focus cleanup efforts elsewhere.

---

## Phase 1: Quick Wins (30 minutes)

### Step 1.1: Remove Unused npm Packages

These packages add 280MB and 22 security vulnerabilities but are never used:

```bash
npm uninstall resume-cli jsonresume-theme-elegant jsonresume-theme-even jsonresume-theme-stackoverflow gif-encoder-2 canvas
```

**Files affected:** `package.json`, `package-lock.json`
**Risk:** None - packages are not imported anywhere

### Step 1.2: Fix README Documentation

The README says to edit `src/config.ts` but users should edit `config.yaml`.

**File:** `README.md`
**Change:** Update all references from `src/config.ts` to `config.yaml`

### Step 1.3: Remove Stale Scripts

**Delete these files:**
- `scripts/optimize-gifs.sh` (contains hardcoded paths, replaced by WebP workflow)

**Keep but document:**
- `scripts/generate-webp-previews.mjs`
- `scripts/generate-webm-sample.mjs`

---

## Phase 2: Dead Code Removal (1-2 hours)

### Step 2.1: Remove Unused Functions from lib/blog.ts

**File:** `src/lib/blog.ts`

Remove these functions (not used anywhere):
- `getPostsByTag()` (lines 31-34)
- `getAllTags()` (lines 39-48)
- `getReadingTime()` (lines 64-68)

### Step 2.2: Remove Unused Functions from lib/updates.ts

**File:** `src/lib/updates.ts`

Remove these functions (not used anywhere):
- `getRecentUpdates()` (lines 113-116)
- `getUpdatesByType()` (lines 121-127)
- `getUpdatesByYear()` (lines 131-135)
- `getUpdatesInRange()` (lines 139-147)
- `groupUpdatesByMonth()` (lines 171-187)

### Step 2.3: Remove Unused Functions from lib/navigation.ts

**File:** `src/lib/navigation.ts`

Remove:
- `getBreadcrumbs()` (lines 134-146)
- `navigationConfig` object (lines 152-165)
- `scanPagesForNavigation()` (lines 179-183) - or implement it

Also remove unused imports at top of file.

### Step 2.4: Remove Unused Functions from lib/typography-presets.ts

**File:** `src/lib/typography-presets.ts`

Remove these functions (replaced by font-loader.ts):
- `getAllFonts()` (lines 310-316)
- `getFontUrl()` (lines 319-333)
- `getAllFontsUrl()` (lines 336-352)

### Step 2.5: Remove Unused Functions from lib/font-loader.ts

**File:** `src/lib/font-loader.ts`

Remove:
- `preloadPresetFonts()` (lines 110-121)
- `arePresetFontsLoaded()` (lines 129-131)
- `clearFontCache()` (lines 136-138)

### Step 2.6: Clean Up Console Logs

**File:** `src/pages/index.astro`

Convert `console.log()` to `console.warn()` or remove:
- Line 65: About page fallback message
- Lines 104, 117, 133: Collection availability messages

---

## Phase 3: Schema Simplification (2-3 hours)

### Step 3.1: Remove Legacy Layout System

**File:** `src/content/config.ts`

The old `layout`/`layoutConfig` system is completely unused. Remove:

1. Delete `LayoutTypeEnum` (line 9)
2. Remove `layout` and `layoutConfig` fields from:
   - `blog` schema (lines 28-29)
   - `projects` schema (lines 58-59)
   - `talks` schema (lines 81-82)
   - `teaching` schema (lines 107-108)
3. Remove `pageLayout` and `layoutConfig` from `collectionPages` (lines 212-214)

### Step 3.2: Consolidate Duplicate Fields

**File:** `src/content/config.ts`

In `projects` schema:
- Remove `url` field (line 44) - redundant with `website`

In `talks` schema:
- Remove `abstract` field (line 77) - redundant with `description`

### Step 3.3: Remove Rarely-Used Fields (Optional)

These fields add complexity but are rarely used:

In `projects` schema:
- `partners` (line 54) - can be in markdown content instead
- `funding` (line 55) - can be in markdown content instead

In `teaching` schema:
- `evaluations` (line 103) - not displayed anywhere
- `year` (line 95) - redundant with `date` + `semester`

---

## Phase 4: Date Formatting Consolidation (1 hour)

### Step 4.1: Create Unified Date Utils

Currently 5 files have their own `formatDate()` implementations. Consolidate into one.

**Create:** `src/lib/date-utils.ts`

```typescript
/**
 * Unified date formatting utilities
 */

export function formatDate(date: Date, format: 'short' | 'long' | 'year' | 'month-year' = 'long'): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    case 'year':
      return date.getFullYear().toString();
    case 'month-year':
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'long':
    default:
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}

export function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return '';
  if (start && !end) return `${start} – Present`;
  if (!start && end) return `Until ${end}`;
  return `${start} – ${end}`;
}
```

**Update these files to use the new utility:**
- `src/components/primitives/ViewDate.astro`
- `src/components/blocks/NewsTimeline.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/cv.astro`
- `src/lib/blog.ts`

---

## Phase 5: Reduce Default Navigation (5 minutes)

### Step 5.1: Simplify Default Navigation

**File:** `config.yaml`

Change default navigation from 10 items to 5:

```yaml
navigation:
  mode: sidebar
  items:
    - id: about
      label: About
      href: /
    - id: publications
      label: Publications
      href: /publications
    - id: projects
      label: Projects
      href: /projects
    - id: cv
      label: CV
      href: /cv
    - id: contact
      label: Contact
      href: /contact
```

Comment out the others with a note that users can re-enable them.

---

## Phase 6: Documentation Updates (1 hour)

### Step 6.1: Add Quick Start Guide

**Create:** `QUICKSTART.md`

```markdown
# 5-Minute Setup

1. Edit `config.yaml`: Add your name, email, institution
2. Replace `public/marie-curie.jpg` with your photo
3. Edit `src/content/pages/about.md` with your bio
4. Add your papers to `src/content/papers.bib`
5. Run `npm run dev` to preview

## Optional: Add More Content

- Blog posts: `src/content/blog/`
- Projects: `src/content/projects/`
- Talks: `src/content/talks/`
- Teaching: `src/content/teaching/`
```

### Step 6.2: Update README

- Fix `config.ts` → `config.yaml` references
- Add link to QUICKSTART.md at top
- Move advanced features (SPARC, MCP) to separate ADVANCED.md

---

## Verification Checklist

After each phase, verify:

```bash
# Build succeeds
npm run build

# Dev server works
npm run dev

# No TypeScript errors
npm run typecheck

# Lint passes (warnings OK)
npm run lint
```

---

## Summary of Changes

| Phase | Time | Impact |
|-------|------|--------|
| 1. Quick Wins | 30 min | -280MB, -22 vulns |
| 2. Dead Code | 1-2 hr | -17 functions, cleaner code |
| 3. Schema Simplification | 2-3 hr | -50+ lines, simpler schemas |
| 4. Date Utils | 1 hr | DRY, consistent formatting |
| 5. Navigation | 5 min | Better default UX |
| 6. Documentation | 1 hr | Clearer onboarding |

**Total estimated time:** 6-8 hours
**Risk level:** Low (all changes are removals or simplifications)

---

## What NOT to Change (Keep for Showcase)

Per your request, these stay as-is:
- All content pages (blog, projects, talks, teaching, news)
- Marie Curie example publications
- Example education and CV data
- All typography presets and themes
- Navigation modes (floating, sidebar, inline)
- Settings panel functionality
