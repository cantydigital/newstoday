"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { getDraftPressReleases, approvePressRelease, rejectPressRelease } from "@/lib/press-releases"
import type { PressRelease } from "@/types/press-release"
import { format } from "date-fns"
import { CheckCircle2, XCircle, Eye, Calendar, User, Building } from "lucide-react"

export default function DraftManagement() {
  const [drafts, setDrafts] = useState<PressRelease[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedDraft, setSelectedDraft] = useState<PressRelease | null>(null)

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
      await loadDrafts() // Reload the list
    } catch (error) {
      console.error("Error rejecting press release:", error)
    } finally {
      setProcessingId(null)
    }
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDraft(draft)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Press Release Preview</DialogTitle>
                      <DialogDescription>Review the full submission before approval</DialogDescription>
                    </DialogHeader>
                    {selectedDraft && (
                      <div className="space-y-4">
                        <div>
                          <Badge variant="outline" className="mb-2">{selectedDraft.category}</Badge>
                          <h2 className="text-2xl font-bold">{selectedDraft.title}</h2>
                          {selectedDraft.subtitle && (
                            <p className="text-lg text-muted-foreground mt-1">{selectedDraft.subtitle}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                          <span>By {selectedDraft.author}</span>
                          <span>•</span>
                          <span>{selectedDraft.company}</span>
                          <span>•</span>
                          <span>{format(selectedDraft.createdAt, "MMMM dd, yyyy")}</span>
                        </div>

                        {selectedDraft.imageUrl && (
                          <img 
                            src={selectedDraft.imageUrl} 
                            alt={selectedDraft.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        )}

                        <div className="prose max-w-none">
                          <p className="whitespace-pre-wrap">{selectedDraft.content}</p>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">Contact Information</h4>
                          <p className="text-sm text-muted-foreground">
                            Email: {selectedDraft.contactEmail}
                            {selectedDraft.contactPhone && (
                              <span> • Phone: {selectedDraft.contactPhone}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  onClick={() => handleApprove(draft.id)}
                  disabled={processingId === draft.id}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {processingId === draft.id ? "Approving..." : "Approve"}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={processingId === draft.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Submission</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for rejecting this press release submission.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rejection-reason">Rejection Reason</Label>
                        <Textarea
                          id="rejection-reason"
                          placeholder="Enter reason for rejection..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(draft.id)}
                          disabled={processingId === draft.id || !rejectionReason.trim()}
                        >
                          {processingId === draft.id ? "Rejecting..." : "Confirm Rejection"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
