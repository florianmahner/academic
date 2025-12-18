/**
 * Markdown Utilities
 * Helper functions for converting markdown to HTML
 */

import { marked } from 'marked';

/**
 * Convert markdown syntax to HTML using 'marked' library
 *
 * @param md - Markdown string to convert
 * @returns HTML string
 */
export function convertMd(md: string): string {
  if (!md) return '';
  // marked.parse is synchronous by default
  return marked.parse(md) as string;
}