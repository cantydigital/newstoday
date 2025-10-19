import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Calendar, User, Building, Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getPressReleaseBySlug } from "@/lib/press-releases"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HtmlContent from "@/components/ui/html-content"
import { generatePressReleaseStructuredData } from "@/lib/seo-utils"
import type { Metadata } from "next"

interface PressReleasePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PressReleasePageProps): Promise<Metadata> {
  const release = await getPressReleaseBySlug(params.slug)
  
  if (!release) {
    return {
      title: "Press Release Not Found - News Today",
      description: "The requested press release could not be found."
    }
  }

  return {
    title: `${release.title} - ${release.company} | News Today`,
    description: release.subtitle || release.content.substring(0, 160),
    openGraph: {
      title: release.title,
      description: release.subtitle || release.content.substring(0, 160),
      images: release.imageUrl ? [release.imageUrl] : [],
      type: "article",
      publishedTime: release.publishedAt?.toISOString(),
      authors: [release.author],
    },
    twitter: {
      card: "summary_large_image",
      title: release.title,
      description: release.subtitle || release.content.substring(0, 160),
      images: release.imageUrl ? [release.imageUrl] : [],
    },
  }
}

export default async function PressReleasePage({ params }: PressReleasePageProps) {
  const release = await getPressReleaseBySlug(params.slug)

  if (!release || release.status !== "published") {
    notFound()
  }

  const structuredData = generatePressReleaseStructuredData(release)

  return (
    <div className="min-h-screen bg-background">
      <Header 
        showNavigation={false}
        customContent={
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/releases" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Releases
              </Link>
            </Button>
            <Badge variant="secondary">Press Release</Badge>
          </div>
        }
      />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="pt-20">
        <article className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{release.category}</Badge>
                  {release.featured && (
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
                  {release.title}
                </h1>
                
                {release.subtitle && (
                  <p className="text-xl text-muted-foreground mb-6 text-pretty">
                    {release.subtitle}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(release.publishedAt!, "MMMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{release.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By {release.author}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {release.imageUrl && (
                <div className="mb-8">
                  <img
                    src={release.imageUrl}
                    alt={release.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="mb-12">
                <HtmlContent 
                  content={release.content}
                  className="prose-lg"
                />
              </div>

              <Separator className="my-8" />

              {/* Contact Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Media Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-foreground mb-2">Company</p>
                      <p className="text-muted-foreground">{release.company}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-2">Contact Person</p>
                      <p className="text-muted-foreground">{release.author}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-2">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${release.contactEmail}`}
                          className="text-primary hover:underline"
                        >
                          {release.contactEmail}
                        </a>
                      </div>
                    </div>
                    {release.contactPhone && (
                      <div>
                        <p className="font-medium text-foreground mb-2">Phone</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`tel:${release.contactPhone}`}
                            className="text-primary hover:underline"
                          >
                            {release.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button variant="outline" asChild>
                  <Link href="/releases">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    View All Press Releases
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/submit">
                    Submit Your Press Release
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
