# Content Directory

This directory contains your content organized in a simple structure.

## Quick Overview

| Content Type | Location | How to Edit |
|-------------|----------|-------------|
| **Blog posts** | `src/content/blog/` | Create `.md` files |
| **Projects** | `src/content/projects/` | Create `.md` files |
| **Publications** | `src/content/papers.bib` | Edit BibTeX file |
| **Talks** | `src/pages/talks.md` | Edit frontmatter items |
| **Teaching** | `src/pages/teaching.md` | Edit frontmatter items |
| **Misc/Tools** | `src/pages/misc.md` | Edit frontmatter items |
| **About page** | `src/content/pages/about.md` | Edit markdown |
| **CV data** | `src/content/cv.json` | Edit JSON |
| **Education** | `src/content/education.json` | Edit JSON |

## Creating Simple List Pages

For pages that just list items (talks, teaching, tools), use markdown files in `src/pages/` with frontmatter configuration:

```markdown
---
layout: ~/layouts/Layout.astro
template: list
title: "Page Title"
description: "Page description"

# View Configuration
view: timeline    # Options: timeline, grid, minimal, showcase
groupBy: year     # Group items by year
showDate: true
dateFormat: short

# Your Items
items:
  - date: 2024-01-15
    title: "Item Title"
    description: "Item description"
    # Add any other fields your view needs
---

Optional markdown content below the list.
```

## View Types

- **timeline** - Chronological list grouped by year, great for talks/news
- **grid** - Card layout, great for tools/resources
- **minimal** - Clean compact list
- **showcase** - Featured items with status badges, great for projects

## Content Collections (with detail pages)

For content that needs individual pages (like blog posts and projects):

### Blog Posts (`src/content/blog/`)

```markdown
---
title: "Post Title"
description: "Brief description"
date: 2024-01-15
tags: ["tag1", "tag2"]
draft: false
image: "/images/post-image.jpg"  # Optional
---

Your blog post content here...
```

### Projects (`src/content/projects/`)

```markdown
---
title: "Project Name"
description: "What it does"
technologies: ["Python", "React"]
github: "https://github.com/user/repo"
status: active  # active, completed, archived, wip
featured: true
---

Detailed project description...
```

## JSON Data Files

- `cv.json` - Professional experience for the CV page
- `education.json` - Academic background shown on homepage
- `repositories.json` - GitHub repos for Open Source page

## Publications (`papers.bib`)

Add publications in BibTeX format. Special fields:
- `selected = true` - Show on homepage
- `abbr` - Conference abbreviation badge
- `preview` - Thumbnail image path
- `pdf`, `code`, `html` - Resource links
