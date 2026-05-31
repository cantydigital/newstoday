import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

const SINGLE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_SINGLE_PAYMENT_LINK ||
  "https://buy.stripe.com/4gMcN5fhpaxPgBWbQzao80U"
const BUNDLE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_BUNDLE_PAYMENT_LINK ||
  "https://buy.stripe.com/14A14n8T121j1H24o7ao80V"

const plans = [
  {
    name: "Single Release",
    price: "$39",
    priceUnit: "per release",
    subtitle: "Perfect for one-off announcements and first-time publishers",
    features: [
      "1 press release credit",
      "Editorial review",
      "SEO-optimised distribution",
      "Live on News Today within 24\u201348 hours",
      "Category placement",
    ],
    buttonText: "Buy 1 Release \u2014 $39",
    buttonVariant: "default" as const,
    popular: false,
    href: SINGLE_LINK,
  },
  {
    name: "10 Release Bundle",
    price: "$300",
    priceUnit: "for 10 releases",
    subtitle: "Best value for agencies and frequent publishers \u2014 save 23%",
    features: [
      "10 press release credits",
      "Effective $30 per release",
      "Priority editorial review",
      "SEO-optimised distribution",
      "Category & homepage eligibility",
      "Credits never expire",
    ],
    buttonText: "Buy 10 Releases \u2014 $300",
    buttonVariant: "default" as const,
    popular: true,
    href: BUNDLE_LINK,
  },
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                  <a href={plan.href} target="_blank" rel="noopener noreferrer">
                    {plan.buttonText}
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Secure checkout via Stripe. Credits are linked to the email
                  you use at checkout.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            After payment, head to <Link href="/submit" className="underline">our submission form</Link>{" "}
            and use the same email address you paid with. Your credit will be
            applied automatically.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Need a custom enterprise package?</strong>{" "}
            Large organisations and agencies with several clients can request a quote.
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us for Custom Solutions</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
