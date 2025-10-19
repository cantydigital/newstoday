import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Small business and first-time users",
    features: [
      "Publish 1 press release per month",
      "Basic formatting & classes",
      "Live on News Today website",
      "Limited SEO optimization"
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Standard",
    price: "$49",
    priceUnit: "per release",
    subtitle: "Emerging businesses and frequent PR necessities",
    features: [
      "Publish up to 5 releases per month",
      "SEO-optimized distribution",
      "Category targeting",
      "Placed in industry directories",
      "News alerts to reporters"
    ],
    buttonText: "Choose Standard",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Premium",
    price: "$99",
    priceUnit: "per release",
    subtitle: "Agencies and high-visibility campaigns",
    features: [
      "Unlimited press releases",
      "Priority editorial review",
      "Home page feature placement",
      "Category placement",
      "Advanced SEO & keyword optimization",
      "Performance tracking & analytics dashboard",
      "Media outreach support"
    ],
    buttonText: "Choose Premium",
    buttonVariant: "default" as const,
    popular: false
  }
]

export default function PricingPlans() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Select the Plan That Fits You
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative border-border ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.priceUnit && (
                    <span className="text-muted-foreground ml-2">/ {plan.priceUnit}</span>
                  )}
                </div>
                <CardDescription className="mt-2 text-center">
                  {plan.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                  asChild
                >
                  <Link href="/submit">
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Note:</strong> Large organizations or agencies with several clients can use custom enterprise packages.
          </p>
          <Button variant="outline">
            Contact Us for Custom Solutions
          </Button>
        </div>
      </div>
    </section>
  )
}
