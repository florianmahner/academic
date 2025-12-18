/**
 * Preview Mode Options Registry
 *
 * Comprehensive options for all page types matching
 * ViewConfig interfaces from view components.
 */

export interface PreviewOption {
  id: string;
  label: string;
  type: 'toggle' | 'select' | 'radio';
  value: any;
  configPath: string;
  choices?: { id: string; label: string }[];
  requiresReload?: boolean;
}

export interface PageOptions {
  pageType: string;
  title: string;
  options: PreviewOption[];
}

export const pageOptionsRegistry: Record<string, PageOptions> = {
  publications: {
    pageType: 'publications',
    title: 'Publications',
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
    title: 'News & Updates',
    options: [
      {
        id: 'view',
        label: 'View Type',
        type: 'radio',
        value: 'timeline',
        configPath: 'news.view',
        requiresReload: true,
        choices: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'grid', label: 'Grid' },
          { id: 'minimal', label: 'Minimal' },
          { id: 'editorial', label: 'Editorial' },
          { id: 'magazine', label: 'Magazine' },
        ],
      },
      {
        id: 'style',
        label: 'Timeline Style',
        type: 'radio',
        value: 'classic',
        configPath: 'news.viewConfig.style',
        requiresReload: true,
        choices: [
          { id: 'minimal', label: 'Minimal' },
          { id: 'strip', label: 'Strip' },
          { id: 'classic', label: 'Classic' },
          { id: 'alternating', label: 'Alternating' },
        ],
      },
      {
        id: 'groupBy',
        label: 'Group By',
        type: 'radio',
        value: 'year',
        configPath: 'news.viewConfig.groupBy',
        choices: [
          { id: 'year', label: 'Year' },
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
      {
        id: 'showDot',
        label: 'Show Type Dots',
        type: 'toggle',
        value: true,
        configPath: 'news.viewConfig.showDot',
      },
      {
        id: 'showDescription',
        label: 'Show Description',
        type: 'toggle',
        value: false,
        configPath: 'news.viewConfig.showDescription',
      },
      {
        id: 'showTags',
        label: 'Show Tags',
        type: 'toggle',
        value: true,
        configPath: 'news.viewConfig.showTags',
      },
    ],
  },

  blog: {
    pageType: 'blog',
    title: 'Blog',
    options: [
      {
        id: 'view',
        label: 'View Type',
        type: 'radio',
        value: 'grid',
        configPath: 'blog.view',
        requiresReload: true,
        choices: [
          { id: 'grid', label: 'Grid' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'magazine', label: 'Magazine' },
          { id: 'minimal', label: 'Minimal' },
        ],
      },
      {
        id: 'columns',
        label: 'Grid Columns',
        type: 'radio',
        value: '2',
        configPath: 'blog.viewConfig.columns',
        choices: [
          { id: '1', label: '1' },
          { id: '2', label: '2' },
          { id: '3', label: '3' },
        ],
      },
      {
        id: 'showImage',
        label: 'Show Images',
        type: 'toggle',
        value: true,
        configPath: 'blog.viewConfig.showImage',
      },
      {
        id: 'showDate',
        label: 'Show Dates',
        type: 'toggle',
        value: true,
        configPath: 'blog.viewConfig.showDate',
      },
      {
        id: 'showDescription',
        label: 'Show Description',
        type: 'toggle',
        value: true,
        configPath: 'blog.viewConfig.showDescription',
      },
      {
        id: 'showTags',
        label: 'Show Tags',
        type: 'toggle',
        value: true,
        configPath: 'blog.viewConfig.showTags',
      },
      {
        id: 'showReadTime',
        label: 'Show Read Time',
        type: 'toggle',
        value: true,
        configPath: 'blog.viewConfig.showReadTime',
      },
    ],
  },

  talks: {
    pageType: 'talks',
    title: 'Talks',
    options: [
      {
        id: 'view',
        label: 'View Type',
        type: 'radio',
        value: 'timeline',
        configPath: 'talks.view',
        requiresReload: true,
        choices: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'grid', label: 'Grid' },
          { id: 'minimal', label: 'Minimal' },
        ],
      },
      {
        id: 'style',
        label: 'Timeline Style',
        type: 'radio',
        value: 'alternating',
        configPath: 'talks.style',
        requiresReload: true,
        choices: [
          { id: 'minimal', label: 'Minimal' },
          { id: 'strip', label: 'Strip' },
          { id: 'classic', label: 'Classic' },
          { id: 'alternating', label: 'Alternating' },
        ],
      },
      {
        id: 'groupBy',
        label: 'Group By',
        type: 'radio',
        value: 'year',
        configPath: 'talks.groupBy',
        choices: [
          { id: 'year', label: 'Year' },
          { id: 'none', label: 'None' },
        ],
      },
      {
        id: 'showDate',
        label: 'Show Dates',
        type: 'toggle',
        value: true,
        configPath: 'talks.showDate',
      },
      {
        id: 'showDescription',
        label: 'Show Description',
        type: 'toggle',
        value: true,
        configPath: 'talks.showDescription',
      },
      {
        id: 'showContext',
        label: 'Show Event/Location',
        type: 'toggle',
        value: true,
        configPath: 'talks.viewConfig.showContext',
      },
      {
        id: 'showTags',
        label: 'Show Tags',
        type: 'toggle',
        value: true,
        configPath: 'talks.viewConfig.showTags',
      },
    ],
  },

  teaching: {
    pageType: 'teaching',
    title: 'Teaching',
    options: [
      {
        id: 'view',
        label: 'View Type',
        type: 'radio',
        value: 'timeline',
        configPath: 'teaching.view',
        requiresReload: true,
        choices: [
          { id: 'timeline', label: 'Timeline' },
          { id: 'minimal', label: 'Minimal' },
          { id: 'grid', label: 'Grid' },
        ],
      },
      {
        id: 'groupBy',
        label: 'Group By',
        type: 'radio',
        value: 'year',
        configPath: 'teaching.groupBy',
        choices: [
          { id: 'year', label: 'Year' },
          { id: 'none', label: 'None' },
        ],
      },
      {
        id: 'showDate',
        label: 'Show Dates',
        type: 'toggle',
        value: true,
        configPath: 'teaching.showDate',
      },
      {
        id: 'showRole',
        label: 'Show Role',
        type: 'toggle',
        value: true,
        configPath: 'teaching.viewConfig.showRole',
      },
      {
        id: 'showInstitution',
        label: 'Show Institution',
        type: 'toggle',
        value: true,
        configPath: 'teaching.viewConfig.showInstitution',
      },
      {
        id: 'showDescription',
        label: 'Show Description',
        type: 'toggle',
        value: true,
        configPath: 'teaching.viewConfig.showDescription',
      },
    ],
  },

  projects: {
    pageType: 'projects',
    title: 'Projects',
    options: [
      {
        id: 'columns',
        label: 'Grid Columns',
        type: 'radio',
        value: '2',
        configPath: 'projects.columns',
        choices: [
          { id: '1', label: '1' },
          { id: '2', label: '2' },
          { id: '3', label: '3' },
        ],
      },
      {
        id: 'showStatus',
        label: 'Show Status',
        type: 'toggle',
        value: true,
        configPath: 'projects.showStatus',
      },
      {
        id: 'showDescription',
        label: 'Show Description',
        type: 'toggle',
        value: true,
        configPath: 'projects.showDescription',
      },
      {
        id: 'showTags',
        label: 'Show Tags',
        type: 'toggle',
        value: true,
        configPath: 'projects.showTags',
      },
    ],
  },

  'open-source': {
    pageType: 'open-source',
    title: 'Open Source',
    options: [
      {
        id: 'columns',
        label: 'Grid Columns',
        type: 'radio',
        value: '2',
        configPath: 'openSource.columns',
        choices: [
          { id: '1', label: '1' },
          { id: '2', label: '2' },
          { id: '3', label: '3' },
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
      {
        id: 'showDescription',
        label: 'Show Description',
        type: 'toggle',
        value: true,
        configPath: 'openSource.showDescription',
      },
    ],
  },
};

export function getPageOptions(pageType: string): PageOptions | null {
  return pageOptionsRegistry[pageType] || null;
}
