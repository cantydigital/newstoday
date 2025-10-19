"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Plus, Newspaper, MessageSquare } from "lucide-react"

interface AdminSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  draftCount?: number
  newContactCount?: number
}

const sidebarItems = [
  {
    id: "all-releases",
    label: "All Press Releases",
    icon: FileText,
    description: "View all published press releases"
  },
  {
    id: "review-releases", 
    label: "Review Releases",
    icon: Eye,
    description: "Review and approve draft submissions"
  },
  {
    id: "submit-release",
    label: "Submit Press Release", 
    icon: Plus,
    description: "Create and publish new press release"
  },
  {
    id: "contact-submissions",
    label: "Contact Submissions",
    icon: MessageSquare,
    description: "View and manage contact form submissions"
  }
]

export default function AdminSidebar({ activeView, onViewChange, draftCount = 0, newContactCount = 0 }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Press Release Management</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            const showBadge = (item.id === "review-releases" && draftCount > 0) || 
                             (item.id === "contact-submissions" && newContactCount > 0)
            const badgeCount = item.id === "review-releases" ? draftCount : newContactCount
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left",
                  isActive && "bg-secondary text-secondary-foreground"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{item.label}</span>
                      {showBadge && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                          {badgeCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
