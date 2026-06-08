"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import ImageUpload from "@/components/ui/image-upload"
import type { PressReleaseFormData } from "@/types/press-release"
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { getRecaptchaToken } from "@/lib/recaptcha-client"

const categories = [
  "Business",
  "Technology",
  "Health & Wellness",
  "Education",
  "Finance",
  "Real Estate",
  "Entertainment",
  "Sports",
  "Environment",
  "Politics",
  "Beauty",
  "Home & Lifestyle",
  "Science & Research",
  "Travel & Tourism",
  "Food & Beverage",
  "Automotive",
  "Legal",
  "Non-Profit & Charity",
  "Energy",
  "Retail & E-commerce",
  "Other",
]

export default function SubmitPressReleasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentReceived, setPaymentReceived] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<PressReleaseFormData>({
    title: "",
    subtitle: "",
    content: "",
    category: "",
    author: "",
    company: "",
    contactEmail: "",
    contactPhone: "",
    purchaseEmail: "",
    featured: false,
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      const recaptchaToken = await getRecaptchaToken("submit_press_release")
      const response = await fetch("/api/press-release/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Submission failed")
      }

      setPaymentReceived(Boolean(result.payment_received))
      setSuccess(true)
      // Reset form
      setFormData({
        title: "",
        subtitle: "",
        content: "",
        category: "",
        author: "",
        company: "",
        contactEmail: "",
        contactPhone: "",
        purchaseEmail: "",
        featured: false,
        imageUrl: "",
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit press release. Please try again."
      )
      console.error("Error submitting press release:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof PressReleaseFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          showNavigation={false} 
          customContent={
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          } 
        />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Submission Received!</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for submitting your press release. It has been received and is now pending review by our editorial team.
            </p>
            {paymentReceived ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
                <p className="text-sm text-green-900 font-semibold mb-1">
                  Payment applied — 1 credit used
                </p>
                <p className="text-sm text-green-800">
                  We matched your email to a paid credit balance. Your release
                  will be prioritised by our editorial team.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6 text-left">
                <p className="text-sm text-amber-900 font-semibold mb-1">
                  No matching paid credit found
                </p>
                <p className="text-sm text-amber-800">
                  We couldn't find a paid credit linked to{" "}
                  <strong>this email</strong>. Your release has still been saved
                  as a draft and will be reviewed. To guarantee publication,{" "}
                  <Link href="/pricing" className="underline font-medium">
                    purchase a credit on our pricing page
                  </Link>{" "}
                  using the same email you submitted with.
                </p>
              </div>
            )}
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">What happens next?</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Our team will review your submission within 24-48 hours. If approved, your press release will be published on News Today and you'll receive an email with the live URL.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/submit">Submit Another Release</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
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
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Badge variant="secondary">Public Submission</Badge>
          </div>
        } 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Submit Your Press Release</h1>
            <p className="text-muted-foreground">
              Submit your press release for review. Our editorial team will review and approve quality submissions for publication.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Review Process</h3>
                <p className="text-sm text-blue-800">
                  All submissions go through our editorial review process. Approved releases are published within 24-48 hours and you'll receive an email with the live URL.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-amber-900">
              <strong>Already paid?</strong> Enter the email you used at Stripe
              checkout in the <strong>Purchase Email</strong> field below and
              your credit will be applied automatically. Haven't paid yet?{" "}
              <Link href="/pricing" className="underline font-medium">
                See pricing
              </Link>
              .
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Press Release Details</CardTitle>
              <CardDescription>Please provide complete and accurate information for your press release</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter press release title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Enter subtitle (optional)"
                    value={formData.subtitle}
                    onChange={(e) => handleChange("subtitle", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                    <SelectTrigger id="category" disabled={isLoading}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Content <span className="text-destructive">*</span>
                  </Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleChange("content", value)}
                    placeholder="Enter the full press release content"
                    disabled={isLoading}
                    className="min-h-[300px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">
                      Author <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="author"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(e) => handleChange("author", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">
                      Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">
                      Contact Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="contact@company.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+61 XXX XXX XXX"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseEmail">Purchase Email</Label>
                  <Input
                    id="purchaseEmail"
                    type="email"
                    placeholder="email used at Stripe checkout"
                    value={formData.purchaseEmail}
                    onChange={(e) => handleChange("purchaseEmail", e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the email you used when purchasing your credit.
                  </p>
                </div>

                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => handleChange("imageUrl", url || "")}
                  disabled={isLoading}
                  label="Press Release Image"
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit for Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
