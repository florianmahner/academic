/**
 * Layout Configuration System
 *
 * Provides a 3-tier cascade system for layout configuration:
 * 1. Global defaults from config.yaml
 * 2. Collection-level overrides
 * 3. Entry-level overrides (frontmatter)
 *
 * Supports multiple layout types with full type safety and validation.
 */

import { config } from '../config';
import { z } from 'zod';

// =============================================================================
// LAYOUT TYPE DEFINITIONS
// =============================================================================

/**
 * All supported layout types
 */
export type LayoutType =
  | 'list'
  | 'cards'
  | 'timeline'
  | 'node'
  | 'masonry'
  | 'accordion'
  | 'minimal';

// =============================================================================
// LAYOUT-SPECIFIC CONFIG INTERFACES
// =============================================================================

/**
 * Configuration for list-based layouts
 * Traditional vertical list with optional thumbnails and grouping
 */
export interface ListLayoutConfig {
  /** Whether to display thumbnail images */
  showThumbnail?: boolean;
  /** Size of thumbnail if displayed */
  thumbnailSize?: 'small' | 'medium' | 'large';
  /** How to group items in the list */
  groupBy?: 'year' | 'category' | 'status' | 'none';
  /** Which fields to display for each item */
  fields?: string[];
  /** Use compact spacing between items */
  compact?: boolean;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Show item count per group */
  showCount?: boolean;
}

/**
 * Configuration for card-based grid layouts
 * Flexible grid with multiple visual styles
 */
export interface CardsLayoutConfig {
  /** Visual style of cards */
  style?: 'image' | 'text' | 'compact' | 'elevated';
  /** Number of columns or auto-responsive */
  columns?: number | 'auto';
  /** Image aspect ratio for card images */
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | '21:9';
  /** Show description text on cards */
  showDescription?: boolean;
  /** Display tags/categories on cards */
  showTags?: boolean;
  /** Spacing between cards */
  gap?: 'small' | 'medium' | 'large';
  /** Show hover effects */
  hoverEffect?: boolean;
  /** Card border style */
  border?: 'none' | 'subtle' | 'solid';
  /** Maximum description length in characters */
  descriptionLength?: number;
}

/**
 * Configuration for timeline layouts
 * Chronological display with various presentation styles
 */
export interface TimelineLayoutConfig {
  /** Visual arrangement of timeline */
  style?: 'alternating' | 'left' | 'right' | 'compact';
  /** How to group timeline entries */
  groupBy?: 'year' | 'month' | 'quarter' | 'none';
  /** Display thumbnail images */
  showThumbnails?: boolean;
  /** Allow expanding/collapsing entries */
  expandable?: boolean;
  /** Highlight important milestones */
  showMilestones?: boolean;
  /** Show connecting lines between entries */
  showConnectors?: boolean;
  /** Date format for timeline labels */
  dateFormat?: 'full' | 'short' | 'relative';
  /** Show icons for entry types */
  showIcons?: boolean;
}

/**
 * Configuration for node/graph layouts
 * Interactive network visualization of connections
 */
export interface NodeLayoutConfig {
  /** How to determine connections between nodes */
  connectionBy?: 'tags' | 'technologies' | 'categories' | 'manual' | 'hybrid';
  /** Size of individual nodes */
  nodeSize?: 'small' | 'medium' | 'large';
  /** Display labels on nodes */
  showLabels?: boolean;
  /** Enable interactive dragging and zooming */
  interactive?: boolean;
  /** Apply physics simulation to layout */
  physics?: boolean;
  /** Maximum number of nodes to display */
  maxNodes?: number;
  /** Minimum connections to show a node */
  minConnections?: number;
  /** Color nodes by category */
  colorByCategory?: boolean;
  /** Layout algorithm */
  algorithm?: 'force' | 'hierarchical' | 'circular' | 'grid';
}

/**
 * Configuration for masonry layouts
 * Pinterest-style variable-height grid
 */
