import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Calendar, User, Building, Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getPressReleaseBySlug, getRecentPressReleases } from "@/lib/press-releases"
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

  const description = release.subtitle || release.content.replace(/<[^>]*>/g, '').substring(0, 160)
  
  return {
    title: `${release.title} - ${release.company} | News Today`,
    description: description,
    keywords: [
      release.category.toLowerCase(),
      release.company.toLowerCase(),
      'press release',
      'Australian news',
      'business news',
      release.author.toLowerCase()
    ],
    authors: [{ name: release.author }],
    publisher: 'News Today',
    openGraph: {
      title: release.title,
      description: description,
      url: `https://newstoday.com.au/releases/${release.slug}`,
      siteName: 'News Today',
      images: release.imageUrl ? [
        {
          url: release.imageUrl,
          width: 1200,
          height: 630,
          alt: release.title,
        }
      ] : [
        {
          url: '/og-press-release.jpg',
          width: 1200,
          height: 630,
          alt: release.title,
        }
      ],
      type: "article",
      publishedTime: release.publishedAt?.toISOString(),
      authors: [release.author],
      section: release.category,
      locale: 'en_AU',
    },
    twitter: {
      card: "summary_large_image",
      title: release.title,
      description: description,
      images: release.imageUrl ? [release.imageUrl] : ['/og-press-release.jpg'],
      creator: '@newstoday_au',
    },
    alternates: {
      canonical: `https://newstoday.com.au/releases/${release.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PressReleasePage({ params }: PressReleasePageProps) {
  const [release, recentReleases] = await Promise.all([
    getPressReleaseBySlug(params.slug),
    getRecentPressReleases(params.slug, 5)
  ])

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
        <div className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <article className="lg:col-span-2">
              
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
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
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
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-1">
                  <div className="sticky top-24">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Recent Press Releases
                        </h3>
                        <div className="space-y-4">
                          {recentReleases.length > 0 ? (
                            recentReleases.map((recentRelease) => (
                              <Link
                                key={recentRelease.id}
                                href={`/releases/${recentRelease.slug}`}
                                className="block group"
                              >
                                <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                                  <div className="flex items-start gap-3">
                                    {recentRelease.imageUrl && (
                                      <img
                                        src={recentRelease.imageUrl}
                                        alt={recentRelease.title}
                                        className="w-16 h-12 object-cover rounded flex-shrink-0"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                        {recentRelease.title}
                                      </h4>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-xs">
                                          {recentRelease.category}
                                        </Badge>
                                        <span>•</span>
                                        <span>{format(recentRelease.publishedAt!, "MMM dd")}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {recentRelease.company}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No recent press releases available.
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-border">
                          <Button variant="outline" size="sm" asChild className="w-full">
                            <Link href="/releases">
                              View All Press Releases
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
