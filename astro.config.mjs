// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import node from '@astrojs/node';
import { config } from './src/lib/config.ts';

// https://astro.build/config
export default defineConfig({
  site: config.site.url,
  base: config.site.base || '/',
  output: 'hybrid',  // Hybrid: static by default, server for pages that need it
  adapter: node({ mode: 'standalone' }),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  build: {
    assets: '_assets'
  },
  vite: {
    build: {
      cssMinify: true,
    }
  }
});
