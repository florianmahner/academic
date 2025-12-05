# Academic Website Template

<div align="center">

### A beautiful, modern template for academic personal websites

**6 Typography Presets** · **3 Navigation Modes** · **Dark Mode** · **Fully Responsive**

[Live Demo](#) · [Getting Started](#-quick-start) · [Documentation](#-configuration)

[![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-96%25+-00CC66?logo=lighthouse&logoColor=white)](../../actions/workflows/lighthouse.yml)

</div>

---

## 📸 Preview

> **Note:** Add screenshots here showing:
> - Homepage with different typography presets
> - Navigation modes (floating, sidebar, inline)
> - Publications page
> - Dark/light mode comparison
> - Mobile responsive view

**Suggested structure:**
```
public/
└── screenshots/
    ├── hero.png           # Main homepage screenshot
    ├── presets.png        # Typography presets comparison
    ├── nav-modes.png      # Navigation modes comparison
    ├── dark-mode.png      # Dark mode example
    └── mobile.png         # Mobile responsive view
```

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🎨 Typography Presets
6 professionally designed font combinations:
- **Crimson Classic** - Traditional academic serif
- **Editorial Newsreader** - Magazine-style elegance
- **Modern Geist** - Clean Vercel-inspired design
- **Classic Playfair** - High-contrast traditional
- **Brutalist Space** - Bold contemporary geometric
- **Humanist Inter** - Warm friendly sans-serif

</td>
<td width="50%">

### 🧭 Navigation Modes
3 distinct navigation styles:
- **Floating** - Safari-style pill at bottom
- **Sidebar** - Fixed left sidebar
- **Inline** - Traditional top header

All modes auto-switch to hamburger menu on mobile!

</td>
</tr>
<tr>
<td width="50%">

### ⚙️ Zero Config Needed
- Edit **one file** (`config.ts`)
- No HTML/CSS knowledge required
- Full TypeScript autocomplete
- Instant preview with hot reload

</td>
<td width="50%">

### 🎯 Built for Academics
- BibTeX support
- Publication previews (GIFs/images)
- Education timeline
- GitHub repos showcase
- Structured data for SEO

</td>
</tr>
</table>

**Plus:** Dark mode, scroll animations (GSAP), settings panel, mobile-first responsive design, sitemap generation

---

## 🚀 Quick Start

```bash
# 1. Clone or download
git clone https://github.com/YOUR_USERNAME/academic-template.git my-website
cd my-website

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Your site is now live at **http://localhost:4321** 🎉

### Next Steps

1. **Edit** `src/config.ts` with your information
2. **Add** your publications to `src/content/publications.json`
3. **Choose** a typography preset and navigation mode
4. **Deploy** to GitHub Pages (see [Deployment](#-deployment))

---

## ⚙️ Configuration

The template is designed so you **only need to edit one file**: `src/config.ts`

<details>
<summary><b>📝 View Full Config Example</b></summary>

```typescript
export const config = {
  // ==================== PERSONAL INFO ====================
  name: {
    first: "Jane",
    middle: "M",
    last: "Smith",
  },
  title: "PhD Candidate in Computer Science",
  email: "jane.smith@university.edu",

  // ==================== SOCIAL LINKS ====================
  social: {
    github: "janesmith",
    scholar: "SCHOLAR_ID",
    linkedin: "janesmith",
    twitter: "janesmith_cs",
    orcid: "0000-0001-2345-6789",
    researchgate: "",  // leave empty to hide
  },

  // ==================== SITE METADATA ====================
  site: {
    url: "https://janesmith.github.io",
    title: "Jane Smith",
    description: "Personal academic website of Jane Smith",
    language: "en",
  },

  // ==================== NAVIGATION ====================
  navigation: [
    { id: "about", label: "About", href: "/" },
    { id: "publications", label: "Publications", href: "/publications" },
    { id: "open-source", label: "Open Source", href: "/open-source" },
    { id: "misc", label: "Misc", href: "/misc" },
  ],

  // Choose: "floating" | "sidebar" | "inline"
  navigationMode: "sidebar",

  // ==================== THEME ====================
  theme: {
    // Choose from 6 presets (see Typography Presets below)
    defaultPreset: "editorial-newsreader",

    // Optional: Override colors
    accentLight: undefined,  // e.g., "#c41e3a"
    accentDark: undefined,   // e.g., "#ff4d6a"
  },

  // ==================== FEATURES ====================
  features: {
    selectedPublications: true,  // Show selected papers on homepage
    education: true,             // Show education section on homepage
    darkMode: true,              // Enable dark/light toggle
    animations: true,            // Enable scroll animations
    settingsPanel: true,         // Show settings gear icon
  },

  // ==================== ABOUT PAGE ====================
  about: {
    bio: "I am an Assistant Professor of Computer Science at University. My research focuses on machine learning and AI.",
    researchInterests: "My work centers on deep learning, NLP, and computer vision.",
    affiliation: {
      name: "AI Research Lab",
      url: "https://ai-lab.university.edu",
    },
  },

  // ==================== FOOTER ====================
  footer: {
    copyright: true,
    links: [
      { label: "Email", href: "mailto:jane.smith@university.edu" },
    ],
  },
};
```

</details>

---

## 🎨 Typography Presets

Choose from **6 professionally designed** presets, each with unique character:

| Preset | Vibe | Fonts | Best For |
|--------|------|-------|----------|
| **Crimson Classic** | 📚 Traditional Academic | Crimson Pro | Classic scholarly look |
| **Editorial Newsreader** ⭐ | 📰 Magazine Editorial | Newsreader + JetBrains Mono | Modern editorial style |
| **Modern Geist** | 💻 Tech Minimal | Geist | Clean contemporary sites |
| **Classic Playfair** | 🎩 Elegant Traditional | Playfair + Lora | High-contrast elegance |
| **Brutalist Space** | 🔨 Bold Contemporary | Space Grotesk | Statement-making design |
| **Humanist Inter** | 👥 Warm & Friendly | Inter | Maximum readability |

⭐ = Default preset

**To change:**
```typescript
theme: {
  defaultPreset: "brutalist-space", // Just change this line!
}
```

**Live Switching:** The settings panel (gear icon ⚙️) lets visitors try different presets in real-time!

---

## 🧭 Navigation Modes

<table>
<tr>
<th width="33%">Floating</th>
<th width="33%">Sidebar</th>
<th width="33%">Inline</th>
</tr>
<tr>
<td>

Safari-style pill at bottom

**Features:**
- Auto-hides on scroll
- Shows on hover
- Space-efficient

**Use when:** Modern minimal aesthetic

</td>
<td>

Fixed left sidebar

**Features:**
- Always visible
- Clean separation
- Easy scanning

**Use when:** Lots of nav items

</td>
<td>

Traditional top header

**Features:**
- Familiar pattern
- Horizontal layout
- Compact

**Use when:** Standard look preferred

</td>
</tr>
</table>

**Mobile:** All modes automatically switch to a hamburger menu below 768px 📱

---

## 📝 Content Management

### Publications

**Two formats supported** - choose what works best for you:

#### Option 1: BibTeX (Recommended for academics)

Edit `src/content/papers.bib`:

```bibtex
@article{smith2024learning,
  title = {Deep Learning for Computer Vision},
  author = {Jane Smith and John Doe},
  journal = {Nature Machine Intelligence},
  year = {2024},
  volume = {7},
  pages = {123-145},
  pdf = {https://arxiv.org/pdf/2024.12345.pdf},
  html = {https://nature.com/articles/s123},
  preview = {/previews/paper.gif},
  selected = {true},
  abbr = {NMI}
}

@inproceedings{smith2023vision,
  title = {Vision Transformers for Object Recognition},
  author = {Jane Smith and Alice Johnson},
  booktitle = {Conference on Computer Vision and Pattern Recognition},
  year = {2023},
  pdf = {https://arxiv.org/pdf/2023.54321.pdf},
  selected = {true}
}
```

**Custom fields:**
- `selected = {true}` - Shows on homepage (featured papers)
- `preview = {/path/to/image.gif}` - Animated preview
- `abbr = {VENUE}` - Abbreviated venue name
- `pdf`, `html`, `code` - Links to resources

#### Option 2: JSON

Alternatively, use `src/content/publications.json`:

```json
{
  "publications": [
    {
      "id": "smith2024learning",
      "type": "article",
      "title": "Deep Learning for Computer Vision",
      "authors": ["Jane Smith", "John Doe"],
      "journal": "Nature Machine Intelligence",
      "year": 2024,
      "pdf": "https://arxiv.org/pdf/...",
      "preview": "/previews/paper.gif",
      "selected": true
    }
  ]
}
```

**Note:** The template automatically prefers `.bib` if both files exist. Most academics find BibTeX easier since you can export directly from reference managers (Zotero, Mendeley, etc.).

### GitHub Repositories

The template **automatically fetches** repo stats from GitHub API!

Edit `src/content/repositories.json` - just list owner/name pairs:

```json
{
  "github_user": "your-username",
  "repositories": [
    { "owner": "pytorch", "name": "pytorch" },
    { "owner": "your-username", "name": "your-project" }
  ]
}
```

**At build time, the template fetches:**
- ⭐ Stars count
- 🍴 Forks count
- 📝 Description
- 🏷️ Language
- 🔖 Topics

No manual updates needed - always fresh data!

### Other Content Files

| File | Purpose |
|------|---------|
| `education.json` | Academic background, degrees, advisors |
| `misc.json` | Tools, configs, other resources |

All files use simple JSON format - no coding required!

---

## 🎯 Project Structure

```
academic-template/
├── src/
│   ├── config.ts              ⭐ EDIT THIS - main configuration
│   ├── components/            Reusable UI components
│   ├── content/               📝 Your content (JSON files)
│   │   ├── publications.json
│   │   ├── education.json
│   │   ├── repositories.json
│   │   └── misc.json
│   ├── layouts/
│   │   └── BaseLayout.astro   Main layout wrapper
│   ├── lib/
│   │   ├── typography-presets.ts  Typography system
│   │   └── bibtex.ts              BibTeX parser
│   ├── pages/                 Site pages (Astro)
│   └── styles/                Global styles
├── public/                    Static assets
│   ├── favicon.jpg
│   └── previews/              📸 Publication preview images
└── package.json
```

---

## 🚢 Deployment

### GitHub Pages (Recommended)

1. **Update config:**
   ```typescript
   site: {
     url: "https://YOUR_USERNAME.github.io",
   }
   ```

2. **Push to GitHub**

3. **Enable Pages:**
   - Go to repo **Settings** > **Pages**
   - Set Source to **"GitHub Actions"**
   - Done! Auto-deploys on every push ✨

### Other Platforms

**Build:**
```bash
npm run build
```

**Deploy `dist/` folder to:**
- **Netlify:** Drag & drop or connect repo
- **Vercel:** Import repo, set build to `npm run build`
- **Cloudflare Pages:** Connect repo

---

## 🛠️ Development

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (`localhost:4321`) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 💡 Customization Examples

<details>
<summary><b>🎨 Change Accent Colors</b></summary>

```typescript
theme: {
  defaultPreset: "editorial-newsreader",
  accentLight: "#0066cc",  // Custom blue in light mode
  accentDark: "#4da6ff",   // Lighter blue in dark mode
}
```

</details>

<details>
<summary><b>🚫 Hide Sections</b></summary>

```typescript
features: {
  selectedPublications: false,  // Hide selected papers
  education: false,             // Hide education section
  settingsPanel: false,         // Hide settings gear
}
```

</details>

<details>
<summary><b>➕ Add Custom Pages</b></summary>

1. Create `src/pages/teaching.astro`
2. Add to navigation:
```typescript
navigation: [
  { id: "about", label: "About", href: "/" },
  { id: "teaching", label: "Teaching", href: "/teaching" },
  // ...
]
```

</details>

<details>
<summary><b>🔤 Customize Typography</b></summary>

Want to create your own preset? Edit `src/lib/typography-presets.ts`:

```typescript
{
  id: 'my-custom-preset',
  name: 'My Custom Style',
  description: 'Unique typography for my site',
  fonts: {
    body: 'Your Font',
    heading: 'Another Font',
    ui: 'UI Font',
    mono: 'Monospace Font',
  },
  colors: {
    accentLight: '#your-color',
    accentDark: '#your-dark-color',
  },
  styles: {
    headingStyle: 'normal',
    headingWeight: 600,
    bodyWeight: 400,
    letterSpacing: 'normal',
  },
}
```

</details>

---

## 🆚 Why This Template?

| Feature | This Template | Jekyll/Hugo | WordPress |
|---------|---------------|-------------|-----------|
| **Setup Time** | 5 minutes | 30 minutes | Hours |
| **Typography Presets** | 6 built-in | Manual | Theme-dependent |
| **Navigation Modes** | 3 built-in | Manual | Plugin-dependent |
| **Type Safety** | ✅ TypeScript | ❌ | ❌ |
| **Live Reload** | ⚡ Instant | Slow | N/A |
| **Build Speed** | ⚡ Fast | Medium | N/A |
| **Hosting Cost** | Free | Free | Paid |

---

## 📚 Tech Stack

- **[Astro 5](https://astro.build)** - Lightning-fast static site generator
- **[GSAP](https://gsap.com)** - Professional-grade animations
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe configuration
- **Google Fonts** - Beautiful web typography
- **[bibtex-parse](https://www.npmjs.com/package/bibtex-parse)** - BibTeX support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🙏 Credits

Created by [Florian Mahner](https://florianmahner.github.io)

Inspired by the academic web community and templates like [al-folio](https://github.com/alshedivat/al-folio).

## ⭐ Show Your Support

If this template helped you create your academic website, please give it a star on GitHub!

---

<div align="center">

**[⬆ Back to Top](#academic-website-template)**

Made with ❤️ for the academic community

</div>
