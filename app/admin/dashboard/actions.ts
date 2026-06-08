"use server"

import { isAuthenticated } from "@/lib/auth"
import {
  adminAdjustCredits,
  listPrUsers,
  listTransactionsForEmail,
  type CreditTransaction,
  type PrUser,
} from "@/lib/credits"
import { assertSupabaseAdmin } from "@/lib/supabase-admin"
import { sendPressReleasePublishedEmail } from "@/lib/email"
import { sanitizeHtml, validateImageUrl } from "@/lib/sanitize"
import { generateUniqueSlug } from "@/lib/slug-utils"
import type { PressRelease, PressReleaseFormData } from "@/types/press-release"
import type { ContactSubmission } from "@/lib/contact-submissions"

const MAX_CONTENT_LENGTH = 100_000

// Map a raw press_releases row to the PressRelease shape used by the UI.
function toPressRelease(row: any): PressRelease {
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

function toContactSubmission(row: any): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    created_at: new Date(row.created_at),
    status: row.status,
    admin_notes: row.admin_notes,
  }
}

async function requireAdmin() {
  const ok = await isAuthenticated()
  if (!ok) throw new Error("Unauthorized")
}

// ---------------------------------------------------------------------------
// Users / credits
// ---------------------------------------------------------------------------

export async function fetchPrUsers(): Promise<PrUser[]> {
  await requireAdmin()
  return listPrUsers()
}

export async function fetchPrUserTransactions(
  email: string
): Promise<CreditTransaction[]> {
  await requireAdmin()
  return listTransactionsForEmail(email)
}

export async function adjustUserCreditsAction(
  email: string,
  delta: number,
  note?: string
): Promise<{ newBalance: number }> {
  await requireAdmin()
  if (!email || !email.includes("@")) throw new Error("Invalid email")
  if (!Number.isInteger(delta) || delta === 0)
    throw new Error("Delta must be a non-zero integer")
  return adminAdjustCredits({ email, delta, note })
}

// ---------------------------------------------------------------------------
// Publishing
// ---------------------------------------------------------------------------

/**
 * Approve a press release AND notify the author by email with the live URL.
 * Returns the email send status (so the admin UI can warn if email failed).
 */
