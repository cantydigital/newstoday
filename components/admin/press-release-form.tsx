"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUpload from "@/components/ui/image-upload"
import { createPressRelease } from "@/lib/press-releases"
import type { PressReleaseFormData } from "@/types/press-release"

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
  "Other",
]

export default function PressReleaseForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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
    featured: false,
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      await createPressRelease(formData)
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
        featured: false,
        imageUrl: "",
      })
    } catch (err) {
      setError("Failed to publish press release. Please try again.")
      console.error("[v0] Error publishing press release:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof PressReleaseFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Press Release Details</CardTitle>
        <CardDescription>Enter all the information for your press release</CardDescription>
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
              onCheckedChange={(checked) => handleChange("featured", checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Mark as featured (will appear prominently on homepage)
            </Label>
          </div>

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Press release published successfully!</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish Press Release"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
