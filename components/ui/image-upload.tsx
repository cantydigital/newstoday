"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  disabled?: boolean
  label?: string
  required?: boolean
}

export default function ImageUpload({ 
  value, 
  onChange, 
  disabled = false, 
  label = "Image", 
  required = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB")
      return
    }

    setError("")
    setIsUploading(true)

    try {
      // Upload through the server endpoint, which re-validates the file
      // (size + magic-byte MIME) and uploads with the service-role key.
      const body = new FormData()
      body.append("file", file)

      const res = await fetch("/api/upload", { method: "POST", body })
      const result = await res.json().catch(() => ({}))

      if (!res.ok || !result?.url) {
        throw new Error(result?.error || "Failed to upload image")
      }

      onChange(result.url)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    // Just clear the reference; storage cleanup of orphaned files is handled
    // server-side and direct anon deletes are no longer permitted.
    onChange(null)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      {value ? (
        <div className="space-y-2">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full max-w-sm h-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Click the X to remove the image or upload a new one to replace it.
          </p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            No image selected
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={disabled || isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
      </p>
    </div>
  )
}
