# 🎨 YAML Configuration System

The academic template now uses a **YAML-based configuration system** with full TypeScript type safety and runtime validation.

## ✨ Key Features

- **📝 Simple YAML syntax** - Edit `config.yaml` instead of TypeScript
- **🔒 Type-safe** - Full TypeScript support with auto-completion
- **✅ Validated** - Zod schema validation catches errors at build time
- **🔄 Backward compatible** - Existing code continues to work
- **📚 Well-documented** - Inline comments and comprehensive docs

## 🚀 Quick Start

### 1. Edit Configuration

Open `config.yaml` in the project root:

```yaml
name:
  first: Jane
  last: Smith
title: Assistant Professor
email: jane@university.edu

social:
  github: janesmith
  scholar: SCHOLAR_ID
  linkedin: ""  # Empty = hidden
  twitter: ""
  orcid: ""

theme:
  preset: editorial-newsreader
  accent_light: ""  # Optional custom color
```

### 2. Build & Deploy

```bash
npm run dev      # Start dev server
npm run build    # Build for production
```

That's it! The configuration is automatically loaded and validated.

## 📂 File Structure

```
academic-template/
├── config.yaml                    # Main configuration file
├── src/
│   ├── config.ts                  # Re-exports YAML config
│   └── lib/
│       └── config-loader.ts       # YAML loader + validation
└── docs/
    └── CONFIG.md                  # Detailed documentation
```

## 🎯 What's Configurable?

### Personal Information
- Name (first, middle, last)
- Professional title
- Institution/affiliation
- Email and avatar

### Social Links
- GitHub, Google Scholar, LinkedIn
- Twitter, ORCID, ResearchGate
- Empty string = hidden

### Site Settings
- URL, title, description
- Language and base path
- SEO metadata

### Navigation
- 3 modes: sidebar, floating, inline
- Custom menu items
- Auto-generation from pages

### Theme
- 6 typography presets
- Custom accent colors
- Light/dark mode

### Features
- Selected publications
- Education section
- Animations and settings panel

### Content
- About page bio
- Research interests
- Footer links

## 📖 Documentation

- **Quick guide**: This file
- **Full documentation**: [docs/CONFIG.md](docs/CONFIG.md)
- **Schema reference**: [src/lib/config-loader.ts](src/lib/config-loader.ts)

## 🔧 Advanced Usage

### TypeScript Import

```typescript
import { config } from "./config";

// Fully typed!
const name = config.name.first;
const theme = config.theme.defaultPreset;
```

### Access Raw YAML

```typescript
import { rawConfig } from "./lib/config-loader";

// Original YAML structure
console.log(rawConfig.theme.accent_light);
```

### Environment Variables

```bash
# Override settings for deployment
SITE_BASE=/academic/ npm run build
```

## ✅ Benefits Over TypeScript Config

| Feature | TypeScript | YAML |
|---------|-----------|------|
| **Syntax** | Complex | Simple |
| **Comments** | Limited | Full support |
| **Validation** | Compile-time only | Build-time + Runtime |
| **Non-developers** | ❌ Hard | ✅ Easy |
| **Type safety** | ✅ Yes | ✅ Yes (via Zod) |
| **Hot reload** | ❌ No | ✅ Yes |

## 🐛 Troubleshooting

### Build Error: "config.yaml not found"

**Solution:** Ensure `config.yaml` exists in the project root (same level as `package.json`).

### Validation Error

```
❌ Invalid configuration: email: Invalid email format
```

**Solution:** Check the error message and fix the corresponding field in `config.yaml`. The error message tells you exactly what's wrong.

### Changes Not Reflected

1. Stop dev server (`Ctrl+C`)
2. Delete cache: `rm -rf .astro`
3. Restart: `npm run dev`

## 📦 Dependencies

- **js-yaml**: Parse YAML files
- **zod**: Runtime schema validation
- **@types/js-yaml**: TypeScript types

All installed automatically with `npm install`.

## 🎓 Examples

### Minimal Setup

```yaml
name:
  first: Jane
  last: Smith
title: Researcher
email: jane@example.com

site:
  url: https://janesmith.com
  title: Jane Smith
  description: Personal website

navigation:
  mode: sidebar
  items:
    - id: about
      label: About
      href: /

theme:
  preset: modern-geist

about:
  bio: I am a researcher.
  research_interests: My research focuses on...
```

### With Custom Styling

```yaml
theme:
  preset: editorial-newsreader
  accent_light: "#c41e3a"  # Harvard crimson
  accent_dark: "#ff4d6a"   # Lighter red for dark mode

features:
  dark_mode: true
  animations: true
  settings_panel: true
```

### Multiple Social Links

```yaml
social:
  github: janesmith
  scholar: ABC123XYZ
  linkedin: janesmith
  twitter: jane_research
  orcid: 0000-0001-2345-6789
  researchgate: Jane_Smith
```

## 📚 Content Collections

The template supports structured content types with automatic routing and rendering:

### Available Collections

| Collection | Directory | Description |
|------------|-----------|-------------|
| **blog** | `src/content/blog/` | Blog posts with tags, dates |
| **publications** | `src/content/publications/` | Academic papers, articles |
| **projects** | `src/content/projects/` | Portfolio/research projects |
| **talks** | `src/content/talks/` | Presentations, conferences |
| **teaching** | `src/content/teaching/` | Courses, teaching experience |
| **pages** | `src/content/pages/` | Custom pages (about, cv) |

### Creating Content

Each content file is a Markdown file with YAML frontmatter:

```markdown
---
title: "My Research Project"
description: "A comprehensive ML framework"
date: 2024-01-15
tags: ["machine-learning", "pytorch"]
github: "https://github.com/user/project"
featured: true
status: "active"
---

# Project Description

Your markdown content here...
```

### Generated Routes

| Collection | URL Pattern |
|------------|-------------|
| blog | `/blog/`, `/blog/[slug]/` |
| publications | `/publications/` |
| projects | `/projects/`, `/projects/[slug]/` |
| talks | `/talks/`, `/talks/[slug]/` |
| teaching | `/teaching/`, `/teaching/[slug]/` |
| pages | `/[slug]/` (e.g., `/about/`, `/cv/`) |

### Schema Validation

All content is validated against Zod schemas defined in `src/content/config.ts`. Run the build to catch validation errors:

```bash
npm run build
```

## 🔐 Security

- ❌ Never commit secrets or API keys
- ✅ Use environment variables for sensitive data
- ✅ Keep `config.yaml` in version control (it's not sensitive)

## 🤝 Migration Guide

If you have an existing TypeScript config:

1. **Keep your old config** - It still works!
2. **Copy values to `config.yaml`** - Transfer your settings
3. **Test thoroughly** - Run `npm run build`
4. **Remove old config** - Delete custom values from `src/config.ts`

The system is fully backward compatible, so you can migrate gradually.

## 📚 Learn More

- **Full config reference**: [docs/CONFIG.md](docs/CONFIG.md)
- **Zod schema**: [src/lib/config-loader.ts](src/lib/config-loader.ts)
- **Example config**: [config.yaml](config.yaml)

## 💡 Tips

1. Use **YAML comments** (`#`) liberally
2. Set unused fields to `""` instead of deleting them
3. Run `npm run build` to validate after changes
4. Check the dev server console for validation errors
5. Keep `config.yaml` organized with the existing structure

---

**Need help?** Check the [full documentation](docs/CONFIG.md) or open an issue on GitHub.
