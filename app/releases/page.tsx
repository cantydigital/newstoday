import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Calendar, 
  User, 
  Building, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Filter
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import AllPressReleasesClient from "@/components/releases/all-press-releases-client"

export const metadata: Metadata = {
  title: "All Press Releases - Latest News from Australian Businesses",
  description: "Browse all published press releases from businesses, organizations, and agencies across Australia. Stay updated with the latest news, announcements, and industry updates.",
  keywords: [
    "Australian press releases",
    "business news Australia",
    "company announcements",
    "latest press releases",
    "Australian business news",
    "corporate news",
    "industry updates Australia"
  ],
  openGraph: {
    title: "All Press Releases - Latest News from Australian Businesses",
    description: "Browse all published press releases from businesses, organizations, and agencies across Australia. Stay updated with the latest news, announcements, and industry updates.",
    url: 'https://newstoday.com.au/releases',
    type: 'website',
    images: [
      {
        url: '/og-releases.jpg',
        width: 1200,
        height: 630,
        alt: 'News Today - All Press Releases',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "All Press Releases - Latest News from Australian Businesses",
    description: "Browse all published press releases from businesses, organizations, and agencies across Australia. Stay updated with the latest news, announcements, and industry updates.",
    images: ['/og-releases.jpg'],
  },
  alternates: {
    canonical: 'https://newstoday.com.au/releases',
  },
}

export default function AllPressReleasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Press Releases
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
              All Press Releases
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 text-pretty max-w-2xl mx-auto leading-relaxed">
              Browse all published press releases from businesses, organizations, and agencies across Australia. Stay updated with the latest news and announcements.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Latest press releases from trusted sources</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <AllPressReleasesClient />

      <Footer />
    </div>
  )
}
