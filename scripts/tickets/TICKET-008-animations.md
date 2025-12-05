# TICKET-008: Replace GSAP with Lightweight Animations

## Priority: LOW
## Branch: `fix/animations`
## Estimated Impact: -100 KB JS bundle

---

## Problem Statement
GSAP + ScrollTrigger (116 KB) is used only for simple scroll reveal animations.
This is overkill and can be replaced with native solutions.

## Acceptance Criteria
- [ ] GSAP dependency removed
- [ ] Same visual animations preserved
- [ ] Using native Intersection Observer API
- [ ] CSS animations for smooth performance
- [ ] JS bundle reduced by ~100 KB

## Technical Approach

### Step 1: Create lightweight animation utility
```typescript
// src/lib/scroll-animations.ts

interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function initScrollAnimations(options: AnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        if (once) observer.unobserve(entry.target);
      }
    });
  }, { threshold, rootMargin });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// Auto-init on DOM ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => initScrollAnimations());
}
```

### Step 2: CSS animations (add to global.css)
```css
/* Scroll Reveal Animations */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-animate].animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
[data-animate-stagger] > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

[data-animate-stagger].animate-in > *:nth-child(1) { transition-delay: 0ms; }
[data-animate-stagger].animate-in > *:nth-child(2) { transition-delay: 100ms; }
[data-animate-stagger].animate-in > *:nth-child(3) { transition-delay: 200ms; }
[data-animate-stagger].animate-in > *:nth-child(4) { transition-delay: 300ms; }
[data-animate-stagger].animate-in > *:nth-child(5) { transition-delay: 400ms; }

[data-animate-stagger].animate-in > * {
  opacity: 1;
  transform: translateY(0);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  [data-animate],
  [data-animate-stagger] > * {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Step 3: Update components to use data attributes
```astro
<!-- Before (GSAP) -->
<div class="gsap-animate">Content</div>

<!-- After (Native) -->
<div data-animate>Content</div>
```

### Step 4: Remove GSAP
```bash
npm uninstall gsap
```

### Step 5: Update BaseLayout.astro
Remove GSAP script imports and initialization.

## Files to Create
- `src/lib/scroll-animations.ts`

## Files to Modify
- `src/styles/global.css` - add animation CSS
- `src/layouts/BaseLayout.astro` - remove GSAP, add new script
- `src/pages/index.astro` - update animation attributes
- `package.json` - remove GSAP dependency

## Animation Mapping
| GSAP Effect | CSS Equivalent |
|-------------|----------------|
| fadeIn | opacity 0→1 |
| slideUp | translateY(20px)→0 |
| stagger | transition-delay |
| duration: 0.6 | transition: 0.6s |

## Testing
- All animations still work visually
- No JS console errors
- Reduced motion preference respected
- Performance improvement verified
- Bundle size reduced
