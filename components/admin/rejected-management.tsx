"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  restorePressReleaseToDraftAction,
  deletePressReleaseAction,
  fetchRejectedPressReleases,
} from "@/app/admin/dashboard/actions"
import type { PressRelease } from "@/types/press-release"
import { format } from "date-fns"
import {
  RotateCcw,
  Trash2,
  Eye,
  Calendar,
  User,
  Building,
  AlertCircle,
} from "lucide-react"
import { stripHtml } from "@/lib/html-utils"

export default function RejectedManagement() {
  const [rejected, setRejected] = useState<PressRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const loadRejected = async () => {
    try {
      const rejectedReleases = await fetchRejectedPressReleases()
      setRejected(rejectedReleases)
    } catch (error) {
      console.error("Error loading rejected press releases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRejected()
  }, [])

  const handleRestore = async (id: string) => {
    setProcessingId(id)
    try {
      await restorePressReleaseToDraftAction(id)
      await loadRejected()
    } catch (error) {
      console.error("Error restoring press release:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setProcessingId(id)
    try {
      await deletePressReleaseAction(id)
      setConfirmDeleteId(null)
      await loadRejected()
    } catch (error) {
      console.error("Error deleting press release:", error)
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rejected Submissions</CardTitle>
          <CardDescription>Loading rejected submissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (rejected.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rejected Submissions</CardTitle>
          <CardDescription>No rejected submissions to display</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">There are no rejected press releases.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rejected Submissions ({rejected.length})</CardTitle>
        <CardDescription>
          Review rejected press releases. You can restore them back to drafts for re-review or permanently delete them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rejected.map((release) => (
            <div key={release.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-2">{release.title}</h3>
                  {release.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{release.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="destructive">Rejected</Badge>
                  <Badge variant="outline">{release.category}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Submitted {format(release.createdAt, "MMM dd, yyyy 'at' HH:mm")}</span>
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

              <p className="text-sm text-muted-foreground line-clamp-3">
                {stripHtml(release.content)}
              </p>

              {release.rejectionReason && (
                <div className="flex gap-2 p-3 rounded-md border border-destructive/30 bg-destructive/5">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-destructive mb-1">Rejection Reason</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {release.rejectionReason}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/preview/${release.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Link>
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleRestore(release.id)}
                  disabled={processingId === release.id}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {processingId === release.id ? "Restoring..." : "Restore to Draft"}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmDeleteId(release.id)}
                  disabled={processingId === release.id || confirmDeleteId === release.id}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Permanently
                </Button>
              </div>

              {confirmDeleteId === release.id && (
                <div className="mt-2 p-4 border border-destructive/40 rounded-lg bg-destructive/5 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      This will permanently delete the press release and cannot be undone. Are you sure?
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={processingId === release.id}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(release.id)}
                      disabled={processingId === release.id}
                    >
                      {processingId === release.id ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
