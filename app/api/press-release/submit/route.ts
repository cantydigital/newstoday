import { NextRequest, NextResponse } from "next/server"
import { assertSupabaseAdmin } from "@/lib/supabase-admin"
import { consumeOneCredit } from "@/lib/credits"
import { generateUniqueSlug } from "@/lib/slug-utils"
import { sanitizeHtml, validateImageUrl } from "@/lib/sanitize"
import { verifyRecaptcha } from "@/lib/recaptcha"
import type { PressReleaseFormData } from "@/types/press-release"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_CONTENT_LENGTH = 100_000

const REQUIRED_FIELDS: (keyof PressReleaseFormData)[] = [
  "title",
  "content",
  "category",
  "author",
  "company",
  "contactEmail",
]

type SubmitBody = PressReleaseFormData & { recaptchaToken?: string }

export async function POST(req: NextRequest) {
  let body: SubmitBody
  try {
    body = (await req.json()) as SubmitBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Bot protection.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined
  const captcha = await verifyRecaptcha(
    body.recaptchaToken,
    "submit_press_release",
    ip
  )
  if (!captcha.success) {
    return NextResponse.json(
      { error: "Captcha verification failed. Please try again." },
      { status: 400 }
    )
  }

  for (const field of REQUIRED_FIELDS) {
    const value = body[field]
    if (typeof value !== "string" || !value.trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      )
    }
  }

  // Cap the content size to avoid DB bloat / slow rendering.
  if (body.content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: "Content exceeds the maximum allowed length" },
      { status: 400 }
    )
  }

  const supabase = assertSupabaseAdmin()

  // Build a unique slug from existing slugs.
  const { data: slugRows, error: slugErr } = await supabase
    .from("press_releases")
    .select("slug")
  if (slugErr) {
    return NextResponse.json(
      { error: `Failed to load slugs: ${slugErr.message}` },
      { status: 500 }
    )
  }
  const existing = (slugRows ?? []).map((r) => r.slug).filter(Boolean) as string[]
  const slug = generateUniqueSlug(body.title, existing)

  // Insert the draft press release first (always as draft regardless of payment).
  const { data: inserted, error: insertErr } = await supabase
    .from("press_releases")
    .insert({
      title: body.title,
      slug,
      subtitle: body.subtitle ?? null,
      content: sanitizeHtml(body.content),
      category: body.category,
      author: body.author,
      company: body.company,
      contact_email: body.contactEmail,
      contact_phone: body.contactPhone ?? null,
      purchase_email: body.purchaseEmail?.trim() || null,
      featured: body.featured ?? false,
      image_url: validateImageUrl(body.imageUrl),
      status: "draft",
      payment_received: false,
    })
    .select("id")
    .single()

  if (insertErr || !inserted) {
    return NextResponse.json(
      { error: `Failed to create draft: ${insertErr?.message ?? "unknown"}` },
      { status: 500 }
    )
  }

  // Try to consume a credit for this email. The submission is saved either way.
  const creditEmail = body.purchaseEmail?.trim()
  let paid = false
  try {
    if (creditEmail) {
      const result = await consumeOneCredit({
        email: creditEmail,
        pressReleaseId: inserted.id,
      })
      paid = result.paid
    }
  } catch (err) {
    console.error("[press-release/submit] credit consumption failed", err)
  }

  if (paid) {
    const { error: updateErr } = await supabase
      .from("press_releases")
      .update({ payment_received: true })
      .eq("id", inserted.id)

    if (updateErr) {
      console.error(
        "[press-release/submit] failed to mark payment_received",
        updateErr
      )
    }
  }

  return NextResponse.json({
    success: true,
    id: inserted.id,
    payment_received: paid,
  })
}
