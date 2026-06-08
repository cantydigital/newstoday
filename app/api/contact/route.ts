import { NextRequest, NextResponse } from "next/server"
import { assertSupabaseAdmin } from "@/lib/supabase-admin"
import { verifyRecaptcha } from "@/lib/recaptcha"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_LENGTHS = {
  name: 200,
  email: 320,
  phone: 50,
  subject: 200,
  message: 5000,
}

type ContactBody = {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  recaptchaToken?: string
}

export async function POST(req: NextRequest) {
  let body: ContactBody
  try {
    body = (await req.json()) as ContactBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Bot protection.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined
  const captcha = await verifyRecaptcha(body.recaptchaToken, "contact", ip)
  if (!captcha.success) {
    return NextResponse.json(
      { error: "Captcha verification failed. Please try again." },
      { status: 400 }
    )
  }

  const name = body.name?.trim()
  const email = body.email?.trim()
  const subject = body.subject?.trim()
  const message = body.message?.trim()
  const phone = body.phone?.trim() || null

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    (phone && phone.length > MAX_LENGTHS.phone) ||
    subject.length > MAX_LENGTHS.subject ||
    message.length > MAX_LENGTHS.message
  ) {
    return NextResponse.json(
      { error: "One or more fields exceed the maximum allowed length" },
      { status: 400 }
    )
  }

  const supabase = assertSupabaseAdmin()

  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({ name, email, phone, subject, message, status: "new" })
    .select("id")
    .single()

  if (error || !data) {
    console.error("[api/contact] insert failed", error)
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, id: data.id })
}
