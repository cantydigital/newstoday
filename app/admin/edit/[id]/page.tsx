"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import ImageUpload from "@/components/ui/image-upload"
import {
  fetchPressReleaseByIdAdmin,
  updatePressReleaseAction,
} from "@/app/admin/dashboard/actions"
import type { PressRelease, PressReleaseFormData } from "@/types/press-release"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

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

export default function EditPressReleasePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [pressRelease, setPressRelease] = useState<PressRelease | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loadError, setLoadError] = useState("")

  const [formData, setFormData] = useState<PressReleaseFormData>({
    title: "",
    subtitle: "",
    content: "",
    category: "",
    author: "",
    company: "",
    contactEmail: "",
    contactPhone: "",
    featured: false,
    imageUrl: "",
  })

  useEffect(() => {
    const loadPressRelease = async () => {
      try {
        const data = await fetchPressReleaseByIdAdmin(id)
        if (data) {
          setPressRelease(data)
          setFormData({
            title: data.title,
            subtitle: data.subtitle || "",
            content: data.content,
            category: data.category,
            author: data.author,
            company: data.company,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone || "",
            featured: data.featured || false,
            imageUrl: data.imageUrl || "",
          })
        } else {
          setLoadError("Press release not found")
        }
      } catch (err) {
        console.error("Error loading press release:", err)
        setLoadError("Failed to load press release")
      } finally {
        setIsLoadingData(false)
      }
    }

    if (id) {
      loadPressRelease()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await updatePressReleaseAction(id, formData)
      setSuccess(true)
    } catch (err) {
      setError("Failed to update press release. Please try again.")
      console.error("Error updating press release:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof PressReleaseFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoadingData) {
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

  if (loadError || !pressRelease) {
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
              <p className="text-muted-foreground">{loadError || "Press release not found"}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (success) {
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
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Press Release Updated!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The press release has been successfully updated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/admin/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setSuccess(false)}>
                Continue Editing
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
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
            <Badge variant="secondary">Edit Press Release</Badge>
          </div>
        }
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Press Release</h1>
            <p className="text-muted-foreground">
              Update the press release information below.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Press Release Details</CardTitle>
              <CardDescription>Update the fields below and save your changes</CardDescription>
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

                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) => handleChange("imageUrl", url || "")}
                  disabled={isLoading}
                  label="Press Release Image"
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleChange("featured", checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="featured" className="font-normal cursor-pointer">
                    Mark as Featured
                  </Label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
