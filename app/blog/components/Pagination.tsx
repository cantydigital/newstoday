import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PageInfo } from '../pagination';
import { pageHref } from '../pagination';

const baseClass =
  'inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors';

export function Pagination({ basePath, info }: { basePath: string; info: PageInfo }) {
  if (info.totalPages <= 1) {
    return null;
  }
  return (
    <nav className="mt-12 flex items-center justify-between" aria-label="Pagination">
      {info.hasPrev ? (
        <Link href={pageHref(basePath, info.page - 1)} className={`${baseClass} text-foreground hover:bg-muted`}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className={`${baseClass} cursor-not-allowed text-muted-foreground/50`}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        Page {info.page} of {info.totalPages}
      </span>
      {info.hasNext ? (
        <Link href={pageHref(basePath, info.page + 1)} className={`${baseClass} text-foreground hover:bg-muted`}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${baseClass} cursor-not-allowed text-muted-foreground/50`}>
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
