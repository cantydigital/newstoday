import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { ArticleCard } from './components/ArticleCard';
import { BlogCta } from './components/BlogCta';
import { Pagination } from './components/Pagination';
import { BLOG_BASE_PATH, SITE_NAME } from './constants';
import { getAllPosts } from './lib/posts';
import { paginate, parsePage } from './pagination';

export const revalidate = 3600;

const DESCRIPTION =
  'Practical guides on press releases, media relations and getting your business news covered in Australia.';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: DESCRIPTION,
  alternates: { canonical: BLOG_BASE_PATH },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const posts = await getAllPosts();
  const { items, info } = paginate(posts, parsePage(page));
  const featured = info.page === 1 ? items[0] : undefined;
  const rest = featured ? items.slice(1) : items;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/40">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Insights &amp; Guides</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-foreground text-balance md:text-5xl">
              {SITE_NAME}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">{DESCRIPTION}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-20 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">No articles yet</h2>
              <p className="mt-2 text-muted-foreground">New guides are on the way. Check back soon.</p>
            </div>
          ) : (
            <>
              {featured ? <ArticleCard post={featured} featured /> : null}

              {rest.length > 0 ? (
                <>
                  {featured ? (
                    <h2 className="mb-6 mt-14 font-serif text-2xl font-bold text-foreground">Latest articles</h2>
                  ) : null}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post) => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                </>
              ) : null}

              <Pagination basePath={BLOG_BASE_PATH} info={info} />
            </>
          )}

          <div className="mt-16">
            <BlogCta />
          </div>
        </div>
      </div>
    </main>
  );
}
