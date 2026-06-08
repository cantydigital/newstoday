import { supabase } from "./supabase"
import type { PressRelease } from "@/types/press-release"

const TABLE_NAME = "press_releases"

// NOTE: Creating press releases is handled server-side. Public submissions go
// through /api/press-release/submit and admin-created releases go through
// createPressReleaseAction in app/admin/dashboard/actions.ts. Both use the
// service-role client, never the public anon client below.

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

export async function getRecentPressReleases(excludeSlug?: string, limitCount = 5): Promise<PressRelease[]> {
  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limitCount + (excludeSlug ? 1 : 0)) // Get one extra if we need to exclude current

  const { data, error } = await query

  if (error) {
    console.error("Error fetching recent press releases:", error)
    return []
  }

  let releases = data.map(transformSupabaseToPressRelease)
  
  // Filter out the current press release if excludeSlug is provided
  if (excludeSlug) {
    releases = releases.filter(release => release.slug !== excludeSlug)
    releases = releases.slice(0, limitCount) // Ensure we don't exceed the limit
  }

  return releases
}

// NOTE: Admin reads (by id, drafts, rejected) and all mutating operations (create/approve/reject/restore/update/delete)
// have been moved to admin-only "use server" actions in
// app/admin/dashboard/actions.ts. Those run server-side with the service-role
// client behind requireAdmin(), so they are never exposed to the browser via
// the public anon key. Do NOT re-add mutation helpers here.

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
    paymentReceived: row.payment_received ?? false,
    publishedUrl: row.published_url ?? null,
  }
}
