#!/usr/bin/env node
/**
 * Link Checker Script
 * Validates that all internal navigation links point to existing pages
 * Run: node scripts/check-links.js
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load config
const configPath = join(projectRoot, 'config.yaml');
const config = yaml.load(readFileSync(configPath, 'utf8'));

// Get base path (strip trailing slash for comparison)
const base = config.site?.base?.replace(/\/$/, '') || '';

/**
 * Build a set of valid routes by scanning the pages directory
 */
function getValidRoutes() {
  const validRoutes = new Set();
  const pagesDir = join(projectRoot, 'src/pages');
  const contentPagesDir = join(projectRoot, 'src/content/pages');

  // Add root
  validRoutes.add('/');

  // Scan src/pages for .astro files
  function scanPages(dir, prefix = '') {
    if (!existsSync(dir)) return;

    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Check for index.astro in subdirectory
        const indexPath = join(dir, entry.name, 'index.astro');
        if (existsSync(indexPath)) {
          validRoutes.add(`${prefix}/${entry.name}`);
        }
        // Also check for [slug].astro (dynamic routes - these are valid)
        const slugPath = join(dir, entry.name, '[slug].astro');
        if (existsSync(slugPath)) {
          validRoutes.add(`${prefix}/${entry.name}`);
        }
        scanPages(join(dir, entry.name), `${prefix}/${entry.name}`);
      } else if (entry.name.endsWith('.astro') && !entry.name.startsWith('[')) {
        const routeName = entry.name.replace('.astro', '');
        if (routeName !== 'index' && routeName !== '404') {
          validRoutes.add(`${prefix}/${routeName}`);
        }
      }
    }
  }

  scanPages(pagesDir);

  // Also check content/pages for markdown pages (handled by [...slug].astro)
  if (existsSync(contentPagesDir)) {
    const contentPages = readdirSync(contentPagesDir);
    for (const file of contentPages) {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const pageName = file.replace(/\.mdx?$/, '');
        if (pageName !== 'about') { // about.md is typically the homepage
          validRoutes.add(`/${pageName}`);
        }
      }
    }
  }

  return validRoutes;
}

const validRoutes = getValidRoutes();

let hasErrors = false;
const errors = [];
const warnings = [];

console.log('🔗 Checking navigation links...\n');
console.log('Valid routes found:', Array.from(validRoutes).sort().join(', '), '\n');

// Check each navigation item
for (const item of config.navigation?.items || []) {
  const href = item.href;
  const label = item.label;

  // Skip external links
  if (href.startsWith('http://') || href.startsWith('https://')) {
    console.log(`  ✓ ${label} → ${href} (external)`);
    continue;
  }

  // Check if route exists in our valid routes set
  if (validRoutes.has(href)) {
    console.log(`  ✓ ${label} → ${href}`);
  } else {
    hasErrors = true;
    errors.push(`  ✗ ${label} → ${href} (no matching page found)`);
  }
}

// Print warnings
if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(w));
}

// Print errors
if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(e => console.log(e));
  console.log('\n');
  process.exit(1);
}

console.log('\n✅ All navigation links are valid!\n');
