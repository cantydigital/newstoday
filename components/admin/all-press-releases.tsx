"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { getPressReleases, deletePressRelease } from "@/lib/press-releases"
import type { PressRelease } from "@/types/press-release"
import { format } from "date-fns"
import { Search, Eye, Calendar, User, Building, Edit, Trash2 } from "lucide-react"
import { truncateHtml } from "@/lib/html-utils"
import EditPressReleaseDialog from "./edit-press-release-form"

export default function AllPressReleases() {
  const [releases, setReleases] = useState<PressRelease[]>([])
  const [filteredReleases, setFilteredReleases] = useState<PressRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
  }, [searchQuery, releases])

  const handleEditSuccess = () => {
    loadReleases() // Reload the releases to show updated data
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      await deletePressRelease(id)
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
              {filteredReleases.map((release) => (
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
        </CardContent>
      </Card>

    </div>
  )
}
