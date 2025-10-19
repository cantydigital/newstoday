import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileText } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function NotFound() {
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
          </div>
        }
      />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-12 pb-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                  Press Release Not Found
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  The press release you're looking for doesn't exist or may have been removed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/releases">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      View All Press Releases
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Go to Homepage
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
