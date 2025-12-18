# Preview Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Preview Mode" toggle to each page that reveals a contextual options panel, allowing users to see and experiment with page-specific configuration options in real-time during development.

**Architecture:** Create a `PreviewPanel` component that conditionally renders based on a dev-mode toggle. Each page type defines its own options schema. The panel uses client-side JavaScript to modify DOM/CSS in real-time. A "Copy Config" button exports the current settings as YAML for `config.yaml`.

**Tech Stack:** Astro components, TypeScript, CSS custom properties, client-side state management via localStorage.

---

## Phase 1: Core Infrastructure

### Task 1: Create PreviewPanel Component Shell

**Files:**
- Create: `src/components/PreviewPanel.astro`

**Step 1: Create the basic PreviewPanel component**

```astro
---
/**
 * PreviewPanel - Page-specific options panel for dev mode
 *
 * Shows a toggle button that reveals contextual configuration options
 * for the current page. Options vary by page type.
 *
 * @prop pageType - The type of page (publications, news, blog, etc.)
 * @prop options - Page-specific options schema
 */

interface Option {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'radio';
  value: any;
  choices?: { id: string; label: string }[];
}

interface Props {
  pageType: string;
  options: Option[];
}

const { pageType, options } = Astro.props;
---

<div id="preview-panel" class="preview-panel" data-page-type={pageType}>
  <button id="preview-toggle" class="preview-toggle" aria-label="Toggle preview options">
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
    <span class="toggle-label">Preview</span>
  </button>

  <aside id="preview-sidebar" class="preview-sidebar" hidden>
    <header class="sidebar-header">
      <h2>Page Options</h2>
      <button id="preview-close" class="close-btn" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </header>

    <div class="sidebar-body">
      {options.map(option => (
        <div class="option-group" data-option-id={option.id}>
          <label class="option-label">{option.label}</label>

          {option.type === 'toggle' && (
            <button
              class="toggle-switch"
              data-option={option.id}
              data-value={String(option.value)}
              aria-pressed={String(option.value)}
            >
              <span class="switch-track">
                <span class="switch-thumb"></span>
              </span>
            </button>
          )}

          {option.type === 'select' && option.choices && (
            <select class="option-select" data-option={option.id}>
              {option.choices.map(choice => (
                <option value={choice.id} selected={choice.id === option.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          )}

          {option.type === 'radio' && option.choices && (
            <div class="radio-group">
              {option.choices.map(choice => (
                <button
                  class:list={['radio-option', { active: choice.id === option.value }]}
                  data-option={option.id}
                  data-value={choice.id}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>

    <footer class="sidebar-footer">
      <button id="copy-config" class="copy-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy Config
      </button>
    </footer>
  </aside>
</div>

<style>
  .preview-panel {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 9990;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
  }

  /* Toggle button */
  .preview-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 10px 14px;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 8px 0 0 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
  }

  .preview-toggle:hover {
    padding-right: 18px;
  }

  .toggle-label {
    display: none;
  }

  .preview-toggle:hover .toggle-label {
    display: inline;
  }

  /* Sidebar */
  .preview-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    height: 100vh;
    background: var(--color-bg);
    border-left: 1px solid var(--color-border);
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.2s ease;
  }

  .preview-sidebar[hidden] {
    display: none;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-header h2 {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }

  .close-btn {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.15s;
  }

  .close-btn:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text);
  }

  .sidebar-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Option groups */
  .option-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .option-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Toggle switch */
  .toggle-switch {
    width: 48px;
    height: 28px;
    background: var(--color-border);
    border: none;
    border-radius: 14px;
    cursor: pointer;
    padding: 2px;
    transition: background 0.2s;
  }

  .toggle-switch[data-value="true"] {
    background: var(--color-accent);
  }

  .switch-track {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .switch-thumb {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
  }

  .toggle-switch[data-value="true"] .switch-thumb {
    transform: translateX(20px);
  }

  /* Select */
  .option-select {
    padding: 10px 12px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    font-size: 14px;
    cursor: pointer;
  }

  .option-select:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Radio group */
  .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .radio-option {
    padding: 8px 14px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .radio-option:hover {
    border-color: var(--color-accent);
  }

  .radio-option.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
  }

  /* Footer */
  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--color-border);
  }

  .copy-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .copy-btn:hover {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
  }

  /* Hide in production */
  @media print {
    .preview-panel {
      display: none;
    }
  }
</style>

<script>
  function initPreviewPanel() {
    const panel = document.getElementById('preview-panel');
    const toggle = document.getElementById('preview-toggle');
    const sidebar = document.getElementById('preview-sidebar');
    const close = document.getElementById('preview-close');
    const copyBtn = document.getElementById('copy-config');
    const pageType = panel?.getAttribute('data-page-type');

    if (!panel || !toggle || !sidebar) return;

    // State
    let currentOptions: Record<string, any> = {};

    // Load saved state
    const savedState = localStorage.getItem(`preview-${pageType}`);
    if (savedState) {
      try {
        currentOptions = JSON.parse(savedState);
        applyAllOptions();
      } catch (e) {
        console.error('Failed to load preview state:', e);
      }
    }

    // Open/close
    toggle.addEventListener('click', () => {
      sidebar.hidden = !sidebar.hidden;
    });

    close?.addEventListener('click', () => {
      sidebar.hidden = true;
    });

    // Handle toggle switches
    sidebar.querySelectorAll('.toggle-switch').forEach(btn => {
      btn.addEventListener('click', () => {
        const option = btn.getAttribute('data-option');
        const currentValue = btn.getAttribute('data-value') === 'true';
        const newValue = !currentValue;

        btn.setAttribute('data-value', String(newValue));
        btn.setAttribute('aria-pressed', String(newValue));

        if (option) {
          currentOptions[option] = newValue;
          applyOption(option, newValue);
          saveState();
        }
      });
    });

    // Handle selects
    sidebar.querySelectorAll('.option-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const option = target.getAttribute('data-option');
        const value = target.value;

        if (option) {
          currentOptions[option] = value;
          applyOption(option, value);
          saveState();
        }
      });
    });

    // Handle radio buttons
    sidebar.querySelectorAll('.radio-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const option = btn.getAttribute('data-option');
        const value = btn.getAttribute('data-value');

        // Update UI
        const group = btn.closest('.radio-group');
        group?.querySelectorAll('.radio-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (option && value) {
          currentOptions[option] = value;
          applyOption(option, value);
          saveState();
        }
      });
    });

    // Copy config
    copyBtn?.addEventListener('click', () => {
      const yaml = generateYaml();
      navigator.clipboard.writeText(yaml).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    });

    // Apply option to page
    function applyOption(option: string, value: any) {
      // Dispatch custom event for page-specific handling
      const event = new CustomEvent('preview-option-change', {
        detail: { option, value, pageType }
      });
      document.dispatchEvent(event);

      // Also set data attribute on body for CSS-based changes
      document.body.setAttribute(`data-preview-${option}`, String(value));
    }

    function applyAllOptions() {
      Object.entries(currentOptions).forEach(([option, value]) => {
        applyOption(option, value);

        // Update UI state
        const toggle = sidebar.querySelector(`[data-option="${option}"].toggle-switch`);
        if (toggle) {
          toggle.setAttribute('data-value', String(value));
          toggle.setAttribute('aria-pressed', String(value));
        }

        const select = sidebar.querySelector(`[data-option="${option}"].option-select`) as HTMLSelectElement;
        if (select) {
          select.value = String(value);
        }

        const radio = sidebar.querySelector(`[data-option="${option}"][data-value="${value}"].radio-option`);
        if (radio) {
          radio.closest('.radio-group')?.querySelectorAll('.radio-option').forEach(b => b.classList.remove('active'));
          radio.classList.add('active');
        }
      });
    }

    function saveState() {
      localStorage.setItem(`preview-${pageType}`, JSON.stringify(currentOptions));
    }

    function generateYaml() {
      const lines = [`# ${pageType} configuration`];
      lines.push(`${pageType}:`);

      Object.entries(currentOptions).forEach(([key, value]) => {
        const yamlValue = typeof value === 'boolean' ? value : `"${value}"`;
        lines.push(`  ${key}: ${yamlValue}`);
      });

      return lines.join('\n');
    }

    // Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !sidebar.hidden) {
        sidebar.hidden = true;
      }
    });
  }

  initPreviewPanel();
  document.addEventListener('astro:after-swap', initPreviewPanel);
