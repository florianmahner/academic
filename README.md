# Academic Website Template

A modern, customizable academic website template built with [Astro](https://astro.build). Features **4 distinctive theme presets**, flexible navigation, BibTeX support, and a centralized configuration system.

## Theme Presets

Choose from four distinctive visual identities:

### Monograph (Default)
Scholarly elegance with warm cream tones and classic serif typography.
- **Fonts**: Crimson Pro, Space Grotesk
- **Colors**: Warm cream background, crimson accents

### Brutalist
Bold, raw design with extreme typographic contrast.
- **Fonts**: Bricolage Grotesque, IBM Plex Sans
- **Colors**: Black/white with orange accents

### Softwave
Modern and approachable with soft shadows and rounded elements.
- **Fonts**: Plus Jakarta Sans, Fira Code
- **Colors**: Cool white, violet-blue accents

### Terminal
Hacker aesthetic with IDE-inspired colors.
- **Fonts**: Space Grotesk, JetBrains Mono
- **Colors**: Deep space dark, cyan glow

## Features

- **4 theme presets** - Distinctive designs, not generic AI aesthetics
- **4 navigation modes** - Inline, minimal, floating-icon, sidebar
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
    middle: "",
    last: "Name",
  },

  // Professional title
  title: "PhD Candidate in ...",

  // Contact & social
  email: "you@example.com",
  social: {
    github: "username",
    scholar: "SCHOLAR_ID",
    linkedin: "username",
    twitter: "",
    orcid: "",
  },

  // Enable/disable sections
  sections: {
    publications: true,
    opensource: true,
    cv: true,
    projects: true,
    teaching: true,
    blog: true,
    misc: true,
  },

  // Navigation
  navigation: {
    mode: "inline", // "inline" | "minimal" | "floating-icon" | "sidebar"
    items: [
      { id: "about", label: "About", href: "/" },
      // ... add more pages
    ],
  },

  // Theme System
  theme: {
    preset: "monograph", // "monograph" | "brutalist" | "softwave" | "terminal"
    colorMode: {
      default: "system", // "light" | "dark" | "system"
      enableToggle: true,
    },
    overrides: {
      // Optional: override preset values
      colors: {
        accent: undefined, // e.g., "#8B2332"
        accentDark: undefined,
      },
      layout: {
        contentWidth: "750px",
      },
    },
  },

  // Motion & Animations
  motion: {
    enabled: true,
    reduceMotion: "respect-system",
    pageTransitions: true,
    staggerAnimations: true,
  },
};
```

## Navigation Modes

### Inline
Traditional horizontal navigation at the top of the page.

### Minimal
Compact fixed top bar that hides on scroll down, shows on scroll up.

### Floating-icon
Fixed circular button in the bottom-right corner that opens a popup menu.

### Sidebar
Vertical navigation on the left side with content on the right.

## Content Files

### Publications (BibTeX)

Edit `src/content/papers.bib`:

```bibtex
@article{yourname2024paper,
  title = {Your Paper Title},
  author = {Your Name and Coauthor},
  journal = {Journal Name},
  year = {2024},
  pdf = {https://link-to-pdf.pdf},
  html = {https://paper-webpage.com},
  preview = {/previews/paper.gif},
  selected = {true},
  abbr = {JNL}
}
```

### Other Content

- `src/content/education.json` - Academic background
- `src/content/cv.json` - Experience, skills, awards
- `src/content/projects.json` - Portfolio projects
- `src/content/teaching.json` - Courses
- `src/content/repositories.json` - Open source
- `src/content/blog/*.md` - Blog posts in Markdown

## Project Structure

```
src/
├── config.ts              # All site configuration
├── lib/
│   └── presets.ts         # Theme preset definitions
├── content/               # Content files (JSON, BibTeX, Markdown)
├── components/            # UI components
├── layouts/
│   └── BaseLayout.astro   # Main layout with navigation
├── pages/                 # Site pages
└── styles/
    ├── global.css         # Main stylesheet
    ├── variables.css      # CSS variable bridge
    └── presets/           # Theme preset CSS files
        ├── monograph.css
        ├── brutalist.css
        ├── softwave.css
        └── terminal.css
```

## Commands

| Command           | Action                                     |
| :---------------- | :----------------------------------------- |
| `npm install`     | Install dependencies                       |
| `npm run dev`     | Start dev server at `localhost:4321`       |
| `npm run build`   | Build production site to `./dist/`         |
| `npm run preview` | Preview production build locally           |

## Customization

### Changing Theme Preset

```typescript
theme: {
  preset: "brutalist", // Try different presets
}
```

### Override Accent Colors

```typescript
theme: {
  preset: "monograph",
  overrides: {
    colors: {
      accent: "#0066cc",     // Custom light mode accent
      accentDark: "#4da6ff", // Custom dark mode accent
    },
  },
}
```

### Change Navigation Style

```typescript
navigation: {
  mode: "sidebar", // Try sidebar navigation
}
```

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
