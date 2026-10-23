import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import type { SanityImageSource } from '@sanity/image-url';
import type { Heading } from '../content';
import { imageUrl } from '../lib/sanity';

type ImageValue = SanityImageSource & { alt?: string; caption?: string; asset?: unknown };

interface TableValue {
  hasHeaderRow?: boolean;
  rows?: { _key: string; cells?: string[] }[];
}

function components(headings: Map<string, Heading>): PortableTextComponents {
  return {
    block: {
      // The page title is the only <h1>, so body H1s render one level down.
      h1: ({ children }) => <h2>{children}</h2>,
      h2: ({ children, value }) => <h2 id={value._key ? headings.get(value._key)?.id : undefined}>{children}</h2>,
    },
    marks: {
      link: ({ children, value }) => {
        const href: string = value?.href ?? '';
        const external = /^https?:\/\//.test(href) && !href.includes('newstoday.au');
        return (
          <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }: { value: ImageValue }) => {
        if (!value?.asset) {
          return null;
        }
        return (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl(value).width(1200).fit('max').url()} alt={value.alt ?? ''} loading="lazy" />
            {value.caption ? <figcaption>{value.caption}</figcaption> : null}
          </figure>
        );
      },
      table: ({ value }: { value: TableValue }) => {
        const rows = value?.rows ?? [];
        if (rows.length === 0) {
          return null;
        }
        const [first, ...rest] = rows;
        const header = value.hasHeaderRow ? first : null;
        const bodyRows = header ? rest : rows;
        return (
          <table>
            {header ? (
              <thead>
                <tr>
                  {(header.cells ?? []).map((cell, index) => (
                    <th key={index}>{cell}</th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {bodyRows.map((row) => (
                <tr key={row._key}>
                  {(row.cells ?? []).map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      },
    },
  };
}

export function PostBody({ body, headings }: { body: PortableTextBlock[]; headings: Map<string, Heading> }) {
  return (
    <div className="blog-content">
      <PortableText value={body} components={components(headings)} />
    </div>
  );
}
