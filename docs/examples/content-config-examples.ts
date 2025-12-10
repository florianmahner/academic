// ==============================================================================
// COMPLETE CONTENT COLLECTIONS CONFIGURATION EXAMPLES
// ==============================================================================
// This file contains production-ready examples you can use as starting points

import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ==============================================================================
// EXAMPLE 1: Blog + Authors + Tags (Multi-author blog with references)
// ==============================================================================

const blogAuthors = defineCollection({
  loader: file('src/content/authors.json'),
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    bio: z.string(),
    avatar: z.string().url(),
    socials: z.record(z.string().url()).optional(),
  }),
});

const blogTags = defineCollection({
  loader: file('src/content/tags.json'),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    color: z.string().optional(),
  }),
});

const blogPosts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    // Metadata
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // References
    author: reference('blog-authors'),
    tags: z.array(reference('blog-tags')).default([]),

    // Content control
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // SEO
    og_image: z.string().optional(),
    canonical_url: z.string().url().optional(),
  }),
});

// ==============================================================================
// EXAMPLE 2: Project Portfolio (Status tracking, tech stack, links)
// ==============================================================================

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    // Basic info
    title: z.string(),
    description: z.string(),
    summary: z.string(),

    // Media
    thumbnail: z.string(),
    gallery: z.array(z.string()).optional(),

    // Links
    live_url: z.string().url().optional(),
    github_url: z.string().url().optional(),

    // Details
    technologies: z.array(z.string()),
    status: z.enum(['completed', 'in-progress', 'archived', 'planned']),
    year: z.number(),

    // Organization
    category: z.enum(['web', 'mobile', 'data', 'other']),
    featured: z.boolean().default(false),
    order: z.number().default(999),
  }),
});

// ==============================================================================
// EXAMPLE 3: Case Studies (Detailed project documentation)
// ==============================================================================

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),

    challenge: z.string(),
    solution: z.string(),
    results: z.string(),

    technologies: z.array(z.string()),
    team_size: z.number(),
    duration_months: z.number(),

    images: z.object({
      hero: z.string(),
      challenge: z.string(),
      solution: z.string(),
    }).optional(),

    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      before: z.string().optional(),
    })).optional(),
  }),
});

// ==============================================================================
// EXAMPLE 4: Product Catalog (With pricing, variants, inventory)
// ==============================================================================

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    sku: z.string(),
    description: z.string(),

    price: z.number().positive(),
    discount_price: z.number().positive().optional(),

    image: z.string(),
    images: z.array(z.string()).optional(),

    category: z.string(),
    tags: z.array(z.string()),

    in_stock: z.boolean(),
    inventory: z.number().nonnegative(),

    specifications: z.record(z.string()).optional(),
    variants: z.array(z.object({
      name: z.string(),
      value: z.string(),
      sku_suffix: z.string(),
    })).optional(),
  }),
});

// ==============================================================================
// EXAMPLE 5: Documentation with Nested Structure
// ==============================================================================

const documentation = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),

    // Navigation
    sidebar_order: z.number().optional(),
    category: z.string().optional(),

    // Content control
    show_toc: z.boolean().default(true),
    searchable: z.boolean().default(true),

    // Meta
    last_updated: z.coerce.date().optional(),
    version: z.string().optional(),
  }),
});

// ==============================================================================
// EXAMPLE 6: Team Members (With profiles and roles)
// ==============================================================================

const teamMembers = defineCollection({
  loader: file('src/content/team.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),

    avatar: z.string().url(),
    email: z.string().email().optional(),

    specialties: z.array(z.string()),
    experience_years: z.number(),

    socials: z.object({
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    }).optional(),
  }),
});

// ==============================================================================
// EXAMPLE 7: Testimonials & Reviews
// ==============================================================================

const testimonials = defineCollection({
  loader: file('src/content/testimonials.json'),
  schema: z.object({
    author_name: z.string(),
    author_role: z.string(),
    author_company: z.string(),
    author_image: z.string().url(),

    quote: z.string(),
    rating: z.number().min(1).max(5),

    featured: z.boolean().default(false),
  }),
});

// ==============================================================================
// EXAMPLE 8: FAQ (Frequently Asked Questions)
// ==============================================================================

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    category: z.string(),
    order: z.number().optional(),
    related_topics: z.array(z.string()).optional(),
  }),
});

// ==============================================================================
// EXAMPLE 9: Events (Conferences, meetups, workshops)
// ==============================================================================

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),

    date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    time: z.string().optional(),
    timezone: z.string().optional(),

    location: z.string().optional(),
    is_virtual: z.boolean().default(false),

    registration_url: z.string().url().optional(),
    capacity: z.number().optional(),

    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// ==============================================================================
// EXAMPLE 10: Podcast Episodes
// ==============================================================================

const podcastEpisodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    episode_number: z.number(),
    season: z.number(),

    pubDate: z.coerce.date(),
    duration_minutes: z.number(),

    guest_name: z.string().optional(),
    guest_bio: z.string().optional(),

    audio_url: z.string().url(),
    transcript: z.string().optional(),

    topics: z.array(z.string()),
    spotify_url: z.string().url().optional(),
    apple_podcasts_url: z.string().url().optional(),
  }),
});

// ==============================================================================
// EXPORT ALL COLLECTIONS
// ==============================================================================

export const collections = {
  // Example 1: Blog
  'blog-authors': blogAuthors,
  'blog-tags': blogTags,
  'blog': blogPosts,

  // Example 2: Projects
  'projects': projects,

  // Example 3: Case Studies
  'case-studies': caseStudies,

  // Example 4: Products
  'products': products,

  // Example 5: Documentation
  'docs': documentation,

  // Example 6: Team
  'team': teamMembers,

  // Example 7: Testimonials
  'testimonials': testimonials,

  // Example 8: FAQ
  'faqs': faqs,

  // Example 9: Events
  'events': events,

  // Example 10: Podcast
  'podcast': podcastEpisodes,
};

// ==============================================================================
// TYPESCRIPT HELPER TYPES (Add to your types file)
// ==============================================================================

export type BlogAuthor = typeof collections['blog-authors'];
export type BlogTag = typeof collections['blog-tags'];
export type BlogPost = typeof collections['blog'];
export type Project = typeof collections['projects'];
export type CaseStudy = typeof collections['case-studies'];
export type Product = typeof collections['products'];
export type Doc = typeof collections['docs'];
export type TeamMember = typeof collections['team'];
export type Testimonial = typeof collections['testimonials'];
export type FAQ = typeof collections['faqs'];
export type Event = typeof collections['events'];
export type PodcastEpisode = typeof collections['podcast'];
