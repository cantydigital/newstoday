"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  Clock,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { 
  getContactSubmissions, 
  markContactSubmissionAsRead, 
  markContactSubmissionAsResponded,
  updateContactSubmissionNotes,
  type ContactSubmission 
} from "@/lib/contact-submissions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const data = await getContactSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error("Error loading contact submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markContactSubmissionAsRead(id)
      await loadSubmissions()
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const handleMarkAsResponded = async (id: string) => {
    try {
      setIsUpdating(true)
      await markContactSubmissionAsResponded(id, adminNotes)
      await loadSubmissions()
      setSelectedSubmission(null)
      setAdminNotes("")
    } catch (error) {
      console.error("Error marking as responded:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateNotes = async (id: string) => {
    try {
      setIsUpdating(true)
      await updateContactSubmissionNotes(id, adminNotes)
      await loadSubmissions()
      setSelectedSubmission(null)
      setAdminNotes("")
    } catch (error) {
      console.error("Error updating notes:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredSubmissions = submissions.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>
      case 'read':
        return <Badge variant="secondary">Read</Badge>
      case 'responded':
        return <Badge variant="default">Responded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <Badge variant="outline">{submissions.length} Total</Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No submissions match your search." : "No contact submissions yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{submission.name}</h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{submission.email}</span>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{submission.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(submission.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{submission.subject}</span>
                      </div>
                    </div>

                    <p className="text-sm line-clamp-2">{submission.message}</p>

                    {submission.admin_notes && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Admin Notes:</p>
                        <p className="text-sm text-muted-foreground">{submission.admin_notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {submission.status === 'new' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(submission.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setAdminNotes(submission.admin_notes || "")
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Manage Contact Submission</DialogTitle>
                          <DialogDescription>
                            View details and update status for {submission.name}'s inquiry
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Name</Label>
                              <p className="text-sm">{submission.name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Email</Label>
                              <p className="text-sm">{submission.email}</p>
                            </div>
                            {submission.phone && (
                              <div>
                                <Label className="text-sm font-medium">Phone</Label>
                                <p className="text-sm">{submission.phone}</p>
                              </div>
                            )}
                            <div>
                              <Label className="text-sm font-medium">Subject</Label>
                              <p className="text-sm">{submission.subject}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Message</Label>
                            <div className="mt-1 p-3 bg-muted rounded-md">
                              <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="admin-notes">Admin Notes</Label>
                            <Textarea
                              id="admin-notes"
                              placeholder="Add notes about this inquiry..."
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdateNotes(submission.id)}
                              disabled={isUpdating}
                              variant="outline"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Update Notes
                            </Button>
                            <Button
                              onClick={() => handleMarkAsResponded(submission.id)}
                              disabled={isUpdating}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark as Responded
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
