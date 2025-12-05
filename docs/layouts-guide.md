# Layout Components Guide

This document describes the available layout components for displaying collections in different visual styles.

## Available Layouts

### 1. MasonryLayout
Pinterest-style variable-height grid using CSS columns (no JavaScript).

**Use case:** Image-heavy content, varied content lengths, visual portfolios

**Configuration:**
```typescript
{
  layout: 'masonry',
  config: {
    columns: 3,              // Number or 'auto'
    gap: 'medium',           // 'small' | 'medium' | 'large'
    showDescription: true
  }
}
```

**Features:**
- CSS `column-count` for masonry effect
- Variable height cards based on content
- Break-inside: avoid for clean columns
- Responsive: 1 column mobile, 2 tablet, 3+ desktop
- Cards flow naturally based on height

**Example usage in config.yaml:**
```yaml
collections:
  projects:
    layout: masonry
    config:
      columns: auto
      gap: medium
      showDescription: true
```

---

### 2. AccordionLayout
Expandable list - just titles visible, click to expand details.

**Use case:** Long lists, scannable content, space-constrained layouts

**Configuration:**
```typescript
{
  layout: 'accordion',
  config: {
    groupBy: 'year',         // 'year' | 'category' | 'none'
    allowMultiple: false,    // Allow multiple items open
    defaultOpen: 'first'     // 'first' | 'none' | 'all'
  }
}
```

**Features:**
- Clean list of titles with expand/collapse
- Click to expand: reveals description, tags, links
- Smooth height animation
- Optionally grouped by year or category
- Uses HTML `<details>/<summary>` for no-JS support
- Single-open mode (accordion) or multi-open mode

**Example usage in config.yaml:**
```yaml
collections:
  publications:
    layout: accordion
    config:
      groupBy: year
      allowMultiple: false
      defaultOpen: first
```

---

### 3. MinimalLayout
Ultra-minimal - just a list of linked titles, nothing else.

**Use case:** Sidebar widgets, simple lists, navigation, clean text-only displays

**Configuration:**
```typescript
{
  layout: 'minimal',
  config: {
    showDate: false,
    showStatus: false,
    bullet: 'disc'           // 'disc' | 'circle' | 'square' | 'dash' | 'none'
  }
}
```

**Features:**
- Simple bulleted/unbulleted list
- Just titles as links
- Optional date and status badges
- Multiple bullet style options
- Perfect for sidebars or simple navigation

**Example usage in config.yaml:**
```yaml
collections:
  blog:
    layout: minimal
    config:
      showDate: true
      showStatus: false
      bullet: dash
```

---

## Using Layouts in Pages

### Option 1: Global Configuration (config.yaml)
```yaml
collections:
  projects:
    layout: masonry
    config:
      columns: auto
      gap: large
```

### Option 2: Page-Level Override
```astro
---
import LayoutDispatcher from '@/components/layouts/LayoutDispatcher.astro';

const entries = await getCollection('projects');
---

<LayoutDispatcher
  collection="projects"
  entries={entries}
  layoutOverride="accordion"
  configOverride={{
    groupBy: 'year',
    allowMultiple: false
  }}
/>
```

## Layout Comparison

| Layout | Best For | Complexity | Visual Impact |
|--------|----------|------------|---------------|
| **Minimal** | Simple lists, navigation | Lowest | Clean & text-focused |
| **Accordion** | Long lists, scannable content | Low | Space-efficient |
| **Cards** | Balanced content display | Medium | Modern & structured |
| **Masonry** | Visual portfolios, varied heights | Medium | Dynamic & engaging |
| **Timeline** | Chronological content | Medium | Story-driven |
| **Node** | Hierarchical relationships | High | Complex networks |

## Dark Mode Support

All layouts fully support dark mode with proper theme variables:
- Automatically adapt to `[data-theme="dark"]`
- Use CSS custom properties for colors
- Smooth transitions between themes

## Accessibility Features

All layouts include:
- ✅ Proper semantic HTML
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Screen reader support
- ✅ Reduced motion support
- ✅ ARIA labels where needed

## Print Styles

All layouts are print-optimized:
- Clean single-column layout
- No unnecessary decorations
- Proper page breaks
- Readable text colors

## Browser Support

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Progressive enhancement for older browsers
- ✅ No JavaScript required (except AccordionLayout single-open mode)
- ✅ CSS Grid and Flexbox with fallbacks
