/**
 * Content Collections Configuration
 * Define schemas for structured content types
 */

import { defineCollection, z } from 'astro:content';

// Layout type enum
const LayoutTypeEnum = z.enum(['list', 'cards', 'timeline', 'node', 'masonry', 'accordion', 'minimal']);

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
    // Layout configuration
    layout: LayoutTypeEnum.optional(),
    layoutConfig: z.record(z.any()).optional(),
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
    // Allow any string for URLs (can be relative)
    github: z.string().optional(),
    url: z.string().optional(),
    website: z.string().optional(),
    demo: z.string().optional(),
    documentation: z.string().optional(),
    pypi: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['active', 'completed', 'archived', 'wip']).default('active'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    // Collaboration fields
    partners: z.array(z.string()).optional(),
    funding: z.string().optional(),
    // Layout configuration
    layout: LayoutTypeEnum.optional(),
    layoutConfig: z.record(z.any()).optional(),
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
    abstract: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Layout configuration
    layout: LayoutTypeEnum.optional(),
    layoutConfig: z.record(z.any()).optional(),
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
    year: z.number().optional(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
    level: z.string().optional(), // Undergraduate, Graduate, etc.
    materials: z.string().optional(),
    syllabus: z.string().optional(),
    website: z.string().optional(),
    students: z.number().optional(),
    evaluations: z.string().optional(),
    topics: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
    // Layout configuration
    layout: LayoutTypeEnum.optional(),
    layoutConfig: z.record(z.any()).optional(),
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
// These configs control the layout of pages like /blog, /projects, /talks, /teaching
const collectionPages = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic metadata
    title: z.string(),
    description: z.string(),

    // Which content collection this page displays
    collection: z.enum(['blog', 'projects', 'talks', 'teaching', 'publications', 'news']),

    // Layout type selection (named pageLayout to avoid Astro 5 reserved 'layout' field)
    pageLayout: LayoutTypeEnum,

    // Flexible layout-specific configuration
    layoutConfig: z.object({
      // List layout options
      groupBy: z.string().optional(), // e.g., 'year', 'category', 'tag'
      showThumbnail: z.boolean().optional(),
      thumbnailSize: z.enum(['small', 'medium', 'large']).optional(),
      compact: z.boolean().optional(),
      fields: z.array(z.string()).optional(), // Which fields to display

      // Card layout options
      style: z.enum(['default', 'bordered', 'elevated', 'minimal']).optional(),
      columns: z.number().min(1).max(6).optional(), // Grid columns
      aspectRatio: z.string().optional(), // e.g., '16/9', '4/3', '1/1'
      showDescription: z.boolean().optional(),
      showTags: z.boolean().optional(),
      gap: z.enum(['small', 'medium', 'large']).optional(),

      // Timeline layout options
      timelineStyle: z.enum(['vertical', 'horizontal', 'alternating']).optional(),
      showThumbnails: z.boolean().optional(),
      expandable: z.boolean().optional(),

      // Node/Graph layout options
      nodeSize: z.enum(['small', 'medium', 'large']).optional(),
      linkDistance: z.number().optional(),
      chargeStrength: z.number().optional(),

      // Masonry layout options
      columnWidth: z.number().optional(),
      gutter: z.number().optional(),

      // Accordion layout options
      defaultExpanded: z.boolean().optional(),
      allowMultiple: z.boolean().optional(),

      // Minimal layout options
      showDates: z.boolean().optional(),
      showDescriptions: z.boolean().optional(),

      // Common options for all layouts
      itemsPerPage: z.number().optional(),
      enableSearch: z.boolean().optional(),
      enableFilters: z.boolean().optional(),
      filterBy: z.array(z.string()).optional(), // Which fields can be filtered
    }).optional(),

    // Sorting configuration
    sortBy: z.string().optional(), // Field to sort by (default: 'date')
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
