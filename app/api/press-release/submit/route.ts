import { NextRequest, NextResponse } from "next/server"
import { assertSupabaseAdmin } from "@/lib/supabase-admin"
import { consumeOneCredit } from "@/lib/credits"
import { generateUniqueSlug } from "@/lib/slug-utils"
import type { PressReleaseFormData } from "@/types/press-release"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const REQUIRED_FIELDS: (keyof PressReleaseFormData)[] = [
  "title",
  "content",
  "category",
  "author",
  "company",
  "contactEmail",
]

export async function POST(req: NextRequest) {
  let body: PressReleaseFormData
  try {
    body = (await req.json()) as PressReleaseFormData
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
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
      content: body.content,
      category: body.category,
      author: body.author,
      company: body.company,
      contact_email: body.contactEmail,
      contact_phone: body.contactPhone ?? null,
      featured: body.featured ?? false,
      image_url: body.imageUrl ?? null,
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
  let paid = false
  try {
    const result = await consumeOneCredit({
      email: body.contactEmail,
      pressReleaseId: inserted.id,
    })
    paid = result.paid
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
