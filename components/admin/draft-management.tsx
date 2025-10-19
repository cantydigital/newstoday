"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { getDraftPressReleases, approvePressRelease, rejectPressRelease } from "@/lib/press-releases"
import type { PressRelease } from "@/types/press-release"
import { format } from "date-fns"
import { CheckCircle2, XCircle, Eye, Calendar, User, Building } from "lucide-react"

export default function DraftManagement() {
  const [drafts, setDrafts] = useState<PressRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const loadDrafts = async () => {
    try {
      const draftReleases = await getDraftPressReleases()
      setDrafts(draftReleases)
    } catch (error) {
      console.error("Error loading drafts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDrafts()
  }, [])

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    try {
      await approvePressRelease(id)
      await loadDrafts() // Reload the list
    } catch (error) {
      console.error("Error approving press release:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      await rejectPressRelease(id, rejectionReason)
      setRejectionReason("")
      setRejectingId(null)
      await loadDrafts() // Reload the list
    } catch (error) {
      console.error("Error rejecting press release:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const startRejection = (id: string) => {
    setRejectingId(id)
    setRejectionReason("")
  }

  const cancelRejection = () => {
    setRejectingId(null)
    setRejectionReason("")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>Loading draft submissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>No draft submissions pending review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">All submissions have been reviewed!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Submissions ({drafts.length})</CardTitle>
        <CardDescription>Review and approve press release submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground line-clamp-2">{draft.title}</h3>
                  {draft.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{draft.subtitle}</p>
                  )}
                </div>
                <Badge variant="outline">{draft.category}</Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(draft.createdAt, "MMM dd, yyyy 'at' HH:mm")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{draft.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{draft.author}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">{draft.content}</p>

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link href={`/admin/preview/${draft.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Link>
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleApprove(draft.id)}
                  disabled={processingId === draft.id}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {processingId === draft.id ? "Approving..." : "Approve"}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => startRejection(draft.id)}
                  disabled={processingId === draft.id || rejectingId === draft.id}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>

              {rejectingId === draft.id && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div>
                    <Label htmlFor={`rejection-reason-${draft.id}`}>Rejection Reason</Label>
                    <Textarea
                      id={`rejection-reason-${draft.id}`}
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelRejection}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(draft.id)}
                      disabled={processingId === draft.id || !rejectionReason.trim()}
                    >
                      {processingId === draft.id ? "Rejecting..." : "Confirm Rejection"}
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
