"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { login } from "@/lib/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { getRecaptchaToken } from "@/lib/recaptcha-client"
import { Lock, ShieldCheck, Loader2, AlertCircle } from "lucide-react"

type LoginStatus = "idle" | "authenticating" | "redirecting"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [status, setStatus] = useState<LoginStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("Verifying credentials...")
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setStatus("authenticating")
    setProgress(25)
    setStatusText("Verifying credentials & reCAPTCHA...")

    try {
      const recaptchaToken = await getRecaptchaToken("admin_login")
      setProgress(50)
      setStatusText("Validating admin credentials...")

      const result = await login(username, password, recaptchaToken)

      if (result.success) {
        setStatus("redirecting")
        setProgress(75)
        setStatusText("Access granted! Preparing admin dashboard...")

        // Begin navigation to dashboard
        router.push("/admin/dashboard")
        router.refresh()

        // Increment progress while the server component renders
        setTimeout(() => {
          setProgress(92)
          setStatusText("Loading dashboard workspace...")
        }, 400)
      } else {
        setStatus("idle")
        setProgress(0)
        setError(result.error || "Invalid username or password")
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
      }
    } catch (err) {
      setStatus("idle")
      setProgress(0)
      setError("An error occurred during sign in. Please try again.")
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const isRedirecting = status === "redirecting"
  const isAuthenticating = status === "authenticating"
  const isBusy = isAuthenticating || isRedirecting

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        showNavigation={false} 
        customContent={<Badge variant="secondary">Admin Portal</Badge>} 
      />
      
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <Card 
          className={`w-full max-w-md relative overflow-hidden transition-all duration-200 shadow-md border-border/80 ${
            isShaking ? "animate-shake border-destructive/50" : ""
          } ${isRedirecting ? "border-muted-foreground/30" : ""}`}
        >
          {/* Top subtle progress bar during authentication / redirection */}
          {isBusy && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted overflow-hidden">
              <div 
                className="h-full bg-foreground/60 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <CardHeader className="space-y-1 text-center pb-2">
            <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
              {isRedirecting ? (
                <ShieldCheck className="w-6 h-6 text-foreground animate-in zoom-in duration-200" />
              ) : (
                <Lock className="w-6 h-6 text-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isRedirecting ? "Authentication Successful" : "Admin Login"}
            </CardTitle>
            <CardDescription>
              {isRedirecting 
                ? "Connecting to the administration panel..." 
                : "Enter your credentials to access the admin panel"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {isRedirecting ? (
              // Clean neutral transition state while dashboard loads
              <div className="py-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted border border-border text-foreground">
                    <ShieldCheck className="w-7 h-7 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Loading Admin Dashboard</p>
                    <p className="text-xs text-muted-foreground">{statusText}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-1.5 w-full bg-muted transition-all duration-500" />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      Loading workspace...
                    </span>
                    <span>{progress}%</span>
                  </div>
                </div>
              </div>
            ) : (
              // Login form
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isBusy}
                    autoComplete="username"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isBusy}
                    autoComplete="current-password"
                    className="h-10"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in duration-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-10 font-medium transition-all"
                  disabled={isBusy}
                >
                  {isAuthenticating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4" />
                      Sign In to Dashboard
                    </span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}
