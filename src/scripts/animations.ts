/**
 * Scroll Animations using native IntersectionObserver
 * Replaces GSAP (saves ~100KB bundle size)
 */

// Import from the new lightweight implementation
export { initScrollAnimations, cleanupAnimations, refreshAnimations } from '../lib/scroll-animations';
