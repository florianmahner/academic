/**
 * Navigation System
 * Auto-generates navigation from pages and config
 *
 * IMPORTANT: Navigation items are defined in config.yaml, NOT in page frontmatter.
 * The `nav: true` frontmatter option is NOT currently used by the system.
 *
 * To add a page to navigation:
 * 1. Add it to config.yaml under navigation.items
 * 2. Ensure the page exists in src/pages/ or src/content/pages/
 *
 * Navigation Configuration Example:
 * ```yaml
 * navigation:
 *   items:
 *     - id: cv
 *       label: CV
 *       href: /cv
 * ```
 */

import { getCollection } from 'astro:content';
import { config } from '../config';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  external?: boolean;
  active?: boolean;
}

interface PageFrontmatter {
  nav?: boolean;
  nav_label?: string;
  nav_order?: number;
  title?: string;
}

/**
 * Get all navigation items from:
 * 1. Pages with nav: true in frontmatter
 * 2. Config navigation overrides
 * 3. Default items for enabled features
 */
export async function getNavigation(): Promise<NavItem[]> {
  const items: NavItem[] = [];

  // Start with config navigation items (these take precedence)
  const configItems = config.navigation.map((item, index) => ({
    id: item.id || item.label.toLowerCase().replace(/\s+/g, '-'),
    label: item.label,
    href: item.href,
    order: index,
    external: item.href.startsWith('http'),
  }));

  items.push(...configItems);

  // TODO: In future, scan for pages with nav: true frontmatter
  // This would require dynamic page scanning at build time
  // For now, we rely on config.navigation

  // Sort by order
  items.sort((a, b) => a.order - b.order);

  return items;
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

/**
 * Get breadcrumb trail for current page
 * Useful for showing navigation hierarchy
 */
export async function getBreadcrumbs(currentPath: string): Promise<NavItem[]> {
  const items = await getNavigation();
  const breadcrumbs: NavItem[] = [];

  // Find the current page in navigation
  const currentItem = items.find(item => isPathActive(currentPath, item.href));

  if (currentItem) {
    breadcrumbs.push(currentItem);
  }

  return breadcrumbs;
}

/**
 * Configuration for dynamic navigation generation
 * This would be used if we implement page scanning in the future
 */
export const navigationConfig = {
  // Pages to exclude from auto-generation
  excludePaths: [
    '/404',
    '/robots.txt',
    '/sitemap.xml',
  ],

  // Default order for pages without explicit nav_order
  defaultOrder: 999,

  // Whether to include pages without nav: true
  autoInclude: false,
};

/**
 * Future: Scan Astro pages for navigation metadata
 * This would enable automatic navigation generation from page frontmatter
 *
 * Example usage in a page:
 * ---
 * title: "About Me"
 * nav: true
 * nav_label: "About"  // Optional: override title
 * nav_order: 1         // Optional: explicit ordering
 * ---
 */
export async function scanPagesForNavigation(): Promise<NavItem[]> {
  // This is a placeholder for future implementation
  // Would require build-time page scanning with Vite or Astro API
  return [];
}
