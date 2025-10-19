import { Card, CardContent } from "@/components/ui/card"
import { Zap, Globe, TrendingUp, Shield, BarChart3, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Publication",
    description: "Publish your press release fast and effectively. Upload your content, include media, and go live in hours. No waiting, no back-and-forths."
  },
  {
    icon: Globe,
    title: "Wide Media Distribution",
    description: "We disseminate your release through our network of journalists, media houses, bloggers, and search engines across Australia and internationally."
  },
  {
    icon: TrendingUp,
    title: "SEO-Optimized Reach",
    description: "All releases follow SEO best practices. Get featured on Google News, search engines, and industry pages for long-term visibility and traffic."
  },
  {
    icon: Shield,
    title: "Credibility and Authority",
    description: "Featuring in a reliable press release source gives credibility to your brand. Provide your announcements the professional exposure they deserve."
  },
  {
    icon: BarChart3,
    title: "Affordable Pricing Plans",
    description: "Quality distribution shouldn't break your budget. Flexible plans from free submissions to premium services let you control exposure and speed."
  },
  {
    icon: Clock,
    title: "Track Performance",
    description: "Premium users get analytics on views, reach, and engagement to gauge the success of your communications and optimize future releases."
  }
]

export default function WhyChooseSection() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Why Choose News Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Professional press release distribution designed for modern businesses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-border">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
