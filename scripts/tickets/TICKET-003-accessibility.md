# TICKET-003: Accessibility Improvements

## Priority: HIGH
## Branch: `fix/accessibility`
## Estimated Impact: WCAG AA Compliance

---

## Problem Statement
Multiple accessibility issues identified:
1. Dark mode contrast fails WCAG AA (#808080 on #151515)
2. Missing skip links for keyboard navigation
3. Decorative SVGs not hidden from screen readers
4. Missing h1 on homepage
5. Form controls lack proper labels

## Acceptance Criteria
- [ ] All text meets WCAG AA contrast ratio (4.5:1 minimum)
- [ ] Skip link added before navigation
- [ ] All decorative icons have `aria-hidden="true"`
- [ ] Proper heading hierarchy on all pages
- [ ] All interactive elements keyboard accessible
- [ ] Mobile menu has proper focus trap

## Technical Approach

### Issue 1: Dark Mode Contrast
```css
/* src/styles/colors.css */
[data-theme="dark"] {
  --color-text-muted: #909090;      /* Was #808080 - now 5.3:1 ratio */
  --color-text-secondary: #c0c0c0;  /* Was #b0b0b0 - improved */
}
```

### Issue 2: Skip Links
```astro
<!-- Add to BaseLayout.astro, before <nav> -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--color-accent);
  color: white;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
</style>
```

### Issue 3: Decorative Icons
Add `aria-hidden="true"` to all decorative SVGs:
- PaperCard.astro (PDF, code, link icons)
- RepoCard.astro (star, fork icons)
- BaseLayout.astro (mobile menu icons)

### Issue 4: Heading Hierarchy
```astro
<!-- index.astro - add visually hidden h1 -->
<h1 class="sr-only">{config.personal.name} - Academic Portfolio</h1>
```

### Issue 5: Focus Trap for Mobile Menu
```typescript
// Add focus trap when mobile menu opens
function trapFocus(element: HTMLElement) {
  const focusable = element.querySelectorAll('a, button');
  const first = focusable[0] as HTMLElement;
  const last = focusable[focusable.length - 1] as HTMLElement;

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
```

## Files to Modify
- `src/styles/colors.css` - fix contrast ratios
- `src/layouts/BaseLayout.astro` - add skip link, fix icons
- `src/pages/index.astro` - add h1
- `src/components/blocks/PaperCard.astro` - aria-hidden on icons
- `src/components/blocks/RepoCard.astro` - aria-hidden on icons
- `src/components/SettingsPanel.astro` - add proper labels

## Testing
- Use axe DevTools browser extension
- Test with screen reader (VoiceOver/NVDA)
- Keyboard-only navigation test
- Contrast checker verification