</script>
```

**Step 2: Verify component compiles**

Run: `npm run build 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/PreviewPanel.astro
git commit -m "add: PreviewPanel component shell"
```

---

### Task 2: Define Page Option Schemas

**Files:**
- Create: `src/lib/preview-options.ts`

**Step 1: Create the options registry**

```typescript
/**
 * Preview Mode Options Registry
 *
 * Defines available options for each page type.
 * These options can be toggled in the PreviewPanel
 * and exported as YAML config.
 */

export interface PreviewOption {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'radio';
  value: any;
  configPath: string; // Path in config.yaml
  choices?: { id: string; label: string }[];
}

export interface PageOptions {
  pageType: string;
  title: string;
  options: PreviewOption[];
}

export const pageOptionsRegistry: Record<string, PageOptions> = {
  publications: {
    pageType: 'publications',
    title: 'Publications Options',
    options: [
      {
        id: 'style',
        label: 'Card Style',
        type: 'radio',
        value: 'default',
        configPath: 'publications.style',
        choices: [
          { id: 'default', label: 'With Previews' },
          { id: 'minimal', label: 'Minimal' },
        ],
      },
      {
        id: 'showPreviews',
        label: 'Show Preview Images',
        type: 'toggle',
        value: true,
        configPath: 'publications.showPreviews',
      },
      {
        id: 'groupByYear',
        label: 'Group by Year',
        type: 'toggle',
        value: true,
        configPath: 'publications.groupByYear',
      },
    ],
  },

  news: {
    pageType: 'news',
    title: 'News Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'timeline',
        configPath: 'news.view',
        choices: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'grid', label: 'Cards' },
          { id: 'minimal', label: 'Minimal' },
          { id: 'editorial', label: 'Editorial' },
          { id: 'magazine', label: 'Magazine' },
        ],
      },
      {
        id: 'groupBy',
        label: 'Group By',
        type: 'select',
        value: 'year',
        configPath: 'news.viewConfig.groupBy',
        choices: [
          { id: 'year', label: 'Year' },
          { id: 'month', label: 'Month' },
          { id: 'none', label: 'None' },
        ],
      },
      {
        id: 'showDate',
        label: 'Show Dates',
        type: 'toggle',
        value: true,
        configPath: 'news.viewConfig.showDate',
      },
    ],
  },

  blog: {
    pageType: 'blog',
    title: 'Blog Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'grid',
        configPath: 'blog.view',
        choices: [
          { id: 'grid', label: 'Cards' },
          { id: 'timeline', label: 'List' },
          { id: 'magazine', label: 'Magazine' },
        ],
      },
      {
        id: 'showImages',
        label: 'Show Images',
        type: 'toggle',
        value: true,
        configPath: 'blog.showImages',
      },
      {
        id: 'showTags',
        label: 'Show Tags',
        type: 'toggle',
        value: true,
        configPath: 'blog.showTags',
      },
    ],
  },

  talks: {
    pageType: 'talks',
    title: 'Talks Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'timeline',
        configPath: 'talks.view',
        choices: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'minimal', label: 'Minimal' },
          { id: 'grid', label: 'Cards' },
        ],
      },
      {
        id: 'showLocation',
        label: 'Show Location',
        type: 'toggle',
        value: true,
        configPath: 'talks.showLocation',
      },
      {
        id: 'showType',
        label: 'Show Type Badge',
        type: 'toggle',
        value: true,
        configPath: 'talks.showType',
      },
    ],
  },

  projects: {
    pageType: 'projects',
    title: 'Projects Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'showcase',
        configPath: 'projects.view',
        choices: [
          { id: 'showcase', label: 'Featured + Grid' },
          { id: 'grid', label: 'All Grid' },
          { id: 'timeline', label: 'Timeline' },
        ],
      },
      {
        id: 'showStatus',
        label: 'Show Status',
        type: 'toggle',
        value: true,
        configPath: 'projects.showStatus',
      },
    ],
  },

  'open-source': {
    pageType: 'open-source',
    title: 'Open Source Options',
    options: [
      {
        id: 'columns',
        label: 'Grid Columns',
        type: 'radio',
        value: '2',
        configPath: 'openSource.columns',
        choices: [
          { id: '1', label: '1 Column' },
          { id: '2', label: '2 Columns' },
          { id: '3', label: '3 Columns' },
        ],
      },
      {
        id: 'showStats',
        label: 'Show Stars/Forks',
        type: 'toggle',
        value: true,
        configPath: 'openSource.showStats',
      },
      {
        id: 'showLanguage',
        label: 'Show Language',
        type: 'toggle',
        value: true,
        configPath: 'openSource.showLanguage',
      },
    ],
  },
};

