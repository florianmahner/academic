// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { config } from './src/config.ts';

// https://astro.build/config
export default defineConfig({
  site: config.site.url,
  base: '/academic',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  build: {
    assets: '_assets'
  },
  vite: {
    build: {
      cssMinify: true,
    }
  }
});
