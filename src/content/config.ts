/**
 * Content Collections Configuration
 * Define schemas for structured content types
 *
 * Only collections that need individual detail pages are defined here.
 * Simple list pages use markdown with frontmatter items (src/pages/*.md)
 */

import { defineCollection, z } from 'astro:content';

// Blog posts collection - needs individual post pages
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

// Projects collection - needs individual project pages
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
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['active', 'completed', 'archived', 'wip']).default('active'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    partners: z.array(z.string()).optional(),
    funding: z.string().optional(),
  }),
});

// Pages collection - static pages (about, cv, etc.)
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

export const collections = {
  blog,
  projects,
  pages,
};
