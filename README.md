# Academic Website Template

A minimal, modern academic website template built with [Astro](https://astro.build). Features clean typography, scroll animations, BibTeX support, and a centralized configuration system.

## Features

- **Single config file** - All settings in `src/config.ts`
- **Clean minimal design** - Swiss-style typography and layout
- **BibTeX support** - Manage publications in standard `.bib` format
- **Dark mode** - Automatic theme switching with manual toggle
- **GSAP animations** - Smooth scroll-triggered animations
- **Fully responsive** - Mobile-first design
- **SEO optimized** - Structured data, sitemap, meta tags
- **Optional sections** - Enable/disable CV, Projects, Teaching, Blog

## Quick Start

```bash
# Clone or use as template
git clone https://github.com/florianmahner/academic.git my-website
cd my-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Site available at http://localhost:4321

## Configuration

Edit `src/config.ts` to customize your site:

```typescript
export const config = {
  // Your name
  name: {
    first: "Your",
    middle: "", // optional
    last: "Name",
  },

  // Professional title
  title: "PhD Candidate in ...",

  // Contact & social
  email: "you@example.com",
  social: {
    github: "username",
    scholar: "SCHOLAR_ID", // Google Scholar ID
    linkedin: "username",
    twitter: "", // leave empty to hide
    orcid: "",
  },

  // Enable/disable sections
  sections: {
    publications: true,
    opensource: true,
    misc: true,
    cv: true,
    projects: true,
    teaching: true,
    blog: true,
  },

  // Theme customization
  theme: {
    accentLight: "#2563eb", // accent color in light mode
    accentDark: "#60a5fa",  // accent color in dark mode
    fonts: {
      body: "Source Sans 3",
      heading: "Source Sans 3",
      ui: "Inter",
      mono: "JetBrains Mono",
    },
    contentWidth: "750px",
  },

  // Navigation style: "inline" | "minimal" | "floating-icon"
  navigationMode: "inline",

  // Feature toggles
  features: {
    selectedPublications: true, // show on homepage
    education: true,            // show on homepage
    darkMode: true,
    animations: true,
  },
};
```

## Content Files

### Publications (BibTeX)

Edit `src/content/papers.bib` to add publications:

```bibtex
@article{yourname2024paper,
  title = {Your Paper Title},
  author = {Your Name and Coauthor Name},
  journal = {Journal Name},
  year = {2024},
  % Custom fields for website:
  pdf = {https://link-to-pdf.pdf},
  html = {https://paper-webpage.com},
  preview = {/previews/paper.gif},
  selected = {true},  % show on homepage
  abbr = {JNL}        % abbreviation shown in list
}
```

### Education

Edit `src/content/education.json`:

```json
{
  "education": [
    {
      "degree": "PhD",
      "field": "Computer Science",
      "institution": "University Name",
      "institutionUrl": "https://university.edu",
      "startYear": 2020,
      "endYear": 2024,
      "supervisors": [
        { "name": "Prof. Name", "url": "https://professor.com" }
      ],
      "thesis": {
        "title": "Thesis Title",
        "url": "/pdf/thesis.pdf"
      }
    }
  ]
}
```

### CV

Edit `src/content/cv.json` for experience, skills, and awards:

```json
{
  "experience": [
    {
      "title": "Position Title",
      "organization": "Company/University",
      "location": "City, Country",
      "startDate": "2020",
      "endDate": "Present",
      "description": "Role description",
      "highlights": ["Achievement 1", "Achievement 2"]
    }
  ],
  "skills": {
    "Programming": ["Python", "PyTorch"],
    "Languages": ["English (Native)"]
  },
  "awards": [
    { "title": "Award Name", "issuer": "Organization", "year": "2024" }
  ]
}
```

### Projects

Edit `src/content/projects.json`:

```json
{
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description",
      "tags": ["Python", "ML"],
      "url": "https://github.com/you/project",
      "featured": true
    }
  ]
}
```

### Teaching

Edit `src/content/teaching.json`:

```json
{
  "courses": [
    {
      "title": "Course Name",
      "role": "Instructor",
      "institution": "University",
      "semester": "Fall 2024",
      "description": "Course description",
      "materials": "https://course-website.edu"
    }
  ]
}
```

### Open Source

Edit `src/content/repositories.json`:

```json
{
  "github_user": "yourusername",
  "repositories": [
    {
      "name": "repo-name",
      "owner": "yourusername",
      "description": "Description",
      "url": "https://github.com/yourusername/repo-name",
      "language": "Python",
      "stars": 100,
      "forks": 20,
      "featured": true
    }
  ]
}
```

### Blog Posts

Add Markdown files to `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "Brief description"
date: 2024-01-15
tags: ["machine-learning", "research"]
draft: false
---

Your content here...
```

## Project Structure

```
src/
├── config.ts              # All site configuration
├── content/
│   ├── papers.bib         # Publications (BibTeX)
│   ├── education.json     # Academic background
│   ├── cv.json            # CV data
│   ├── projects.json      # Portfolio projects
│   ├── teaching.json      # Courses
│   ├── repositories.json  # Open source
│   ├── misc.json          # Tools/resources
│   └── blog/              # Blog posts (Markdown)
├── lib/                   # Utility functions
├── components/            # UI components
├── layouts/
│   └── BaseLayout.astro   # Main page wrapper
├── pages/                 # Site pages
└── styles/                # CSS styles
```

## Commands

| Command           | Action                                     |
| :---------------- | :----------------------------------------- |
| `npm install`     | Install dependencies                       |
| `npm run dev`     | Start dev server at `localhost:4321`       |
| `npm run build`   | Build production site to `./dist/`         |
| `npm run preview` | Preview production build locally           |

## Customization

### Colors

Change accent colors in `src/config.ts`:

```typescript
theme: {
  accentLight: "#0066cc", // blue accent
  accentDark: "#4da6ff",
}
```

### Fonts

Change fonts (loaded from Google Fonts):

```typescript
fonts: {
  body: "Lora",
  heading: "Playfair Display",
  ui: "Inter",
  mono: "Fira Code",
}
```

### Navigation Style

Choose from three navigation modes:

- `"inline"` - Traditional horizontal nav at top
- `"minimal"` - Compact top bar
- `"floating-icon"` - Floating hamburger menu

## Deployment

### GitHub Pages

The template includes a GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Go to repo Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to `master` branch to trigger deployment

### Other Platforms

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting (Netlify, Vercel, etc.)

## Technologies

- [Astro 5](https://astro.build) - Static site generator
- [GSAP](https://gsap.com) - Scroll animations
- [bibtex-parse](https://www.npmjs.com/package/bibtex-parse) - BibTeX parsing
- Google Fonts - Typography

## License

MIT License - feel free to use this template for your own website.
