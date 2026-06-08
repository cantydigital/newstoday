"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { getPressReleases } from "@/lib/press-releases"
import { deletePressReleaseAction } from "@/app/admin/dashboard/actions"
import type { PressRelease } from "@/types/press-release"
import { format } from "date-fns"
import { Search, Eye, Calendar, User, Building, Edit, Trash2 } from "lucide-react"
import { truncateHtml } from "@/lib/html-utils"
import EditPressReleaseDialog from "./edit-press-release-form"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

const PAGE_SIZE = 10

export default function AllPressReleases() {
  const [releases, setReleases] = useState<PressRelease[]>([])
  const [filteredReleases, setFilteredReleases] = useState<PressRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const loadReleases = async () => {
    try {
      const publishedReleases = await getPressReleases(100) // Get more releases for admin view
      setReleases(publishedReleases)
      setFilteredReleases(publishedReleases)
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
    if (!searchQuery.trim()) {
      setFilteredReleases(releases)
    } else {
      const filtered = releases.filter(release =>
        release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredReleases(filtered)
    }
    setCurrentPage(1)
  }, [searchQuery, releases])

  const totalPages = Math.max(1, Math.ceil(filteredReleases.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const paginatedReleases = filteredReleases.slice(startIndex, startIndex + PAGE_SIZE)

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    if (safePage > 3) pages.push("ellipsis")
    const start = Math.max(2, safePage - 1)
    const end = Math.min(totalPages - 1, safePage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (safePage < totalPages - 2) pages.push("ellipsis")
    pages.push(totalPages)
    return pages
  }

  const handleEditSuccess = () => {
    loadReleases() // Reload the releases to show updated data
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      await deletePressReleaseAction(id)
      await loadReleases() // Reload the releases
    } catch (error) {
      console.error("Error deleting press release:", error)
      alert("Failed to delete press release. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Press Releases</CardTitle>
          <CardDescription>Loading published press releases...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Press Releases ({releases.length})</CardTitle>
          <CardDescription>Manage and view all published press releases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search press releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline" className="ml-auto">
              {filteredReleases.length} results
            </Badge>
          </div>

          {filteredReleases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "No press releases match your search." : "No press releases published yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReleases.map((release) => (
                <div key={release.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground line-clamp-2">{release.title}</h3>
                        {release.featured && (
                          <Badge variant="secondary" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      {release.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{release.subtitle}</p>
                      )}
                    </div>
                    <Badge variant="outline">{release.category}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(release.publishedAt!, "MMM dd, yyyy 'at' HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      <span>{release.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{release.author}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{truncateHtml(release.content, 150)}</p>

                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link 
                        href={`/releases/${release.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <EditPressReleaseDialog
                      pressRelease={release}
                      onSuccess={handleEditSuccess}
                    >
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </EditPressReleaseDialog>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(release.id, release.title)}
                      disabled={deletingId === release.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {deletingId === release.id ? (
                        <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      {deletingId === release.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredReleases.length > PAGE_SIZE && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, filteredReleases.length)} of {filteredReleases.length}
              </p>
              <Pagination className="mx-0 sm:ml-auto w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (safePage > 1) setCurrentPage(safePage - 1)
                      }}
                      aria-disabled={safePage === 1}
                      className={safePage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, idx) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === safePage}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (safePage < totalPages) setCurrentPage(safePage + 1)
                      }}
                      aria-disabled={safePage === totalPages}
                      className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
