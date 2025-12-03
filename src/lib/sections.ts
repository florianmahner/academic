/**
 * Section helpers
 * Utilities for checking section availability
 */

import { config, type SectionKey } from '../config';

/**
 * Check if a section is enabled
 */
export function isSectionEnabled(section: SectionKey): boolean {
  return config.sections[section] === true;
}

/**
 * Get all enabled sections
 */
export function getEnabledSections(): SectionKey[] {
  return (Object.keys(config.sections) as SectionKey[])
    .filter(key => config.sections[key]);
}

/**
 * Redirect URL for disabled sections (homepage)
 */
export const DISABLED_SECTION_REDIRECT = '/';
