/**
 * Blog Utilities
 * Helper functions for working with blog posts
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { config } from './config';

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
