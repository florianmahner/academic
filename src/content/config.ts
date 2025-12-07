/**
 * Content Collections Configuration
 * Define schemas for structured content types
 */

import { defineCollection, z } from 'astro:content';

// View type enum (unified view system)
const ViewTypeEnum = z.enum(['timeline', 'showcase', 'grid', 'minimal', 'editorial', 'magazine', 'academic']);

// Blog posts collection
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

// Projects collection - portfolio/research projects
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date().optional(),
    technologies: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
    github: z.string().optional(),
    website: z.string().optional(),
    demo: z.string().optional(),
    documentation: z.string().optional(),
    pypi: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['active', 'completed', 'archived', 'wip']).default('active'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});

// Talks collection - presentations/conferences
const talks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    venue: z.string().optional(),
    type: z.enum(['keynote', 'invited', 'talk', 'workshop', 'poster', 'panel', 'tutorial', 'contributed', 'conference', 'seminar']).default('talk'),
    slides: z.string().optional(),
    video: z.string().optional(),
    poster: z.string().optional(),
    materials: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

// Teaching collection - courses taught
const teaching = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    code: z.string().optional(), // Course code like "CS 4780"
    role: z.enum(['Instructor', 'Teaching Assistant', 'Guest Lecturer', 'Co-Instructor', 'TA', 'Lecturer']),
    institution: z.string(),
    semester: z.string(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
    level: z.string().optional(), // Undergraduate, Graduate, etc.
    materials: z.string().optional(),
    syllabus: z.string().optional(),
    website: z.string().optional(),
    students: z.number().optional(),
    topics: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

// Pages collection - custom pages (about, cv, etc.)
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    layout: z.enum(['default', 'wide', 'minimal', 'full']).default('default'),
    nav: z.boolean().default(true),
    nav_order: z.number().default(999),
    draft: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

// Collection Pages - defines how collection index pages are displayed
const collectionPages = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic metadata
    title: z.string(),
    description: z.string(),

    // Which content collection this page displays
    collection: z.enum(['blog', 'projects', 'talks', 'teaching', 'publications', 'news']),

    // View type selection (unified view system)
    view: ViewTypeEnum.optional(),

    // Unified view configuration
    viewConfig: z.object({
      // Style Variant
      style: z.enum(['minimal', 'strip', 'classic', 'alternating']).optional(),

      // Grouping
      groupBy: z.enum(['year', 'semester', 'none']).optional(),

      // Status/Type Indicators
      showDot: z.boolean().optional(),
      dotType: z.enum(['content', 'status']).optional(),

      // Date Display
      showDate: z.boolean().optional(),
      dateFormat: z.enum(['short', 'long', 'year', 'month-year']).optional(),

      // Content Display
      showDescription: z.boolean().optional(),
      descriptionLimit: z.number().optional(),

      // Tags
      showTags: z.boolean().optional(),
      tagLimit: z.number().optional(),
      tagStyle: z.enum(['pills', 'inline', 'minimal']).optional(),

      // Links
      showLinks: z.array(z.string()).optional(),
      linkStyle: z.enum(['icons', 'text', 'both']).optional(),

      // Featured Items (ShowcaseView)
      showFeatured: z.boolean().optional(),
      featuredCount: z.number().optional(),

      // Grid Options (GridView)
      columns: z.number().min(1).max(4).optional(),
      showImage: z.boolean().optional(),
      imageAspect: z.enum(['16:9', '4:3', '1:1', '3:2']).optional(),
      showReadTime: z.boolean().optional(),
      gap: z.enum(['small', 'medium', 'large']).optional(),

      // Context Display (TimelineView)
      showContext: z.boolean().optional(),
      showAuthors: z.boolean().optional(),
      authorLimit: z.number().optional(),

      // Role/Institution (MinimalView)
      showRole: z.boolean().optional(),
      showInstitution: z.boolean().optional(),
      showCode: z.boolean().optional(),
      showLevel: z.boolean().optional(),
      compact: z.boolean().optional(),

      // Status Display (ShowcaseView)
      showStatus: z.boolean().optional(),

      // Editorial View Variant
      variant: z.enum(['classic', 'compact', 'featured']).optional(),
    }).optional(),

    // Sorting configuration
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),

    // Display options
    showCount: z.boolean().optional().default(true),
    emptyMessage: z.string().optional(),
  }),
});

// News/Announcements collection - standalone news items without a full page
const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    link: z.string().optional(), // Optional external link
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  projects,
  talks,
  teaching,
  pages,
  news,
  'collection-pages': collectionPages,
};
