import { Card, CardContent } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

const planDetails = [
  {
    name: "Single Release \u2014 $39",
    description:
      "Perfect for one-off announcements, product launches, and businesses publishing for the first time on News Today.",
    highlights: [
      "1 press release credit, no subscription",
      "Editorial review by our team",
      "SEO-ready formatting for Google News & search",
      "Live on News Today within 24\u201348 hours",
    ],
  },
  {
    name: "10 Release Bundle \u2014 $300",
    description:
      "Designed for PR agencies, marketing teams, and businesses with a steady drumbeat of announcements. Save 23% compared to buying singles.",
    highlights: [
      "10 press release credits (effective $30 per release)",
      "Priority editorial review",
      "Credits never expire and are linked to your email",
      "Category and homepage placement eligibility",
      "Email alerts to journalists and media partners",
    ],
  },
]

export default function PlanDetails() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Plan Details & Benefits
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {planDetails.map((plan, index) => (
            <Card key={plan.name} className="border-border">
              <CardContent className="pt-8">
                <div className="flex items-start gap-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-3">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {plan.description}
                    </p>
                    <ul className="space-y-3">
                      {plan.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
