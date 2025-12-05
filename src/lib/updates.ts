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
  } catch (e) {
    // Collection doesn't exist, skip
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
  } catch (e) {
    // Collection doesn't exist, skip
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
  } catch (e) {
    // Collection doesn't exist, skip
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
  } catch (e) {
    // Collection doesn't exist, skip
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
 * Get recent updates with limit
 */
export async function getRecentUpdates(limit: number = 5): Promise<UpdateItem[]> {
  const allUpdates = await getAllUpdates();
  return allUpdates.slice(0, limit);
}

/**
 * Get updates filtered by type
 */
export async function getUpdatesByType(
  types: UpdateItem['type'][]
): Promise<UpdateItem[]> {
  const allUpdates = await getAllUpdates();
  return allUpdates.filter(update => types.includes(update.type));
}

/**
 * Get updates for a specific year
 */
export async function getUpdatesByYear(year: number): Promise<UpdateItem[]> {
  const allUpdates = await getAllUpdates();
  return allUpdates.filter(update => update.date.getFullYear() === year);
}

/**
 * Get updates within a date range
 */
export async function getUpdatesInRange(
  startDate: Date,
  endDate: Date
): Promise<UpdateItem[]> {
  const allUpdates = await getAllUpdates();
  return allUpdates.filter(
    update => update.date >= startDate && update.date <= endDate
  );
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

/**
 * Group updates by month (YYYY-MM format)
 */
export function groupUpdatesByMonth(
  updates: UpdateItem[]
): Map<string, UpdateItem[]> {
  const grouped = new Map<string, UpdateItem[]>();

  updates.forEach(update => {
    const monthKey = `${update.date.getFullYear()}-${String(
      update.date.getMonth() + 1
    ).padStart(2, '0')}`;
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    grouped.get(monthKey)!.push(update);
  });

  return grouped;
}