export async function approveAndNotifyAction(
  id: string
): Promise<{ sent: boolean; reason?: string; liveUrl: string }> {
  await requireAdmin()

  const supabase = assertSupabaseAdmin()

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://newstoday.com.au"

  // Approve (publish) + return the row so we have what we need for the email.
  const { data, error } = await supabase
    .from("press_releases")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug, title, author, contact_email")
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to approve press release: ${error?.message ?? "not found"}`
    )
  }

  const liveUrl = `${siteUrl}/releases/${data.slug}`

  // Persist the live URL so admins can copy it later.
  await supabase
    .from("press_releases")
    .update({ published_url: liveUrl })
    .eq("id", id)

  const emailResult = await sendPressReleasePublishedEmail({
    to: data.contact_email,
    authorName: data.author,
    pressReleaseTitle: data.title,
    liveUrl,
  })

  return { ...emailResult, liveUrl }
}

/** Reject a press release with an optional reason. Admin only. */
export async function rejectPressReleaseAction(
  id: string,
  reason?: string
): Promise<void> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { error } = await supabase
    .from("press_releases")
    .update({
      status: "rejected",
      rejection_reason: reason?.trim() || "Not approved for publication",
    })
    .eq("id", id)

  if (error) throw new Error(`Failed to reject press release: ${error.message}`)
}

/** Restore a rejected press release back to draft. Admin only. */
export async function restorePressReleaseToDraftAction(
  id: string
): Promise<void> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { error } = await supabase
    .from("press_releases")
    .update({ status: "draft", rejection_reason: null })
    .eq("id", id)

  if (error) throw new Error(`Failed to restore press release: ${error.message}`)
}

/** Permanently delete a press release. Admin only. */
export async function deletePressReleaseAction(id: string): Promise<void> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { error } = await supabase.from("press_releases").delete().eq("id", id)

  if (error) throw new Error(`Failed to delete press release: ${error.message}`)
}

/**
 * Update a press release. Admin only. Content is sanitized, the image URL is
 * validated, and the content length is capped before persisting.
 */
export async function updatePressReleaseAction(
  id: string,
  data: PressReleaseFormData
): Promise<void> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  if (typeof data.content !== "string" || data.content.length > MAX_CONTENT_LENGTH) {
    throw new Error("Content is missing or exceeds the maximum allowed length")
  }

  const { error } = await supabase
    .from("press_releases")
    .update({
      title: data.title,
      subtitle: data.subtitle ?? null,
      content: sanitizeHtml(data.content),
      category: data.category,
      author: data.author,
      company: data.company,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone ?? null,
      featured: data.featured || false,
      image_url: validateImageUrl(data.imageUrl),
    })
    .eq("id", id)

  if (error) throw new Error(`Failed to update press release: ${error.message}`)
}

/**
 * Create and immediately publish a press release from the admin panel. Admin
 * only. Content is sanitized, the image URL validated and the length capped.
 */
export async function createPressReleaseAction(
  data: PressReleaseFormData
): Promise<string> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  if (typeof data.content !== "string" || data.content.length > MAX_CONTENT_LENGTH) {
    throw new Error("Content is missing or exceeds the maximum allowed length")
  }

  const { data: slugRows, error: slugErr } = await supabase
    .from("press_releases")
    .select("slug")
  if (slugErr) throw new Error(`Failed to load slugs: ${slugErr.message}`)
  const existing = (slugRows ?? []).map((r) => r.slug).filter(Boolean) as string[]
  const slug = generateUniqueSlug(data.title, existing)

  const { data: inserted, error } = await supabase
    .from("press_releases")
    .insert({
      title: data.title,
      slug,
      subtitle: data.subtitle ?? null,
      content: sanitizeHtml(data.content),
      category: data.category,
      author: data.author,
      company: data.company,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone ?? null,
      featured: data.featured || false,
      image_url: validateImageUrl(data.imageUrl),
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error || !inserted) {
    throw new Error(`Failed to create press release: ${error?.message ?? "unknown"}`)
  }

  return inserted.id
}

// ---------------------------------------------------------------------------
// Admin reads (service-role, so RLS can deny anon access to drafts/rejected)
// ---------------------------------------------------------------------------

export async function fetchDraftPressReleases(): Promise<PressRelease[]> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase
    .from("press_releases")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to load drafts: ${error.message}`)
  return (data ?? []).map(toPressRelease)
}

export async function fetchRejectedPressReleases(): Promise<PressRelease[]> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase
    .from("press_releases")
    .select("*")
    .eq("status", "rejected")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to load rejected: ${error.message}`)
  return (data ?? []).map(toPressRelease)
}

/** Fetch a single press release of any status (used by the admin preview). */
export async function fetchPressReleaseByIdAdmin(
  id: string
): Promise<PressRelease | null> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase
    .from("press_releases")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw new Error(`Failed to load press release: ${error.message}`)
  return data ? toPressRelease(data) : null
}

// ---------------------------------------------------------------------------
// Contact submissions (admin only)
// ---------------------------------------------------------------------------

export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to load contact submissions: ${error.message}`)
  return (data ?? []).map(toContactSubmission)
}

export async function fetchNewContactSubmissions(): Promise<ContactSubmission[]> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("status", "new")
    .order("created_at", { ascending: false })

  if (error)
    throw new Error(`Failed to load new contact submissions: ${error.message}`)
  return (data ?? []).map(toContactSubmission)
}

export async function markContactReadAction(id: string): Promise<void> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: "read" })
    .eq("id", id)

  if (error) throw new Error(`Failed to mark as read: ${error.message}`)
}

export async function markContactRespondedAction(
  id: string,
  adminNotes?: string
): Promise<void> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: "responded", admin_notes: adminNotes || null })
    .eq("id", id)

  if (error) throw new Error(`Failed to mark as responded: ${error.message}`)
}

export async function updateContactNotesAction(
  id: string,
  adminNotes: string
): Promise<void> {
  await requireAdmin()
  const supabase = assertSupabaseAdmin()

  const { error } = await supabase
    .from("contact_submissions")
    .update({ admin_notes: adminNotes })
    .eq("id", id)

  if (error) throw new Error(`Failed to update notes: ${error.message}`)
}