export function getPageOptions(pageType: string): PageOptions | null {
  return pageOptionsRegistry[pageType] || null;
}
```

**Step 2: Commit**

```bash
git add src/lib/preview-options.ts
git commit -m "add: preview options registry for all page types"
```

---

## Phase 2: Integration with Pages

### Task 3: Add PreviewPanel to Publications Page

**Files:**
- Modify: `src/pages/publications.astro`

**Step 1: Import and add PreviewPanel**

Add imports at top:
```astro
import PreviewPanel from '../components/PreviewPanel.astro';
import { getPageOptions } from '../lib/preview-options';
```

Add before closing `</BaseLayout>`:
```astro
{import.meta.env.DEV && (
  <PreviewPanel
    pageType="publications"
    options={getPageOptions('publications')?.options || []}
  />
)}
```

**Step 2: Add client-side handler script**

Add before closing `</BaseLayout>`:
```astro
<script>
  document.addEventListener('preview-option-change', ((e: CustomEvent) => {
    const { option, value } = e.detail;

    // Handle style change
    if (option === 'style') {
      document.body.setAttribute('data-pub-style', value);
    }

    // Handle groupByYear
    if (option === 'groupByYear') {
      const yearHeaders = document.querySelectorAll('.year-header');
      yearHeaders.forEach(h => {
        (h as HTMLElement).style.display = value ? '' : 'none';
      });
    }

    // Handle showPreviews
    if (option === 'showPreviews') {
      const previews = document.querySelectorAll('.media-card-image');
      previews.forEach(p => {
        (p as HTMLElement).style.display = value ? '' : 'none';
      });
    }
  }) as EventListener);
