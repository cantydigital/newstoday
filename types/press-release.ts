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
  paymentReceived?: boolean
  publishedUrl?: string | null
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
  purchaseEmail?: string
  featured?: boolean
  imageUrl?: string
  // Custom publish date as an ISO 8601 string. When omitted, the publish date
  // defaults to now (on create) or is left unchanged (on update).
  publishedAt?: string
}
