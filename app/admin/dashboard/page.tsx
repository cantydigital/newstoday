import { redirect } from "next/navigation"
import { isAuthenticated, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminDashboardClient from "@/components/admin/admin-dashboard-client"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default async function AdminDashboardPage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        showNavigation={false} 
        customContent={
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Admin Dashboard</Badge>
            <form
              action={async () => {
                "use server"
                await logout()
                redirect("/admin/login")
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Logout
              </Button>
            </form>
          </div>
        } 
      />

      <div className="flex flex-1">
        <AdminDashboardClient />
      </div>
      
      <Footer />
    </div>
  )
}