</script>
```

**Step 3: Verify build**

Run: `npm run build 2>&1 | grep -E "(error|Error|publications)"`
Expected: No errors, publications page built

**Step 4: Commit**

```bash
git add src/pages/publications.astro
git commit -m "add: PreviewPanel to publications page"
```

---

### Task 4: Add PreviewPanel to News Page

**Files:**
- Modify: `src/pages/news/index.astro`

**Step 1: Import and add PreviewPanel**

Add imports at top:
```astro
import PreviewPanel from '../../components/PreviewPanel.astro';
import { getPageOptions } from '../../lib/preview-options';
```

Add state variable after existing const declarations:
```astro
const pageOptions = getPageOptions('news');
```

Add before closing `</BaseLayout>`:
```astro
{import.meta.env.DEV && pageOptions && (
  <PreviewPanel
    pageType="news"
    options={pageOptions.options}
  />
)}
```

**Step 2: Add client-side handler**

Add script for view switching (will require page reload for full effect initially):
```astro
<script>
  document.addEventListener('preview-option-change', ((e: CustomEvent) => {
    const { option, value, pageType } = e.detail;
    if (pageType !== 'news') return;

    // For view changes, we need to reload - show message
    if (option === 'view') {
      const msg = document.createElement('div');
      msg.className = 'preview-reload-msg';
      msg.innerHTML = `View changed to "${value}". <button onclick="location.reload()">Reload to apply</button>`;
      msg.style.cssText = 'position:fixed;bottom:80px;right:20px;background:var(--color-accent);color:white;padding:12px 16px;border-radius:8px;font-size:14px;z-index:9999;';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 5000);
    }

    // Toggle date visibility
    if (option === 'showDate') {
      document.querySelectorAll('.view-date, time').forEach(el => {
        (el as HTMLElement).style.display = value ? '' : 'none';
      });
    }
  }) as EventListener);
</script>
```

**Step 3: Commit**

```bash
git add src/pages/news/index.astro
git commit -m "add: PreviewPanel to news page"
```

---

### Task 5: Add PreviewPanel to Blog Page

**Files:**
- Modify: `src/pages/blog/index.astro`

**Step 1: Read current file structure**

First read the file to understand its current structure.

**Step 2: Add PreviewPanel imports and component**

Follow same pattern as news page.

**Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "add: PreviewPanel to blog page"
```

---

### Task 6: Add PreviewPanel to Open Source Page

**Files:**
- Modify: `src/pages/open-source.astro`

**Step 1: Add PreviewPanel with column switching**

The open-source page has a simple grid. We can dynamically change columns via CSS.

Add imports and component.

