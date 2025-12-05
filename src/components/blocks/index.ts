/**
 * Block Components Index
 * Consolidated component library for academic template
 */

// Card Components
export { default as PaperCard } from './PaperCard.astro';
export { default as ProjectCard } from './ProjectCard.astro';
export { default as BlogCard } from './BlogCard.astro';
export { default as TalkCard } from './TalkCard.astro';
export { default as TeachingCard } from './TeachingCard.astro';
export { default as RepoCard } from './RepoCard.astro';
export { default as TimelineItem } from './TimelineItem.astro';

// List Components
export { default as PublicationList } from './PublicationList.astro';
export { default as ProjectGrid } from './ProjectGrid.astro';
export { default as BlogList } from './BlogList.astro';
export { default as TalkList } from './TalkList.astro';
export { default as UpdatesList } from './UpdatesList.astro';

// Export UpdateItem type for convenience
export type { UpdateItem } from './UpdatesList.astro';

// Legacy aliases (for backward compatibility)
export { default as BlogPostCard } from './BlogCard.astro';
export { default as CourseCard } from './TeachingCard.astro';
