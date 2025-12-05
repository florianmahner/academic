/**
 * YAML Configuration Loader
 * Loads and validates config.yaml with full type safety
 */

import { readFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import { z } from "zod";

// =============================================================================
// ZOD SCHEMA DEFINITIONS
// =============================================================================

const NameSchema = z.object({
  first: z.string(),
  middle: z.string().optional(),
  last: z.string(),
});

const InstitutionSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

const SocialSchema = z.object({
  github: z.string().default(""),
  scholar: z.string().default(""),
  linkedin: z.string().default(""),
  twitter: z.string().default(""),
  orcid: z.string().default(""),
  researchgate: z.string().default(""),
});

const SiteSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string(),
  language: z.string().default("en"),
  base: z.string().default("/"),
});

const NavigationItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

const NavigationSchema = z.object({
  mode: z.enum(["floating", "sidebar", "inline"]).default("sidebar"),
  items: z.array(NavigationItemSchema),
});

const ThemeSchema = z.object({
  preset: z.enum([
    "crimson-classic",
    "editorial-newsreader",
    "modern-geist",
    "classic-playfair",
    "brutalist-space",
    "humanist-inter",
  ]).default("editorial-newsreader"),
  accent_light: z.string().optional(),
  accent_dark: z.string().optional(),
});

const FeaturesSchema = z.object({
  selected_publications: z.boolean().default(true),
  education: z.boolean().default(true),
  dark_mode: z.boolean().default(true),
  animations: z.boolean().default(true),
  settings_panel: z.boolean().default(true),
});

const AboutSchema = z.object({
  bio: z.string(),
  research_interests: z.string(),
});

const FooterLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const FooterSchema = z.object({
  copyright: z.boolean().default(true),
  links: z.array(FooterLinkSchema).default([]),
});

// Layout configuration schemas
const ListLayoutConfigSchema = z.object({
  showThumbnail: z.boolean().default(true),
  thumbnailSize: z.enum(["small", "medium", "large"]).default("small"),
  groupBy: z.enum(["year", "category", "none"]).default("year"),
  fields: z.array(z.string()).default(["description", "tags", "links"]),
  compact: z.boolean().default(false),
});

const CardsLayoutConfigSchema = z.object({
  style: z.enum(["text", "image", "minimal"]).default("text"),
  columns: z.union([z.number(), z.literal("auto")]).default("auto"),
  aspectRatio: z.string().default("16:9"),
  showDescription: z.boolean().default(true),
  showTags: z.boolean().default(true),
  gap: z.enum(["small", "medium", "large"]).default("medium"),
});

const TimelineLayoutConfigSchema = z.object({
  style: z.enum(["left", "right", "center", "alternating"]).default("left"),
  groupBy: z.enum(["year", "month", "none"]).default("year"),
  showThumbnails: z.boolean().default(false),
  expandable: z.boolean().default(false),
  showMilestones: z.boolean().default(true),
});

const NodeLayoutConfigSchema = z.object({
  connectionBy: z.enum(["tags", "category", "date", "manual"]).default("tags"),
  nodeSize: z.enum(["small", "medium", "large"]).default("medium"),
  showLabels: z.boolean().default(true),
  interactive: z.boolean().default(true),
  physics: z.boolean().default(true),
  maxNodes: z.number().default(50),
});

const MasonryLayoutConfigSchema = z.object({
  columns: z.union([z.number(), z.literal("auto")]).default("auto"),
  gap: z.enum(["small", "medium", "large"]).default("medium"),
  showDescription: z.boolean().default(true),
});

const AccordionLayoutConfigSchema = z.object({
  groupBy: z.enum(["year", "category", "none"]).default("year"),
  allowMultiple: z.boolean().default(true),
  defaultOpen: z.enum(["first", "all", "none"]).default("first"),
});

const MinimalLayoutConfigSchema = z.object({
  showDate: z.boolean().default(false),
  showStatus: z.boolean().default(false),
});

const LayoutsSchema = z.object({
  default: z.enum(["list", "cards", "timeline", "node", "masonry", "accordion", "minimal"]).default("list"),
  list: ListLayoutConfigSchema.default({}),
  cards: CardsLayoutConfigSchema.default({}),
  timeline: TimelineLayoutConfigSchema.default({}),
  node: NodeLayoutConfigSchema.default({}),
  masonry: MasonryLayoutConfigSchema.default({}),
  accordion: AccordionLayoutConfigSchema.default({}),
  minimal: MinimalLayoutConfigSchema.default({}),
});

const CollectionLayoutSchema = z.object({
  layout: z.enum(["list", "cards", "timeline", "node", "masonry", "accordion", "minimal"]),
  config: z.record(z.any()).optional(),
});

const CollectionsSchema = z.object({
  blog: CollectionLayoutSchema.optional(),
  projects: CollectionLayoutSchema.optional(),
  talks: CollectionLayoutSchema.optional(),
  teaching: CollectionLayoutSchema.optional(),
});

