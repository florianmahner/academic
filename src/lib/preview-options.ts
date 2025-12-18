/**
 * Preview Mode Options Registry
 *
 * Defines available options for each page type.
 * These options can be toggled in the PreviewPanel
 * and exported as YAML config.
 */

export interface PreviewOption {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'radio';
  value: any;
  configPath: string; // Path in config.yaml
  choices?: { id: string; label: string }[];
}

export interface PageOptions {
  pageType: string;
  title: string;
  options: PreviewOption[];
}

export const pageOptionsRegistry: Record<string, PageOptions> = {
  publications: {
    pageType: 'publications',
    title: 'Publications Options',
    options: [
      {
        id: 'style',
        label: 'Card Style',
        type: 'radio',
        value: 'default',
        configPath: 'publications.style',
        choices: [
          { id: 'default', label: 'With Previews' },
          { id: 'minimal', label: 'Minimal' },
        ],
      },
      {
        id: 'showPreviews',
        label: 'Show Preview Images',
        type: 'toggle',
        value: true,
        configPath: 'publications.showPreviews',
      },
      {
        id: 'groupByYear',
        label: 'Group by Year',
        type: 'toggle',
        value: true,
        configPath: 'publications.groupByYear',
      },
    ],
  },

  news: {
    pageType: 'news',
    title: 'News Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'timeline',
        configPath: 'news.view',
        choices: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'grid', label: 'Cards' },
          { id: 'minimal', label: 'Minimal' },
          { id: 'editorial', label: 'Editorial' },
          { id: 'magazine', label: 'Magazine' },
        ],
      },
      {
        id: 'groupBy',
        label: 'Group By',
        type: 'select',
        value: 'year',
        configPath: 'news.viewConfig.groupBy',
        choices: [
          { id: 'year', label: 'Year' },
          { id: 'month', label: 'Month' },
          { id: 'none', label: 'None' },
        ],
      },
      {
        id: 'showDate',
        label: 'Show Dates',
        type: 'toggle',
        value: true,
        configPath: 'news.viewConfig.showDate',
      },
    ],
  },

  blog: {
    pageType: 'blog',
    title: 'Blog Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'grid',
        configPath: 'blog.view',
        choices: [
          { id: 'grid', label: 'Cards' },
          { id: 'timeline', label: 'List' },
          { id: 'magazine', label: 'Magazine' },
        ],
      },
      {
        id: 'showImages',
        label: 'Show Images',
        type: 'toggle',
        value: true,
        configPath: 'blog.showImages',
      },
      {
        id: 'showTags',
        label: 'Show Tags',
        type: 'toggle',
        value: true,
        configPath: 'blog.showTags',
      },
    ],
  },

  talks: {
    pageType: 'talks',
    title: 'Talks Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'timeline',
        configPath: 'talks.view',
        choices: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'minimal', label: 'Minimal' },
          { id: 'grid', label: 'Cards' },
        ],
      },
      {
        id: 'showLocation',
        label: 'Show Location',
        type: 'toggle',
        value: true,
        configPath: 'talks.showLocation',
      },
      {
        id: 'showType',
        label: 'Show Type Badge',
        type: 'toggle',
        value: true,
        configPath: 'talks.showType',
      },
    ],
  },

  projects: {
    pageType: 'projects',
    title: 'Projects Options',
    options: [
      {
        id: 'view',
        label: 'View Style',
        type: 'radio',
        value: 'showcase',
        configPath: 'projects.view',
        choices: [
          { id: 'showcase', label: 'Featured + Grid' },
          { id: 'grid', label: 'All Grid' },
          { id: 'timeline', label: 'Timeline' },
        ],
      },
      {
        id: 'showStatus',
        label: 'Show Status',
        type: 'toggle',
        value: true,
        configPath: 'projects.showStatus',
      },
    ],
  },

  'open-source': {
    pageType: 'open-source',
    title: 'Open Source Options',
    options: [
      {
        id: 'columns',
        label: 'Grid Columns',
        type: 'radio',
        value: '2',
        configPath: 'openSource.columns',
        choices: [
          { id: '1', label: '1 Column' },
          { id: '2', label: '2 Columns' },
          { id: '3', label: '3 Columns' },
        ],
      },
      {
        id: 'showStats',
        label: 'Show Stars/Forks',
        type: 'toggle',
        value: true,
        configPath: 'openSource.showStats',
      },
      {
        id: 'showLanguage',
        label: 'Show Language',
        type: 'toggle',
        value: true,
        configPath: 'openSource.showLanguage',
      },
    ],
  },
};

export function getPageOptions(pageType: string): PageOptions | null {
  return pageOptionsRegistry[pageType] || null;
}
