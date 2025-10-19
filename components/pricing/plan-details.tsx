import { Card, CardContent } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

const planDetails = [
  {
    name: "Free Plan",
    description: "Ideal for startups and small companies making their first steps in press distribution.",
    highlights: [
      "Publish your initial press statement free of charge",
      "Get a professional appearance on News Today",
      "Access to journalists and readers in Australia"
    ]
  },
  {
    name: "Standard Plan",
    description: "Aimed at businesses that do frequent news sharing and prefer more visibility.",
    highlights: [
      "Selective distribution to targeted industries",
      "Google News & search engines release formatting, SEO-ready",
      "Email alerts to journalists and media partners"
    ]
  },
  {
    name: "Premium Plan",
    description: "Perfect for PR agencies, marketing companies, or businesses requiring maximum impact.",
    highlights: [
      "Special editorial consideration for professional appearance",
      "Placement on home page and category pages of News Today",
      "Advanced analytics to monitor reach, engagement and views",
      "Media outreach services for additional exposure"
    ]
  }
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
