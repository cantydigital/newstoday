import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

// Defaults match studio/sanity.config.ts; override per environment if needed.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'n17820f7';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = '2025-02-19';

// Only needed if the dataset is private. Server-side only: never prefix with NEXT_PUBLIC_.
const token = process.env.SANITY_API_READ_TOKEN;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // The CDN can't serve authenticated requests.
  useCdn: !token,
  token,
  perspective: 'published',
});

const builder = createImageUrlBuilder({ projectId, dataset });

export function imageUrl(source: SanityImageSource) {
  return builder.image(source).auto('format');
}
