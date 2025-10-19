import { Badge } from "@/components/ui/badge"

export default function PricingHero() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance">
            Publish Your Press Release with News Today
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
            Plans that are flexible for all businesses. At News Today, we believe professional press release distribution should be quick, effective and affordable regardless of your business size.
          </p>
          <p className="text-base text-muted-foreground">
            We have options that best suit your budget and needs; startup, established company or PR agency.
          </p>
        </div>
      </div>
    </section>
  )
}
