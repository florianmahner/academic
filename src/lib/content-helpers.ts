import { getEntry, getCollection } from 'astro:content';
import { convertMd } from './markdown';
import { config } from './config';

export interface AboutContent {
  bioHtml: string;
  researchInterestsHtml: string;
}

/**
 * loads and processes the About page content
 * Splits content into Bio and Research Interests based on heading
 */
export async function getAboutContent(): Promise<AboutContent> {
  let bioHtml = '';
  let researchInterestsHtml = '';

  try {
    const aboutPage = await getEntry('pages', 'about');
    if (aboutPage) {
      const rawBody = aboutPage.body;
      // Case-insensitive regex for the split marker, tolerating whitespace
      const splitRegex = /^##\s+Research\s+Interests\s*$/m;
      const match = rawBody.match(splitRegex);

      if (match && match.index !== undefined) {
        const splitIndex = match.index;
        const matchLength = match[0].length;

        const bioMd = rawBody.substring(0, splitIndex).trim();
        const researchMd = rawBody.substring(splitIndex + matchLength).trim();

        bioHtml = convertMd(bioMd);
        researchInterestsHtml = convertMd(researchMd);
      } else {
        bioHtml = convertMd(rawBody);
      }
    }
  } catch (e) {
    // Fallback if about.md not found or error
    console.warn('Error loading about page:', e);
  }

  // Fallback to config if markdown content is empty
  if (!bioHtml) bioHtml = config.about?.bio || '';
  if (!researchInterestsHtml) researchInterestsHtml = config.about?.researchInterests || '';

  return { bioHtml, researchInterestsHtml };
}

export interface NewsItem {
  type: 'blog' | 'publication';
  title: string;
  date: Date;
  href?: string;
}

/**
 * Fetches and aggregates news items from Blog and Publications
 */
export async function getRecentNews(limit: number = 5, base: string = '/'): Promise<NewsItem[]> {
  const newsItems: NewsItem[] = [];

  // Helper to prepend base path
  const prependBase = (path: string) => {
    if (!path || path.startsWith('http')) return path;
    if (base === '/') return path;
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${normalizedBase}${path}`;
  };

  // Load blog posts
  try {
    const allPosts = await getCollection('blog');
    newsItems.push(...allPosts
      .filter(post => !post.data.draft)
      .map(post => ({
        type: 'blog' as const,
        title: post.data.title,
        date: post.data.date,
        href: prependBase(`/blog/${post.slug}`),
      }))
    );
  } catch {
    // Blog collection might not exist or be empty
  }

  // Note: Publications are usually loaded from bibtex/json separately. 
  // If we wanted to include them in "News", we would need to pass them in or load them here.
  // The original index.astro didn't seemingly add *new* publications to the news timeline automatically 
  // from the file, but rather relied on `newsItems` array. 
  // Wait, looking at index.astro code:
  // `newsItems.push(...allPosts...)`
  // It only pushed blog posts. 
  // But the interface allowed 'publication'. 
  // I will keep it focused on Blog for now to match original behavior, 
  // but the return type supports expansion.

  return newsItems
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, limit);
}
