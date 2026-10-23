import { markdownToPortableText } from '@portabletext/markdown';
import { compileSchema, defineSchema } from '@portabletext/schema';

/**
 * Mirrors studio/schemaTypes/blockContent.ts, so the converter only emits
 * content the Studio can edit. Anything else (code, callouts, raw HTML) falls
 * back to plain text blocks or is dropped by the library.
 */
const schema = compileSchema(
  defineSchema({
    styles: [
      { name: 'normal' },
      { name: 'h1' },
      { name: 'h2' },
      { name: 'h3' },
      { name: 'h4' },
      { name: 'blockquote' },
    ],
    lists: [{ name: 'bullet' }, { name: 'number' }],
    decorators: [{ name: 'strong' }, { name: 'em' }],
    annotations: [{ name: 'link', fields: [{ name: 'href', type: 'string' }] }],
    blockObjects: [
      {
        name: 'image',
        fields: [
          { name: 'src', type: 'string' },
          { name: 'alt', type: 'string' },
        ],
      },
      {
        name: 'table',
        fields: [
          { name: 'headerRows', type: 'number' },
          { name: 'rows', type: 'array' },
        ],
      },
    ],
  })
);

type Block = { _type: string; _key: string; [field: string]: unknown };

interface Span {
  _type: string;
  text?: string;
}

/** Image in the body, still pointing at its source URL until it's uploaded. */
export interface PendingImage extends Block {
  _type: 'image';
  src: string;
  alt?: string;
}

export interface StudioTableRow {
  _type: 'tableRow';
  _key: string;
  cells: string[];
}

function textOf(blocks: unknown): string {
  if (!Array.isArray(blocks)) {
    return '';
  }
  return blocks
    .flatMap((block: { children?: Span[] }) => block.children ?? [])
    .map((child) => child.text ?? '')
    .join('')
    .trim();
}

/** The library's nested table shape, flattened to rows of plain-text cells. */
function toStudioTable(block: Block): Block {
  const rows = (block.rows as { _key: string; cells?: { value?: unknown }[] }[] | undefined) ?? [];
  return {
    _type: 'table',
    _key: block._key,
    hasHeaderRow: Number(block.headerRows ?? 0) > 0,
    rows: rows.map(
      (row): StudioTableRow => ({
        _type: 'tableRow',
        _key: row._key,
        cells: (row.cells ?? []).map((cell) => textOf(cell.value)),
      })
    ),
  };
}

/**
 * Convert an article's Markdown into Portable Text for the Studio's
 * `blockContent` type. The page renders the title and hero image itself, so a
 * leading H1 and the hero image are removed from the body.
 */
export function markdownToBody(markdown: string, heroImageUrl?: string | null) {
  const blocks = markdownToPortableText(markdown, { schema }) as Block[];

  const body: Block[] = [];
  let seenText = false;
  for (const block of blocks) {
    if (!seenText && block._type === 'block' && block.style === 'h1') {
      continue;
    }
    if (block._type === 'image' && (block as PendingImage).src === heroImageUrl) {
      continue;
    }
    if (block._type === 'block') {
      seenText = true;
    }
    body.push(block._type === 'table' ? toStudioTable(block) : block);
  }

  const images = body.filter((block): block is PendingImage => block._type === 'image');
  return { body, images };
}
