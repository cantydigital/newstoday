import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import { truncateHtml } from "@/lib/html-utils"
import { format } from "date-fns"
import Link from "next/link"
import type { PressRelease } from "@/types/press-release"

interface FeaturedPressReleasesProps {
  releases: PressRelease[]
}

export default function FeaturedPressReleases({ releases }: FeaturedPressReleasesProps) {
  if (releases.length === 0) {
    return null
  }

  return (
    <section className="py-20 md:py-28 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Featured
          </Badge>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Latest Featured Press Releases
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Breaking news and important announcements from leading organizations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {releases.slice(0, 3).map((release) => (
            <Card key={release.id} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                {release.imageUrl && (
                  <img
                    src={release.imageUrl || "/placeholder.svg"}
                    alt={release.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <Badge variant="outline" className="mb-3">
                  {release.category}
                </Badge>
                <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">{release.title}</h3>
                {release.subtitle && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{release.subtitle}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>{format(release.publishedAt!, "MMM dd, yyyy")}</span>
                  <span>•</span>
                  <span>{release.company}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{truncateHtml(release.content, 200)}</p>
                <Button variant="link" className="p-0 h-auto text-primary" asChild>
                  <Link href={`/releases/${release.slug}`}>
                    Read Full Release
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
