/**
 * Site Configuration
 *
 * This file now loads configuration from config.yaml in the project root.
 * Edit config.yaml to customize your website.
 *
 * This file maintains backward compatibility for all existing imports.
 */

import { config as yamlConfig, type SiteConfig } from "./lib/config-loader";

// Re-export the config loaded from YAML
export const config = yamlConfig;

// Re-export type
export type { SiteConfig };
