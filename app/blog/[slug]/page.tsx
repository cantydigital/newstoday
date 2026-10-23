import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleJsonLd } from '../components/ArticleJsonLd';
import { BlogCta } from '../components/BlogCta';
import { PostBody } from '../components/PostBody';
import { BLOG_BASE_PATH, SITE_URL } from '../constants';
import { getHeadingIds, readingTimeMinutes, sidebarHeadings } from '../content';
import { formatDate } from '../format';
import { getAllPosts, getPostBySlug, type BlogPost, type BlogPostSummary } from '../lib/posts';
import '../blog-content.css';

export const revalidate = 3600;

export async function generateStaticParams() {
  // Don't fail the build when the CMS is unreachable; pages are then rendered
  // on demand and cached via ISR.
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error('Blog: failed to prerender posts', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {};
  }
  const canonical = SITE_URL ? `${SITE_URL}${BLOG_BASE_PATH}/${post.slug}` : undefined;
  return {
    title: post.title,
    description: post.description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonical,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

function articleJsonLd(post: BlogPost): Record<string, unknown> {
  const organization = { '@type': 'Organization', name: 'News Today', url: SITE_URL || undefined };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.coverImageUrl ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: post.authorName ? { '@type': 'Person', name: post.authorName } : organization,
    publisher: organization,
    mainEntityOfPage: SITE_URL ? `${SITE_URL}${BLOG_BASE_PATH}/${post.slug}` : undefined,
  };
}

// Prefer posts that share a keyword with this one, then fall back to the latest.
async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPostSummary[]> {
  try {
    const keywords = new Set(post.keywords);
    const others = (await getAllPosts()).filter((other) => other.id !== post.id);
    const shared = (other: BlogPostSummary) => other.keywords.filter((keyword) => keywords.has(keyword)).length;
    return others.sort((a, b) => shared(b) - shared(a)).slice(0, limit);
  } catch {
    return [];
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const headingIds = getHeadingIds(post.body);
  const headings = sidebarHeadings(headingIds);
  const readingTime = readingTimeMinutes(post.plainText);
  const related = await getRelatedPosts(post);

  return (
    <main className="min-h-screen bg-background">
      <ArticleJsonLd data={articleJsonLd(post)} />

      <section className="border-b border-border bg-muted/40">
        <div className="container mx-auto px-4 pb-10 pt-8 md:pb-14 md:pt-10">
          <div className="mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={BLOG_BASE_PATH} className="transition-colors hover:text-foreground">
                Blog
              </Link>
            </nav>

            {post.topic ? (
              <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">{post.topic}</p>
            ) : null}
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-foreground text-balance md:text-5xl">
              {post.title}
            </h1>
            {post.description ? (
              <p className="mt-5 text-lg text-muted-foreground text-pretty md:text-xl">{post.description}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">By {post.authorName ?? 'News Today'}</span>
              <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </time>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {post.coverImageUrl ? (
          <div className="mx-auto mt-10 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted shadow-lg">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="mx-auto w-full max-w-3xl">
            <PostBody body={post.body} headings={headingIds} />

            <footer className="mt-12 border-t border-border pt-8">
              {post.keywords.length > 0 ? (
                <>
                  <p className="mb-3 text-sm font-semibold text-foreground">Topics</p>
                  <ul className="flex flex-wrap gap-2">
                    {post.keywords.map((keyword) => (
                      <li
                        key={keyword}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {keyword}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <Button variant="outline" className="mt-8" asChild>
                <Link href={BLOG_BASE_PATH}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to all articles
                </Link>
              </Button>
            </footer>
          </article>

          {headings.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <nav aria-label="On this page" className="rounded-xl border border-border p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    On this page
                  </p>
                  <ul className="space-y-2.5 text-sm">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className="block leading-snug text-muted-foreground transition-colors hover:text-primary"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="rounded-xl bg-muted p-5">
                  <p className="font-serif text-lg font-bold text-foreground">Have news to share?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Publish your press release across Australia in minutes.
                  </p>
                  <Button size="sm" className="mt-4 w-full" asChild>
                    <Link href="/submit">Submit a Release</Link>
                  </Button>
                </div>
              </div>
            </aside>
          ) : null}
        </div>

        <div className="mx-auto max-w-6xl py-16">
          {related.length > 0 ? (
            <section className="mb-16">
              <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Keep reading</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((other) => (
                  <ArticleCard key={other.id} post={other} />
                ))}
              </div>
            </section>
          ) : null}
          <BlogCta />
        </div>
      </div>
    </main>
  );
}
