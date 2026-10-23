import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BlogCta() {
  return (
    <section className="rounded-xl bg-primary px-6 py-10 text-center text-primary-foreground md:px-12 md:py-14">
      <h2 className="font-serif text-2xl font-bold text-balance md:text-3xl">
        Ready to share your news across Australia?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80 text-pretty">
        Publish your press release on News Today and get it in front of journalists, media outlets and
        readers nationwide.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" variant="secondary" asChild>
          <Link href="/submit">
            Submit a Release
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          asChild
        >
          <Link href="/pricing">View Pricing</Link>
        </Button>
      </div>
    </section>
  );
}
