import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import PricingHero from "@/components/pricing/pricing-hero"
import PricingPlans from "@/components/pricing/pricing-plans"
import PlanDetails from "@/components/pricing/plan-details"
import PricingBenefits from "@/components/pricing/pricing-benefits"
import EnterpriseSection from "@/components/pricing/enterprise-section"
import TransparencySection from "@/components/pricing/transparency-section"
import PricingCTA from "@/components/pricing/pricing-cta"

export const metadata: Metadata = {
  title: "Pricing Plans - Affordable Press Release Distribution | News Today",
  description: "Choose from our flexible pricing plans for press release distribution across Australia. Transparent pricing, no hidden fees, and guaranteed media coverage starting from just $99.",
  keywords: [
    "press release pricing Australia",
    "media distribution cost",
    "press release service pricing",
    "Australian press release rates",
    "news distribution pricing",
    "affordable press release service"
  ],
  openGraph: {
    title: "Pricing Plans - Affordable Press Release Distribution | News Today",
    description: "Choose from our flexible pricing plans for press release distribution across Australia. Transparent pricing, no hidden fees, and guaranteed media coverage starting from just $99.",
    url: 'https://newstoday.com.au/pricing',
    type: 'website',
    images: [
      {
        url: '/og-pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'News Today Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pricing Plans - Affordable Press Release Distribution | News Today",
    description: "Choose from our flexible pricing plans for press release distribution across Australia. Transparent pricing, no hidden fees, and guaranteed media coverage starting from just $99.",
    images: ['/og-pricing.jpg'],
  },
  alternates: {
    canonical: 'https://newstoday.com.au/pricing',
  },
}


export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PricingHero />

      <PricingPlans />

      <PlanDetails />

      <PricingBenefits />

      <EnterpriseSection />

      <TransparencySection />

      <PricingCTA />

      <Footer />
    </div>
  )
}
