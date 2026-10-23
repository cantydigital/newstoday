import { toPlainText, type PortableTextBlock } from '@portabletext/react';

export interface Heading {
  id: string;
  text: string;
}

// Sections that make no sense in the "On this page" sidebar.
const SKIPPED_HEADINGS = new Set(['table-of-contents', 'tldr', 'sources', 'recommended']);

const WORDS_PER_MINUTE = 200;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Give every H2 block a unique anchor id. The same ids are used by the body
 * renderer and the "On this page" sidebar, so the two always line up.
 */
export function getHeadingIds(body: PortableTextBlock[]): Map<string, Heading> {
  const used = new Map<string, number>();
  const headings = new Map<string, Heading>();
  for (const block of body) {
    if (block._type !== 'block' || block.style !== 'h2' || !block._key) {
      continue;
    }
    const text = toPlainText(block).trim();
    const base = slugify(text) || 'section';
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    headings.set(block._key, { id: count === 0 ? base : `${base}-${count + 1}`, text });
  }
  return headings;
}

export function sidebarHeadings(headings: Map<string, Heading>): Heading[] {
  return [...headings.values()].filter((heading) => !SKIPPED_HEADINGS.has(heading.id));
}

export function readingTimeMinutes(plainText: string): number {
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
