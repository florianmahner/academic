/**
 * BibTeX Parser Utility
 * Parses .bib files and converts them to structured publication data
 */

import bibtexParse from 'bibtex-parse';
import fs from 'node:fs';
import path from 'node:path';

export interface Publication {
  id: string;
  type: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  booktitle?: string;
  volume?: string;
  pages?: string;
  doi?: string;
  pdf?: string;
  html?: string;
  code?: string;
  preview?: string;
  selected?: boolean;
  abbr?: string;
  abstract?: string;
}

/**
 * Parse author string into array of names
 * Handles "and" separated lists and "Last, First" format
 */
function parseAuthors(authorString: string): string[] {
  if (!authorString) return [];

  return authorString
    .split(' and ')
    .map(author => {
      const trimmed = author.trim();
      // Convert "Last, First" to "First Last"
      if (trimmed.includes(',')) {
        const [last, first] = trimmed.split(',').map(s => s.trim());
        return `${first} ${last}`;
      }
      return trimmed;
    });
}

/**
 * Parse a BibTeX file and return structured publications
 */
export function parseBibTeX(filePath: string): Publication[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const entries = bibtexParse.entries(content);

  return entries.map(entry => {
    // bibtex-parse returns uppercase field names, normalize to lowercase
    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(entry)) {
      if (key !== 'key' && key !== 'type') {
        fields[key.toLowerCase()] = value as string;
      }
    }

    return {
      id: entry.key || '',
      type: entry.type || 'article',
      title: fields.title?.replace(/[{}]/g, '') || '',
      authors: parseAuthors(fields.author || ''),
      year: parseInt(fields.year || '0', 10),
      journal: fields.journal?.replace(/[{}]/g, ''),
      booktitle: fields.booktitle?.replace(/[{}]/g, ''),
      volume: fields.volume,
      pages: fields.pages,
      doi: fields.doi,
      // Custom fields for website
      pdf: fields.pdf,
      html: fields.html || fields.url,
      code: fields.code,
      preview: fields.preview,
      selected: fields.selected === 'true',
      abbr: fields.abbr,
      abstract: fields.abstract?.replace(/[{}]/g, ''),
    };
  }).sort((a, b) => b.year - a.year);
}

/**
 * Load publications from BibTeX file
 */
export function loadPublications(contentDir: string): Publication[] {
  const bibPath = path.join(contentDir, 'papers.bib');

  if (fs.existsSync(bibPath)) {
    return parseBibTeX(bibPath);
  }

  return [];
}

/**
 * Get selected/featured publications
 */
export function getSelectedPublications(publications: Publication[]): Publication[] {
  return publications.filter(p => p.selected);
}

/**
 * Group publications by year
 */
export function groupByYear(publications: Publication[]): Record<number, Publication[]> {
  return publications.reduce((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = [];
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);
}
