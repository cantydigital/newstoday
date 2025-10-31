"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getPressReleaseById, approvePressRelease, rejectPressRelease } from "@/lib/press-releases"
import type { PressRelease } from "@/types/press-release"
import { format } from "date-fns"
import { ArrowLeft, CheckCircle2, XCircle, Calendar, User, Building, Mail, Phone } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function PreviewDraftPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [draft, setDraft] = useState<PressRelease | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const pressRelease = await getPressReleaseById(id)
        if (pressRelease) {
          setDraft(pressRelease)
        } else {
          setError("Press release not found")
        }
      } catch (error) {
        console.error("Error loading draft:", error)
        setError("Failed to load press release")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadDraft()
    }
  }, [id])

  const handleApprove = async () => {
    if (!draft) return
    
    setProcessingId(draft.id)
    try {
      await approvePressRelease(draft.id)
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error approving press release:", error)
      setError("Failed to approve press release")
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async () => {
    if (!draft) return
    
    setProcessingId(draft.id)
    try {
      await rejectPressRelease(draft.id, rejectionReason)
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error rejecting press release:", error)
      setError("Failed to reject press release")
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          showNavigation={false} 
          customContent={
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
          } 
        />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !draft) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          showNavigation={false} 
          customContent={
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
          } 
        />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error || "Press release not found"}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        showNavigation={false} 
        customContent={
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
            <Badge variant="secondary">Draft Preview</Badge>
          </div>
        } 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>Approve or reject this press release submission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={processingId === draft.id}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {processingId === draft.id ? "Approving..." : "Approve & Publish"}
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setShowRejectionForm(!showRejectionForm)}
                  disabled={processingId === draft.id}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>

              {showRejectionForm && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50 space-y-3">
                  <div>
                    <Label htmlFor="rejection-reason">Rejection Reason</Label>
                    <Textarea
                      id="rejection-reason"
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
                      onClick={() => setShowRejectionForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleReject}
                      disabled={processingId === draft.id || !rejectionReason.trim()}
                    >
                      {processingId === draft.id ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Press Release Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">{draft.category}</Badge>
                  <CardTitle className="text-2xl">{draft.title}</CardTitle>
                  {draft.subtitle && (
                    <CardDescription className="text-lg mt-2">{draft.subtitle}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted {format(draft.createdAt, "MMMM dd, yyyy 'at' HH:mm")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>By {draft.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{draft.company}</span>
                </div>
              </div>

              {/* Featured Image */}
              {draft.imageUrl && (
                <div>
                  <img 
                    src={draft.imageUrl} 
                    alt={draft.title}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-foreground leading-relaxed [&>p]:mb-4 [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4"
                  dangerouslySetInnerHTML={{ __html: draft.content }}
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{draft.contactEmail}</span>
                  </div>
                  {draft.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{draft.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
