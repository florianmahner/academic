# Block Components

Consolidated component library for the academic template.

## 📦 Component Inventory

### Card Components (9)
- ✅ **PaperCard** - Academic publications with previews and links
- ✅ **ProjectCard** - Projects with images and tags
- ✅ **BlogCard** - Blog post previews (replaces BlogPostCard)
- ✅ **TalkCard** - Talks and presentations
- ✅ **TeachingCard** - Teaching experience (replaces CourseCard)
- ✅ **RepoCard** - GitHub repositories with stats
- ✅ **TimelineItem** - Timeline entries for CV

### List Components (4)
- ✅ **PublicationList** - Renders publications grouped by year
- ✅ **ProjectGrid** - Responsive grid of projects
- ✅ **BlogList** - List of blog posts
- ✅ **TalkList** - List of talks

### Legacy Aliases (2)
- `BlogPostCard` → `BlogCard`
- `CourseCard` → `TeachingCard`

## 🎯 Features

All components include:
- **TypeScript interfaces** for type-safe props
- **Dark mode support** via CSS variables
- **Animation data attributes** for scroll animations
- **Responsive design** with mobile-first approach
- **Accessibility** with semantic HTML
- **Hover states** with smooth transitions

## 📝 Usage Example

### Individual Card
```astro
---
import PaperCard from '../components/blocks/PaperCard.astro';
---

<PaperCard
  title="Understanding Neural Networks"
  authors={["John Doe", "Jane Smith"]}
  venue="NeurIPS"
  year={2024}
  pdf="/papers/neural-nets.pdf"
/>
```

### Using List Components
```astro
---
import PublicationList from '../components/blocks/PublicationList.astro';
import { loadPublications } from '../lib/bibtex';

const publications = loadPublications('./content');
---

<PublicationList publications={publications} />
```

### Using Barrel Exports
```astro
---
import {
  PaperCard,
  ProjectGrid,
  BlogList
} from '../components/blocks';
---
```

## 🔄 Migration from Inline Markup

### Before (Inline Markup)
```astro
<article class="paper-card">
  <div class="paper-preview">
    <img src={preview} alt={title} />
  </div>
  <div class="paper-content">
    <h3>{title}</h3>
    <p>{authors}</p>
    <!-- ... lots of repetitive markup -->
  </div>
</article>
```

### After (Component)
```astro
<PaperCard
  title={title}
  authors={authors}
  preview={preview}
/>
```

## 📍 Pages Updated

The following pages now use components instead of inline markup:
- ✅ `/src/pages/index.astro` - Uses PaperCard
- ✅ `/src/pages/publications.astro` - Uses PublicationList
- ✅ `/src/pages/open-source.astro` - Uses RepoCard

## 🎨 Customization

All components accept a `class` prop for custom styling:

```astro
<PaperCard
  title="My Paper"
  authors={["Author"]}
  class="featured-paper"
/>
```

```css
.featured-paper {
  border: 2px solid var(--color-accent);
  background: var(--color-bg-alt);
}
```

## 📚 Documentation

Full documentation available at:
- [Block Components Guide](/docs/components/block-components.md)

## 🚀 Benefits

1. **DRY Principle** - No repeated markup across pages
2. **Type Safety** - TypeScript interfaces catch errors
3. **Consistency** - Uniform styling and behavior
4. **Maintainability** - Update once, apply everywhere
5. **Reusability** - Easy to use in new pages
6. **Performance** - Optimized components with lazy loading

## 🔧 Component Structure

```
src/components/blocks/
├── PaperCard.astro          # Publication card
├── ProjectCard.astro        # Project card
├── BlogCard.astro           # Blog post card
├── TalkCard.astro           # Talk/presentation card
├── TeachingCard.astro       # Teaching/course card
├── RepoCard.astro           # GitHub repository card
├── TimelineItem.astro       # CV timeline item
├── PublicationList.astro    # Publication list with grouping
├── ProjectGrid.astro        # Project grid layout
├── BlogList.astro           # Blog post list
├── TalkList.astro           # Talk list
├── index.ts                 # Barrel exports
├── README.md                # This file
└── [Legacy Files]
    ├── BlogPostCard.astro   # → Use BlogCard instead
    └── CourseCard.astro     # → Use TeachingCard instead
```

## ✅ Build Status

All components build successfully:
```bash
npm run build
# ✓ Completed in 168ms
```

## 🎯 Next Steps

To use these components in a new page:

1. Import the component:
```astro
import { PaperCard } from '../components/blocks';
```

2. Use with props:
```astro
<PaperCard
  title="Your Title"
  authors={["Author"]}
/>
```

3. Style with CSS variables from `global.css`

Happy building! 🚀
