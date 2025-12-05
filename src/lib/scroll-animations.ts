/**
 * Lightweight scroll animations using Intersection Observer
 * Replaces GSAP ScrollTrigger (saves ~100KB)
 */

interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function initScrollAnimations(options: AnimationOptions = {}): void {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true
  } = options;

  // Skip if no IntersectionObserver support
  if (typeof IntersectionObserver === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('animate-in');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay for children if parent has data-animate-stagger
        const parent = entry.target.closest('[data-animate-stagger]');
        if (parent && !parent.classList.contains('animate-in')) {
          parent.classList.add('animate-in');
        }

        entry.target.classList.add('animate-in');

        if (once) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold, rootMargin });

  // Observe all elements with data-animate
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

  // Also observe stagger containers
  document.querySelectorAll('[data-animate-stagger]').forEach(el => {
    observer.observe(el);
  });
}

// Cleanup function for page navigation
export function cleanupAnimations(): void {
  // No cleanup needed for IntersectionObserver approach
  // Browser handles this automatically
}

// Refresh function for dynamic content (no-op for this approach)
export function refreshAnimations(): void {
  // Re-initialize if needed
  initScrollAnimations();
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initScrollAnimations());
  } else {
    initScrollAnimations();
  }
}
