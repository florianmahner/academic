# Academic Template User Guide

Welcome to the Academic Template! This guide will help you create and customize your professional academic website in minutes.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
- [Content Types](#content-types)
- [Customization](#customization)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Quick Start (5 Minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/academic-template.git my-website
cd my-website

# Install dependencies
npm install
```

### 2. Edit Your Configuration

Open `config.yaml` and update your personal information:

```yaml
name:
  first: Your
  last: Name
title: Your Professional Title
email: your.email@university.edu

site:
  url: https://yourusername.github.io
  title: Your Name
  description: Your professional tagline
```

### 3. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:4321** to see your site! 🎉

### 4. Add Your Content

- **Publications**: Edit files in `src/content/publications/`
- **Blog posts**: Add markdown files to `src/content/blog/`
- **Projects**: Edit files in `src/content/projects/`
- **About page**: Edit the `about` section in `config.yaml`

### 5. Validate and Build

```bash
# Check your configuration
npm run validate-config

# Build for production
npm run build
```

---

## Configuration Reference

All configuration is in **`config.yaml`** at the project root. The file is heavily commented to guide you.

### Personal Information

```yaml
name:
  first: Jane
  middle: M          # Optional
  last: Smith

title: Assistant Professor of Computer Science

institution:
  name: Center for Advanced Computational Research
  url: https://research.university.edu

email: jane.smith@university.edu
avatar: /avatar.jpg  # Place image in public/ folder
```

**Tips**:
- Middle name is optional
- Avatar should be square (e.g., 400x400px)
- Supported formats: JPG, PNG, WebP

### Social Links

Add your professional profiles:

```yaml
social:
  github: janesmith
  scholar: SCHOLAR_ID        # Google Scholar ID
  linkedin: janesmith
  twitter: janesmith_cs
  orcid: 0000-0001-2345-6789
  researchgate: ""           # Leave empty to hide
```

**Finding Your IDs**:
- **GitHub**: Your username
- **Google Scholar**: The ID in your profile URL after `user=`
- **ORCID**: Your full ORCID number (e.g., `0000-0001-2345-6789`)
- **LinkedIn**: The username in your profile URL

**Hide Links**: Set any field to `""` (empty string) to hide it from your site.

### Site Metadata

Configure SEO and site-wide settings:

```yaml
site:
  url: https://janesmith.com
  title: Jane Smith
  description: Personal academic website of Jane Smith - Research in machine learning and AI
  language: en
  base: /  # Change to /subdirectory/ for subdirectory deployments
```

**Important**:
- `url`: Your full website URL (required for SEO)
- `base`: Keep as `/` unless deploying to a subdirectory
- `description`: Used for SEO and social media previews

### Navigation

Choose from **3 navigation modes** and customize menu items:

```yaml
navigation:
  # Mode options: "floating", "sidebar", or "inline"
  mode: sidebar

  # Navigation items (order matters!)
  items:
    - id: about
      label: About
      href: /
    - id: publications
      label: Publications
      href: /publications
    - id: open-source
      label: Open Source
      href: /open-source
    - id: misc
      label: Misc
      href: /misc
```

**Navigation Modes**:

| Mode | Description | Best For |
|------|-------------|----------|
| `sidebar` | Fixed left sidebar | Desktop-first sites, many nav items |
| `floating` | Safari-style bottom pill (auto-hides) | Modern, minimal aesthetic |
| `inline` | Traditional header bar | Familiar, compact layout |

**All modes automatically switch to a hamburger menu on mobile!** 📱

### Theme System

Choose from **6 typography presets** and customize colors:

```yaml
theme:
  # Available presets:
  # - "crimson-classic" (Harvard-inspired serif)
  # - "editorial-newsreader" (Magazine editorial) ⭐ DEFAULT
  # - "modern-geist" (Vercel-style sans-serif)
  # - "classic-playfair" (Traditional high-contrast)
  # - "brutalist-space" (Bold geometric)
  # - "humanist-inter" (Warm, friendly)
  preset: editorial-newsreader

  # Optional: Override accent colors
  accent_light: ""  # e.g., "#c41e3a" (Harvard crimson)
  accent_dark: ""   # e.g., "#ff4d6a" (lighter for dark mode)
```

**Typography Presets Comparison**:

```
Crimson Classic     📚 Traditional academic serif
Editorial Newsreader 📰 Magazine editorial (DEFAULT)
Modern Geist        💻 Clean tech minimal
Classic Playfair    🎩 Elegant traditional
Brutalist Space     🔨 Bold contemporary
Humanist Inter      👥 Warm & friendly
```

**Custom Colors**: Leave empty (`""`) to use preset defaults, or add hex colors to override.

### Features

Enable or disable site features:

```yaml
features:
  selected_publications: true   # Show featured papers on homepage
  education: true               # Show education section on homepage
  dark_mode: true               # Enable light/dark mode toggle
  animations: true              # Enable GSAP scroll animations
  settings_panel: true          # Show settings gear icon (⚙️)
```

**Feature Details**:
- `selected_publications`: Shows papers marked with `selected: true`
- `education`: Displays degrees from `src/content/education.json`
- `dark_mode`: Adds theme toggle in navigation
- `animations`: Smooth fade-in effects on scroll
- `settings_panel`: Lets visitors try different typography presets

### About Page Content

Write your bio and research interests (HTML allowed for links):

```yaml
about:
  bio: |
    I am a researcher exploring the fascinating intersection of
    <a href='https://en.wikipedia.org/wiki/Computational_neuroscience'>computational neuroscience</a>
    and <a href='https://distill.pub'>interpretable machine learning</a>.

  research_interests: |
    My research interests span representation learning, cognitive modeling,
    and the philosophical implications of AI. I'm particularly interested in
    <a href='https://arxiv.org/abs/1706.03762'>transformer architectures</a>
    and their applications to natural language processing.
```

**Tips**:
- Use `|` for multi-line text
- Add links with `<a href='URL'>text</a>`
- Keep paragraphs concise for readability
- HTML entities work (e.g., `&mdash;` for em-dash)

### Footer

Customize footer content:

```yaml
footer:
  copyright: true  # Show "© 2024 Your Name"
  links:
    - label: Email
      href: mailto:jane.smith@university.edu
    - label: CV
      href: /cv.pdf
    - label: GitHub
      href: https://github.com/janesmith
```

---

## Content Types

The template supports **6 content types**, all using simple markdown files.

### Publications

**Location**: `src/content/publications/`

Publications use markdown files with frontmatter metadata. Each publication is a separate `.json` file.

**Example** (`src/content/publications/my-paper-2024.json`):

```json
{
  "title": "Attention Is All You Need",
  "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar"],
  "venue": "NeurIPS 2017",
  "year": 2017,
  "type": "inproceedings",
  "pdf": "https://arxiv.org/pdf/1706.03762.pdf",
  "code": "https://github.com/tensorflow/tensor2tensor",
  "selected": true,
  "preview": "/previews/attention.gif",
  "abbr": "NeurIPS"
}
```

**Frontmatter Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Paper title |
| `authors` | array | ✅ | List of author names |
| `year` | number | ✅ | Publication year |
| `venue` | string | ❌ | Conference or journal name |
| `type` | enum | ❌ | `article`, `inproceedings`, `preprint`, `thesis` |
| `pdf` | URL | ❌ | Link to PDF |
| `html` | URL | ❌ | Link to publisher page |
| `code` | URL | ❌ | Link to code repository |
| `slides` | URL | ❌ | Link to presentation slides |
| `selected` | boolean | ❌ | Show on homepage? (default: `false`) |
| `preview` | string | ❌ | Path to preview image/GIF |
| `abbr` | string | ❌ | Venue abbreviation badge |

**BibTeX Support**: You can also use `src/content/papers.bib` for BibTeX entries. The template automatically parses them!

```bibtex
@article{smith2024learning,
  title = {Deep Learning for Computer Vision},
  author = {Jane Smith and John Doe},
  journal = {Nature Machine Intelligence},
  year = {2024},
  pdf = {https://arxiv.org/pdf/2024.12345.pdf},
  selected = {true},
  preview = {/previews/paper.gif}
}
```

### Blog Posts

**Location**: `src/content/blog/`

Write blog posts in markdown with frontmatter:

**Example** (`src/content/blog/my-first-post.md`):

```markdown
---
title: Getting Started with Academic Websites
description: A guide to creating your professional academic presence online
date: 2024-12-01
tags: [web-development, academia, tutorial]
draft: false
---

# Getting Started

Your blog post content goes here...

## Headings

Use markdown syntax for formatting.

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

## Code Blocks

\`\`\`python
def hello_world():
    print("Hello, world!")
\`\`\`
```

**Frontmatter Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Post title |
| `date` | date | ✅ | Publication date (YYYY-MM-DD) |
| `description` | string | ❌ | Short summary (for SEO) |
| `tags` | array | ❌ | Topic tags |
| `draft` | boolean | ❌ | Hide from production? |
| `updated` | date | ❌ | Last updated date |
| `image` | string | ❌ | Hero image path |
| `imageAlt` | string | ❌ | Image alt text |

**Draft Posts**: Set `draft: true` to hide posts during development.

### Projects

**Location**: `src/content/projects/`

Showcase your research projects and software:

**Example** (`src/content/projects/neural-summarizer.json`):

```json
{
  "title": "Neural Text Summarizer",
  "description": "An extractive summarization system using BERT embeddings",
  "technologies": ["Python", "PyTorch", "BERT", "Flask"],
  "github": "https://github.com/janesmith/neural-summarizer",
  "demo": "https://summarizer.janesmith.com",
  "featured": true,
  "status": "active",
  "startDate": "2023-06-01"
}
```

**Frontmatter Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Project name |
| `description` | string | Short description |
| `technologies` | array | Tech stack |
| `tags` | array | Topic tags |
| `github` | URL | GitHub repository |
| `url` | URL | Project website |
| `demo` | URL | Live demo |
| `featured` | boolean | Highlight this project? |
| `status` | enum | `active`, `completed`, `archived` |
| `startDate` | date | Start date |
| `endDate` | date | End date (if completed) |

### Talks

**Location**: `src/content/talks/`

Document your conference presentations:

**Example** (`src/content/talks/neurips-2024.json`):

```json
{
  "title": "Advances in Transformer Architectures",
  "event": "NeurIPS 2024",
  "date": "2024-12-10",
  "location": "Vancouver, Canada",
  "type": "keynote",
  "slides": "https://slides.com/janesmith/neurips2024",
  "video": "https://youtube.com/watch?v=..."
}
```

**Frontmatter Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Talk title |
| `event` | string | Conference/event name |
| `date` | date | Presentation date |
| `location` | string | City, country |
| `type` | enum | `keynote`, `talk`, `workshop`, `poster`, `panel` |
| `slides` | URL | Link to slides |
| `video` | URL | Video recording |
| `abstract` | string | Talk abstract |

### Teaching

**Location**: `src/content/teaching/`

List courses you've taught:

**Example** (`src/content/teaching/cs229-fall-2024.json`):

```json
{
  "title": "Machine Learning",
  "role": "Instructor",
  "institution": "Stanford University",
  "semester": "Fall 2024",
  "year": 2024,
  "description": "Introduction to machine learning algorithms and applications",
  "materials": "https://cs229.stanford.edu",
  "students": 200
}
```

**Frontmatter Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Course title |
| `role` | enum | `Instructor`, `Teaching Assistant`, `Co-Instructor`, `Guest Lecturer` |
| `institution` | string | University name |
| `semester` | string | E.g., "Fall 2024" |
| `year` | number | Academic year |
| `description` | string | Course description |
| `materials` | URL | Course website |
| `students` | number | Enrollment count |

### Custom Pages

**Location**: `src/content/pages/`

Create custom pages (CV, resources, etc.):

**Example** (`src/content/pages/cv.md`):

```markdown
---
title: Curriculum Vitae
description: Academic CV and professional experience
layout: default
nav: true
nav_order: 99
---

# Curriculum Vitae

## Education

**PhD in Computer Science** - Stanford University (2020)

## Experience

**Assistant Professor** - MIT (2020-present)
```

**Frontmatter Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title |
| `description` | string | Page description |
| `layout` | enum | `default`, `wide`, `minimal`, `full` |
| `nav` | boolean | Show in navigation? |
| `nav_order` | number | Navigation position (lower = first) |
| `draft` | boolean | Hide from production? |

---

## Customization

### Changing Colors

Override accent colors in `config.yaml`:

```yaml
theme:
  preset: editorial-newsreader
  accent_light: "#0066cc"  # Custom blue (light mode)
  accent_dark: "#4da6ff"   # Lighter blue (dark mode)
```

**Tips**:
- Use hex color codes (e.g., `#c41e3a`)
- Test in both light and dark modes
- Ensure sufficient contrast for accessibility

### Changing Typography

Switch to a different preset in `config.yaml`:

```yaml
theme:
  preset: brutalist-space  # Bold, modern look
```

Or **create your own preset** by editing `src/lib/typography-presets.ts`.

### Adding Custom CSS

Create `src/styles/custom.css`:

```css
/* Custom styles */
.paper-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-link {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

Import it in `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/custom.css';
---
```

### Hiding Sections

Disable features in `config.yaml`:

```yaml
features:
  selected_publications: false  # Hide featured papers
  education: false              # Hide education section
  settings_panel: false         # Hide settings gear
```

### Adding Navigation Items

Add new pages to navigation in `config.yaml`:

```yaml
navigation:
  items:
    - id: about
      label: About
      href: /
    - id: cv
      label: CV
      href: /cv
    - id: blog
      label: Blog
      href: /blog
```

Then create the corresponding page file in `src/content/pages/` or `src/pages/`.

### Custom Domain

If you're using a custom domain (e.g., `janesmith.com`):

1. Update `site.url` in `config.yaml`:
   ```yaml
   site:
     url: https://janesmith.com
   ```

2. Add a `CNAME` file to `public/`:
   ```
   janesmith.com
   ```

3. Configure DNS settings with your domain registrar (see [Deployment](#deployment))

---

## Deployment

### GitHub Pages (Recommended)

**1. Update Configuration**:

```yaml
site:
  url: https://YOUR_USERNAME.github.io
  # Or for custom domain:
  # url: https://yourdomain.com
```

**2. Push to GitHub**:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**3. Enable GitHub Pages**:

1. Go to your repository **Settings**
2. Navigate to **Pages**
3. Under **Source**, select **GitHub Actions**
4. Done! Your site will auto-deploy on every push ✨

**GitHub Workflow** (already included in `.github/workflows/deploy.yml`):

The template includes a pre-configured workflow that:
- Builds your site on every push to `main`
- Deploys to GitHub Pages automatically
- Handles caching for faster builds

**Custom Domain Setup**:

1. Add `CNAME` file to `public/` with your domain
2. In GitHub repo settings, add your custom domain
3. Configure DNS with your registrar:
   - **A records** pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or **CNAME record** pointing to `YOUR_USERNAME.github.io`

### Netlify

**1. Build Settings**:

```
Build command: npm run build
Publish directory: dist
```

**2. Deploy**:

Option A: **Drag & Drop**
- Run `npm run build` locally
- Drag `dist/` folder to Netlify

Option B: **Git Integration**
- Connect your GitHub repository
- Netlify will auto-deploy on push

**3. Custom Domain**:
- Add domain in Netlify dashboard
- Update DNS settings as instructed
- Netlify handles SSL certificates automatically

### Vercel

**1. Import Repository**:
- Go to Vercel dashboard
- Click "Import Project"
- Connect your GitHub repository

**2. Configure Build**:
```
Framework Preset: Astro
Build Command: npm run build
Output Directory: dist
```

**3. Deploy**:
- Vercel will auto-deploy on every push
- Custom domains managed in Vercel dashboard
- SSL certificates automatic

### Cloudflare Pages

**1. Connect Repository**:
- Go to Cloudflare Pages dashboard
- Click "Create a project"
- Connect your GitHub repository

**2. Build Settings**:
```
Build command: npm run build
Build output directory: dist
Root directory: /
```

**3. Deploy**:
- Auto-deploys on push
- Custom domains in Cloudflare dashboard
- Built-in CDN and SSL

---

## Troubleshooting

### Build Errors

**Problem**: Configuration validation fails

```
❌ Configuration validation error:
   • email: Invalid email
   • site.url: Invalid URL
```

**Solution**: Check `config.yaml` for the fields mentioned. Run `npm run validate-config` to identify issues.

---

**Problem**: "config.yaml not found"

**Solution**: Make sure `config.yaml` exists in the project root (same level as `package.json`).

---

**Problem**: Build fails after config change

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .astro
npm run build
```

---

### Content Not Showing

**Problem**: Publications not appearing on homepage

**Solution**: Make sure publications have `selected: true` in their frontmatter, and `features.selected_publications: true` in `config.yaml`.

---

**Problem**: Blog posts not rendering

**Solution**:
- Check that files are in `src/content/blog/`
- Verify frontmatter is valid YAML
- Ensure `draft: false` (or omit the field)
- Restart dev server

---

**Problem**: Custom page not in navigation

**Solution**:
- Set `nav: true` in page frontmatter
- Or manually add to `navigation.items` in `config.yaml`

---

### Styling Issues

**Problem**: Colors not changing

**Solution**:
- Check that hex colors are valid (e.g., `#c41e3a`)
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Verify CSS is not being overridden

---

**Problem**: Typography preset not applying

**Solution**:
- Verify preset name is correct (check `src/lib/typography-presets.ts` for valid names)
- Restart dev server
- Clear browser cache

---

**Problem**: Dark mode not working

**Solution**:
- Ensure `features.dark_mode: true` in `config.yaml`
- Check browser for JavaScript errors
- Verify settings panel is enabled

---

### Deployment Issues

**Problem**: GitHub Pages shows 404

**Solution**:
- Check that GitHub Actions workflow completed successfully
- Verify `site.url` matches your GitHub Pages URL
- Ensure `base` is set correctly for subdirectory deployments

---

**Problem**: Custom domain not working

**Solution**:
- Verify `CNAME` file exists in `public/`
- Check DNS settings (may take 24-48 hours to propagate)
- Ensure SSL certificate is active

---

**Problem**: Images not loading after deployment

**Solution**:
- Ensure images are in `public/` folder
- Use absolute paths (e.g., `/avatar.jpg` not `avatar.jpg`)
- Check that image files were included in build output

---

### Performance Issues

**Problem**: Slow page load times

**Solution**:
- Optimize images (use WebP format, compress)
- Disable animations if not needed: `features.animations: false`
- Check for large GIF previews (consider converting to video)

---

**Problem**: Large bundle size

**Solution**:
- Remove unused typography presets from `src/lib/typography-presets.ts`
- Optimize images and assets
- Audit with `npm run build -- --profile`

---

### Common Questions

**Q: Can I use both BibTeX and JSON for publications?**

A: Yes! The template supports both. BibTeX entries from `papers.bib` and JSON files from `src/content/publications/` will both be displayed.

---

**Q: How do I change the homepage layout?**

A: Edit `src/pages/index.astro`. The layout components are modular and easy to rearrange.

---

**Q: Can I use this template for a non-academic website?**

A: Absolutely! While designed for academics, it works great for any professional portfolio. Just customize the content types and navigation to fit your needs.

---

**Q: How do I add Google Analytics?**

A: Add your tracking code to `src/layouts/BaseLayout.astro` in the `<head>` section.

---

**Q: Is the template mobile-responsive?**

A: Yes! All layouts automatically adapt to mobile devices. Navigation switches to a hamburger menu below 768px.

---

**Q: Can I add a contact form?**

A: The template is static, so you'll need to integrate a service like [Formspree](https://formspree.io/) or [Netlify Forms](https://www.netlify.com/products/forms/).

---

**Q: How do I update to the latest version?**

A: This template doesn't have automatic updates. For major features, check the [GitHub releases](https://github.com/florianmahner/academic-template/releases) and manually merge changes.

---

## Additional Resources

- **Full Config Reference**: See `docs/CONFIG.md` for every configuration option
- **Architecture Guide**: See `docs/ARCHITECTURE.md` for technical details
- **Quick Reference**: See `docs/CONFIG-QUICK-REFERENCE.md` for common tasks
- **Example Config**: See `config.example.yaml` for a complete example

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/florianmahner/academic-template/issues)
2. Review the [documentation files](docs/)
3. Open a new issue with:
   - Error message or screenshot
   - Your `config.yaml` (redact personal info)
   - Steps to reproduce
   - Node.js and npm versions

---

## Contributing

Contributions are welcome! If you've made improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy building!** 🎉

If this template helped you create your academic website, please consider:
- ⭐ Starring the repository
- 📢 Sharing with colleagues
- 🐛 Reporting bugs
- 💡 Suggesting features

---

*Last updated: December 4, 2024*
*Template version: 2.0.0*
