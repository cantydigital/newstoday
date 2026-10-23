import type { PortableTextBlock } from '@portabletext/react';
import type { SanityImageSource } from '@sanity/image-url';
import { imageUrl, sanityClient } from './sanity';

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  publishedAt: string;
  updatedAt: string;
  authorName: string | null;
  topic: string | null;
  keywords: string[];
}

export interface BlogPost extends BlogPostSummary {
  body: PortableTextBlock[];
  /** Body as plain text, for reading time. */
  plainText: string;
}

const DESCRIPTION_LENGTH = 180;

// Published posts with a slug, excluding ones scheduled for the future.
const POST_FILTER = '_type == "post" && defined(slug.current) && coalesce(publishedAt, _createdAt) <= now()';

const SUMMARY_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  "publishedAt": coalesce(publishedAt, _createdAt),
  _updatedAt,
  "authorName": author->name,
  "categories": categories[]->title,
  keywords,
  "plainText": pt::text(body)
`;

interface SummaryRow {
  _id: string;
  title: string | null;
  slug: string;
  excerpt: string | null;
  mainImage: SanityImageSource | null;
  publishedAt: string;
  _updatedAt: string;
  authorName: string | null;
  categories: (string | null)[] | null;
  keywords: string[] | null;
  plainText: string | null;
}

interface PostRow extends SummaryRow {
  body: PortableTextBlock[] | null;
}

function truncate(text: string, length: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= length) {
    return clean;
  }
  const cut = clean.lastIndexOf(' ', length);
  return `${clean.slice(0, cut > 0 ? cut : length).replace(/[,.;:]$/, '')}…`;
}

function toSummary(row: SummaryRow): BlogPostSummary {
  // Categories are the editorial topics; imported posts only carry SEO keywords.
  const categories = (row.categories ?? []).filter((title): title is string => Boolean(title));
  const keywords = categories.length > 0 ? categories : (row.keywords ?? []).filter(Boolean);
  return {
    id: row._id,
    slug: row.slug,
    title: row.title ?? 'Untitled',
    description: row.excerpt?.trim() || truncate(row.plainText ?? '', DESCRIPTION_LENGTH),
    // mainImage can exist without an uploaded asset while an editor is mid-way.
    coverImageUrl:
      row.mainImage && typeof row.mainImage === 'object' && 'asset' in row.mainImage && row.mainImage.asset
        ? imageUrl(row.mainImage).width(1600).height(900).fit('crop').url()
        : null,
    publishedAt: row.publishedAt,
    updatedAt: row._updatedAt,
    authorName: row.authorName,
    topic: keywords[0] ?? null,
    keywords,
  };
}

export async function getAllPosts(): Promise<BlogPostSummary[]> {
  const rows = await sanityClient.fetch<SummaryRow[]>(
    `*[${POST_FILTER}] | order(coalesce(publishedAt, _createdAt) desc) { ${SUMMARY_FIELDS} }`
  );
  return rows.map(toSummary);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await sanityClient.fetch<PostRow | null>(
    `*[${POST_FILTER} && slug.current == $slug][0] { ${SUMMARY_FIELDS}, body }`,
    { slug }
  );
  if (!row) {
    return null;
  }
  return { ...toSummary(row), body: row.body ?? [], plainText: row.plainText ?? '' };
}
