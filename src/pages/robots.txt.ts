import type { APIRoute } from 'astro';
import { config } from '../lib/config';

export const GET: APIRoute = () => {
  const siteUrl = config.site.url.replace(/\/$/, '');

  const robotsTxt = `# Robots.txt for ${siteUrl}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap-index.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
