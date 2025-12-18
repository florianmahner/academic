/**
 * Primitives - Reusable UI building blocks
 *
 * These components are the foundation for all specialized content components.
 * They provide consistent styling and behavior across the template.
 */

// Layout Primitives
export { default as TimelineEntry } from './TimelineEntry.astro';
export { default as MediaCard } from './MediaCard.astro';
export { default as StatCard } from './StatCard.astro';
export { default as ListItem } from './ListItem.astro';

// Helper Primitives
export { default as AuthorList } from './AuthorList.astro';
export { default as LanguageDot } from './LanguageDot.astro';
export { default as ActionLink } from './ActionLink.astro';

// View Primitives (for collection layouts)
export { default as ViewDate } from './ViewDate.astro';
export { default as ViewDot } from './ViewDot.astro';
export { default as ViewLinks } from './ViewLinks.astro';
export { default as ViewTags } from './ViewTags.astro';
export { default as ViewYearHeader } from './ViewYearHeader.astro';
