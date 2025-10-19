import { Card, CardContent } from "@/components/ui/card"
import { Shield, Globe, TrendingUp, Target } from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Increasing Brand Credibility",
    description: "Create trust through expert announcements and professional distribution."
  },
  {
    icon: Globe,
    title: "Increasing Media Exposure",
    description: "Reach out directly to journalists and media partners across Australia."
  },
  {
    icon: TrendingUp,
    title: "Generating Website Traffic",
    description: "SEO optimized releases provide long-term discoverability and organic traffic."
  },
  {
    icon: Target,
    title: "Strengthening Marketing Activities",
    description: "Support product releases, events, and campaigns with professional distribution."
  }
]

export default function PricingBenefits() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Why Invest in Press Release Distribution?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            It's not just about publishing a press release
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <Card key={benefit.title} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            News Today allows you to select a plan that supports your communication objectives, whether you need to attract attention to your first story or organize numerous campaigns with clients.
          </p>
        </div>
      </div>
    </section>
  )
}
