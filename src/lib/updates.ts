/**
 * Updates Utilities
 * Helper functions for aggregating and working with updates from multiple sources
 */

import { getCollection } from 'astro:content';
import { getPublishedPosts } from './blog';
import type { UpdateItem } from '../components/blocks/UpdatesList.astro';

/**
 * Aggregate updates from all content sources
 */
export async function getAllUpdates(): Promise<UpdateItem[]> {
  // Get blog posts
  const blogPosts = await getPublishedPosts();
  const blogUpdates: UpdateItem[] = blogPosts.map(post => ({
    type: 'blog' as const,
    title: post.data.title,
    date: post.data.date,
    description: post.data.description,
    url: `/blog/${post.slug}`,
    tags: post.data.tags,
  }));

  // Get publications (if collection exists)
  let publicationUpdates: UpdateItem[] = [];
  try {
    const publications = await getCollection('publications');
    publicationUpdates = publications.map(pub => ({
      type: 'publication' as const,
      title: pub.data.title,
      date: new Date(pub.data.year, 0), // Use January of publication year
      venue: pub.data.venue || pub.data.journal || pub.data.booktitle,
      authors: pub.data.authors,
      url: `/publications/${pub.slug}`,
      description: pub.data.abstract,
    }));
  } catch (error) {
    // Collection doesn't exist or other error - only log unexpected errors
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message);
      if (!message.includes('does not exist') && !message.includes('Unknown collection')) {
        console.error('Error loading publications:', error);
      }
    }
  }

  // Get talks (if collection exists)
  let talkUpdates: UpdateItem[] = [];
  try {
    const talks = await getCollection('talks');
    talkUpdates = talks.map(talk => ({
      type: 'talk' as const,
      title: talk.data.title,
      date: new Date(talk.data.date),
      event: talk.data.event,
      location: talk.data.location,
      url: `/talks/${talk.slug}`,
      description: talk.data.abstract,
    }));
  } catch (error) {
    // Collection doesn't exist or other error - only log unexpected errors
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message);
      if (!message.includes('does not exist') && !message.includes('Unknown collection')) {
        console.error('Error loading talks:', error);
      }
    }
  }

  // Get teaching (if collection exists)
  let teachingUpdates: UpdateItem[] = [];
  try {
    const teaching = await getCollection('teaching');
    teachingUpdates = teaching.map(course => ({
      type: 'teaching' as const,
      title: course.data.title,
      date: new Date(course.data.semester.replace(/Fall|Spring|Summer|Winter/, (match) => {
        const year = course.data.semester.match(/\d{4}/)?.[0] || new Date().getFullYear();
        const months: Record<string, number> = {
          'Spring': 1,
          'Summer': 5,
          'Fall': 8,
          'Winter': 11,
        };
        return `${year}-${months[match] || 1}-01`;
      })),
      venue: course.data.institution,
      url: `/teaching/${course.slug}`,
      description: course.data.description,
    }));
  } catch (error) {
    // Collection doesn't exist or other error - only log unexpected errors
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message);
      if (!message.includes('does not exist') && !message.includes('Unknown collection')) {
        console.error('Error loading teaching:', error);
      }
    }
  }

  // Get projects (if collection exists)
  let projectUpdates: UpdateItem[] = [];
  try {
    const projects = await getCollection('projects');
    projectUpdates = projects.map(project => ({
      type: 'project' as const,
      title: project.data.title,
      date: project.data.date || new Date(project.data.year, 0),
      url: `/projects/${project.slug}`,
      description: project.data.description,
      tags: project.data.tags,
    }));
  } catch (error) {
    // Collection doesn't exist or other error - only log unexpected errors
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message);
      if (!message.includes('does not exist') && !message.includes('Unknown collection')) {
        console.error('Error loading projects:', error);
      }
    }
  }

  // Combine and sort by date (newest first)
  return [
    ...blogUpdates,
    ...publicationUpdates,
    ...talkUpdates,
    ...teachingUpdates,
    ...projectUpdates,
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Group updates by year
 */
export function groupUpdatesByYear(
  updates: UpdateItem[]
): Map<number, UpdateItem[]> {
  const grouped = new Map<number, UpdateItem[]>();

  updates.forEach(update => {
    const year = update.date.getFullYear();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)!.push(update);
  });

  return grouped;
}
