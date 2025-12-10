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
  profile_picture: z.boolean().default(true),
});

const AboutSchema = z.object({
  bio: z.string().default(""),
  research_interests: z.string().default(""),
}).optional();

const FooterLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const FooterSchema = z.object({
  copyright: z.boolean().default(true),
  links: z.array(FooterLinkSchema).default([]),
});

const PublicationsSchema = z.object({
  style: z.enum(["default", "minimal"]).default("default"),
  showPreviews: z.boolean().default(true),
  groupByYear: z.boolean().default(true),
  highlightAuthor: z.string().default(""),
}).optional();

const CVSchema = z.object({
  file: z.string().default("cv.json"),
  pdf: z.string().default("/cv.pdf"),
  sections: z.array(z.enum([
    "summary",
    "education",
    "work",
    "awards",
    "publications",
    "skills",
    "languages",
    "references",
  ])).default(["summary", "education", "work", "awards", "publications", "skills", "languages", "references"]),
}).optional();

// Main config schema
// NOTE: Layout configuration has been moved to frontmatter in src/content/collection-pages/
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
  about: AboutSchema.optional(),
  footer: FooterSchema,
  publications: PublicationsSchema,
  cv: CVSchema,
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

// Layout types are now defined in src/lib/layout-config.ts
// and configured via frontmatter in src/content/collection-pages/
export type LayoutType = "list" | "cards" | "timeline" | "node" | "masonry" | "accordion" | "minimal";

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
    avatar: yamlConfig.avatar,

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
      profilePicture: yamlConfig.features.profile_picture,
    },

    // NOTE: Layout configuration has moved to frontmatter in src/content/collection-pages/

    // About page content (optional - can be in markdown instead)
    about: yamlConfig.about ? {
      bio: yamlConfig.about.bio || "",
      researchInterests: yamlConfig.about.research_interests || "",
      affiliation: yamlConfig.institution ? {
        name: yamlConfig.institution.name,
        url: yamlConfig.institution.url,
      } : undefined,
    } : undefined,

    // Footer
    footer: {
      copyright: yamlConfig.footer.copyright,
      links: yamlConfig.footer.links,
    },

    // Publications
    publications: yamlConfig.publications ? {
      style: yamlConfig.publications.style,
      showPreviews: yamlConfig.publications.showPreviews,
      groupByYear: yamlConfig.publications.groupByYear,
      highlightAuthor: yamlConfig.publications.highlightAuthor,
    } : {
      style: 'default' as const,
      showPreviews: true,
      groupByYear: true,
      highlightAuthor: '',
    },

    // CV / Resume
    cv: yamlConfig.cv ? {
      file: yamlConfig.cv.file,
      pdf: yamlConfig.cv.pdf,
      sections: yamlConfig.cv.sections,
    } : {
      file: 'cv.json',
      pdf: '/cv.pdf',
      sections: ['summary', 'education', 'work', 'awards', 'publications', 'skills', 'languages', 'references'] as const,
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
