/**
 * Unified Date Formatting Utilities
 * Consolidates date formatting across the application
 */

export type DateFormat = 'short' | 'long' | 'year' | 'month-year';

/**
 * Format a date for display
 * @param date - Date to format
 * @param format - Output format type
 */
export function formatDate(
  date: Date,
  format: DateFormat = 'long'
): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    case 'year':
      return date.getFullYear().toString();
    case 'month-year':
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    case 'long':
    default:
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
  }
}

/**
 * Format a date range for display
 * @param start - Start date/year string
 * @param end - End date/year string (optional)
 */
export function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return '';
  if (start && !end) return `${start} – Present`;
  if (!start && end) return `Until ${end}`;
  return `${start} – ${end}`;
}
