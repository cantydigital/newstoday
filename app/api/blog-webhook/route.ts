import { timingSafeEqual } from 'node:crypto';
import { createClient, type SanityClient } from '@sanity/client';
import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { BLOG_BASE_PATH, SITE_URL } from '@/app/blog/constants';
import { apiVersion, dataset, projectId } from '@/app/blog/lib/sanity';
import { markdownToBody, type PendingImage } from './convert';

/**
 * Receives articles from the BabyLoveGrowth webhook integration and saves them
 * as Sanity `post` documents, with images copied into Sanity's asset store.
 * https://www.babylovegrowth.ai/docs/integrations/webhook
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// BabyLoveGrowth waits up to 120s; image uploads are the slow part.
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const payloadSchema = z.object({
  id: z.union([z.number(), z.string().min(1)]),
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  metaDescription: z.string().nullish(),
  keywords: z.union([z.string(), z.array(z.string())]).nullish(),
  content_markdown: z.string().nullish(),
  heroImageUrl: z.string().nullish(),
  heroImageAlt: z.string().nullish(),
});

type Payload = z.infer<typeof payloadSchema>;

// BabyLoveGrowth treats any 2xx JSON reply as delivered, and only retries 429/5xx.
function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

function isAuthorized(request: NextRequest, secret: string): boolean {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const provided = bearer || request.headers.get('x-api-key') || '';
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

function toKeywords(value: Payload['keywords']): string[] {
  const list = Array.isArray(value) ? value : (value ?? '').split(',');
  return [...new Set(list.map((keyword) => keyword.trim()).filter(Boolean))];
}

async function uploadImage(client: SanityClient, url: string): Promise<string> {
  const { protocol, pathname } = new URL(url);
  if (protocol !== 'https:' && protocol !== 'http:') {
    throw new Error(`unsupported image URL ${url}`);
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok || !contentType.startsWith('image/')) {
    throw new Error(`could not download ${url} (${response.status} ${contentType})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(`${url} is larger than ${MAX_IMAGE_BYTES / 1024 / 1024}MB`);
  }
  // Sanity de-duplicates identical files, so retried deliveries reuse the same asset.
  const asset = await client.assets.upload('image', buffer, {
    filename: pathname.split('/').pop() || 'image',
    contentType,
  });
  return asset._id;
}

const imageRef = (assetId: string) => ({ _type: 'reference', _ref: assetId });

export async function POST(request: NextRequest) {
  const secret = process.env.BLOG_WEBHOOK_SECRET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!secret || !token) {
    console.error('[blog-webhook] BLOG_WEBHOOK_SECRET or SANITY_API_WRITE_TOKEN is not set');
    return reply(500, { success: false, error: 'Webhook is not configured' });
  }
  if (!isAuthorized(request, secret)) {
    return reply(401, { success: false, error: 'Unauthorized' });
  }

  let payload: Payload;
  try {
    payload = payloadSchema.parse(await request.json());
  } catch (error) {
    const detail = error instanceof z.ZodError ? error.issues.map((issue) => issue.path.join('.')).join(', ') : '';
    return reply(400, { success: false, error: `Invalid payload${detail ? `: ${detail}` : ''}` });
  }
  if (!payload.content_markdown?.trim()) {
    return reply(400, { success: false, error: 'Invalid payload: content_markdown is empty' });
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
  // Keyed on the BabyLoveGrowth article id, so retries and re-publishes update the same post.
  const docId = `blg-post-${String(payload.id).replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const slug = toSlug(payload.slug);
  const warnings: string[] = [];

  try {
    const [previousSlug, slugOwner] = await Promise.all([
      client.fetch<string | null>('*[_id == $id][0].slug.current', { id: docId }),
      client.fetch<string | null>(
        '*[_type == "post" && slug.current == $slug && !(_id in [$id, "drafts." + $id])][0]._id',
        { slug, id: docId }
      ),
    ]);
    if (slugOwner) {
      return reply(200, { success: false, error: `Slug "${slug}" is already used by another post (${slugOwner})` });
    }

    const { body, images } = markdownToBody(payload.content_markdown, payload.heroImageUrl);

    const [heroAssetId, ...inlineAssetIds] = await Promise.all(
      [payload.heroImageUrl ?? null, ...images.map((image) => image.src)].map(async (url) => {
        if (!url) {
          return null;
        }
        try {
          return await uploadImage(client, url);
        } catch (error) {
          warnings.push(error instanceof Error ? error.message : String(error));
          return null;
        }
      })
    );

    // Swap each pending image's source URL for the uploaded asset; drop ones that failed.
    const uploaded = new Map(images.map((image, index) => [image, inlineAssetIds[index]]));
    const finalBody = body.flatMap((block) => {
      if (block._type !== 'image') {
        return [block];
      }
      const assetId = uploaded.get(block as PendingImage);
      return assetId ? [{ _type: 'image', _key: block._key, alt: (block as PendingImage).alt, asset: imageRef(assetId) }] : [];
    });

    const fields: Record<string, unknown> = {
      title: payload.title,
      slug: { _type: 'slug', current: slug },
      excerpt: payload.metaDescription?.trim() || undefined,
      keywords: toKeywords(payload.keywords),
      body: finalBody,
    };
    if (heroAssetId) {
      fields.mainImage = { _type: 'image', alt: payload.heroImageAlt ?? undefined, asset: imageRef(heroAssetId) };
    }

    // createIfNotExists + patch keeps fields editors set in Studio (author,
    // categories, publishedAt) when an article is re-published.
    await client
      .transaction()
      .createIfNotExists({ _id: docId, _type: 'post', publishedAt: new Date().toISOString() })
      .patch(docId, (patch) => patch.set(fields))
      .commit({ visibility: 'sync' });

    revalidatePath(BLOG_BASE_PATH);
    revalidatePath(`${BLOG_BASE_PATH}/${slug}`);
    if (previousSlug && previousSlug !== slug) {
      revalidatePath(`${BLOG_BASE_PATH}/${previousSlug}`);
    }

    if (warnings.length > 0) {
      console.warn(`[blog-webhook] ${docId} saved with warnings:`, warnings);
    }
    return reply(200, {
      success: true,
      link: `${SITE_URL || 'https://newstoday.au'}${BLOG_BASE_PATH}/${slug}`,
      ...(warnings.length > 0 ? { warnings } : {}),
    });
  } catch (error) {
    // 500 makes BabyLoveGrowth retry, which is safe because the save is idempotent.
    console.error(`[blog-webhook] failed to save ${docId}`, error);
    return reply(500, { success: false, error: 'Failed to save the article' });
  }
}