export interface MasonryLayoutConfig {
  /** Number of columns or auto-responsive */
  columns?: number | 'auto';
  /** Spacing between items */
  gap?: 'small' | 'medium' | 'large';
  /** Show description text */
  showDescription?: boolean;
  /** Show metadata (date, author, etc.) */
  showMetadata?: boolean;
  /** Image loading strategy */
  imageLoading?: 'lazy' | 'eager';
  /** Maintain aspect ratios */
  preserveAspectRatio?: boolean;
  /** Show hover overlay */
  showOverlay?: boolean;
}

/**
 * Configuration for accordion layouts
 * Collapsible sections for dense information
 */
export interface AccordionLayoutConfig {
  /** Allow multiple sections open at once */
  multipleOpen?: boolean;
  /** Which sections start expanded */
  defaultOpen?: 'first' | 'all' | 'none' | number[];
  /** Group items by this field */
  groupBy?: 'year' | 'category' | 'status' | 'none';
  /** Show item count in headers */
  showCount?: boolean;
  /** Animate open/close transitions */
  animated?: boolean;
  /** Show icons in headers */
  showIcons?: boolean;
  /** Compact spacing */
  compact?: boolean;
}

/**
 * Configuration for minimal layouts
 * Clean, text-focused presentation
 */
export interface MinimalLayoutConfig {
  /** Typography size */
  textSize?: 'small' | 'medium' | 'large';
  /** Show only essential information */
  essential?: boolean;
  /** Group items */
  groupBy?: 'year' | 'category' | 'none';
  /** Show dividers between items */
  showDividers?: boolean;
  /** Show metadata */
  showMetadata?: boolean;
  /** Compact spacing */
  compact?: boolean;
}

/**
 * Union type of all layout configurations
 */
export type LayoutConfig =
  | ListLayoutConfig
  | CardsLayoutConfig
  | TimelineLayoutConfig
  | NodeLayoutConfig
  | MasonryLayoutConfig
  | AccordionLayoutConfig
  | MinimalLayoutConfig;

// =============================================================================
// COLLECTION-LEVEL CONFIGURATION
// =============================================================================

/**
 * Layout configuration that can be specified at collection level
 */
export interface CollectionLayoutConfig {
  /** Default layout for this collection */
  layout?: LayoutType;
  /** Layout-specific configuration */
  layoutConfig?: LayoutConfig;
}

/**
 * Entry-level override from frontmatter
 */
