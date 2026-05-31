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
