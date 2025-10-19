"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AllPressReleases from "@/components/admin/all-press-releases"
import DraftManagement from "@/components/admin/draft-management"
import PressReleaseForm from "@/components/admin/press-release-form"
import ContactSubmissions from "@/components/admin/contact-submissions"
import { getDraftPressReleases } from "@/lib/press-releases"
import { getNewContactSubmissions } from "@/lib/contact-submissions"

export default function AdminDashboardClient() {
  const [activeView, setActiveView] = useState("all-releases")
  const [draftCount, setDraftCount] = useState(0)
  const [newContactCount, setNewContactCount] = useState(0)

  // Load counts for sidebar badges
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [drafts, newContacts] = await Promise.all([
          getDraftPressReleases(),
          getNewContactSubmissions()
        ])
        setDraftCount(drafts.length)
        setNewContactCount(newContacts.length)
      } catch (error) {
        console.error("Error loading counts:", error)
      }
    }

    loadCounts()
    
    // Refresh counts every 30 seconds
    const interval = setInterval(loadCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const renderContent = () => {
    switch (activeView) {
      case "all-releases":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">All Press Releases</h2>
              <p className="text-muted-foreground">View and manage all published press releases</p>
            </div>
            <AllPressReleases />
          </div>
        )
      case "review-releases":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Review Submissions</h2>
              <p className="text-muted-foreground">Review and approve draft press release submissions</p>
            </div>
            <DraftManagement />
          </div>
        )
      case "submit-release":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Submit Press Release</h2>
              <p className="text-muted-foreground">Create and publish a new press release directly</p>
            </div>
            <PressReleaseForm />
          </div>
        )
      case "contact-submissions":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Contact Submissions</h2>
              <p className="text-muted-foreground">View and manage contact form submissions</p>
            </div>
            <ContactSubmissions />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex w-full min-h-[calc(100vh-200px)]">
      <AdminSidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        draftCount={draftCount}
        newContactCount={newContactCount}
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
