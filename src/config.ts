/**
 * Site Configuration
 *
 * This file now loads configuration from config.yaml in the project root.
 * Edit config.yaml to customize your website.
 *
 * This file maintains backward compatibility for all existing imports.
 */

import {
  config as yamlConfig,
  type SiteConfig,
  type LayoutType,
  type ListLayoutConfig,
  type CardsLayoutConfig,
  type TimelineLayoutConfig,
  type NodeLayoutConfig,
  type MasonryLayoutConfig,
  type AccordionLayoutConfig,
  type MinimalLayoutConfig,
} from "./lib/config-loader";

// Re-export the config loaded from YAML
export const config = yamlConfig;

// Re-export types
export type {
  SiteConfig,
  LayoutType,
  ListLayoutConfig,
  CardsLayoutConfig,
  TimelineLayoutConfig,
  NodeLayoutConfig,
  MasonryLayoutConfig,
  AccordionLayoutConfig,
  MinimalLayoutConfig,
};