export interface EntryLayoutOverride {
  /** Override layout type */
  layout?: LayoutType;
  /** Override layout configuration */
  layoutConfig?: Partial<LayoutConfig>;
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

/**
 * Get sensible default configuration for a given layout type
 *
 * @param layout - The layout type to get defaults for
 * @returns Default configuration object for the layout
 *
 * @example
 * ```typescript
 * const defaults = getLayoutDefaults('cards');
 * // { style: 'elevated', columns: 'auto', aspectRatio: '16:9', ... }
 * ```
 */
export function getLayoutDefaults(layout: LayoutType): LayoutConfig {
  const defaults: Record<LayoutType, LayoutConfig> = {
    list: {
      showThumbnail: true,
      thumbnailSize: 'medium',
      groupBy: 'year',
      fields: ['title', 'date', 'description'],
      compact: false,
      sortOrder: 'desc',
      showCount: true,
    } as ListLayoutConfig,

    cards: {
      style: 'elevated',
      columns: 'auto',
      aspectRatio: '16:9',
      showDescription: true,
      showTags: true,
      gap: 'medium',
      hoverEffect: true,
      border: 'subtle',
      descriptionLength: 150,
    } as CardsLayoutConfig,

    timeline: {
      style: 'alternating',
      groupBy: 'year',
      showThumbnails: true,
      expandable: false,
      showMilestones: true,
      showConnectors: true,
      dateFormat: 'short',
      showIcons: true,
    } as TimelineLayoutConfig,

    node: {
      connectionBy: 'tags',
      nodeSize: 'medium',
      showLabels: true,
      interactive: true,
      physics: true,
      maxNodes: 50,
      minConnections: 1,
      colorByCategory: true,
      algorithm: 'force',
    } as NodeLayoutConfig,

    masonry: {
      columns: 'auto',
      gap: 'medium',
      showDescription: true,
      showMetadata: true,
      imageLoading: 'lazy',
      preserveAspectRatio: true,
      showOverlay: true,
    } as MasonryLayoutConfig,

    accordion: {
      multipleOpen: false,
      defaultOpen: 'first',
      groupBy: 'year',
      showCount: true,
      animated: true,
      showIcons: true,
      compact: false,
    } as AccordionLayoutConfig,

    minimal: {
      textSize: 'medium',
      essential: false,
      groupBy: 'year',
      showDividers: true,
      showMetadata: true,
      compact: false,
    } as MinimalLayoutConfig,
  };

  return defaults[layout];
}

/**
 * Collection-specific default layouts
 * These can be overridden in config.yaml
 */
const COLLECTION_DEFAULTS: Record<string, CollectionLayoutConfig> = {
  publications: {
    layout: 'list',
    layoutConfig: {
      groupBy: 'year',
      showThumbnail: false,
      compact: true,
      fields: ['title', 'authors', 'venue', 'year'],
    } as ListLayoutConfig,
  },
  projects: {
    layout: 'cards',
    layoutConfig: {
      style: 'image',
      columns: 3,
      aspectRatio: '16:9',
      showDescription: true,
      showTags: true,
    } as CardsLayoutConfig,
  },
  blog: {
    layout: 'cards',
    layoutConfig: {
      style: 'text',
      columns: 2,
      showDescription: true,
      gap: 'large',
    } as CardsLayoutConfig,
  },
  talks: {
    layout: 'timeline',
    layoutConfig: {
      style: 'left',
      groupBy: 'year',
      showThumbnails: true,
    } as TimelineLayoutConfig,
  },
  teaching: {
    layout: 'accordion',
    layoutConfig: {
      groupBy: 'year',
      defaultOpen: 'first',
      showCount: true,
    } as AccordionLayoutConfig,
  },
};

// =============================================================================
// CONFIGURATION MERGING
// =============================================================================

/**
 * Deep merge two configuration objects
 * Later configurations override earlier ones, but only defined properties
 *
 * @param base - Base configuration object
 * @param override - Configuration to merge on top
 * @returns Merged configuration object
 *
 * @example
 * ```typescript
 * const base = { columns: 3, gap: 'medium' };
 * const override = { columns: 4 };
 * const result = mergeLayoutConfig(base, override);
 * // { columns: 4, gap: 'medium' }
 * ```
 */
export function mergeLayoutConfig<T extends LayoutConfig>(
  base: T,
  override?: Partial<T>
): T {
  if (!override) return base;

  // Deep merge - only override defined properties
  const merged = { ...base };

  for (const key in override) {
    const value = override[key];
    if (value !== undefined) {
      merged[key] = value as T[Extract<keyof T, string>];
    }
  }

  return merged;
}

// =============================================================================
// CONFIG VALIDATION
// =============================================================================

/**
 * Validate that a layout configuration is valid for its layout type
 *
 * @param layout - The layout type
 * @param config - The configuration to validate
 * @returns True if valid, throws error if invalid
 *
 * @example
 * ```typescript
 * try {
 *   validateLayoutConfig('cards', { columns: 3, gap: 'medium' });
 * } catch (error) {
 *   console.error('Invalid config:', error);
 * }
 * ```
 */
export function validateLayoutConfig(
  layout: LayoutType,
  config: any
): config is LayoutConfig {
  // Define validation schemas for each layout type
  const schemas: Record<LayoutType, z.ZodSchema> = {
    list: z.object({
      showThumbnail: z.boolean().optional(),
      thumbnailSize: z.enum(['small', 'medium', 'large']).optional(),
      groupBy: z.enum(['year', 'category', 'status', 'none']).optional(),
      fields: z.array(z.string()).optional(),
      compact: z.boolean().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      showCount: z.boolean().optional(),
    }),

    cards: z.object({
      style: z.enum(['image', 'text', 'compact', 'elevated']).optional(),
      columns: z.union([z.number().min(1).max(6), z.literal('auto')]).optional(),
      aspectRatio: z.enum(['16:9', '4:3', '1:1', '3:2', '21:9']).optional(),
      showDescription: z.boolean().optional(),
      showTags: z.boolean().optional(),
      gap: z.enum(['small', 'medium', 'large']).optional(),
      hoverEffect: z.boolean().optional(),
      border: z.enum(['none', 'subtle', 'solid']).optional(),
      descriptionLength: z.number().positive().optional(),
    }),

    timeline: z.object({
      style: z.enum(['alternating', 'left', 'right', 'compact']).optional(),
      groupBy: z.enum(['year', 'month', 'quarter', 'none']).optional(),
      showThumbnails: z.boolean().optional(),
      expandable: z.boolean().optional(),
      showMilestones: z.boolean().optional(),
      showConnectors: z.boolean().optional(),
      dateFormat: z.enum(['full', 'short', 'relative']).optional(),
      showIcons: z.boolean().optional(),
    }),

    node: z.object({
      connectionBy: z.enum(['tags', 'technologies', 'categories', 'manual', 'hybrid']).optional(),
      nodeSize: z.enum(['small', 'medium', 'large']).optional(),
      showLabels: z.boolean().optional(),
      interactive: z.boolean().optional(),
      physics: z.boolean().optional(),
      maxNodes: z.number().positive().optional(),
      minConnections: z.number().min(0).optional(),
      colorByCategory: z.boolean().optional(),
      algorithm: z.enum(['force', 'hierarchical', 'circular', 'grid']).optional(),
    }),

    masonry: z.object({
      columns: z.union([z.number().min(1).max(6), z.literal('auto')]).optional(),
      gap: z.enum(['small', 'medium', 'large']).optional(),
      showDescription: z.boolean().optional(),
      showMetadata: z.boolean().optional(),
      imageLoading: z.enum(['lazy', 'eager']).optional(),
      preserveAspectRatio: z.boolean().optional(),
      showOverlay: z.boolean().optional(),
    }),

    accordion: z.object({
      multipleOpen: z.boolean().optional(),
      defaultOpen: z.union([
        z.literal('first'),
        z.literal('all'),
        z.literal('none'),
        z.array(z.number()),
      ]).optional(),
      groupBy: z.enum(['year', 'category', 'status', 'none']).optional(),
      showCount: z.boolean().optional(),
      animated: z.boolean().optional(),
      showIcons: z.boolean().optional(),
      compact: z.boolean().optional(),
    }),

    minimal: z.object({
      textSize: z.enum(['small', 'medium', 'large']).optional(),
      essential: z.boolean().optional(),
      groupBy: z.enum(['year', 'category', 'none']).optional(),
      showDividers: z.boolean().optional(),
      showMetadata: z.boolean().optional(),
      compact: z.boolean().optional(),
    }),
  };

  try {
    schemas[layout].parse(config);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid layout configuration for '${layout}': ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
      );
    }
    throw error;
  }
}

