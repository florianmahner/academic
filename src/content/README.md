# Content Directory

All your website content lives here. Users only edit files in this folder - no code changes needed!

## Quick Overview

| Content Type | Location | How to Edit |
|-------------|----------|-------------|
| **Talks** | `talks.md` | Edit frontmatter items |
| **Teaching** | `teaching.md` | Edit frontmatter items |
| **Misc/Tools** | `misc.md` | Edit frontmatter items |
| **Blog posts** | `blog/*.md` | Create markdown files |
| **Projects** | `projects/*.md` | Create markdown files |
| **Publications** | `papers.bib` | Edit BibTeX file |
| **About page** | `pages/about.md` | Edit markdown |
| **CV data** | `cv.json` | Edit JSON |

## How It Works

### Single File = Simple List

Create `{name}.md` with items in frontmatter → route auto-created at `/{name}`

Example `talks.md`:
```yaml
---
title: "Talks & Presentations"
view: timeline
style: alternating
groupBy: year

items:
  - date: 2024-06-15
    title: "My Keynote"
    event: "Conference 2024"
    location: "City, Country"

  - date: 2023-11-20
    title: "Workshop Talk"
    event: "Workshop 2023"
---

Optional intro text appears below the list.
```

### Folder = Many Items

Create `{name}.md` + `{name}/` folder → items loaded from folder

```
blog.md          # Config (view, title, etc.)
blog/            # Items loaded automatically
├── post1.md
├── post2.md
└── post3.md
```

## View Types

Set `view:` in frontmatter:

- **timeline** - Chronological with year groups (talks, teaching)
- **grid** - Card layout (tools, resources)
- **minimal** - Clean compact list
- **showcase** - Featured items with badges (projects)

### Timeline Styles

Set `style:` when using timeline view:

- **alternating** - Items alternate left/right (good for talks)
- **strip** - Simple vertical line (good for teaching)
- **classic** - Elegant gradient line
- **minimal** - No decoration

## Creating a New Collection

Just create a file! Example `src/content/awards.md`:

```yaml
---
title: "Awards & Honors"
view: timeline
style: classic
groupBy: year

items:
  - date: 2024-05-01
    title: "Best Paper Award"
    event: "Conference 2024"
---
```

Route `/awards` is automatically created!

## Content With Detail Pages

For content needing individual pages (blog, projects), add files to the folder:

### Blog Post (`blog/my-post.md`)
```yaml
---
title: "Post Title"
date: 2024-01-15
tags: ["research", "tutorial"]
---

Your blog post content...
```

### Project (`projects/my-project.md`)
```yaml
---
title: "Project Name"
description: "What it does"
technologies: ["Python", "React"]
github: "https://github.com/user/repo"
status: active
---

Project details...
```

## Data Files

- `papers.bib` - Publications (BibTeX format)
- `cv.json` - Professional experience
- `education.json` - Academic background
- `repositories.json` - GitHub repos
