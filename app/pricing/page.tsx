import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import PricingHero from "@/components/pricing/pricing-hero"
import PricingPlans from "@/components/pricing/pricing-plans"
import PlanDetails from "@/components/pricing/plan-details"
import PricingBenefits from "@/components/pricing/pricing-benefits"
import EnterpriseSection from "@/components/pricing/enterprise-section"
import TransparencySection from "@/components/pricing/transparency-section"
import PricingCTA from "@/components/pricing/pricing-cta"


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
