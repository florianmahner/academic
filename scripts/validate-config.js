#!/usr/bin/env node

/**
 * Configuration Validator
 * Validates config.yaml without building the entire site
 */

import { readFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import { z } from "zod";

// Define the same schema as in config-loader.ts
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
  about: AboutSchema,
  footer: FooterSchema,
});

// Validation function
function validateConfig() {
  try {
    console.log("🔍 Validating config.yaml...\n");

    // Read YAML file
    const configPath = join(process.cwd(), "config.yaml");
    const fileContents = readFileSync(configPath, "utf8");

    // Parse YAML
    const rawConfig = yaml.load(fileContents);

    // Validate with Zod
    const config = ConfigSchema.parse(rawConfig);

    console.log("✅ Configuration is valid!\n");
    console.log("📋 Configuration Summary:");
    console.log(`   Name: ${config.name.first} ${config.name.last}`);
    console.log(`   Title: ${config.title}`);
    console.log(`   Email: ${config.email}`);
    console.log(`   Site URL: ${config.site.url}`);
    console.log(`   Theme: ${config.theme.preset}`);
    console.log(`   Navigation: ${config.navigation.mode}`);
    console.log(`   Navigation items: ${config.navigation.items.length}`);

    // Check social links
    const socialLinks = Object.entries(config.social).filter(([_, value]) => value).length;
    console.log(`   Social links: ${socialLinks}/${Object.keys(config.social).length} configured`);

    // Check features
    const enabledFeatures = Object.entries(config.features).filter(([_, value]) => value).length;
    console.log(`   Features enabled: ${enabledFeatures}/${Object.keys(config.features).length}`);

    console.log("\n✨ Your configuration looks great!");
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Configuration validation failed:\n");

      error.errors.forEach((err) => {
        const path = err.path.join(".");
        console.error(`   • ${path}: ${err.message}`);
      });

      console.error("\n💡 Tip: Check config.yaml for the fields listed above.");
      console.error("📖 See docs/CONFIG.md for configuration reference.\n");

      return false;
    }

    if (error instanceof Error) {
      if (error.message.includes("ENOENT")) {
        console.error("❌ config.yaml not found!\n");
        console.error("💡 Create a config.yaml file in the project root.");
        console.error("📋 Copy config.example.yaml to get started:\n");
        console.error("   cp config.example.yaml config.yaml\n");
        return false;
      }

      console.error(`❌ Error: ${error.message}\n`);
      return false;
    }

    console.error("❌ Unknown error occurred");
    console.error(error);
    return false;
  }
}

// Run validation
const isValid = validateConfig();
process.exit(isValid ? 0 : 1);
