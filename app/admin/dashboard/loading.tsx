import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        showNavigation={false}
        customContent={
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Admin Dashboard</Badge>
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        }
      />

      <div className="flex flex-1">
        {/* Sidebar Skeleton */}
        <aside className="w-64 bg-card border-r border-border h-full p-4 space-y-4 hidden md:block shrink-0">
          <div className="p-2 border-b border-border pb-4 flex items-center gap-2.5">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2 pt-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                <Skeleton className="h-5 w-5 rounded-md shrink-0" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/60 self-start sm:self-auto">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Loading dashboard...</span>
            </div>
          </div>

          {/* Search bar skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>

          {/* Cards / List skeleton */}
          <div className="space-y-4 pt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-5 w-2/5" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-4/5" />
                <div className="flex items-center gap-4 pt-2">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
