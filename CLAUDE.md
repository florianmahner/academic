# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

This is a personal academic website built with Astro v5. The site uses static site generation with no framework integrations (pure Astro components).

### Key Configuration Files

- `src/config.ts` - Central site configuration (name, social links, navigation, theme colors, feature toggles). This is the main file to modify for site customization.
- `astro.config.mjs` - Astro configuration with sitemap integration

### Content Structure

Content is managed through JSON files in `src/content/`:
- `publications.json` - Publication entries with metadata (title, authors, year, links, preview images)
- `repositories.json` - GitHub repositories for open source page
- `education.json` - Academic background entries
- `misc.json` - Miscellaneous content

The site also supports BibTeX: `src/content/papers.bib` can be used as an alternative to `publications.json`. The `src/lib/bibtex.ts` utility handles parsing.

### Layout System

- `src/layouts/BaseLayout.astro` - Main layout wrapper with three navigation modes: `inline`, `floating-icon`, `minimal` (controlled via `config.navigationMode`)
- Navigation mode affects content positioning and mobile behavior

### Pages

All pages in `src/pages/`:
- `index.astro` - Homepage with profile, selected publications, education
- `publications.astro` - Full publications list
- `open-source.astro` - GitHub repositories
- `misc.astro` - Miscellaneous content

### Styling

- `src/styles/global.css` - Global styles and component classes
- `src/styles/variables.css` - CSS custom properties (spacing, typography scales)
- `src/styles/colors.css` - Theme colors (light/dark mode)
- `src/styles/typography.css` - Font definitions

Theme colors and fonts are configurable in `src/config.ts` under the `theme` object.

### Components

- `ThemeToggle.astro` - Dark/light mode toggle
- `AnimationInit.astro` - GSAP scroll animations (controlled by `config.features.animations`)
- `StructuredData.astro` - JSON-LD for SEO

### Feature Flags

In `src/config.ts`, the `features` object enables/disables:
- `selectedPublications` - Show selected papers on homepage
- `education` - Show academic background on homepage
- `darkMode` - Enable theme toggle
- `animations` - Enable GSAP scroll animations
