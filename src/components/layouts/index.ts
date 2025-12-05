/**
 * Layout Components Exports
 *
 * Central export point for all layout components.
 * Import from here to access any layout:
 *
 * @example
 * import { LayoutDispatcher, CardsLayout, ListLayout } from '@/components/layouts';
 */

export { default as LayoutDispatcher } from './LayoutDispatcher.astro';
export { default as ListLayout } from './ListLayout.astro';
export { default as CardsLayout } from './CardsLayout.astro';
export { default as TimelineLayout } from './TimelineLayout.astro';
export { default as NodeLayout } from './NodeLayout.astro';
export { default as MasonryLayout } from './MasonryLayout.astro';
export { default as AccordionLayout } from './AccordionLayout.astro';
export { default as MinimalLayout } from './MinimalLayout.astro';

/**
 * Type definitions for layout props
 */
export interface LayoutProps {
  entries: any[];
  config?: Record<string, any>;
  collection?: string;
}

export interface DispatcherProps extends LayoutProps {
  collection: string;
  title?: string;
  description?: string;
  layoutOverride?: string;
  configOverride?: Record<string, any>;
}
