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
} from "./lib/config-loader";

// Re-export the config loaded from YAML
export const config = yamlConfig;

// Re-export types
// NOTE: Layout config types are now in src/lib/layout-config.ts
// and configured via frontmatter in src/content/collection-pages/
export type {
  SiteConfig,
  LayoutType,
};
