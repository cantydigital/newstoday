import { supabase } from "./supabase"
import { generateUniqueSlug } from "./slug-utils"
import type { PressRelease, PressReleaseFormData, PressReleaseStatus } from "@/types/press-release"

const TABLE_NAME = "press_releases"

// Helper function to get existing slugs for uniqueness check
async function getExistingSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('slug')
  
  if (error) {
    console.error("Error fetching existing slugs:", error)
    return []
  }
  
  return data.map(row => row.slug).filter(Boolean)
}

export async function createPressRelease(data: PressReleaseFormData): Promise<string> {
  // Generate unique slug
  const existingSlugs = await getExistingSlugs()
  const slug = generateUniqueSlug(data.title, existingSlugs)

  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      title: data.title,
      slug: slug,
      subtitle: data.subtitle,
      content: data.content,
      category: data.category,
      author: data.author,
      company: data.company,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      featured: data.featured || false,
      image_url: data.imageUrl,
      status: "published" as PressReleaseStatus,
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    console.error("Error creating press release:", error)
    throw new Error(`Failed to create press release: ${error.message}`)
  }

  return result.id
}

export async function createDraftPressRelease(data: PressReleaseFormData): Promise<string> {
  // Generate unique slug
  const existingSlugs = await getExistingSlugs()
  const slug = generateUniqueSlug(data.title, existingSlugs)

  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      title: data.title,
      slug: slug,
      subtitle: data.subtitle,
      content: data.content,
      category: data.category,
      author: data.author,
      company: data.company,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      featured: data.featured || false,
      image_url: data.imageUrl,
      status: "draft" as PressReleaseStatus,
    })
    .select('id')
    .single()

  if (error) {
    console.error("Error creating draft press release:", error)
    throw new Error(`Failed to create draft press release: ${error.message}`)
  }

  return result.id
}

export async function getPressReleases(limitCount = 50): Promise<PressRelease[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limitCount)

  if (error) {
    console.error("Error fetching press releases:", error)
    return []
  }

  return data.map(transformSupabaseToPressRelease)
}

export async function getPressReleaseById(id: string): Promise<PressRelease | null> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error("Error fetching press release by ID:", error)
    return null
  }

  return transformSupabaseToPressRelease(data)
}

export async function getPressReleaseBySlug(slug: string): Promise<PressRelease | null> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error("Error fetching press release by slug:", error)
    return null
  }

  return transformSupabaseToPressRelease(data)
}

export async function getFeaturedPressReleases(): Promise<PressRelease[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching featured press releases:", error)
    return []
  }

  return data.map(transformSupabaseToPressRelease)
}

export async function getDraftPressReleases(): Promise<PressRelease[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('status', 'draft')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching draft press releases:", error)
    return []
  }

  return data.map(transformSupabaseToPressRelease)
}

export async function approvePressRelease(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      status: "published" as PressReleaseStatus,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error("Error approving press release:", error)
    throw new Error(`Failed to approve press release: ${error.message}`)
  }
}

export async function rejectPressRelease(id: string, reason?: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      status: "rejected" as PressReleaseStatus,
      rejection_reason: reason || "Not approved for publication",
    })
    .eq('id', id)

  if (error) {
    console.error("Error rejecting press release:", error)
    throw new Error(`Failed to reject press release: ${error.message}`)
  }
}

export async function updatePressRelease(id: string, data: PressReleaseFormData): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
      category: data.category,
      author: data.author,
      company: data.company,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      featured: data.featured || false,
      image_url: data.imageUrl,
    })
    .eq('id', id)

  if (error) {
    console.error("Error updating press release:", error)
    throw new Error(`Failed to update press release: ${error.message}`)
  }
}

export async function deletePressRelease(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error deleting press release:", error)
    throw new Error(`Failed to delete press release: ${error.message}`)
  }
}

// Helper function to transform Supabase row to PressRelease interface
function transformSupabaseToPressRelease(row: any): PressRelease {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    category: row.category,
    author: row.author,
    company: row.company,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    createdAt: new Date(row.created_at),
    status: row.status,
    featured: row.featured || false,
    imageUrl: row.image_url,
    rejectionReason: row.rejection_reason,
  }
}
