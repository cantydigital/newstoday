import type { Metadata } from "next"
import { getPressReleases, getFeaturedPressReleases } from "@/lib/press-releases"
import type { PressRelease } from "@/types/press-release"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import FeaturedPressReleases from "@/components/sections/featured-press-releases"
import RecentPressReleases from "@/components/sections/recent-press-releases"
import WhyChooseSection from "@/components/sections/why-choose-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import WhoUsesSection from "@/components/sections/who-uses-section"
import IndustriesSection from "@/components/sections/industries-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import CTASection from "@/components/sections/cta-section"

export const metadata: Metadata = {
  title: "News Today - Australia's Leading Press Release Distribution Service",
  description: "Get your press releases published across Australia's top media outlets. Fast, reliable, and affordable press release distribution service with guaranteed media coverage.",
  keywords: [
    "press release distribution Australia",
    "media coverage Australia",
    "press release service",
    "Australian news distribution",
    "business news Australia",
    "media outreach",
    "press release publishing"
  ],
  openGraph: {
    title: "News Today - Australia's Leading Press Release Distribution Service",
    description: "Get your press releases published across Australia's top media outlets. Fast, reliable, and affordable press release distribution service with guaranteed media coverage.",
    url: 'https://newstoday.com.au',
    type: 'website',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'News Today - Press Release Distribution Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "News Today - Australia's Leading Press Release Distribution Service",
    description: "Get your press releases published across Australia's top media outlets. Fast, reliable, and affordable press release distribution service with guaranteed media coverage.",
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: 'https://newstoday.com.au',
  },
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  let featuredReleases: PressRelease[] = []
  let recentReleases: PressRelease[] = []

  try {
    featuredReleases = await getFeaturedPressReleases()
    recentReleases = await getPressReleases(6)
  } catch (error) {
    console.error("[v0] Error fetching press releases:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <FeaturedPressReleases releases={featuredReleases} />

      <RecentPressReleases releases={recentReleases} />

      <WhyChooseSection />

      <HowItWorksSection />

      <WhoUsesSection />

      <IndustriesSection />

      <TestimonialsSection />

      <CTASection />

      <Footer />
    </div>
  )
}
