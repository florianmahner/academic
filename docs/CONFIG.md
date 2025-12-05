# Configuration Guide

The academic template uses a YAML-based configuration system that provides type safety and validation while keeping configuration simple and readable.

## Quick Start

Edit `config.yaml` in the project root to customize your website:

```yaml
name:
  first: Jane
  last: Smith
title: Assistant Professor
email: jane@university.edu
```

## Configuration File

All website configuration is in `/config.yaml`. This file is validated at build time to ensure correctness.

### Personal Information

```yaml
name:
  first: Jane
  middle: M          # Optional
  last: Smith

title: Assistant Professor of Computer Science

institution:
  name: MIT
  url: https://mit.edu

email: jane@mit.edu
avatar: /avatar.jpg  # Path relative to public/ folder
```

### Social Links

Leave any field empty (`""`) to hide that social link:

```yaml
social:
  github: janesmith
  scholar: SCHOLAR_ID
  linkedin: janesmith
  twitter: janesmith_cs
  orcid: 0000-0001-2345-6789
  researchgate: ""    # Empty = hidden
```

### Site Metadata

```yaml
site:
  url: https://janesmith.com
  title: Jane Smith
  description: Personal academic website
  language: en
  base: /             # For subdirectory: /academic/
```

### Navigation

Three display modes available:

```yaml
navigation:
  mode: sidebar       # Options: sidebar, floating, inline

  items:
    - id: about
      label: About
      href: /
    - id: publications
      label: Publications
      href: /publications
```

**Navigation Modes:**
- `sidebar`: Fixed left sidebar (default)
- `floating`: Safari-style bottom pill that auto-hides
- `inline`: Traditional header navigation

### Theme

```yaml
theme:
  preset: editorial-newsreader
  accent_light: ""    # Optional color override
  accent_dark: ""     # Optional color override
```

**Available Presets:**
- `crimson-classic`: Harvard-inspired serif design
- `editorial-newsreader`: Editorial serif typography
- `modern-geist`: Clean sans-serif (Vercel-style)
- `classic-playfair`: Traditional academic serif
- `brutalist-space`: Bold monospace design
- `humanist-inter`: Friendly sans-serif

### Features

Enable/disable features:

```yaml
features:
  selected_publications: true   # Show featured papers
  education: true               # Show education section
  dark_mode: true               # Light/dark toggle
  animations: true              # GSAP scroll animations
  settings_panel: true          # Settings gear icon
```

### About Page

HTML is allowed for inline links:

```yaml
about:
  bio: |
    I am a researcher interested in <a href='https://example.com'>machine learning</a>.

  research_interests: |
    My research spans multiple areas including...
```

### Footer

```yaml
footer:
  copyright: true
  links:
    - label: Email
      href: mailto:jane@university.edu
    - label: CV
      href: /cv.pdf
```

## Type Safety

The configuration system uses Zod for runtime validation and TypeScript for compile-time type checking. Invalid configurations will fail at build time with helpful error messages.

### Schema Validation

If your configuration is invalid, you'll see detailed error messages:

```
❌ Configuration validation error:
- name.first: Required
- email: Invalid email format
- site.url: Invalid URL
```

## Migration from TypeScript Config

If you have an existing `src/config.ts` file, the system is backward compatible. The new config loader reads from `config.yaml` and maintains the same interface.

### Differences

**Old (config.ts):**
```typescript
export const config = {
  name: { first: "Jane", last: "Smith" },
  // ...
};
```

**New (config.yaml):**
```yaml
name:
  first: Jane
  last: Smith
```

The exported `config` object has the exact same structure, so all existing code continues to work.

## Environment-Specific Configuration

For deployment-specific settings, use environment variables in your build pipeline:

```bash
# GitHub Pages subdirectory
SITE_BASE=/academic/ npm run build
```

Then in `config.yaml`:
```yaml
site:
  base: ${SITE_BASE:-/}  # Default to / if not set
```

## Advanced Usage

### Accessing Raw YAML Config

```typescript
import { rawConfig } from "./lib/config-loader";

// Access the original YAML structure
console.log(rawConfig.theme.accent_light);
```

### Custom Validation

Extend the Zod schema in `src/lib/config-loader.ts`:

```typescript
const CustomSchema = ConfigSchema.extend({
  customField: z.string().optional(),
});
```

## Troubleshooting

### Config not found

```
❌ config.yaml not found
```

**Solution:** Create `config.yaml` in the project root (same level as `package.json`).

### Validation errors

```
❌ Invalid configuration: email: Invalid email
```

**Solution:** Check the error message and fix the corresponding field in `config.yaml`.

### Build fails after config change

1. Stop the dev server
2. Delete `.astro` cache: `rm -rf .astro`
3. Restart: `npm run dev`

## Best Practices

1. **Keep it simple**: Only configure what you need
2. **Use comments**: YAML supports `#` comments
3. **Empty strings**: Use `""` to hide optional fields
4. **Test locally**: Run `npm run build` to validate config
5. **Version control**: Commit `config.yaml` to your repository
6. **Sensitive data**: Never commit API keys or secrets

## Examples

### Minimal Configuration

```yaml
name:
  first: Jane
  last: Smith
title: Researcher
email: jane@example.com

social:
  github: janesmith
  scholar: ""
  linkedin: ""
  twitter: ""
  orcid: ""

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

features:
  selected_publications: true
  dark_mode: true
  animations: false

about:
  bio: I am a researcher.
  research_interests: My research focuses on...

footer:
  copyright: true
  links: []
```

### Full Configuration

See the default `config.yaml` for a complete example with all available options.

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/yourusername/academic-template/issues)
- Review the [example config.yaml](../config.yaml)
- See the [Zod schema](../src/lib/config-loader.ts) for all available options