// =============================================================================
// MAIN RESOLVER FUNCTION
// =============================================================================

/**
 * Resolve layout configuration using 3-tier cascade:
 * 1. Global defaults for the layout type
 * 2. Collection-level defaults
 * 3. Entry-level overrides from frontmatter
 *
 * @param collection - Collection name (e.g., 'publications', 'projects')
 * @param entryOverrides - Optional overrides from entry frontmatter
 * @returns Resolved layout type and configuration
 *
 * @example
 * ```typescript
 * // Get default publication layout
 * const { layout, config } = resolveLayoutConfig('publications');
 *
 * // Get with entry-level overrides
 * const { layout, config } = resolveLayoutConfig('publications', {
 *   layout: 'timeline',
 *   layoutConfig: { style: 'compact' }
 * });
 * ```
 */
export function resolveLayoutConfig(
  collection: string,
  entryOverrides?: EntryLayoutOverride
): { layout: LayoutType; config: LayoutConfig } {
  // Step 1: Get collection defaults (or fallback to 'list')
  const collectionDefaults = COLLECTION_DEFAULTS[collection] || {
    layout: 'list' as LayoutType,
    layoutConfig: getLayoutDefaults('list'),
  };

  // Step 2: Determine final layout type
  const layoutType = entryOverrides?.layout || collectionDefaults.layout || 'list';

  // Step 3: Build configuration cascade
  // Start with layout type defaults
  let resolvedConfig = getLayoutDefaults(layoutType);

  // Apply collection-level config if it matches the layout type
  if (collectionDefaults.layoutConfig) {
    resolvedConfig = mergeLayoutConfig(
      resolvedConfig,
      collectionDefaults.layoutConfig as Partial<typeof resolvedConfig>
    );
  }

  // Apply entry-level overrides
  if (entryOverrides?.layoutConfig) {
    resolvedConfig = mergeLayoutConfig(
      resolvedConfig,
      entryOverrides.layoutConfig as Partial<typeof resolvedConfig>
    );
  }

  // Step 4: Validate final configuration
  validateLayoutConfig(layoutType, resolvedConfig);

  return {
    layout: layoutType,
    config: resolvedConfig,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get available layouts for a collection
 * Some collections may have restricted layout options
 *
 * @param collection - Collection name
 * @returns Array of available layout types
 */
export function getAvailableLayouts(collection: string): LayoutType[] {
  // Most collections support all layouts
  const allLayouts: LayoutType[] = [
    'list',
    'cards',
    'timeline',
    'node',
    'masonry',
    'accordion',
    'minimal',
  ];

  // Collection-specific restrictions could be added here
  const restrictions: Partial<Record<string, LayoutType[]>> = {
    // Example: publications might not look good as nodes
    // publications: ['list', 'cards', 'timeline', 'accordion', 'minimal'],
  };

  return restrictions[collection] || allLayouts;
}

/**
 * Check if a layout is suitable for a collection
 *
 * @param collection - Collection name
 * @param layout - Layout type to check
 * @returns True if layout is suitable
 */
export function isLayoutAvailable(
  collection: string,
  layout: LayoutType
): boolean {
  return getAvailableLayouts(collection).includes(layout);
}

/**
 * Get a human-readable description of a layout type
 *
 * @param layout - Layout type
 * @returns Description string
 */
export function getLayoutDescription(layout: LayoutType): string {
  const descriptions: Record<LayoutType, string> = {
    list: 'Traditional vertical list with optional grouping and thumbnails',
    cards: 'Responsive grid of cards with images and descriptions',
    timeline: 'Chronological timeline with milestones and connections',
    node: 'Interactive network graph showing relationships between items',
    masonry: 'Pinterest-style variable-height grid layout',
    accordion: 'Collapsible sections for dense information display',
    minimal: 'Clean, text-focused presentation with minimal decoration',
  };

  return descriptions[layout];
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if config is ListLayoutConfig
 */
export function isListLayoutConfig(config: LayoutConfig): config is ListLayoutConfig {
  return 'groupBy' in config && 'showThumbnail' in config;
}

/**
 * Type guard to check if config is CardsLayoutConfig
 */
export function isCardsLayoutConfig(config: LayoutConfig): config is CardsLayoutConfig {
  return 'columns' in config && 'aspectRatio' in config;
}

/**
 * Type guard to check if config is TimelineLayoutConfig
 */
export function isTimelineLayoutConfig(config: LayoutConfig): config is TimelineLayoutConfig {
  return 'style' in config && 'showConnectors' in config;
}

/**
 * Type guard to check if config is NodeLayoutConfig
 */
export function isNodeLayoutConfig(config: LayoutConfig): config is NodeLayoutConfig {
  return 'connectionBy' in config && 'physics' in config;
}

/**
 * Type guard to check if config is MasonryLayoutConfig
 */
export function isMasonryLayoutConfig(config: LayoutConfig): config is MasonryLayoutConfig {
  return 'preserveAspectRatio' in config;
}

/**
 * Type guard to check if config is AccordionLayoutConfig
 */
export function isAccordionLayoutConfig(config: LayoutConfig): config is AccordionLayoutConfig {
  return 'multipleOpen' in config && 'defaultOpen' in config;
}

/**
 * Type guard to check if config is MinimalLayoutConfig
 */
export function isMinimalLayoutConfig(config: LayoutConfig): config is MinimalLayoutConfig {
  return 'textSize' in config && 'essential' in config;
}

// =============================================================================
// CONVENIENCE ALIASES
// =============================================================================

/**
 * Alias for resolveLayoutConfig - used by LayoutDispatcher
 * Returns layout configuration for a collection
 *
 * @param collection - Collection name
 * @returns Layout type and configuration
 */
export function getLayoutForCollection(collection: string): { layout: LayoutType; config: LayoutConfig } {
  return resolveLayoutConfig(collection);
}
