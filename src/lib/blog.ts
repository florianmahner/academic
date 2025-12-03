/**
 * Blog Utilities
 * Helper functions for working with blog posts
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { config } from '../config';

export type BlogPost = CollectionEntry<'blog'>;

/**
 * Get all published blog posts, sorted by date (newest first)
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    // Filter out drafts in production
    if (!config.blog.showDrafts && data.draft) {
      return false;
    }
    return true;
  });

  return posts.sort((a, b) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter(post => post.data.tags.includes(tag));
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const tags = new Set<string>();

  posts.forEach(post => {
    post.data.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get reading time estimate
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
