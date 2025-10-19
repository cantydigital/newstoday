import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, User } from "lucide-react"
import { truncateHtml } from "@/lib/html-utils"
import Link from "next/link"
import { format } from "date-fns"
import type { PressRelease } from "@/types/press-release"

interface RecentPressReleasesProps {
  releases: PressRelease[]
}

export default function RecentPressReleases({ releases }: RecentPressReleasesProps) {
  if (releases.length === 0) {
    return null
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Recent Press Releases
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Stay updated with the latest news and announcements
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {releases.map((release) => (
            <Card key={release.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {release.imageUrl && (
                    <img
                      src={release.imageUrl || "/placeholder.svg"}
                      alt={release.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{release.category}</Badge>
                      {release.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">{release.title}</h3>
                    {release.subtitle && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{release.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      <span>{format(release.publishedAt!, "MMMM dd, yyyy")}</span>
                      <span>•</span>
                      <span>{release.company}</span>
                      <span>•</span>
                      <span>By {release.author}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{truncateHtml(release.content, 150)}</p>
                    <Button variant="link" className="p-0 h-auto text-primary" asChild>
                      <Link href={`/releases/${release.slug}`}>
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/releases">
              View All Press Releases
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
