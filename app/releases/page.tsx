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

export default function AllPressReleasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Press Releases
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance">
              All Press Releases
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
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
