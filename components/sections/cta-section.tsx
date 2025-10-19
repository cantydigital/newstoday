import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-balance">
            Start Publishing with News Today
          </h2>
          <p className="text-lg mb-8 text-pretty opacity-90 leading-relaxed">
            It only takes a few clicks to have your story live and in front of journalists, readers, and investors.
            Make your announcement count.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base" asChild>
              <Link href="/submit">
                Submit Your Press Release
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Talk to Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
