/**
 * Scroll Animations using GSAP
 * Handles fade-in and slide-up animations as elements enter viewport
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Initialize scroll animations for elements with data-animate attribute
 */
export function initScrollAnimations() {
  if (prefersReducedMotion) {
    // If user prefers reduced motion, just show everything
    gsap.set('[data-animate]', { opacity: 1, y: 0 });
    return;
  }

  // Fade up animation for sections
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Staggered fade for lists/grids
  gsap.utils.toArray<HTMLElement>('[data-animate="stagger"]').forEach((container) => {
    const children = container.children;
    gsap.fromTo(
      children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Fade in only (no movement)
  gsap.utils.toArray<HTMLElement>('[data-animate="fade"]').forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Scale up animation
  gsap.utils.toArray<HTMLElement>('[data-animate="scale"]').forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/**
 * Clean up ScrollTrigger instances (call on page navigation)
 */
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/**
 * Refresh ScrollTrigger (call after dynamic content changes)
 */
export function refreshAnimations() {
  ScrollTrigger.refresh();
}
