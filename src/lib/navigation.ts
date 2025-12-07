/**
 * Navigation System
 * Auto-generates navigation from pages and config
 *
 * IMPORTANT: Navigation items are defined in config.yaml, NOT in page frontmatter.
 *
 * To add a page to navigation:
 * 1. Add it to config.yaml under navigation.items
 * 2. Ensure the page exists in src/pages/ or src/content/pages/
 */

import { config } from '../config';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  external?: boolean;
  active?: boolean;
}

/**
 * Get all navigation items from config
 */
export async function getNavigation(): Promise<NavItem[]> {
  // Get navigation items from config
  const configItems = config.navigation.map((item, index) => ({
    id: item.id || item.label.toLowerCase().replace(/\s+/g, '-'),
    label: item.label,
    href: item.href,
    order: index,
    external: item.href.startsWith('http'),
  }));

  // Sort by order
  configItems.sort((a, b) => a.order - b.order);

  return configItems;
}

/**
 * Get navigation items with active state
 * @param currentPath - Current page pathname
 */
export async function getNavigationWithActive(currentPath: string): Promise<NavItem[]> {
  const items = await getNavigation();

  return items.map(item => ({
    ...item,
    active: isPathActive(currentPath, item.href),
  }));
}

/**
 * Check if a path should be marked as active
 * Handles exact matches and prefix matches (e.g., /blog matches /blog/post-1)
 */
function isPathActive(currentPath: string, itemHref: string): boolean {
  // Remove trailing slashes for comparison
  const normalizePath = (path: string) => {
    const normalized = path.replace(/\/$/, '') || '/';
    // Ensure we always start with /
    return normalized.startsWith('/') ? normalized : '/' + normalized;
  };

  const normalizedCurrent = normalizePath(currentPath);
  const normalizedHref = normalizePath(itemHref);

  // Exact match
  if (normalizedCurrent === normalizedHref) {
    return true;
  }

  // Prefix match (but not for home page to avoid matching everything)
  if (normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/')) {
    return true;
  }

  return false;
}

/**
 * Apply base path to navigation items
 * Handles subdirectory deployments (e.g., /academic)
 */
export function applyBasePath(items: NavItem[], base: string): NavItem[] {
  if (base === '/') {
    return items;
  }

  // Normalize base by removing trailing slash to avoid double slashes
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;

  return items.map(item => ({
    ...item,
    href: item.external ? item.href : `${normalizedBase}${item.href}`,
  }));
}
