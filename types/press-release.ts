export type PressReleaseStatus = "draft" | "published" | "rejected"

export interface PressRelease {
  id: string
  slug: string
  title: string
  subtitle?: string
  content: string
  category: string
  author: string
  company: string
  contactEmail: string
  contactPhone?: string
  publishedAt?: Date
  createdAt: Date
  status: PressReleaseStatus
  featured?: boolean
  imageUrl?: string
  rejectionReason?: string
}

export interface PressReleaseFormData {
  title: string
  subtitle?: string
  content: string
  category: string
  author: string
  company: string
  contactEmail: string
  contactPhone?: string
  featured?: boolean
  imageUrl?: string
}
