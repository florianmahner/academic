/**
 * Content Collections Configuration
 * Define schemas for structured content types
 */

import { defineCollection, z } from 'astro:content';

// Blog posts collection
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
