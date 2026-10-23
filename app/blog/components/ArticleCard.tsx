import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { BLOG_BASE_PATH } from '../constants';
import { formatDate } from '../format';
import type { BlogPostSummary } from '../lib/posts';

export function ArticleCard({
  post,
  featured = false,
}: {
  post: BlogPostSummary;
  featured?: boolean;
}) {
  const href = `${BLOG_BASE_PATH}/${post.slug}`;

  if (featured) {
    return (
      <Link
        href={href}
        className="group grid overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg md:grid-cols-5"
      >
        <div className="relative aspect-[16/9] bg-muted md:col-span-3 md:aspect-auto md:min-h-[340px]">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:col-span-2 md:p-8">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
            <span className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground">Featured</span>
            {post.topic ? <span className="text-muted-foreground">{post.topic}</span> : null}
          </div>
          <h2 className="font-serif text-2xl font-bold leading-tight text-foreground text-balance group-hover:text-primary md:text-3xl">
            {post.title}
          </h2>
          <p className="line-clamp-4 text-muted-foreground text-pretty">{post.description}</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <time dateTime={post.publishedAt} className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </time>
            <span className="flex items-center gap-1 font-medium text-primary">
              Read article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.topic ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{post.topic}</span>
        ) : null}
        <h2 className="mt-2 font-serif text-xl font-bold leading-snug text-foreground text-balance group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <time dateTime={post.publishedAt} className="text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
          <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
