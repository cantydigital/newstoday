import { CheckCircle2 } from "lucide-react"

const industries = [
  "Business & Finance",
  "Technology & Startups",
  "Health & Wellness",
  "Education",
  "Real Estate & Construction",
  "Travel & Lifestyle",
  "Environment & Sustainability",
  "Retail & E-commerce",
  "Government & Public Sector",
  "Automotive",
  "Energy & Mining",
  "Entertainment & Media",
]

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Industries We Cover
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            If it's newsworthy, it belongs on News Today
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {industries.map((industry) => (
            <div key={industry} className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">{industry}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
