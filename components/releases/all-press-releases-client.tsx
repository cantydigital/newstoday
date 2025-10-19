"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Calendar, 
  User, 
  Building, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  ArrowRight,
  FileText
} from "lucide-react"
import { truncateHtml, stripHtml } from "@/lib/html-utils"
import Link from "next/link"
import { getPressReleases } from "@/lib/press-releases"
import type { PressRelease } from "@/types/press-release"
import { format } from "date-fns"

const ITEMS_PER_PAGE = 10

const categories = [
  "All Categories",
  "Business",
  "Technology",
  "Health & Wellness",
  "Education",
  "Finance",
  "Real Estate",
  "Entertainment",
  "Sports",
  "Environment",
  "Politics",
  "Other"
]

export default function AllPressReleasesClient() {
  const [releases, setReleases] = useState<PressRelease[]>([])
  const [filteredReleases, setFilteredReleases] = useState<PressRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("newest")

  const loadReleases = async () => {
    try {
      setIsLoading(true)
      const allReleases = await getPressReleases(1000) // Get a large number for client-side pagination
      setReleases(allReleases)
      setFilteredReleases(allReleases)
    } catch (error) {
      console.error("Error loading press releases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReleases()
  }, [])

  useEffect(() => {
    let filtered = releases

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(release =>
        release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stripHtml(release.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(release => release.category === selectedCategory)
    }

    // Sort results
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime()
        case "oldest":
          return new Date(a.publishedAt!).getTime() - new Date(b.publishedAt!).getTime()
        case "company":
          return a.company.localeCompare(b.company)
        default:
          return 0
      }
    })

    setFilteredReleases(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [releases, searchQuery, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredReleases.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentReleases = filteredReleases.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPaginationRange = () => {
    const range = []
    const showPages = 5
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i)
    }
    
    return range
  }

  if (isLoading) {
    return (
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Search and Filter Bar */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search press releases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="company">Company A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Results Count */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredReleases.length)} of {filteredReleases.length} results
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategory !== "All Categories" && ` in ${selectedCategory}`}
                </p>
                {(searchQuery || selectedCategory !== "All Categories") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All Categories")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Press Releases List */}
          {currentReleases.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Press Releases Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "All Categories" 
                    ? "Try adjusting your search or filter criteria." 
                    : "No press releases have been published yet."}
                </p>
                {(searchQuery || selectedCategory !== "All Categories") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All Categories")
                    }}
                  >
                    View All Releases
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {currentReleases.map((release) => (
                <Card key={release.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      {release.imageUrl && (
                        <div className="lg:w-48 flex-shrink-0">
                          <img
                            src={release.imageUrl || "/placeholder.svg"}
                            alt={release.title}
                            className="w-full h-32 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{release.category}</Badge>
                            {release.featured && (
                              <Badge variant="secondary" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2 line-clamp-2">
                          {release.title}
                        </h2>
                        
                        {release.subtitle && (
                          <p className="text-muted-foreground mb-3 line-clamp-1">
                            {release.subtitle}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(release.publishedAt!, "MMM dd, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{release.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{release.author}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {truncateHtml(release.content, 200)}
                        </p>
                        
                        <Button variant="link" className="p-0 h-auto text-primary" asChild>
                          <Link href={`/releases/${release.slug}`}>
                            Read Full Release
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="hidden md:flex items-center gap-1">
                      {currentPage > 3 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </Button>
                          {currentPage > 4 && <span className="px-2 text-muted-foreground">...</span>}
                        </>
                      )}
                      
                      {getPaginationRange().map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && <span className="px-2 text-muted-foreground">...</span>}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
