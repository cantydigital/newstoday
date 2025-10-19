"use client"

import { Button } from "@/components/ui/button"
import { Newspaper } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  showNavigation?: boolean
  showAuthButtons?: boolean
  customContent?: React.ReactNode
}

export default function Header({ 
  showNavigation = true, 
  showAuthButtons = true, 
  customContent 
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-semibold text-foreground">News Today</span>
        </Link>
        
        {showNavigation && (
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/releases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Press Releases
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
        )}

        {customContent || (
          showAuthButtons && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/submit">Submit A Release</Link>
              </Button>
            </div>
          )
        )}
      </div>
    </header>
  )
}