Add handler for columns:
```astro
<script>
  document.addEventListener('preview-option-change', ((e: CustomEvent) => {
    const { option, value, pageType } = e.detail;
    if (pageType !== 'open-source') return;

    if (option === 'columns') {
      const grid = document.querySelector('.repos-grid');
      if (grid) {
        (grid as HTMLElement).style.gridTemplateColumns = `repeat(${value}, 1fr)`;
      }
    }

    if (option === 'showStats') {
      document.querySelectorAll('.repo-stats').forEach(el => {
        (el as HTMLElement).style.display = value ? '' : 'none';
      });
    }

    if (option === 'showLanguage') {
      document.querySelectorAll('.language-dot').forEach(el => {
        (el as HTMLElement).style.display = value ? '' : 'none';
      });
    }
  }) as EventListener);
</script>
```

**Step 2: Commit**

```bash
git add src/pages/open-source.astro
git commit -m "add: PreviewPanel to open-source page"
```

---

## Phase 3: Polish and Documentation

### Task 7: Add CSS for Preview-based Styling

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Add preview-mode CSS rules**

Add at end of file:
```css
/* Preview Mode Styles */
[data-preview-style="minimal"] .media-card-image {
  display: none !important;
}

[data-preview-groupByYear="false"] .year-header {
  display: none !important;
}

[data-preview-showPreviews="false"] .media-card-image {
  display: none !important;
}

[data-preview-showDate="false"] .view-date,
[data-preview-showDate="false"] time {
  display: none !important;
}

[data-preview-showTags="false"] .blog-tags,
[data-preview-showTags="false"] .view-tags {
  display: none !important;
}

[data-preview-showStats="false"] .repo-stats {
  display: none !important;
}

[data-preview-showLanguage="false"] .language-dot {
  display: none !important;
}
```

**Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "add: CSS rules for preview mode options"
```

---

### Task 8: Improve Copy Config YAML Output

**Files:**
- Modify: `src/components/PreviewPanel.astro`

**Step 1: Update generateYaml function**

In the script section, improve the YAML generation to match actual config.yaml structure:

```typescript
function generateYaml() {
  const pageType = panel?.getAttribute('data-page-type') || 'unknown';
  const lines: string[] = [];

  // Group options by their config path prefix
  const grouped: Record<string, Record<string, any>> = {};

  Object.entries(currentOptions).forEach(([key, value]) => {
    const option = panel?.querySelector(`[data-option="${key}"]`);
    // For now, simple flat structure
    if (!grouped[pageType]) grouped[pageType] = {};
    grouped[pageType][key] = value;
  });

  // Generate YAML
  lines.push(`# Add to config.yaml under ${pageType} section:`);
  lines.push('');

  Object.entries(grouped).forEach(([section, opts]) => {
    lines.push(`${section}:`);
    Object.entries(opts).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        lines.push(`  ${key}: ${value}`);
      } else if (typeof value === 'number') {
        lines.push(`  ${key}: ${value}`);
      } else {
        lines.push(`  ${key}: ${value}`);
      }
    });
  });

  return lines.join('\n');
}
```

**Step 2: Commit**

```bash
git add src/components/PreviewPanel.astro
git commit -m "improve: YAML output formatting for config"
```

---

### Task 9: Add Dev-Only Indicator Badge

**Files:**
- Modify: `src/components/PreviewPanel.astro`

**Step 1: Add visual indicator that this is dev-only**

Add after the toggle button:
```astro
<span class="dev-badge">DEV</span>
```

Add styles:
```css
.dev-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f59e0b;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}
```

**Step 2: Commit**

```bash
git add src/components/PreviewPanel.astro
git commit -m "add: DEV badge to preview panel"
```

---

### Task 10: Final Build and Verification

**Step 1: Run full build**

```bash
npm run build
```

Expected: Build completes without errors

**Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors

**Step 3: Test in dev mode**

```bash
npm run dev
```

Navigate to:
- `/publications` - Verify Preview button appears, options work
- `/news` - Verify options panel works
- `/blog` - Verify options panel works
- `/open-source` - Verify column switching works

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete preview mode implementation"
```

---

## Summary

**Created:**
1. `PreviewPanel.astro` - Reusable panel component with toggle, options, and copy config
2. `preview-options.ts` - Registry of options for each page type

**Modified:**
- `publications.astro` - Added PreviewPanel
- `news/index.astro` - Added PreviewPanel
- `blog/index.astro` - Added PreviewPanel
- `open-source.astro` - Added PreviewPanel
- `global.css` - Added preview-mode CSS rules

**Features:**
- Toggle button on right edge of screen (dev mode only)
- Slide-out sidebar with page-specific options
- Real-time preview of changes
- Copy Config button exports YAML
- State persisted in localStorage
- Keyboard accessible (Escape to close)
