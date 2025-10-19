import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PricingCTA() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-balance">
            Get Started Today
          </h2>
          <p className="text-lg mb-8 text-pretty opacity-90 leading-relaxed">
            Publishing your press release has been made easy
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 mb-8 text-left">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="h-8 w-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-sm font-bold mb-2">
                1
              </div>
              <h3 className="font-semibold mb-1">Choose Your Plan</h3>
              <p className="text-sm opacity-90">Select the perfect plan for your needs</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="h-8 w-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-sm font-bold mb-2">
                2
              </div>
              <h3 className="font-semibold mb-1">Upload Your Release</h3>
              <p className="text-sm opacity-90">Add your press release content</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="h-8 w-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-sm font-bold mb-2">
                3
              </div>
              <h3 className="font-semibold mb-1">Target Audience</h3>
              <p className="text-sm opacity-90">Choose categories and target audience</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="h-8 w-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-sm font-bold mb-2">
                4
              </div>
              <h3 className="font-semibold mb-1">Go Live</h3>
              <p className="text-sm opacity-90">Deploy and become operational in hours</p>
            </div>
          </div>

          <p className="text-lg mb-8 opacity-90">
            Give your brand a voice with News Today, today!
          </p>
          
          <Button size="lg" variant="secondary" className="text-base" asChild>
            <Link href="/submit">
              Submit Your Press Release
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