// Main config schema
const ConfigSchema = z.object({
  name: NameSchema,
  title: z.string(),
  institution: InstitutionSchema.optional(),
  email: z.string().email(),
  avatar: z.string().optional(),
  social: SocialSchema,
  site: SiteSchema,
  navigation: NavigationSchema,
  theme: ThemeSchema,
  features: FeaturesSchema,
  layouts: LayoutsSchema.default({}),
  collections: CollectionsSchema.default({}),
  about: AboutSchema,
  footer: FooterSchema,
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ConfigType = z.infer<typeof ConfigSchema>;
export type NavigationMode = "floating" | "sidebar" | "inline";
export type ThemePreset =
  | "crimson-classic"
  | "editorial-newsreader"
  | "modern-geist"
  | "classic-playfair"
  | "brutalist-space"
  | "humanist-inter";
export type LayoutType = "list" | "cards" | "timeline" | "node" | "masonry" | "accordion" | "minimal";
export type ListLayoutConfig = z.infer<typeof ListLayoutConfigSchema>;
export type CardsLayoutConfig = z.infer<typeof CardsLayoutConfigSchema>;
export type TimelineLayoutConfig = z.infer<typeof TimelineLayoutConfigSchema>;
export type NodeLayoutConfig = z.infer<typeof NodeLayoutConfigSchema>;
export type MasonryLayoutConfig = z.infer<typeof MasonryLayoutConfigSchema>;
export type AccordionLayoutConfig = z.infer<typeof AccordionLayoutConfigSchema>;
export type MinimalLayoutConfig = z.infer<typeof MinimalLayoutConfigSchema>;

// =============================================================================
// CONFIG LOADER
// =============================================================================

/**
 * Load and validate configuration from YAML file
 */
function loadConfig(): ConfigType {
  try {
    // Read YAML file from project root
    const configPath = join(process.cwd(), "config.yaml");
    const fileContents = readFileSync(configPath, "utf8");

    // Parse YAML
    const rawConfig = yaml.load(fileContents);

    // Validate with Zod
    const config = ConfigSchema.parse(rawConfig);

    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Configuration validation error:");
      console.error(error.errors);
      throw new Error(`Invalid configuration: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }

    if (error instanceof Error) {
      if (error.message.includes("ENOENT")) {
        throw new Error(
          "❌ config.yaml not found. Please create a config.yaml file in the project root."
        );
      }
      throw new Error(`Failed to load config: ${error.message}`);
    }

    throw error;
  }
}

/**
 * Transform YAML config to match existing TypeScript config format
 */
function transformConfig(yamlConfig: ConfigType) {
  return {
    // Personal information
    name: {
      first: yamlConfig.name.first,
      middle: yamlConfig.name.middle || "",
      last: yamlConfig.name.last,
    },

    title: yamlConfig.title,
    email: yamlConfig.email,

    social: {
      github: yamlConfig.social.github || "",
      scholar: yamlConfig.social.scholar || "",
      linkedin: yamlConfig.social.linkedin || "",
      twitter: yamlConfig.social.twitter || "",
      orcid: yamlConfig.social.orcid || "",
      researchgate: yamlConfig.social.researchgate || "",
    },

    // Site metadata
    site: {
      url: yamlConfig.site.url,
      title: yamlConfig.site.title,
      description: yamlConfig.site.description,
      language: yamlConfig.site.language,
      base: yamlConfig.site.base,
    },

    // Navigation
    navigation: yamlConfig.navigation.items,
    navigationMode: yamlConfig.navigation.mode as const,

    // Theme
    theme: {
      defaultPreset: yamlConfig.theme.preset,
      accentLight: yamlConfig.theme.accent_light || undefined,
      accentDark: yamlConfig.theme.accent_dark || undefined,
    },

    // Features
    features: {
      selectedPublications: yamlConfig.features.selected_publications,
      education: yamlConfig.features.education,
      darkMode: yamlConfig.features.dark_mode,
      animations: yamlConfig.features.animations,
      settingsPanel: yamlConfig.features.settings_panel,
    },

    // Layout system
    layouts: {
      default: yamlConfig.layouts.default,
      list: yamlConfig.layouts.list,
      cards: yamlConfig.layouts.cards,
      timeline: yamlConfig.layouts.timeline,
      node: yamlConfig.layouts.node,
      masonry: yamlConfig.layouts.masonry,
      accordion: yamlConfig.layouts.accordion,
      minimal: yamlConfig.layouts.minimal,
    },

    // Collection-specific layouts
    collections: yamlConfig.collections,

    // About page content
    about: {
      bio: yamlConfig.about.bio,
      researchInterests: yamlConfig.about.research_interests,
      affiliation: yamlConfig.institution ? {
        name: yamlConfig.institution.name,
        url: yamlConfig.institution.url,
      } : undefined,
    },

    // Footer
    footer: {
      copyright: yamlConfig.footer.copyright,
      links: yamlConfig.footer.links,
    },
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

// Load and transform config
const yamlConfig = loadConfig();
export const config = transformConfig(yamlConfig);

// Export original YAML config if needed
export const rawConfig = yamlConfig;

// Type export for the transformed config
export type SiteConfig = typeof config;
