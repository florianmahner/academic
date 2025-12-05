# TICKET-006: Create 404 Error Page

## Priority: MEDIUM
## Branch: `fix/404-page`
## Estimated Impact: Better UX for broken links

---

## Problem Statement
No custom 404 page exists. Users hitting broken links see default Astro error.

## Acceptance Criteria
- [ ] Custom 404.astro page created
- [ ] Matches site design and theme
- [ ] Provides helpful navigation options
- [ ] Works in both light and dark mode
- [ ] Includes search suggestion or popular links

## Technical Approach

### Create 404.astro
```astro
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import { config } from '../config';
---

<BaseLayout title="Page Not Found" description="The page you're looking for doesn't exist.">
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div class="error-actions">
        <a href="/" class="button-primary">Go Home</a>
        <a href="/publications" class="button-secondary">View Publications</a>
      </div>

      <div class="error-suggestions">
        <h3>Popular Pages</h3>
        <ul>
          <li><a href="/publications">Publications</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .error-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
  }

  .error-code {
    font-size: clamp(4rem, 15vw, 8rem);
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
    margin: 0;
  }

  .error-title {
    font-size: var(--font-size-xl);
    margin: var(--space-2) 0;
  }

  .error-message {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-6);
  }

  .error-actions {
    display: flex;
    gap: var(--space-3);
    justify-content: center;
    margin-bottom: var(--space-8);
  }

  .button-primary {
    background: var(--color-accent);
    color: white;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .button-primary:hover {
    opacity: 0.9;
  }

  .button-secondary {
    border: 1px solid var(--color-border);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--color-text);
    transition: border-color 0.2s;
  }

  .button-secondary:hover {
    border-color: var(--color-accent);
  }

  .error-suggestions {
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-6);
    margin-top: var(--space-6);
  }

  .error-suggestions h3 {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-3);
  }

  .error-suggestions ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
  }

  .error-suggestions a {
    color: var(--color-text-secondary);
  }

  .error-suggestions a:hover {
    color: var(--color-accent);
  }
</style>
```

## Files to Create
- `src/pages/404.astro`

## Testing
- Navigate to `/nonexistent-page`
- Verify 404 page displays
- Check light/dark mode appearance
- Test all links on 404 page work
- Verify mobile responsiveness
