/**
 * Markdown Utilities
 * Helper functions for converting simple markdown to HTML
 */

/**
 * Convert simple markdown syntax to HTML
 * Supports links, inline code, and paragraphs
 *
 * @param md - Markdown string to convert
 * @returns HTML string
 */
export function convertMd(md: string): string {
  return md
    // Convert links: [text](url) -> <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Convert inline code: `code` -> <code>code</code>
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Convert paragraphs (double newlines)
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, ' ')}</p>`)
    .join('\n');
}
