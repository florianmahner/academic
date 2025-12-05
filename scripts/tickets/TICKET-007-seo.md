# TICKET-007: SEO & Structured Data Fixes

## Priority: MEDIUM
## Branch: `fix/seo`
## Estimated Impact: Better search visibility

---

## Problem Statement
1. StructuredData.astro has hardcoded personal information
2. Twitter meta tags use wrong attribute (`property` vs `name`)
3. No breadcrumb structured data
4. robots.txt has hardcoded URL

## Acceptance Criteria
- [ ] StructuredData.astro uses config values
- [ ] Twitter meta tags fixed
- [ ] Breadcrumb schema added for content pages
- [ ] robots.txt uses dynamic site URL
- [ ] All structured data validates on schema.org

## Technical Approach

### Issue 1: Fix StructuredData.astro
```astro
---
// src/components/StructuredData.astro
import { config } from '../config';

interface Props {
  type?: 'website' | 'article' | 'person';
  article?: {
    title: string;
    description: string;
    datePublished: Date;
    dateModified?: Date;
  };
}

const { type = 'website', article } = Astro.props;
const { personal, site, social } = config;
---

{type === 'person' && (
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personal.name,
    "jobTitle": personal.position,
    "affiliation": personal.affiliations?.map(aff => ({
      "@type": "Organization",
      "name": aff.name,
      "url": aff.url
    })),
    "url": site.url,
    "sameAs": [
      social.github && `https://github.com/${social.github}`,
      social.twitter && `https://twitter.com/${social.twitter}`,
      social.linkedin && `https://linkedin.com/in/${social.linkedin}`,
      social.googleScholar && `https://scholar.google.com/citations?user=${social.googleScholar}`
    ].filter(Boolean)
  })} />
)}
```

### Issue 2: Fix Twitter Meta Tags
```astro
<!-- BaseLayout.astro - change property to name -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

### Issue 3: Add Breadcrumb Schema
```astro
---
// Add to content layouts (BlogLayout, ProjectLayout, etc.)
const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: title, url: Astro.url.pathname }
];
---

<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": new URL(item.url, config.site.url).toString()
  }))
})} />
```

### Issue 4: Dynamic robots.txt
Create as Astro page instead of static file:
```astro
---
// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';
import { config } from '../config';

export const GET: APIRoute = () => {
  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${config.site.url}/sitemap-index.xml
`.trim();

  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain' }
  });
};
```

## Files to Modify
- `src/components/StructuredData.astro` - use config values
- `src/layouts/BaseLayout.astro` - fix Twitter meta tags
- `src/layouts/BlogLayout.astro` - add breadcrumbs
- `src/layouts/ProjectLayout.astro` - add breadcrumbs
- `src/layouts/TalkLayout.astro` - add breadcrumbs

## Files to Create
- `src/pages/robots.txt.ts` - dynamic robots.txt

## Files to Delete
- `public/robots.txt` - replaced by dynamic version

## Testing
- Google Rich Results Test
- Schema.org Validator
- Twitter Card Validator
- Verify no hardcoded values remain
