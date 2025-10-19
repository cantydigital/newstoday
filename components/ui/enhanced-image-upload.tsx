"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string | null) => void
  disabled?: boolean
  label?: string
  required?: boolean
}

export default function EnhancedImageUpload({ 
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, GIF, WebP)")
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
      // Create unique filename with timestamp and random string
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const fileName = `${timestamp}-${randomStr}.${fileExt}`
      const filePath = `press-releases/${fileName}`

      console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type)

      // Try to upload to Supabase Storage with additional options
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          duplex: 'half' // Add this for better compatibility
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      console.log('Upload successful:', data)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      console.log('Public URL generated:', publicUrl)

      onChange(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      
      // Provide more specific error messages
      if (err.message?.includes('row-level security')) {
        setError("Storage access denied. Please check your database permissions.")
      } else if (err.message?.includes('bucket')) {
        setError("Storage bucket not found. Please check your storage configuration.")
      } else {
        setError(err.message || "Failed to upload image. Please try again.")
      }
    } finally {
      setIsUploading(false)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (value) {
      try {
        // Extract file path from URL for deletion
        const url = new URL(value)
        const pathParts = url.pathname.split('/')
        const filePath = pathParts.slice(-2).join('/') // Get 'press-releases/filename'
        
        console.log('Deleting file:', filePath)
        
        // Delete from Supabase Storage
        const { error: deleteError } = await supabase.storage
          .from('images')
          .remove([filePath])
          
        if (deleteError) {
          console.error('Delete error:', deleteError)
          // Continue with removal even if delete fails
        }
      } catch (err) {
        console.error('Error deleting image:', err)
        // Continue with removal even if delete fails
      }
    }
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
              onError={() => setError("Failed to load image")}
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
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
      </p>
    </div>
  )
}
